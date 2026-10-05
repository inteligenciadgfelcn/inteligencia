import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { DB_LGI } from '@/application/sunesis/shared/constants/database-connections'
import { PaginacionQueryDto } from '@/common/dto'
import { TipoDocumentoLgi } from '@/application/lgi/parametro/parametricas_lgi/entity/tipo-documento.entity'
import { PersonasImplicada } from '@/application/lgi/personas_implicadas/entities/personas_implicada.entity'
import { VinculoBienLgi } from '@/application/lgi/vinculo_bien_lgi/entities/vinculo_bien_lgi.entity'
import { CreateVinculoBienDto } from '../dto/create-vinculo_bien_pd.dto'
import { UpdateVinculoBienDto } from '../dto/update-vinculo_bien_pd.dto'

export type PersonaConDocumento = PersonasImplicada & {
  tipoDocumento: TipoDocumentoLgi | null
}

export type VinculoBienConPersona = VinculoBienLgi & {
  detenidoAuxiliar: PersonaConDocumento | null
}

@Injectable()
export class VinculoBienRepository {
  constructor(
    @InjectRepository(VinculoBienLgi, DB_LGI)
    private readonly repository: Repository<VinculoBienLgi>
  ) {}

  private consultaBase() {
    return this.repository
      .createQueryBuilder('v')
      .leftJoinAndMapOne(
        'v.detenidoAuxiliar',
        PersonasImplicada,
        'p',
        'p.deId = v.idDetenidoAuxiliar'
      )
      .leftJoinAndMapOne(
        'p.tipoDocumento',
        TipoDocumentoLgi,
        'td',
        'td.tdId = p.tipoDocumentoId'
      )
      .where('v.estado = :estado', {
        estado: 'ACTIVO',
      })
  }

  async create(
    dto: CreateVinculoBienDto
  ): Promise<VinculoBienConPersona> {
    if (dto.idItemBienSecuestrado != null) {
      this.validarId(dto.idItemBienSecuestrado)
    }

    const vinculo = this.repository.create({
      idDetenidoAuxiliar: dto.idDetenidoAuxiliar ?? null,
      idVinculo: dto.idVinculo ?? null,
      idTipoVinculo: dto.idTipoVinculo ?? null,
      idItemBienSecuestrado: dto.idItemBienSecuestrado ?? null,
      estado: 'ACTIVO',
      fechaHoraIngreso: new Date(),
    })

    const guardado = await this.repository.save(vinculo)

    return this.findOne(guardado.idVinculoBien)
  }

  async findAll(): Promise<VinculoBienConPersona[]> {
    const filas = await this.consultaBase()
      .orderBy('v.idVinculoBien', 'DESC')
      .getMany()

    return filas as VinculoBienConPersona[]
  }

  async findAllPaginado(
    pagination: PaginacionQueryDto
  ): Promise<[VinculoBienConPersona[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.consultaBase()

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('p.nombres ILIKE :filtro')
            .orWhere('p.paterno ILIKE :filtro')
            .orWhere('p.materno ILIKE :filtro')
            .orWhere('p.numeroDocumento ILIKE :filtro')
            .orWhere('td.descripcion ILIKE :filtro')
            .orWhere(
              `CONCAT_WS(
                ' ',
                NULLIF(TRIM(p.nombres), ''),
                NULLIF(TRIM(p.paterno), ''),
                NULLIF(TRIM(p.materno), '')
              ) ILIKE :filtro`
            )
            .orWhere(
              'CAST(v.idVinculoBien AS TEXT) ILIKE :filtro'
            )
            .orWhere(
              'CAST(v.idItemBienSecuestrado AS TEXT) ILIKE :filtro'
            )
        }),
        { filtro: valor }
      )
    }

    const total = await query.clone().getCount()

    const filas = await query
      .orderBy('v.idVinculoBien', 'DESC')
      .take(limite)
      .skip(saltar)
      .getMany()

    return [filas as VinculoBienConPersona[], total]
  }

  async findByBien(
    itemBienSecId: string
  ): Promise<VinculoBienConPersona[]> {
    this.validarId(itemBienSecId)

    const filas = await this.consultaBase()
      .andWhere('v.idItemBienSecuestrado = :itemBienSecId', {
        itemBienSecId,
      })
      .orderBy('v.idVinculoBien', 'DESC')
      .getMany()

    return filas as VinculoBienConPersona[]
  }

  async findOne(id: string): Promise<VinculoBienConPersona> {
    this.validarId(id)

    const vinculo = await this.consultaBase()
      .andWhere('v.idVinculoBien = :id', { id })
      .getOne()

    if (!vinculo) {
      throw new NotFoundException(
        `No existe un vínculo de bien activo con ID ${id}`
      )
    }

    return vinculo as VinculoBienConPersona
  }

  async update(
    id: string,
    dto: UpdateVinculoBienDto
  ): Promise<VinculoBienConPersona> {
    // Consulta solo la entidad para actualizarla.
    const vinculo = await this.obtenerEntidadActiva(id)

    if (dto.idDetenidoAuxiliar !== undefined) {
      vinculo.idDetenidoAuxiliar = dto.idDetenidoAuxiliar
    }

    if (dto.idVinculo !== undefined) {
      vinculo.idVinculo = dto.idVinculo
    }

    if (dto.idTipoVinculo !== undefined) {
      vinculo.idTipoVinculo = dto.idTipoVinculo
    }

    if (dto.idItemBienSecuestrado !== undefined) {
      if (dto.idItemBienSecuestrado !== null) {
        this.validarId(dto.idItemBienSecuestrado)
      }

      vinculo.idItemBienSecuestrado = dto.idItemBienSecuestrado
    }

    vinculo.fechaHoraActualizacion = new Date()

    await this.repository.save(vinculo)

    return this.findOne(id)
  }

  async remove(id: string): Promise<{
    mensaje: string
    idVinculoBien: string
  }> {
    const vinculo = await this.obtenerEntidadActiva(id)

    vinculo.estado = 'INACTIVO'
    vinculo.fechaHoraActualizacion = new Date()

    await this.repository.save(vinculo)

    return {
      mensaje: 'Vínculo de bien eliminado correctamente',
      idVinculoBien: id,
    }
  }

  private async obtenerEntidadActiva(
    id: string
  ): Promise<VinculoBienLgi> {
    this.validarId(id)

    const vinculo = await this.repository.findOne({
      where: {
        idVinculoBien: id,
        estado: 'ACTIVO',
      },
    })

    if (!vinculo) {
      throw new NotFoundException(
        `No existe un vínculo de bien activo con ID ${id}`
      )
    }

    return vinculo
  }

  private validarId(id: string): void {
    if (
      typeof id !== 'string' ||
      !/^[1-9]\d*$/.test(id) ||
      BigInt(id) > BigInt('9223372036854775807')
    ) {
      throw new BadRequestException(
        'El ID debe ser un entero positivo válido de tipo bigint'
      )
    }
  }
}