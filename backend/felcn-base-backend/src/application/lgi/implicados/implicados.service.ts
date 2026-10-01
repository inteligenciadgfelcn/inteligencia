import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { CreateImplicadoLgiDto } from './dto/create-implicado.dto'
import { UpdateImplicadoLgiDto } from './dto/update-implicado.dto'
import { ImplicadoLgi } from './entities/implicado.entity'
import { ImplicadoLgiRepository } from './repository/implicado-lgi.repository'

interface RequestConAuditoria extends Request {
  usuarioAuditoria?: string
}

@Injectable({ scope: Scope.REQUEST })
export class ImplicadoLgiService {
  constructor(
    private readonly repository: ImplicadoLgiRepository,
    @Inject(REQUEST)
    private readonly request: RequestConAuditoria
  ) {}

  private obtenerUsuarioAuditoria(): string {
    const usuario = this.request.usuarioAuditoria?.trim()

    if (!usuario) {
      throw new UnauthorizedException(
        'No se encontró el usuario para registrar la auditoría'
      )
    }

    return usuario
  }

  private validarId(id: string): void {
    if (!/^[1-9]\d*$/.test(id)) {
      throw new BadRequestException('El ID debe ser un entero positivo')
    }
  }

  async create(dto: CreateImplicadoLgiDto): Promise<ImplicadoLgi> {
    return this.repository.create(dto, this.obtenerUsuarioAuditoria())
  }

  async findAll(
    id_operativo?: string,
    empresaId?: number
  ): Promise<ImplicadoLgi[]> {
    if (id_operativo !== undefined) {
      this.validarId(id_operativo)
    }

    if (
      empresaId !== undefined &&
      (!Number.isInteger(empresaId) || empresaId <= 0 || empresaId > 2147483647)
    ) {
      throw new BadRequestException(
        'empresaId debe ser un entero positivo válido'
      )
    }

    return this.repository.findAll(id_operativo, empresaId)
  }

  async findOne(id: string): Promise<ImplicadoLgi> {
    this.validarId(id)

    const implicado = await this.repository.findOne(id)

    if (!implicado) {
      throw new NotFoundException(
        `El implicado con ID ${id} no existe o está inactivo`
      )
    }

    return implicado
  }

  async findByOperativo(operativoId: string): Promise<ImplicadoLgi[]> {
    this.validarId(operativoId)

    return this.repository.findByOperativo(operativoId)
  }

  async update(id: string, dto: UpdateImplicadoLgiDto): Promise<ImplicadoLgi> {
    this.validarId(id)

    const implicado = await this.repository.update(
      id,
      dto,
      this.obtenerUsuarioAuditoria()
    )

    if (!implicado) {
      throw new NotFoundException(
        `El implicado con ID ${id} no existe o está inactivo`
      )
    }

    return implicado
  }

  async remove(id: string): Promise<{ message: string }> {
    this.validarId(id)

    const eliminado = await this.repository.remove(
      id,
      this.obtenerUsuarioAuditoria()
    )

    if (!eliminado) {
      throw new NotFoundException(
        `El implicado con ID ${id} no existe o ya está inactivo`
      )
    }

    return {
      message: 'Implicado dado de baja correctamente',
    }
  }
}
