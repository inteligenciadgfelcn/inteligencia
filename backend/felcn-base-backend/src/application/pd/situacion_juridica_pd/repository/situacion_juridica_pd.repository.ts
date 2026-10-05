import { MedidaCautelar } from '@/application/lgi/parametro/parametricas_lgi/entity/medida_cautelar.entity'
import { DB_LGI } from '@/core/config/database/database.module'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSituacionJuridicaPdDto } from '../dto/create-situacion_juridica_pd.dto'
import { UpdateSituacionJuridicaPdDto } from '../dto/update-situacion_juridica_pd.dto'
import { SituacionJuridicaPd } from '../entities/situacion_juridica_pd.entity'

export type SituacionJuridicaConRelaciones = SituacionJuridicaPd & {
  medidaCautelar: MedidaCautelar | null
}

@Injectable()
export class SituacionJuridicaPdRepository {
  constructor(
    @InjectRepository(SituacionJuridicaPd, DB_LGI)
    private readonly repository: Repository<SituacionJuridicaPd>
  ) {}

  private consultaBase() {
    return this.repository
      .createQueryBuilder('s')
      .leftJoinAndMapOne(
        's.medidaCautelar',
        MedidaCautelar,
        'mc',
        'mc.idMedidaCautelar = s.idMedidaCautelar'
      )
  }

  async create(
    dto: CreateSituacionJuridicaPdDto,
    usuarioAuditoria?: string
  ): Promise<SituacionJuridicaConRelaciones> {
    this.validarId(dto.itemBienSecId, 'itemBienSecId')

    const usuario = usuarioAuditoria?.trim()

    if (!usuario || usuario.length > 15) {
      throw new BadRequestException(
        'El usuario de auditoría es obligatorio y debe tener hasta 15 caracteres'
      )
    }

    const registro = this.repository.create({
      itemBienSecId: dto.itemBienSecId,
      fiscalia: dto.fiscalia,
      fechaResolucion: this.convertirFecha(dto.fechaResolucion),
      autoridad: dto.autoridad,
      idMedidaCautelar: dto.idMedidaCautelar ?? null,
      fechaHoraIngreso: new Date(),
      usuario,
    })

    const guardado = await this.repository.save(registro)

    return this.findOne(guardado.perdomId)
  }

  async findAll(): Promise<SituacionJuridicaConRelaciones[]> {
    const filas = await this.consultaBase()
      .orderBy('s.perdomId', 'DESC')
      .getMany()

    return filas as SituacionJuridicaConRelaciones[]
  }

  async findByBien(
    itemBienSecId: string
  ): Promise<SituacionJuridicaConRelaciones[]> {
    this.validarId(itemBienSecId, 'itemBienSecId')

    const filas = await this.consultaBase()
      .where('s.itemBienSecId = :itemBienSecId', {
        itemBienSecId,
      })
      .orderBy('s.fechaResolucion', 'DESC')
      .addOrderBy('s.perdomId', 'DESC')
      .getMany()

    return filas as SituacionJuridicaConRelaciones[]
  }

  async findOne(id: string): Promise<SituacionJuridicaConRelaciones> {
    this.validarId(id, 'perdomId')

    const registro = await this.consultaBase()
      .where('s.perdomId = :id', { id })
      .getOne()

    if (!registro) {
      throw new NotFoundException(
        `No existe una situación jurídica con ID ${id}`
      )
    }

    return registro as SituacionJuridicaConRelaciones
  }

  async update(
    id: string,
    dto: UpdateSituacionJuridicaPdDto
  ): Promise<SituacionJuridicaConRelaciones> {
    // Obtiene únicamente la entidad que se va a modificar.
    const registro = await this.obtenerEntidad(id)

    const obligatorios = [
      'itemBienSecId',
      'fiscalia',
      'fechaResolucion',
      'autoridad',
    ] as const

    for (const campo of obligatorios) {
      if (dto[campo] === null) {
        throw new BadRequestException(`El campo ${campo} no puede ser null`)
      }
    }

    if (dto.itemBienSecId !== undefined) {
      this.validarId(dto.itemBienSecId, 'itemBienSecId')
      registro.itemBienSecId = dto.itemBienSecId
    }

    if (dto.fiscalia !== undefined) {
      registro.fiscalia = dto.fiscalia
    }

    if (dto.fechaResolucion !== undefined) {
      registro.fechaResolucion = this.convertirFecha(dto.fechaResolucion)
    }

    if (dto.autoridad !== undefined) {
      registro.autoridad = dto.autoridad
    }

    if (dto.idMedidaCautelar !== undefined) {
      registro.idMedidaCautelar = dto.idMedidaCautelar
    }

    const guardado = await this.repository.save(registro)

    return this.findOne(guardado.perdomId)
  }

  async remove(id: string): Promise<{
    mensaje: string
    perdomId: string
  }> {
    const registro = await this.obtenerEntidad(id)

    await this.repository.remove(registro)

    return {
      mensaje: 'Situación jurídica eliminada correctamente',
      perdomId: id,
    }
  }

  private async obtenerEntidad(id: string): Promise<SituacionJuridicaPd> {
    this.validarId(id, 'perdomId')

    const registro = await this.repository.findOne({
      where: {
        perdomId: id,
      },
    })

    if (!registro) {
      throw new NotFoundException(
        `No existe una situación jurídica con ID ${id}`
      )
    }

    return registro
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

  private convertirFecha(valor: string): Date {
    const fecha = new Date(valor)

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('La fecha de resolución no es válida')
    }

    return fecha
  }
}
