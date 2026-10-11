import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CasoIntegralRepository } from '../repository/caso-integral.repository'
import { ActuacionReporteRepository } from '../repository/actuacion.repository'
import { BienesLgiReporteRepository } from '../repository/bienes-lgi.repository'
import { ConclusionReporteRepository } from '../repository/lgi-conclusion.repository'
import { PersonasJuridicasReporteService } from './personas-juridicas.service'
import { ActuacionLgiService } from './actuacion.service'
import { BienesLgiService } from './bienes_lgi.service'
import { ConsultaSiiiRepository } from '../../informacion_siii/repository/consulta.repository'
import { formatearMoneda } from '@/common/utils/reporte.util'

@Injectable()
export class CasoIntegralService {
  constructor(
    private readonly repository: CasoIntegralRepository,
    private readonly actuacionRepository: ActuacionReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
    private readonly bienesService: BienesLgiService,
    private readonly bienesReporte: BienesLgiReporteRepository,
    private readonly conclusionRepository: ConclusionReporteRepository,
    private readonly empresasService: PersonasJuridicasReporteService,
    private readonly consultaSiii: ConsultaSiiiRepository,
  ) {}

  async GenerarPDFCasoIntegral(casosId: number) {
    if (!Number.isSafeInteger(casosId) || casosId <= 0) throw new BadRequestException('casosId debe ser un entero positivo')
    if (!await this.repository.existeCaso(casosId)) throw new NotFoundException(`No existe el caso ${casosId}`)
    const ops = await this.repository.actuaciones(casosId)
    if (!ops.length) throw new NotFoundException(`El caso ${casosId} no tiene actuaciones activas para el reporte`)
    const actuaciones: any[] = []
    let datosCaso: any = null
    let personas: any[] = []
    const numerosPrecedentes = new Set<string>()
    for (const [indice, op] of ops.entries()) {
      const [base, completo, registrosBienes, registrosEmpresas] = await Promise.all([
        this.actuacionService.GenerarPDFActuacion(Number(op.opId)),
        this.actuacionRepository.obtenerReporteCompleto(Number(op.opId)),
        this.conclusionRepository.obtenerBienesConFotos(Number(op.opId)),
        this.conclusionRepository.obtenerEmpresas(Number(op.opId)),
      ])
      if (!completo) throw new NotFoundException(`No se pudo leer la actuación ${op.opId}`)
      if (!datosCaso) {
        datosCaso = { ...base.accion, datos: this.campos(completo.datosCaso) }
        personas = base.personasAfectadas.map((p: any, i: number) => ({
          ...p, datos: this.campos((completo.personasAfectadas ?? [])[i] ?? {}),
        }))
      }
      for (const numero of completo.datosCaso.numerosCasosPrecedentes ?? []) numerosPrecedentes.add(numero)
      const bienes: any[] = []
      for (const [indiceBien, registro] of registrosBienes.entries()) {
        const id = Number(registro.itembiensecId)
        const reporte = await this.bienesService.GenerarPDFBienes(id)
        const [datos, historial] = await Promise.all([
          this.bienesReporte.obtenerDatosBien(id), this.bienesReporte.obtenerHistorialSituacionBien(id),
        ])
        // Incluye datos jurídicos completos disponibles en el JSON del repositorio compartido.
        bienes.push({
          ...reporte.bien, numeroBien: indiceBien + 1,
          datos: reporte.bien.datos.filter((d: any) => !['Latitud', 'Longitud'].includes(d.etiqueta)),
          latitud: datos?.latitud, longitud: datos?.longitud,
          historialSituacionBien: reporte.bien.historialSituacionBien.map((s: any, i: number) => ({
            ...s, tipoDocumento: historial[i]?.tipoDocumento ?? 'Sin especificar',
          })),
          historialJuridico: reporte.bien.historialJuridico.map((s: any, i: number) => ({
            ...s, detalles: this.campos((registro.situacionesJuridicas ?? [])
              .filter((r: any) => [1,2,3].includes(Number(r.idTipoSituacionLegalBien)))[i]?.datos ?? {}),
          })),
        })
      }
      const empresas: any[] = []
      for (const e of registrosEmpresas) {
        empresas.push((await this.empresasService.GenerarPDFEmpresa(Number(e.empId))).empresa)
      }
      actuaciones.push({ numeroSeccion: indice + 1, ...base,
        responsables: this.campos(completo.responsables),
        datosActuacion: this.campos({ encabezado: completo.encabezado, dependencia: completo.dependenciaInstitucional, etapaProcesal: completo.etapaProcesal, actuacion: completo.actuacion }), bienes, empresas })
    }
    const [resumen, conclusion, precedentes] = await Promise.all([
      this.repository.resumen(casosId), this.conclusionRepository.obtenerSelecciones(String(casosId)),
      numerosPrecedentes.size
        ? this.consultaSiii.buscarCasosPrecedentesParaReporte([...numerosPrecedentes])
        : Promise.resolve([]),
    ])
    return this.prepararTablas({
      caso: datosCaso, personas, actuaciones, conclusion,
      precedentes: precedentes.map((p: any, i: number) => ({ numero: i + 1, datos: this.campos(p) })),
      resumen: resumen.map((r: any) => ({ ...r, total: r.total === null ? 'Sin valoración' : formatearMoneda(Number(r.total)) })),
      totalBienes: formatearMoneda(resumen.reduce((s: number, r: any) => s + Number(r.total ?? 0), 0)),
      cantidadBienes: resumen.reduce((s: number, r: any) => s + Number(r.cantidad ?? 0), 0),
      cantidadActuaciones: actuaciones.length,
      faltantes: resumen.reduce((s: number, r: any) => s + Number(r.faltantes ?? 0), 0),
    })
  }

  private prepararTablas(valor: any): any {
    if (Array.isArray(valor)) return valor.map((item) => this.prepararTablas(item))
    if (!valor || typeof valor !== 'object') return valor
    const resultado: any = { ...valor }
    for (const [clave, item] of Object.entries(valor)) {
      resultado[clave] = this.prepararTablas(item)
    }
    const agrupar = (campos: any[], excluir: string[] = []) => {
      const limpios = campos.filter((d: any) => !excluir.includes(d.etiqueta))
      const filas: any[] = []
      for (let i = 0; i < limpios.length; i += 2) {
        filas.push({ izquierda: limpios[i], derecha: limpios[i + 1] ?? null })
      }
      return filas
    }
    if (Array.isArray(valor.datos)) {
      const repetidosPersona = valor.documento !== undefined && valor.nombre !== undefined
        ? ['nombres', 'paterno', 'materno', 'esposo', 'numero Documento', 'relacion'] : []
      resultado.filasDatos = agrupar(valor.datos, valor.numeroCasoFiscalia !== undefined
        ? ['nombre Caso', 'fecha Inicio', 'numero Caso Fiscalia', 'numero Caso Giaef', 'cud Ifp', 'forma Inicio', 'control Jurisdiccional']
        : repetidosPersona)
      if (repetidosPersona.length) {
        resultado.sexo = valor.datos.find((d: any) => d.etiqueta === 'sexo')?.valor ?? 'Sin registro'
        resultado.estadoPersona = valor.datos.find((d: any) => d.etiqueta === 'estado')?.valor ?? 'Sin registro'
        resultado.filasDatos = agrupar(valor.datos, [...repetidosPersona, 'sexo', 'estado'])
      }
    }
    if (Array.isArray(valor.caracteristicas)) resultado.filasCaracteristicas = agrupar(valor.caracteristicas)
    if (Array.isArray(valor.datosActuacion)) {
      resultado.filasActuacion = agrupar(valor.datosActuacion,
        ['actuacion / sintesis', 'encabezado / numero Actuacion', 'encabezado / fecha Informe'])
    }
    if (Array.isArray(valor.responsables)) resultado.filasResponsables = agrupar(valor.responsables)
    return resultado
  }

  private campos(objeto: any): Array<{ etiqueta: string; valor: string }> {
    const salida: Array<{ etiqueta: string; valor: string }> = []
    const recorrer = (valor: any, ruta: string, profundidad = 0) => {
      if (valor === null || valor === undefined || profundidad > 8 || Buffer.isBuffer(valor)) return
      if (valor instanceof Date) { salida.push({ etiqueta: ruta, valor: valor.toISOString().slice(0,10) }); return }
      if (typeof valor === 'object') {
        for (const [clave, item] of Object.entries(valor)) {
          if (/^(id|.*Id|.*_id|imagen|fotografia|rutaArchivo|imagenBase64|imagenDataUrl)$/i.test(clave)) continue
          const nombre = clave.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')
          recorrer(item, ruta ? `${ruta} / ${nombre}` : nombre, profundidad + 1)
        }
      } else if (String(valor).trim()) {
        salida.push({ etiqueta: ruta, valor: typeof valor === 'boolean' ? (valor ? 'Sí' : 'No') : String(valor) })
      }
    }
    recorrer(objeto, '')
    return salida
  }
}
