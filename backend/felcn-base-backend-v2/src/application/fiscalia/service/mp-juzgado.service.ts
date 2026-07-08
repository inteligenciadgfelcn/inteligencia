import { Injectable } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpCasoJuzgado } from '../entity/mp-caso-juzgado.entity'
import { MpCasoService } from './mp-caso.service'
import { MpSujetoService } from './mp-sujeto.service'
import {
  ActualizarJuzgadoCasoDto,
  ActualizarJuzgadoSujetosDto,
} from '../dto/juzgado.dto'

/* eslint-disable camelcase */

/**
 * Servicio MpJuzgadoService
 * Asignación de juzgado a caso y a sujetos (3.17 / 3.18).
 * Cada POST agrega un registro al historial; el vigente es el más reciente.
 */
@Injectable()
export class MpJuzgadoService extends BaseService {
  constructor(
    private readonly repository: FiscaliaRepository,
    private readonly mpCasoService: MpCasoService,
    private readonly mpSujetoService: MpSujetoService
  ) {
    super()
  }

  async actualizarJuzgadoCaso(dto: ActualizarJuzgadoCasoDto): Promise<void> {
    const polCasoId = String(dto.pol_caso_id)
    await this.mpCasoService.buscarPorPolCasoId(polCasoId)

    await this.repository.crear(MpCasoJuzgado, {
      polCasoId,
      polCasoPersonaId: null,
      juzgadoId: dto.juzgado_id,
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Juzgado del caso actualizado',
      metadata: { polCasoId, juzgadoId: dto.juzgado_id },
    })
  }

  async actualizarJuzgadoSujetos(
    dto: ActualizarJuzgadoSujetosDto
  ): Promise<void> {
    for (const polCasoPersonaId of dto.pol_caso_persona_ids) {
      const sujeto = await this.mpSujetoService.buscarSujeto(
        String(polCasoPersonaId)
      )
      await this.repository.crear(MpCasoJuzgado, {
        polCasoId: sujeto.polCasoId,
        polCasoPersonaId: String(polCasoPersonaId),
        juzgadoId: dto.juzgado_id,
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Juzgado de sujetos actualizado',
      metadata: {
        sujetos: dto.pol_caso_persona_ids,
        juzgadoId: dto.juzgado_id,
      },
    })
  }
}
