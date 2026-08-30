import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpCasoFiscal } from '../entity/mp-caso-fiscal.entity'
import { MpCasoService } from './mp-caso.service'
import { ActualizarFiscalDto, CrearFiscalesDto } from '../dto/fiscal.dto'

/* eslint-disable camelcase */

/**
 * Servicio MpFiscalService
 * Recepción de fiscales del caso (3.13 / 3.14).
 */
@Injectable()
export class MpFiscalService extends BaseService {
  constructor(
    private readonly repository: FiscaliaRepository,
    private readonly mpCasoService: MpCasoService
  ) {
    super()
  }

  async crearFiscales(polCasoId: string, dto: CrearFiscalesDto) {
    await this.mpCasoService.buscarPorPolCasoId(polCasoId)

    const fiscales: {
      mp_caso_funcionario_id: number
      pol_caso_funcionario_id: number
    }[] = []
    let algunoCreado = false

    for (const item of dto.fiscales) {
      const existente = await this.repository.buscarUno(MpCasoFiscal, {
        mpCasoFuncionarioId: String(item.mp_caso_funcionario_id),
      })
      if (existente) {
        fiscales.push({
          mp_caso_funcionario_id: item.mp_caso_funcionario_id,
          pol_caso_funcionario_id: Number(existente.polCasoFuncionarioId),
        })
        continue
      }

      const creado = await this.repository.crear(MpCasoFiscal, {
        mpCasoFuncionarioId: String(item.mp_caso_funcionario_id),
        polCasoId,
        ci: item.ci,
        tipoResponsableId: item.tipo_responsable_id,
        payload: { ...item },
      })
      algunoCreado = true
      fiscales.push({
        mp_caso_funcionario_id: item.mp_caso_funcionario_id,
        pol_caso_funcionario_id: Number(creado.polCasoFuncionarioId),
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Fiscales MP registrados',
      metadata: { polCasoId, cantidad: dto.fiscales.length },
    })

    return { fiscales, algunoCreado }
  }

  async actualizarFiscal(
    polCasoFuncionarioId: string,
    dto: ActualizarFiscalDto
  ): Promise<void> {
    const fiscal = await this.repository.buscarUno(MpCasoFiscal, {
      polCasoFuncionarioId,
    })
    if (!fiscal) {
      throw new NotFoundException(
        `No existe un fiscal con pol_caso_funcionario_id ${polCasoFuncionarioId}`
      )
    }

    await this.repository.guardar(MpCasoFiscal, {
      polCasoFuncionarioId,
      estado: dto.estado,
      payload: { ...fiscal.payload, ...dto },
      updatedAt: new Date(),
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Fiscal MP actualizado',
      metadata: { polCasoFuncionarioId },
    })
  }
}
