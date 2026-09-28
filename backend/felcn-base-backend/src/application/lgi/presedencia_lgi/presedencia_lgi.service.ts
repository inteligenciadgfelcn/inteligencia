import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { Request } from 'express'

import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

import { ResultadoConsultaAvanzada } from '../informacion_siii/dto/consulta_siii.dto'
import { ConsultaSiiiRepository } from '../informacion_siii/repository/consulta.repository'

import { CreatePresedenciaLgiDto } from './dto/create-presedencia_lgi.dto'
import { PresedenciaLgi } from './entities/presedencia_lgi.entity'
import { PresedenciaLgiRepository } from './repository/presedencia_lgi.repository'

type AuditedRequest = Request & {
  usuarioAuditoria?: string
}

type PresedenciaConOperativos = PresedenciaLgi & {
  operativosSiii: ResultadoConsultaAvanzada[]
}

@Injectable({ scope: Scope.REQUEST })
export class PresedenciaLgiService {
  constructor(
    private readonly presedenciaRepository: PresedenciaLgiRepository,

    private readonly consultaSiiiRepository: ConsultaSiiiRepository,

    @Inject(REQUEST)
    private readonly request: AuditedRequest
  ) {}

  async create(dto: CreatePresedenciaLgiDto): Promise<PresedenciaLgi> {
    const numeroCaso = dto.nrocasopre.trim().toUpperCase()

    const existente =
      await this.presedenciaRepository.buscarActivoPorCasoYNumero(
        dto.casosId,
        numeroCaso
      )

    if (existente) {
      throw new ConflictException(
        `El caso precedente ${numeroCaso} ya está registrado en este caso`
      )
    }

    const presedencia = this.presedenciaRepository.crear({
      casosId: dto.casosId,
      nrocasopre: numeroCaso,
      estado: 'ACTIVO',
      usuario: this.request.usuarioAuditoria ?? 'SISTEMA',
    })

    return this.presedenciaRepository.guardar(presedencia)
  }

  async remove(id: number): Promise<PresedenciaLgi> {
    const presedencia =
      await this.presedenciaRepository.buscarActivoPorId(id)

    if (!presedencia) {
      throw new NotFoundException(
        `No existe la presedencia activa con ID ${id}`
      )
    }

    presedencia.estado = 'INACTIVO'
    presedencia.usuarioActualizacion =
      this.request.usuarioAuditoria ?? 'SISTEMA'

    return this.presedenciaRepository.guardar(presedencia)
  }

  async findAllPaginadoByCaso(
    casosId: number,
    pagination: PaginacionQueryDto
  ): Promise<[PresedenciaConOperativos[], number]> {
    const [presedencias, total] =
      await this.presedenciaRepository.findAllPaginadoByCaso(
        casosId,
        pagination
      )

    if (presedencias.length === 0) {
      return [[], total]
    }

    const operativos =
      await this.consultaSiiiRepository.buscarPorNumerosCaso(
        presedencias.map((item) => item.nrocasopre)
      )

    const porNumeroCaso =
      new Map<string, ResultadoConsultaAvanzada[]>()

    for (const operativo of operativos) {
      const clave = operativo.numeroCaso.trim().toUpperCase()
      const grupo = porNumeroCaso.get(clave) ?? []

      grupo.push(operativo)
      porNumeroCaso.set(clave, grupo)
    }

    const filas: PresedenciaConOperativos[] =
      presedencias.map((presedencia) => ({
        ...presedencia,
        operativosSiii:
          porNumeroCaso.get(
            presedencia.nrocasopre.trim().toUpperCase()
          ) ?? [],
      }))

    return [filas, total]
  }
}