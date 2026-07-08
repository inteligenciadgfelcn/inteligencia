import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpCasoDelito } from '../entity/mp-caso-delito.entity'
import { MpCasoService } from './mp-caso.service'
import { ActualizarDelitoDto, CrearDelitosDto } from '../dto/delito.dto'

/* eslint-disable camelcase */

export interface MapeoDelito {
  mp_caso_delito_id: number
  pol_caso_delito_id: number
}

/**
 * Servicio MpDelitoService
 * Recepción de delitos del caso (3.3–3.6). Cubre delito inicial y
 * principal (mismo recurso, campos es_principal / es_tentativo opcionales).
 */
@Injectable()
export class MpDelitoService extends BaseService {
  constructor(
    private readonly repository: FiscaliaRepository,
    private readonly mpCasoService: MpCasoService
  ) {
    super()
  }

  /**
   * Registra delitos en bloque. Idempotente por mp_caso_delito_id:
   * los ya recibidos devuelven su pol_caso_delito_id existente.
   */
  async crearDelitos(
    polCasoId: string,
    dto: CrearDelitosDto
  ): Promise<{ delitos: MapeoDelito[]; algunoCreado: boolean }> {
    await this.mpCasoService.buscarPorPolCasoId(polCasoId)

    const delitos: MapeoDelito[] = []
    let algunoCreado = false

    for (const item of dto.delitos) {
      const existente = await this.repository.buscarUno(MpCasoDelito, {
        mpCasoDelitoId: String(item.mp_caso_delito_id),
      })

      if (existente) {
        delitos.push({
          mp_caso_delito_id: item.mp_caso_delito_id,
          pol_caso_delito_id: Number(existente.polCasoDelitoId),
        })
        continue
      }

      const creado = await this.repository.crear(MpCasoDelito, {
        mpCasoDelitoId: String(item.mp_caso_delito_id),
        polCasoId,
        delitoId: item.delito_id,
        esPrincipal: item.es_principal ?? null,
        esTentativo: item.es_tentativo ?? null,
        payload: { ...item },
      })
      algunoCreado = true
      delitos.push({
        mp_caso_delito_id: item.mp_caso_delito_id,
        pol_caso_delito_id: Number(creado.polCasoDelitoId),
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Delitos MP registrados',
      metadata: { polCasoId, cantidad: dto.delitos.length },
    })

    return { delitos, algunoCreado }
  }

  /** Actualiza es_principal / es_tentativo / estado de un delito (3.4 / 3.6). */
  async actualizarDelito(
    polCasoDelitoId: string,
    dto: ActualizarDelitoDto
  ): Promise<void> {
    const delito = await this.repository.buscarUno(MpCasoDelito, {
      polCasoDelitoId,
    })
    if (!delito) {
      throw new NotFoundException(
        `No existe un delito con pol_caso_delito_id ${polCasoDelitoId}`
      )
    }

    await this.repository.guardar(MpCasoDelito, {
      polCasoDelitoId,
      esPrincipal: dto.es_principal ?? delito.esPrincipal,
      esTentativo: dto.es_tentativo ?? delito.esTentativo,
      estado: dto.estado ?? delito.estado,
      payload: { ...delito.payload, ...dto },
      updatedAt: new Date(),
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Delito MP actualizado',
      metadata: { polCasoDelitoId },
    })
  }
}
