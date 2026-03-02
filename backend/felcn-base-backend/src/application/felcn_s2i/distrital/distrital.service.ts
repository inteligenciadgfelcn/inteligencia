import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateDistritalDto } from './dto/create-distrital.dto'
import { UpdateDistritalDto } from './dto/update-distrital.dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { Distrital } from './entities/distrital.entity'
import { Unidad } from '../unidad/entities/unidad.entity'
import { DataSource, Repository } from 'typeorm'
import { Estado } from '../estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_S2I } from '@/core/config/database/database.module'

@Injectable()
export class DistritalService {
  constructor(
    @InjectDataSource(DB_S2I)
    private readonly datasource: DataSource
  ) {}

  async create(dto: CreateDistritalDto): Promise<Distrital> {
    const unidad = await this.datasource.getRepository('unidad').findOne({
      where: { idUnidad: dto.idUnidad, estado: Estado.ACTIVO },
    })

    if (!unidad) {
      throw new BadRequestException('Unidad no válida o inactiva')
    }

    const exists = await this.datasource.getRepository('distrital').exist({
      where: {
        descripcion: dto.descripcion,
        unidad: { idUnidad: dto.idUnidad },
      },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un distrital con esa descripción en la unidad'
      )
    }

    return this.datasource.getRepository<Distrital>('distrital').save(
      this.datasource.getRepository('distrital').create({
        descripcion: dto.descripcion,
        unidad,
      })
    )
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.datasource
      .getRepository(Distrital)
      .createQueryBuilder('distrital')
      .innerJoinAndSelect('distrital.unidad', 'unidad')
      .where('distrital.estado = :estado', { estado: Estado.ACTIVO })
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere(
        '(distrital.descripcion ILIKE :filtro OR unidad.descripcion ILIKE :filtro)',
        { filtro: `%${filtro}%` }
      )
    }

    query.orderBy('distrital.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')

    return await query.getManyAndCount()
  }

  async findAllGeneral(): Promise<Distrital[]> {
    return this.datasource.getRepository<Distrital>('distrital').find({
      where: { estado: Estado.ACTIVO },
      relations: ['unidad'],
      order: { descripcion: 'ASC' },
    })
  }

  async findAllUnidad(idUnidad?: number) {
    return this.datasource.getRepository<Distrital>('distrital').find({
      where: {
        estado: Estado.ACTIVO,
        ...(idUnidad && { unidad: { idUnidad } }),
      },
      relations: ['unidad'],
      order: { descripcion: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Distrital> {
    const distrital = await this.datasource
      .getRepository<Distrital>('distrital')
      .findOne({
        where: {
          idDistrital: id,
          estado: Estado.ACTIVO,
          unidad: {
            estado: Estado.ACTIVO,
          },
        },
        relations: ['unidad'],
      })

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado')
    }
    return distrital
  }

  async update(id: number, dto: UpdateDistritalDto): Promise<Distrital> {
    const distrital = await this.datasource.getRepository('distrital').findOne({
      where: { idDistrital:id, estado: Estado.ACTIVO },
      relations: ['unidad'],
    })

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado')
    }

    // Validar unique si cambia descripcion
    if (dto.descripcion && dto.descripcion !== distrital.descripcion) {
      const exists = await this.datasource.getRepository('distrital').findOne({
        where: {
          descripcion: dto.descripcion,
          unidad: { id: distrital.unidad.id },
        },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un distrital con esa descripción en la unidad'
        )
      }
    }

    // Cambiar unidad si envían idUnidad
    if (dto.idUnidad !== undefined) {
      const unidad = await this.datasource.getRepository('unidad').findOne({
        where: { idUnidad: dto.idUnidad, estado: Estado.ACTIVO },
      })
      if (!unidad) {
        throw new BadRequestException('Unidad no válida o inactiva')
      }
      distrital.unidad = unidad
      delete dto.idUnidad
    }
    Object.assign(distrital, dto)
    return await this.datasource
      .getRepository<Distrital>('distrital')
      .save(distrital)
  }

  async remove(id: number): Promise<Distrital> {
    const distrital = await this.datasource.getRepository('distrital').findOne({
      where: { idDistrital: id, estado: Estado.ACTIVO },
    })

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado')
    }

    distrital.estado = Estado.INACTIVO

    return await this.datasource
      .getRepository<Distrital>('distrital')
      .save(distrital)
  }
}
