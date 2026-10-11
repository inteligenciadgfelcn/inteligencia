import { Injectable } from '@nestjs/common'
import { BusquedaLgiService } from './busqueda_lgi.service'
import { FiltrosVariablesCruzadasLgiDto } from './dto/filtros-variables-cruzadas-lgi.dto'
import { ExportService } from '@/application/inteligencia/reportes/export/export.service'
import { PDF_A3_HORIZONTAL } from '@/application/inteligencia/reportes/export/pdf/pdf-options'
type FilaPlana = Record<string, string | number | boolean>

type Registro = Record<string, any>

@Injectable()
export class VariablesCruzadasLgiExportService {
  constructor(
    private readonly busquedaLgiService: BusquedaLgiService,
    private readonly exportService: ExportService
  ) {}

  async generarExcel(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)
    return this.exportService.generateExcel(
      'Variables cruzadas LGI',
      this.prepararFilasPlanas(filas)
    )
  }

  async generarCsv(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)
    return this.exportService.generateCSV(this.prepararFilasPlanas(filas))
  }

  async generarJson(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)
    return this.exportService.generateJSON({
      titulo: 'Reporte de variables cruzadas LGI',
      fechaGeneracion: this.obtenerFechaGeneracion(),
      filtros: filtros ?? {},
      resumen: this.crearResumen(filas),
      // Estructura original: personas del caso y bienes/empresas de cada actuación.
      filas,
    })
  }

  async generarPdf(filtros: FiltrosVariablesCruzadasLgiDto): Promise<Buffer> {
    const filas = await this.obtenerFilas(filtros)
    return this.exportService.generatePDF(
      'variables-cruzadas-lgi',
      this.prepararDatosPdf(filas, filtros),
      PDF_A3_HORIZONTAL
    )
  }

  private obtenerFilas(
    filtros: FiltrosVariablesCruzadasLgiDto
  ): Promise<Registro[]> {
    return this.busquedaLgiService.obtenerTodosParaExportar(filtros ?? {})
  }

  private obtenerFechaGeneracion(): string {
    return new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      dateStyle: 'short',
      timeStyle: 'medium',
      hourCycle: 'h23',
    }).format(new Date())
  }

  private fecha(valor: unknown): string {
    if (valor === null || valor === undefined || valor === '') return ''
    // Fechas sin hora conservan su día: no se parsean como medianoche UTC.
    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor))
      return valor
    const date = valor instanceof Date ? valor : new Date(String(valor))
    if (Number.isNaN(date.getTime())) return String(valor)
    return new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz',
      dateStyle: 'short',
      timeStyle: 'short',
      hourCycle: 'h23',
    }).format(date)
  }

  private crearResumen(casos: Registro[]): Registro {
    let personas = 0,
      actuaciones = 0,
      registrosBienes = 0,
      cantidadBienes = 0n,
      empresas = 0
    for (const caso of casos) {
      personas += (caso.personasInvestigadas ?? []).length
      for (const actuacion of caso.actuaciones ?? []) {
        actuaciones++
        registrosBienes += (actuacion.bienes ?? []).length
        empresas += (actuacion.empresas ?? []).length
        for (const bien of actuacion.bienes ?? [])
          cantidadBienes += BigInt(bien.cantidad ?? 0)
      }
    }
    return {
      casos: casos.length,
      personasRegistradas: personas,
      actuaciones,
      registrosBienes,
      cantidadBienes: cantidadBienes.toString(),
      empresasRegistradas: empresas,
    }
  }

  /** Una fila por registro, sin multiplicar personas × bienes × empresas. */
  private prepararFilasPlanas(casos: Registro[]): FilaPlana[] {
    const filas: FilaPlana[] = []
    for (const caso of casos) {
      const base: FilaPlana = {
        'Tipo registro': '',
        'ID registro': '',
        'ID caso': caso.casosId,
        'Caso GIAEF': caso.numeroCasoGiaef ?? '',
        'Nombre caso': caso.nombreCaso ?? '',
        'CUD / IFP': caso.cud ?? '',
        'Caso Fiscalía': caso.numeroCasoFiscalia ?? '',
        'Departamento código': caso.departamentoCodigo ?? '',
        Unidad: caso.unidad ?? '',
        Distrital: caso.distrital ?? '',
        Grupo: caso.grupo ?? '',
        'Inicio caso': this.fecha(caso.fechaInicio),
        'Etapa investigación': caso.etapaInvestigacion ?? '',
        'Estado procesal': caso.estadoProcesal ?? '',
        'ID actuación': '',
        Actuación: '',
        'Fecha informe': '',
        'Tipo informe': '',
        'Lugar actuación': '',
        'Persona / empresa / bien': '',
        'Tipo documento': '',
        'Documento / NIT': '',
        País: '',
        Sexo: '',
        'Estado civil': '',
        Profesión: '',
        Relación: '',
        'Categoría bien': '',
        'Clase bien': '',
        'Tipo bien': '',
        Características: '',
        Cantidad: '',
        'Valor aproximado': '',
        'Valor cuantificado': '',
        'Lugar secuestro': '',
        Matrícula: '',
        Representante: '',
        Dirección: '',
        'Capital social': '',
        Vínculo: '',
        'Pericia realizada': '',
        'Resultado pericia': '',
        Observaciones: '',
        'Situación legal actual': '',
        'Situación jurídica actual': '',
        'Fecha registro': '',
        'Historial legal': '',
        'Historial jurídico': '',
      }
      filas.push({
        ...base,
        'Tipo registro': 'CASO',
        'ID registro': caso.casosId,
      })
      for (const p of caso.personasInvestigadas ?? [])
        filas.push({
          ...base,
          'Tipo registro': 'PERSONA',
          'ID registro': p.deId,
          'Persona / empresa / bien': p.nombreCompleto ?? '',
          'Tipo documento': p.tipoDocumento ?? '',
          'Documento / NIT': p.numeroDocumento ?? '',
          País: p.pais ?? '',
          Sexo: p.sexo ?? '',
          'Estado civil': p.estadoCivil ?? '',
          Profesión: p.profesion ?? '',
          Relación: p.relacion ?? '',
          Observaciones: p.observaciones ?? '',
          'Fecha registro': this.fecha(p.fechaRegistro),
          'Situación jurídica actual':
            p.situacionJuridicaActual ?? 'Sin situación registrada',
          'Historial jurídico': this.historial(p.historialSituaciones),
        })
      for (const a of caso.actuaciones ?? []) {
        const actuacion: FilaPlana = {
          ...base,
          'ID actuación': a.opId,
          Actuación: a.numeroActuacion ?? '',
          'Fecha informe': this.fecha(a.fechaInforme),
          'Tipo informe': a.tipoInforme ?? '',
          'Lugar actuación': a.lugar ?? '',
        }
        filas.push({
          ...actuacion,
          'Tipo registro': 'ACTUACION',
          'ID registro': a.opId,
          Observaciones: a.descripcion ?? '',
        })
        for (const b of a.bienes ?? [])
          filas.push({
            ...actuacion,
            'Tipo registro': 'BIEN',
            'ID registro': b.itemBienSecId,
            'Persona / empresa / bien': b.tipo ?? '',
            'Categoría bien': b.categoria ?? '',
            'Clase bien': b.clase ?? '',
            'Tipo bien': b.tipo ?? '',
            Características: (b.caracteristicas ?? [])
              .map(
                (c: Registro) =>
                  `${c.caracteristica ?? c.caracteristicaId}: ${c.valor ?? ''}`
              )
              .join('; '),
            Cantidad: b.cantidad ?? '',
            'Valor aproximado': b.valorAproximado ?? '',
            'Valor cuantificado': b.valorCuantificado ?? '',
            'Lugar secuestro': b.lugarSecuestro ?? '',
            'Pericia realizada': b.pericia ? 'Sí' : 'No',
            'Resultado pericia': b.resultadoPericia ?? '',
            'Situación legal actual':
              b.situacionLegalActual ?? 'Sin situación registrada',
            'Situación jurídica actual':
              b.situacionJuridicaActual ?? 'Sin situación registrada',
            'Fecha registro': this.fecha(b.fechaRegistro),
            'Historial legal': this.historial(b.historialLegal),
            'Historial jurídico': this.historial(b.historialJuridico),
          })
        for (const e of a.empresas ?? [])
          filas.push({
            ...actuacion,
            'Tipo registro': 'EMPRESA',
            'ID registro': e.empId,
            'Persona / empresa / bien': e.nombre ?? '',
            'Documento / NIT': e.nit ?? '',
            Matrícula: e.matricula ?? '',
            Representante: e.representante ?? '',
            Dirección: e.direccion ?? '',
            'Capital social': e.capitalSocial ?? '',
            Vínculo: e.vinculo ?? '',
            'Pericia realizada': e.pericia ? 'Sí' : 'No',
            'Resultado pericia': e.resultadoPericia ?? '',
            Observaciones: e.observaciones ?? '',
            'Fecha registro': this.fecha(e.fechaRegistro),
            'Situación jurídica actual':
              e.situacionJuridicaActual ?? 'Sin situación registrada',
            'Historial jurídico': this.historial(e.historialSituaciones),
          })
      }
    }
    // Evitar que datos de texto se interpreten como fórmulas al abrir CSV/Excel.
    return filas.map((fila) =>
      Object.fromEntries(
        Object.entries(fila).map(([k, v]) => [
          k,
          typeof v === 'string' && /^[\s]*[=+\-@\t\r\n]/.test(v) ? `'${v}` : v,
        ])
      )
    )
  }

  private historial(eventos: Registro[] = []): string {
    return eventos
      .map((e) =>
        [
          this.fecha(e.fecha ?? e.fechaRegistro),
          e.descripcion ?? e.tipo ?? e.situacionId ?? '',
          e.numeroResolucion ?? e.documento ?? '',
        ]
          .filter(Boolean)
          .join(' · ')
      )
      .join(' | ')
  }

  private prepararDatosPdf(
    casos: Registro[],
    filtros: FiltrosVariablesCruzadasLgiDto
  ): Registro {
    return {
      titulo: 'Reporte de variables cruzadas LGI',
      fechaGeneracion: this.obtenerFechaGeneracion(),
      resumen: this.crearResumen(casos),
      filtros: Object.entries(filtros ?? {})
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([nombre, valor]) => ({ nombre, valor: String(valor) })),
      casos: casos.map((c) => ({
        ...c,
        fechaInicio: this.fecha(c.fechaInicio),
        personasInvestigadas: (c.personasInvestigadas ?? []).map(
          (p: Registro) => ({
            ...p,
            fechaRegistro: this.fecha(p.fechaRegistro),
            historialSituaciones: (p.historialSituaciones ?? []).map(
              (s: Registro) => ({
                ...s,
                fecha: this.fecha(s.fecha ?? s.fechaRegistro),
              })
            ),
          })
        ),
        actuaciones: (c.actuaciones ?? []).map((a: Registro) => ({
          ...a,
          fechaInforme: this.fecha(a.fechaInforme),
          bienes: (a.bienes ?? []).map((b: Registro) => ({
            ...b,
            caracteristicasTexto: (b.caracteristicas ?? [])
              .map(
                (x: Registro) =>
                  `${x.caracteristica ?? x.caracteristicaId}: ${x.valor ?? ''}`
              )
              .join('; '),
            historialLegal: (b.historialLegal ?? []).map((s: Registro) => ({
              ...s,
              fecha: this.fecha(s.fecha ?? s.fechaRegistro),
            })),
            historialJuridico: (b.historialJuridico ?? []).map(
              (s: Registro) => ({
                ...s,
                fechaRegistro: this.fecha(s.fechaRegistro),
              })
            ),
          })),
          empresas: (a.empresas ?? []).map((e: Registro) => ({
            ...e,
            historialSituaciones: (e.historialSituaciones ?? []).map(
              (s: Registro) => ({
                ...s,
                fecha: this.fecha(s.fecha ?? s.fechaRegistro),
              })
            ),
          })),
        })),
      })),
    }
  }
}
