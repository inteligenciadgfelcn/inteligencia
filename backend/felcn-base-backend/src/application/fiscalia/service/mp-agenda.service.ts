import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpCasoAgenda } from '../entity/mp-caso-agenda.entity'
import { MpCasoService } from './mp-caso.service'
import { ActualizarAgendaDto, CrearAgendaDto } from '../dto/agenda.dto'

/* eslint-disable camelcase */

/**
 * Servicio MpAgendaService
 * Recepción de agenda de audiencias (3.19 / 3.16b + 3.20 unificados).
 */
@Injectable()
export class MpAgendaService extends BaseService {
  constructor(
    private readonly repository: FiscaliaRepository,
    private readonly mpCasoService: MpCasoService
  ) {
    super()
  }

  /**
   * Registra un evento de agenda. Idempotente por oj_audiencia_detalle_id.
   */
  async crearAgenda(polCasoId: string, dto: CrearAgendaDto) {
    await this.mpCasoService.buscarPorPolCasoId(polCasoId)

    const existente = await this.repository.buscarUno(MpCasoAgenda, {
      ojAudienciaDetalleId: String(dto.oj_audiencia_detalle_id),
    })
    if (existente) {
      return { pol_agenda_id: Number(existente.polAgendaId), creado: false }
    }

    const creado = await this.repository.crear(MpCasoAgenda, {
      polCasoId,
      ojAudienciaId: String(dto.oj_audiencia_id),
      ojAudienciaDetalleId: String(dto.oj_audiencia_detalle_id),
      juzgadoId: dto.juzgado_id,
      fechaHoraInicio: new Date(dto.fecha_hora_inicio),
      fechaHoraFin: new Date(dto.fecha_hora_fin),
      payload: { ...dto },
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Agenda MP registrada',
      metadata: { polCasoId, polAgendaId: creado.polAgendaId },
    })

    return { pol_agenda_id: Number(creado.polAgendaId), creado: true }
  }

  async actualizarAgenda(
    polAgendaId: string,
    dto: ActualizarAgendaDto
  ): Promise<void> {
    const agenda = await this.repository.buscarUno(MpCasoAgenda, {
      polAgendaId,
    })
    if (!agenda) {
      throw new NotFoundException(
        `No existe un evento de agenda con pol_agenda_id ${polAgendaId}`
      )
    }

    await this.repository.guardar(MpCasoAgenda, {
      polAgendaId,
      juzgadoId: dto.juzgado_id ?? agenda.juzgadoId,
      fechaHoraInicio: dto.fecha_hora_inicio
        ? new Date(dto.fecha_hora_inicio)
        : agenda.fechaHoraInicio,
      fechaHoraFin: dto.fecha_hora_fin
        ? new Date(dto.fecha_hora_fin)
        : agenda.fechaHoraFin,
      estado: dto.estado ?? agenda.estado,
      payload: { ...agenda.payload, ...dto },
      updatedAt: new Date(),
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Agenda MP actualizada',
      metadata: { polAgendaId },
    })
  }
}
