import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpReserva, TablaReserva } from '../entity/mp-reserva.entity'
import { MpCaso } from '../entity/mp-caso.entity'
import { MpCasoSujeto } from '../entity/mp-caso-sujeto.entity'
import { MpCasoActividad } from '../entity/mp-caso-actividad.entity'
import { CrearReservaDto } from '../dto/reserva.dto'

/* eslint-disable camelcase */

/**
 * Servicio MpReservaService
 * Recepción de reservas de caso / sujeto / actividad (3.16).
 * Guarda el historial en mp_reserva y refleja el flag en el recurso.
 */
@Injectable()
export class MpReservaService extends BaseService {
  constructor(private readonly repository: FiscaliaRepository) {
    super()
  }

  async crearReserva(dto: CrearReservaDto) {
    const tablaId = String(dto.tabla_id)
    const fechaFin = dto.fecha_fin_reserva
      ? new Date(dto.fecha_fin_reserva)
      : null

    await this.reflejarEnRecurso(dto.tabla, tablaId, dto.estado, fechaFin)

    const reserva = await this.repository.crear(MpReserva, {
      tabla: dto.tabla,
      tablaId,
      estado: dto.estado,
      fechaFinReserva: fechaFin,
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Reserva MP registrada',
      metadata: { tabla: dto.tabla, tablaId, estado: dto.estado },
    })

    return { pol_reserva_id: Number(reserva.polReservaId) }
  }

  /** Valida que el recurso destino exista y refleja el estado de reserva. */
  private async reflejarEnRecurso(
    tabla: number,
    tablaId: string,
    estado: number,
    fechaFin: Date | null
  ): Promise<void> {
    if (tabla === TablaReserva.CASO) {
      const caso = await this.repository.buscarUno(MpCaso, {
        polCasoId: tablaId,
      })
      if (!caso) {
        throw new NotFoundException(
          `No existe un caso con pol_caso_id ${tablaId}`
        )
      }
      await this.repository.guardar(MpCaso, {
        polCasoId: tablaId,
        estaReservado: estado === 1,
        fechaFinReserva: fechaFin,
        updatedAt: new Date(),
      })
      return
    }

    if (tabla === TablaReserva.SUJETO) {
      const sujeto = await this.repository.buscarUno(MpCasoSujeto, {
        polCasoPersonaId: tablaId,
      })
      if (!sujeto) {
        throw new NotFoundException(
          `No existe un sujeto con pol_caso_persona_id ${tablaId}`
        )
      }
      await this.repository.guardar(MpCasoSujeto, {
        polCasoPersonaId: tablaId,
        reservaIdentidad: estado === 1,
        updatedAt: new Date(),
      })
      return
    }

    const actividad = await this.repository.buscarUno(MpCasoActividad, {
      polCasoActividadId: tablaId,
    })
    if (!actividad) {
      throw new NotFoundException(
        `No existe una actividad con pol_caso_actividad_id ${tablaId}`
      )
    }
  }
}
