import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUnidadDto } from './dto/create-unidad.dto'
import { UpdateUnidadDto } from './dto/update-unidad.dto'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_S2I } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'
import { Unidad } from './entities/unidad.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Estado } from '../estado.enum'

@Injectable()
export class UnidadService {
  constructor(
    @InjectDataSource(DB_S2I)
    private readonly datasource: DataSource
  ) {}

  async create(dto: CreateUnidadDto): Promise<Unidad> {
    const exists = await this.datasource.getRepository('unidad').findOne({
      where: { abreviatura: dto.abreviatura },
    })

    if (exists) {
      throw new BadRequestException('Ya existe una unidad con ese código')
    }

    const unidad = this.datasource.getRepository('unidad').create(dto)
    return await this.datasource.getRepository<Unidad>('unidad').save(unidad)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.datasource
      .getRepository(Unidad)
      .createQueryBuilder('unidad')
      .where('unidad.estado = :estado', { estado: Estado.ACTIVO })
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('unidad.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    query.orderBy('unidad.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')
    return await query.getManyAndCount()
  }

  async findAllGeneral(): Promise<Unidad[]> {
    return this.datasource.getRepository<Unidad>('unidad').find({
      where: { estado: Estado.ACTIVO },
      order: { abreviatura: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Unidad> {
    const unidad = await this.datasource
      .getRepository<Unidad>('unidad')
      .findOne({
        where: { idUnidad: id, estado: Estado.ACTIVO },
      })

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada')
    }
    return unidad
  }

  async update(id: number, dto: UpdateUnidadDto) {
    const unidad = await this.datasource.getRepository('unidad').findOne({
      where: { idUnidad: id, estado: Estado.ACTIVO },
    })

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada')
    }

    if (dto.abreviatura && dto.abreviatura !== unidad.codigo) {
      const exists = await this.datasource.getRepository('unidad').findOne({
        where: { abreviatura: dto.abreviatura },
      })

      if (exists) {
        throw new BadRequestException('Ya existe una unidad con ese código')
      }
    }

    Object.assign(unidad, dto)

    return await this.datasource.getRepository<Unidad>('unidad').save(unidad)
  }

  async remove(id: number): Promise<Unidad> {
    const unidad = await this.datasource.getRepository('unidad').findOne({
      where: { idUnidad: id, estado: Estado.ACTIVO },
    })

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada')
    }

    unidad.estado = Estado.INACTIVO

    return await this.datasource.getRepository<Unidad>('unidad').save(unidad)
  }
}
