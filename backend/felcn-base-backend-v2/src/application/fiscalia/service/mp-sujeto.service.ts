import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpCasoSujeto } from '../entity/mp-caso-sujeto.entity'
import { MpSujetoAbogado } from '../entity/mp-sujeto-abogado.entity'
import { MpSujetoSituacionJuridica } from '../entity/mp-sujeto-situacion-juridica.entity'
import { MpSujetoDomicilio } from '../entity/mp-sujeto-domicilio.entity'
import { MpCasoService } from './mp-caso.service'
import {
  ActualizarAbogadoDto,
  ActualizarSujetoDto,
  CrearAbogadosDto,
  CrearDomicilioDto,
  CrearSituacionesJuridicasDto,
  CrearSujetosDto,
  SujetoItemDto,
} from '../dto/sujeto.dto'

/* eslint-disable camelcase */

/**
 * Servicio MpSujetoService
 * Recepción de sujetos del caso y sus recursos hijos: abogados,
 * situaciones jurídicas y domicilios (3.7–3.12).
 */
@Injectable()
export class MpSujetoService extends BaseService {
  constructor(
    private readonly repository: FiscaliaRepository,
    private readonly mpCasoService: MpCasoService
  ) {
    super()
  }

  // ─── Sujetos (3.7 / 3.8) ───────────────────────────────────────────────────

  async crearSujetos(polCasoId: string, dto: CrearSujetosDto) {
    await this.mpCasoService.buscarPorPolCasoId(polCasoId)
    dto.sujetos.forEach((s) => this.validarPersona(s))

    const sujetos: {
      mp_caso_persona_id: number
      pol_caso_persona_id: number
    }[] = []
    let algunoCreado = false

    for (const item of dto.sujetos) {
      const existente = await this.repository.buscarUno(MpCasoSujeto, {
        mpCasoPersonaId: String(item.mp_caso_persona_id),
      })
      if (existente) {
        sujetos.push({
          mp_caso_persona_id: item.mp_caso_persona_id,
          pol_caso_persona_id: Number(existente.polCasoPersonaId),
        })
        continue
      }

      const creado = await this.repository.crear(MpCasoSujeto, {
        mpCasoPersonaId: String(item.mp_caso_persona_id),
        polCasoId,
        tipoPersona: item.persona_natural ? 'natural' : 'juridica',
        numeroDocumento: item.persona_natural?.numero_documento ?? null,
        nit: item.persona_juridica?.nit ?? null,
        esQuerellante: item.es_querellante ?? null,
        reservaIdentidad: item.reserva_identidad ?? null,
        payload: { ...item },
      })
      algunoCreado = true
      sujetos.push({
        mp_caso_persona_id: item.mp_caso_persona_id,
        pol_caso_persona_id: Number(creado.polCasoPersonaId),
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Sujetos MP registrados',
      metadata: { polCasoId, cantidad: dto.sujetos.length },
    })

    return { sujetos, algunoCreado }
  }

  async actualizarSujeto(
    polCasoPersonaId: string,
    dto: ActualizarSujetoDto
  ): Promise<void> {
    const sujeto = await this.buscarSujeto(polCasoPersonaId)
    if (dto.persona_natural && dto.persona_juridica) {
      throw new BadRequestException(
        'persona_natural y persona_juridica son mutuamente excluyentes'
      )
    }

    await this.repository.guardar(MpCasoSujeto, {
      polCasoPersonaId,
      numeroDocumento:
        dto.persona_natural?.numero_documento ?? sujeto.numeroDocumento,
      nit: dto.persona_juridica?.nit ?? sujeto.nit,
      esQuerellante: dto.es_querellante ?? sujeto.esQuerellante,
      estado: dto.estado ?? sujeto.estado,
      payload: { ...sujeto.payload, ...dto },
      updatedAt: new Date(),
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Sujeto MP actualizado',
      metadata: { polCasoPersonaId },
    })
  }

  // ─── Abogados (3.9 / 3.10) ─────────────────────────────────────────────────

  async crearAbogados(polCasoPersonaId: string, dto: CrearAbogadosDto) {
    await this.buscarSujeto(polCasoPersonaId)

    const abogados: {
      mp_caso_persona_abogado_id: number
      pol_caso_persona_abogado_id: number
    }[] = []
    let algunoCreado = false

    for (const item of dto.abogados) {
      const existente = await this.repository.buscarUno(MpSujetoAbogado, {
        mpCasoPersonaAbogadoId: String(item.mp_caso_persona_abogado_id),
      })
      if (existente) {
        abogados.push({
          mp_caso_persona_abogado_id: item.mp_caso_persona_abogado_id,
          pol_caso_persona_abogado_id: Number(
            existente.polCasoPersonaAbogadoId
          ),
        })
        continue
      }

      const creado = await this.repository.crear(MpSujetoAbogado, {
        mpCasoPersonaAbogadoId: String(item.mp_caso_persona_abogado_id),
        polCasoPersonaId,
        ci: item.ci,
        codigoRpa: item.codigo_rpa,
        payload: { ...item },
      })
      algunoCreado = true
      abogados.push({
        mp_caso_persona_abogado_id: item.mp_caso_persona_abogado_id,
        pol_caso_persona_abogado_id: Number(creado.polCasoPersonaAbogadoId),
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Abogados MP registrados',
      metadata: { polCasoPersonaId, cantidad: dto.abogados.length },
    })

    return { abogados, algunoCreado }
  }

  async actualizarAbogado(
    polCasoPersonaAbogadoId: string,
    dto: ActualizarAbogadoDto
  ): Promise<void> {
    const abogado = await this.repository.buscarUno(MpSujetoAbogado, {
      polCasoPersonaAbogadoId,
    })
    if (!abogado) {
      throw new NotFoundException(
        `No existe un abogado con pol_caso_persona_abogado_id ${polCasoPersonaAbogadoId}`
      )
    }

    await this.repository.guardar(MpSujetoAbogado, {
      polCasoPersonaAbogadoId,
      estado: dto.estado,
      motivoBaja: dto.motivo_baja ?? abogado.motivoBaja,
      payload: { ...abogado.payload, ...dto },
      updatedAt: new Date(),
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Abogado MP actualizado',
      metadata: { polCasoPersonaAbogadoId },
    })
  }

  // ─── Situaciones jurídicas (3.11) ──────────────────────────────────────────

  async crearSituacionesJuridicas(
    polCasoPersonaId: string,
    dto: CrearSituacionesJuridicasDto
  ) {
    await this.buscarSujeto(polCasoPersonaId)

    const situaciones_juridicas: {
      mp_caso_persona_situacion_juridica_id: number
      pol_caso_persona_situacion_juridica_id: number
    }[] = []
    let algunoCreado = false

    for (const item of dto.situaciones_juridicas) {
      const existente = await this.repository.buscarUno(
        MpSujetoSituacionJuridica,
        {
          mpCasoPersonaSituacionJuridicaId: String(
            item.mp_caso_persona_situacion_juridica_id
          ),
        }
      )
      if (existente) {
        situaciones_juridicas.push({
          mp_caso_persona_situacion_juridica_id:
            item.mp_caso_persona_situacion_juridica_id,
          pol_caso_persona_situacion_juridica_id: Number(
            existente.polCasoPersonaSituacionJuridicaId
          ),
        })
        continue
      }

      const creado = await this.repository.crear(MpSujetoSituacionJuridica, {
        mpCasoPersonaSituacionJuridicaId: String(
          item.mp_caso_persona_situacion_juridica_id
        ),
        polCasoPersonaId,
        situacionJuridicaId: item.situacion_juridica_id,
        fechaInicio: new Date(item.fecha_inicio),
        payload: { ...item },
      })
      algunoCreado = true
      situaciones_juridicas.push({
        mp_caso_persona_situacion_juridica_id:
          item.mp_caso_persona_situacion_juridica_id,
        pol_caso_persona_situacion_juridica_id: Number(
          creado.polCasoPersonaSituacionJuridicaId
        ),
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Situaciones jurídicas MP registradas',
      metadata: {
        polCasoPersonaId,
        cantidad: dto.situaciones_juridicas.length,
      },
    })

    return { situaciones_juridicas, algunoCreado }
  }

  // ─── Domicilios (3.12) ─────────────────────────────────────────────────────

  async crearDomicilio(polCasoPersonaId: string, dto: CrearDomicilioDto) {
    await this.buscarSujeto(polCasoPersonaId)

    const existente = await this.repository.buscarUno(MpSujetoDomicilio, {
      mpPersonaDomicilioId: String(dto.mp_persona_domicilio_id),
    })
    if (existente) {
      return {
        pol_persona_residencia_id: Number(existente.polPersonaResidenciaId),
        creado: false,
      }
    }

    const creado = await this.repository.crear(MpSujetoDomicilio, {
      mpPersonaDomicilioId: String(dto.mp_persona_domicilio_id),
      polCasoPersonaId,
      paisId: dto.pais_id,
      municipioId: dto.municipio_id ?? null,
      payload: { ...dto },
    })

    this.logger.audit('fiscalia', {
      mensaje: 'Domicilio MP registrado',
      metadata: { polCasoPersonaId },
    })

    return {
      pol_persona_residencia_id: Number(creado.polPersonaResidenciaId),
      creado: true,
    }
  }

  // ─── Compartidos ───────────────────────────────────────────────────────────

  /** Obtiene un sujeto por pol_caso_persona_id o lanza 404. */
  async buscarSujeto(polCasoPersonaId: string): Promise<MpCasoSujeto> {
    const sujeto = await this.repository.buscarUno(MpCasoSujeto, {
      polCasoPersonaId,
    })
    if (!sujeto) {
      throw new NotFoundException(
        `No existe un sujeto con pol_caso_persona_id ${polCasoPersonaId}`
      )
    }
    return sujeto
  }

  private validarPersona(sujeto: SujetoItemDto): void {
    const tieneNatural = !!sujeto.persona_natural
    const tieneJuridica = !!sujeto.persona_juridica
    if (tieneNatural === tieneJuridica) {
      throw new BadRequestException(
        `El sujeto mp_caso_persona_id=${sujeto.mp_caso_persona_id} debe ` +
          'incluir persona_natural o persona_juridica (exactamente una)'
      )
    }
  }
}
