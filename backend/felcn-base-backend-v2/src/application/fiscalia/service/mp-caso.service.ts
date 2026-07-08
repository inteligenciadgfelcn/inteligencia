import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { MpCasoRepository } from '../repository/mp-caso.repository'
import { ActualizarCasoDto, CrearCasoDto } from '../dto/caso.dto'
import { MpCaso } from '../entity/mp-caso.entity'

export interface ResultadoCrearCaso {
  pol_caso_id: number
  /** false cuando el mp_caso_id ya existía (reintento idempotente) */
  creado: boolean
}

/**
 * Servicio MpCasoService
 * Recepción de casos enviados por el Ministerio Público (3.1 / 3.2).
 * Persiste en staging (fiscalia.mp_caso) sin homologar catálogos:
 * la homologación hacia las tablas SIII es diferida (Fase B).
 */
@Injectable()
export class MpCasoService extends BaseService {
  constructor(private readonly mpCasoRepository: MpCasoRepository) {
    super()
  }

  /**
   * Registra un caso del MP. Idempotente: si el mp_caso_id ya fue recibido,
   * devuelve el pol_caso_id ya asignado sin crear un duplicado.
   */
  async crearCaso(dto: CrearCasoDto): Promise<ResultadoCrearCaso> {
    const existente = await this.mpCasoRepository.buscarPorMpCasoId(
      dto.mp_caso_id
    )
    if (existente) {
      this.logger.audit('fiscalia', {
        mensaje: 'Caso MP reenviado — se devuelve pol_caso_id existente',
        metadata: {
          mpCasoId: dto.mp_caso_id,
          polCasoId: existente.polCasoId,
        },
      })
      return { pol_caso_id: Number(existente.polCasoId), creado: false }
    }

    const creado = await this.mpCasoRepository.crear({
      mpCasoId: String(dto.mp_caso_id),
      cud: dto.cud,
      mpCasoPadreId:
        dto.mp_caso_padre_id !== undefined && dto.mp_caso_padre_id !== null
          ? String(dto.mp_caso_padre_id)
          : null,
      estaReservado: dto.esta_reservado ?? false,
      payload: { ...dto },
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Caso MP registrado',
      metadata: {
        mpCasoId: dto.mp_caso_id,
        polCasoId: creado.polCasoId,
        cud: dto.cud,
      },
    })

    return { pol_caso_id: Number(creado.polCasoId), creado: true }
  }

  /**
   * Actualiza un caso del MP: refresca columnas de correlación y hace
   * merge del body recibido sobre el payload almacenado.
   */
  async actualizarCaso(
    polCasoId: string,
    dto: ActualizarCasoDto
  ): Promise<void> {
    const caso = await this.buscarPorPolCasoId(polCasoId)

    await this.mpCasoRepository.actualizar(polCasoId, {
      mpCasoPadreId:
        dto.mp_caso_padre_id !== undefined && dto.mp_caso_padre_id !== null
          ? String(dto.mp_caso_padre_id)
          : caso.mpCasoPadreId,
      payload: { ...caso.payload, ...dto },
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Caso MP actualizado',
      metadata: { polCasoId, mpCasoId: caso.mpCasoId },
    })
  }

  /** Obtiene un caso por pol_caso_id o lanza 404. Reutilizado por otros servicios del módulo. */
  async buscarPorPolCasoId(polCasoId: string): Promise<MpCaso> {
    const caso = await this.mpCasoRepository.buscarPorPolCasoId(polCasoId)
    if (!caso) {
      throw new NotFoundException(
        `No existe un caso con pol_caso_id ${polCasoId}`
      )
    }
    return caso
  }
}
