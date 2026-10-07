import { Injectable, BadRequestException } from '@nestjs/common'
import {
  formatearMoneda,
  convertirMontoLiteral,
  formatearFechaReporte,
} from '@/common/utils/reporte.util'
import { BienesLgiReporteRepository } from '../repository/bienes-lgi.repository'
import { ActuacionLgiService } from './actuacion.service'

@Injectable()
export class BienesLgiService {
  constructor(
    private readonly bienesRepository: BienesLgiReporteRepository,
    private readonly actuacionService: ActuacionLgiService,
  ) {}

 async GenerarPDFBienes(opId: number) {
  if (!Number.isSafeInteger(opId) || opId <= 0) {
    throw new BadRequestException(
      'El identificador de actuación debe ser un entero positivo',
    )
  }

  const base =
    await this.actuacionService.GenerarPDFActuacion(opId)

  const registros =
    await this.bienesRepository.obtenerBienesPorOperativo(opId)

    return {
      reporte: base.reporte,
      accion: base.accion,
      personasAfectadas: base.personasAfectadas,
      delitoPrecedente: base.delitoPrecedente,
      bienes: registros.map((registro, index) => {
        const aprox = this.obtenerMonto(registro.costoAprox)
        const cuant = this.obtenerMonto(registro.costoCuant)
        return {
          numero: index + 1,
          idBien: registro.itembiensecId,
          opId: registro.opId,
          tipoBien: registro.categoriaTipo?.descripcion ?? 'Sin especificar',
          cantidad: registro.cantidadBien ?? 1,
          fechaRegistro: registro.fechaHoraIngreso ?? 'Sin especificar',
          lugarSecuestro: registro.lugarSecuestro ?? null,
          valorEstimado: aprox === null ? 'Sin especificar' : formatearMoneda(aprox),
          valorLiteral: aprox === null ? '' : convertirMontoLiteral(aprox),
          valorCuantificado: cuant === null ? 'Sin especificar' : formatearMoneda(cuant),
          caracteristicas: registro.caracteristicas ?? [],
          ultimaSituacion: registro.ultimaSituacionJuridica?.descripcionTipo ?? 'Sin situación registrada',
          situacionesLegales: (registro.situacionesJuridicas ?? []).map(
            (situacion: any) => this.mapearSituacion(situacion),
          ),
          fotografias: (registro.fotografias ?? []).map((foto: any, indice: number) => ({
            numero: indice + 1,
            descripcion: foto.descripcion ?? '',
            // findOne ya devuelve data URL; no convertirla otra vez.
            imagen: foto.fotografiaDataUrl ?? null,
          })),
        }
      }),
    }
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
