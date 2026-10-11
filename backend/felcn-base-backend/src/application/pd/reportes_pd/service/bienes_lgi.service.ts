
import { Injectable, BadRequestException } from '@nestjs/common'
import {
  formatearMoneda,
  convertirMontoLiteral,
  formatearFechaReporte,
} from '@/common/utils/reporte.util'
import { BienesLgiReporteRepository } from '../repository/bienes-lgi.repository'
import { ActuacionLgiService } from './actuacion.service'
import { generarMapaBien } from '@/common/utils/mapa-bien.util'

@Injectable()
export class BienesLgiService {
  constructor(
    private readonly bienesRepository: BienesLgiReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

  async GenerarPDFBienes(idBien: number) {
    if (!Number.isSafeInteger(idBien) || idBien <= 0) {
      throw new BadRequestException('El identificador del bien debe ser un entero positivo')
    }

    const registro = await this.bienesRepository.obtenerBien(idBien)
    const base = await this.actuacionService.GenerarPDFActuacion(Number(registro.opId))
    const [situacionesBien, anotacionesJuridicas, datosBien, caracteristicas] = await Promise.all([
      this.bienesRepository.obtenerHistorialSituacionBien(idBien),
      this.bienesRepository.obtenerAnotacionesJuridicas(idBien),
      this.bienesRepository.obtenerDatosBien(idBien),
      this.bienesRepository.obtenerCaracteristicas(idBien),
    ])
    // Exclusivamente situacionbienes; no mezcla los eventos jurídicos.
    const ultimaSituacionBien = situacionesBien[0] ?? null
    const aprox = this.obtenerMonto(datosBien?.costoaprox)
    const cuant = this.obtenerMonto(datosBien?.costocuant)

    const mapa = await generarMapaBien(datosBien?.latitud, datosBien?.longitud)

    return {
      reporte: base.reporte,
      accion: base.accion,
      personasAfectadas: base.personasAfectadas,
      delitoPrecedente: base.delitoPrecedente,
      novedad: {
        tipo: ultimaSituacionBien?.calidad ?? 'Sin situación del bien registrada',
        numero: base.novedad.numero,
        fecha: ultimaSituacionBien?.fechaEntrega
          ? formatearFechaReporte(ultimaSituacionBien.fechaEntrega)
          : 'Sin fecha registrada',
        afectacionEstimadaNumero: aprox === null ? 'Sin especificar' : formatearMoneda(aprox),
        afectacionEstimadaLiteral: aprox === null ? '' : convertirMontoLiteral(aprox),
      },
      bien: {
        ...mapa,
        latitud: datosBien?.latitud ?? null,
  longitud: datosBien?.longitud ?? null,
        idBien: registro.itembiensecId,
        tipoBien: datosBien?.tipoDescripcion ?? registro.categoriaTipo?.descripcion ?? 'Sin especificar',
        cantidad: registro.cantidadBien ?? 1,
        fechaRegistro: registro.fechaHoraIngreso ?? 'Sin especificar',
        lugarSecuestro: registro.lugarSecuestro ?? null,
        valorCuantificado: cuant === null ? 'Sin especificar' : formatearMoneda(cuant),
        caracteristicas: caracteristicas.map((c: any) => ({
          etiqueta: c.etiqueta ?? 'Característica sin nombre',
          valor: c.valor ?? 'Sin valor registrado',
        })),
        datos: this.mapearDatosBien(datosBien ?? {}),
        ultimaSituacionJuridica: (registro.situacionesJuridicas ?? [])
          .find((s: any) => [1, 2, 3].includes(Number(s.idTipoSituacionLegalBien)))?.descripcionTipo
          ?? 'Sin situación jurídica registrada',
        valorAproximado: aprox === null ? 'Sin especificar' : formatearMoneda(aprox),
        historialJuridico: (registro.situacionesJuridicas ?? [])
          .filter((situacion: any) => [1, 2, 3].includes(Number(situacion.idTipoSituacionLegalBien)))
          .map((situacion: any, indice: number) => ({
            ...this.mapearSituacion(situacion), esUltima: indice === 0,
          })),
        anotacionesJuridicas: anotacionesJuridicas.map((anotacion: any) => ({
          descripcion: anotacion.descripcion ?? 'Sin descripción',
          fecha: anotacion.fechaHoraIngreso
            ? formatearFechaReporte(anotacion.fechaHoraIngreso)
            : 'Sin fecha registrada',
        })),
        historialSituacionBien: situacionesBien.map((situacion: any) => ({
          ...situacion,
          tipoDocumento: situacion.tipoDocumento ?? 'Sin especificar',
          fecha: situacion.fechaEntrega
            ? formatearFechaReporte(situacion.fechaEntrega)
            : 'Sin fecha registrada',
        })),
        fotografias: (registro.fotografias ?? []).map((foto: any, indice: number) => ({
          numero: indice + 1,
          descripcion: foto.descripcion ?? '',
          imagen: foto.fotografiaDataUrl ?? null,
        })),
      },
    }
  }

  private mapearDatosBien(datos: any) {
    const campos: Array<[string, string]> = [
      ['claseDescripcion', 'Clase'], ['tipoDescripcion', 'Tipo'],
      ['cantidadbien', 'Cantidad'],
      ['inves', 'En investigación'], ['lugar_secuestro', 'Lugar de secuestro'],
      ['pericia', 'Pericia'], ['resultado_pericia', 'Resultado de pericia'],
      ['fechahoraing', 'Fecha de registro'], ['usuario', 'Usuario de registro'],
      ['estado', 'Estado del registro'],
    ]
    return campos.map(([campo, etiqueta]) => {
      const valor = datos[campo]
      return {
        etiqueta,
        valor: valor === null || valor === undefined || String(valor).trim() === ''
          ? 'Sin información registrada'
          : typeof valor === 'boolean' ? (valor ? 'Sí' : 'No')
          : campo === 'fechahoraing' ? formatearFechaReporte(valor) : String(valor),
      }
    })
  }

  private obtenerMonto(valor: unknown): number | null {
    if (valor === null || valor === undefined || String(valor).trim() === '') return null
    const numero = Number(valor)
    return Number.isFinite(numero) ? numero : null
  }

  private mapearSituacion(situacion: any) {
    const datos = situacion.datos ?? {}
    const detalles: Array<{ etiqueta: string; valor: string }> = []
    const agregar = (etiqueta: string, valor: unknown) => {
      if (valor !== null && valor !== undefined && String(valor).trim() !== '') {
        detalles.push({ etiqueta, valor: String(valor) })
      }
    }

    // Claves reales de los jsonb_build_object de tu repositorio.
    agregar('Fiscal', datos.fiscal)
    agregar('Investigador', datos.investigador)
    agregar('Número de resolución', datos.nroResol)
    agregar('Número de sentencia judicial', datos.numSentJud)
    agregar('Autoridad', datos.autoridad)
    agregar('Fiscal requirente', datos.fiscalRequirente)
    agregar('Responsable de recepción', datos.responsableRecepcion)
    agregar('Institución', datos.institucion)
    agregar('Ubicación', datos.ubicacion)

    return {
      situacion: situacion.descripcionTipo ?? 'Sin especificar',
      fecha: situacion.fechaSituacion
        ? formatearFechaReporte(situacion.fechaSituacion)
        : 'Sin fecha registrada',
      detalles,
    }
  }
}
