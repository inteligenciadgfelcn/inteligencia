import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { BieneSecuestradoLgi } from '../entities/bienes_secuestrado.entity'
import { CreateBienesSecuestradoDto } from '../dto/create-bienes_secuestrado.dto'
import { UpdateBieneSecuestradoLgiDto } from '../dto/update-bienes_secuestrado.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { formatearFechaBolivia } from '@/common/utils/date.util'

@Injectable()
export class BienSecuestradoLgiRepository {
  constructor(
    @InjectRepository(BieneSecuestradoLgi, DB_LGI)
    private readonly repository: Repository<BieneSecuestradoLgi>
  ) {}

  async create(dto: CreateBienesSecuestradoDto): Promise<BieneSecuestradoLgi> {
    const item = this.repository.create(dto)
    return this.repository.save(item)
  }

  findAll(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.repository.find({
      where: {
        opId,
      },
      relations: {
        operativo: true,
        categoriaTipo: true,
        tipoVinculo: true,
      },
      order: {
        itembiensecId: 'DESC',
      },
    })
  }

  async findAllPaginado(
    opId: number,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    const { limite, saltar, filtro } = pagination

    const query = this.repository
      .createQueryBuilder('bien')
      .leftJoinAndSelect('bien.operativo', 'operativo')
      .leftJoinAndSelect('bien.categoriaTipo', 'categoriaTipo')
      .leftJoinAndSelect('bien.tipoVinculo', 'tipoVinculo')
      .where('bien.opId = :opId', { opId })
      .andWhere('bien.estado = :estado', { estado: 'ACTIVO' })

    if (filtro?.trim()) {
      const valor = `%${filtro.trim()}%`

      query.andWhere(
        new Brackets((qb) => {
          qb.where('bien.lugarSecuestro ILIKE :filtro', { filtro: valor })
            .orWhere('bien.nombreCompletoVinculo ILIKE :filtro', {
              filtro: valor,
            })
            .orWhere('bien.cedulaIdentidadVinculo ILIKE :filtro', {
              filtro: valor,
            })
            .orWhere('bien.autoridadDisposicion ILIKE :filtro', {
              filtro: valor,
            })
            .orWhere('categoriaTipo.descripcion ILIKE :filtro', {
              filtro: valor,
            })
            .orWhere('tipoVinculo.descripcion ILIKE :filtro', { filtro: valor })
        })
      )
    }

    const [data, total] = await query
      .orderBy('bien.itembiensecId', 'DESC')
      .take(limite)
      .skip(saltar)
      .getManyAndCount()

    const resultado = data.map((item) => ({
      ...item,

      fecha: formatearFechaBolivia(item.fecha),

      fechaHoraIngreso: formatearFechaBolivia(item.fechaHoraIngreso),
    }))

    return [resultado, total]
  }

  async findOne(id: number): Promise<any> {
    const item = await this.repository.findOne({
      where: {
        itembiensecId: String(id),
        estado: 'ACTIVO',
      },
      relations: {
        operativo: true,
        categoriaTipo: true,
        tipoVinculo: true,
      },
    })

    if (!item) {
      throw new NotFoundException(`No existe el bien secuestrado con id ${id}`)
    }

    return {
      ...item,
      fecha: formatearFechaBolivia(item.fecha),
      fechaHoraIngreso: formatearFechaBolivia(item.fechaHoraIngreso),
    }
  }

  findAllByOperativo(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.repository.find({
      where: {
        opId,
      },
      order: {
        itembiensecId: 'DESC',
      },
    })
  }

  async update(
    id: number,
    dto: UpdateBieneSecuestradoLgiDto
  ): Promise<BieneSecuestradoLgi> {
    const item = await this.findOne(id)

    this.repository.merge(item, dto)

    return this.repository.save(item)
  }

  async inactivar(id: number): Promise<void> {
    const item = await this.findOne(id)

    item.estado = 'INACTIVO'

    await this.repository.save(item)
  }
}
