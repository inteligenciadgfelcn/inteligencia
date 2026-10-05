import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UpdateSituacionBienLgiDto } from './dto/update-situacion_bien_lgi.dto'
import { CreateSituacionBienDto } from './dto/create-situacion-bien.dto'
import { DB_LGI } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SituacionBien } from './entities/situacion-bienes.entity'

@Injectable()
export class SituacionBienLgiService {
  constructor(
    @InjectRepository(SituacionBien, DB_LGI)
    private readonly repository: Repository<SituacionBien>
  ) {}

  async create(
    dto: CreateSituacionBienDto,
    usuarioAuditoria?: string
  ): Promise<SituacionBien> {
    const usuario = usuarioAuditoria?.trim()

    if (!usuario || usuario.length > 15) {
      throw new BadRequestException(
        'El usuario de auditoría es obligatorio y debe tener hasta 15 caracteres'
      )
    }

    this.validarId(dto.itemBienSecId, 'itemBienSecId')
    this.validarCalidad(dto.calbId)

    const entregaDircabi = dto.calbId === '5'

    const situacion = this.repository.create({
      itemBienSecId: dto.itemBienSecId,
      fiscalRequirente: dto.fiscalRequirente,
      calbId: dto.calbId,
      fechaEntrega: this.convertirFecha(dto.fechaEntrega),
      responsableRecepcion: dto.responsableRecepcion,
      institucion: entregaDircabi ? (dto.institucion ?? null) : null,
      ubicacion: entregaDircabi ? (dto.ubicacion ?? null) : null,
      idTipoDocumento: dto.idTipoDocumento ?? null,
      numeroDocumento: dto.numeroDocumento ?? null,
      fechaHoraIngreso: new Date(),
      usuario,
    })

    return this.repository.save(situacion)
  }

  async findAll(): Promise<SituacionBien[]> {
    return this.repository.find({
      order: {
        sitbId: 'DESC',
      },
    })
  }

  async findByBien(itemBienSecId: string): Promise<SituacionBien[]> {
    this.validarId(itemBienSecId, 'itemBienSecId')

    return this.repository.find({
      where: {
        itemBienSecId,
      },
      order: {
        fechaEntrega: 'DESC',
        sitbId: 'DESC',
      },
    })
  }

  async findOne(id: string): Promise<SituacionBien> {
    this.validarId(id, 'sitbId')

    const situacion = await this.repository.findOne({
      where: {
        sitbId: id,
      },
    })

    if (!situacion) {
      throw new NotFoundException(
        `No existe una situación de bien con ID ${id}`
      )
    }

    return situacion
  }

  async update(
    id: string,
    dto: UpdateSituacionBienLgiDto
  ): Promise<SituacionBien> {
    const situacion = await this.findOne(id)

    // Los campos obligatorios pueden omitirse en PATCH,
    // pero no pueden establecerse en null.
    const obligatorios = [
      'itemBienSecId',
      'fiscalRequirente',
      'calbId',
      'fechaEntrega',
      'responsableRecepcion',
    ] as const

    for (const campo of obligatorios) {
      if (dto[campo] === null) {
        throw new BadRequestException(`El campo ${campo} no puede ser null`)
      }
    }

    if (dto.itemBienSecId !== undefined) {
      this.validarId(dto.itemBienSecId, 'itemBienSecId')
      situacion.itemBienSecId = dto.itemBienSecId
    }

    if (dto.fiscalRequirente !== undefined) {
      situacion.fiscalRequirente = dto.fiscalRequirente
    }

    if (dto.calbId !== undefined) {
      this.validarCalidad(dto.calbId)
      situacion.calbId = dto.calbId
    }

    if (dto.fechaEntrega !== undefined) {
      situacion.fechaEntrega = this.convertirFecha(dto.fechaEntrega)
    }

    if (dto.responsableRecepcion !== undefined) {
      situacion.responsableRecepcion = dto.responsableRecepcion
    }

    if (dto.idTipoDocumento !== undefined) {
      situacion.idTipoDocumento = dto.idTipoDocumento
    }

    if (dto.numeroDocumento !== undefined) {
      situacion.numeroDocumento = dto.numeroDocumento
    }

    // Usa la calidad resultante: la enviada o la ya registrada.
    if (situacion.calbId === '5') {
      if (dto.institucion !== undefined) {
        situacion.institucion = dto.institucion
      }

      if (dto.ubicacion !== undefined) {
        situacion.ubicacion = dto.ubicacion
      }
    } else {
      situacion.institucion = null
      situacion.ubicacion = null
    }

    return this.repository.save(situacion)
  }

  async remove(id: string): Promise<{
    mensaje: string
    sitbId: string
  }> {
    const situacion = await this.findOne(id)

    await this.repository.remove(situacion)

    return {
      mensaje: 'Situación de bien eliminada correctamente',
      sitbId: id,
    }
  }

  private validarId(id: string, campo: string): void {
    if (
      typeof id !== 'string' ||
      !/^[1-9]\d*$/.test(id) ||
      BigInt(id) > BigInt('9223372036854775807')
    ) {
      throw new BadRequestException(
        `${campo} debe ser una cadena con un entero positivo válido de tipo bigint`
      )
    }
  }

  private validarCalidad(calbId: string): void {
    if (!['1', '2', '3', '4', '5'].includes(calbId)) {
      throw new BadRequestException(
        'calbId debe ser uno de los valores: 1, 2, 3, 4 o 5'
      )
    }
  }

  private convertirFecha(valor: string): Date {
    const fecha = new Date(valor)

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('La fecha de entrega no es válida')
    }

    return fecha
  }
}
