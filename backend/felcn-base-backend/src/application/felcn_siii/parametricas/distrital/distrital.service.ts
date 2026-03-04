import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateDistritalDto } from './dto/create-distrital.dto'
import { UpdateDistritalDto } from './dto/update-distrital.dto'
import { InjectRepository} from '@nestjs/typeorm'
import { Distrital } from './entities/distrital.entity'
import { Repository} from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_SIII } from '@/core/config/database/database.module'
import { Estado } from '../../estado.enum'
import { Unidad } from '../unidad/entities/unidad.entity'

@Injectable()
export class DistritalService {
  constructor(
      @InjectRepository(Unidad, DB_SIII)
      private readonly unidadRepository: Repository<Unidad>,

      @InjectRepository(Distrital, DB_SIII)
      private readonly distritalRepository: Repository<Distrital>,
    ) {}

  async create(dto: CreateDistritalDto): Promise<Distrital> {
    const unidad = await this.unidadRepository.findOne({
      where: { idUnidad: dto.idUnidad, estado: Estado.ACTIVO },
    })

    if (!unidad) {
      throw new BadRequestException('Unidad no válida o inactiva')
    }

    const exists = await this.distritalRepository.exists({
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

    return this.distritalRepository.save(
      this.distritalRepository.create({
        descripcion: dto.descripcion,
        unidad,
      })
    )
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.distritalRepository
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
    return this.distritalRepository.find({
      where: { estado: Estado.ACTIVO },
      relations: ['unidad'],
      order: { descripcion: 'ASC' },
    })
  }

  async findAllUnidad(idUnidad?: number) {
    return this.distritalRepository.find({
      where: {
        estado: Estado.ACTIVO,
        ...(idUnidad && { unidad: { idUnidad } }),
      },
      relations: ['unidad'],
      order: { descripcion: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Distrital> {
    const distrital = await this.distritalRepository
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
    const distrital = await this.distritalRepository.findOne({
      where: { idDistrital:id, estado: Estado.ACTIVO },
      relations: ['unidad'],
    })

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado')
    }

    // Validar unique si cambia descripcion
    if (dto.descripcion && dto.descripcion !== distrital.descripcion) {
      const exists = await this.distritalRepository.findOne({
        where: {
          descripcion: dto.descripcion,
          unidad: { idUnidad: distrital.unidad.idUnidad },
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
      const unidad = await this.unidadRepository.findOne({
        where: { idUnidad: dto.idUnidad, estado: Estado.ACTIVO },
      })
      if (!unidad) {
        throw new BadRequestException('Unidad no válida o inactiva')
      }
      distrital.unidad = unidad
      delete dto.idUnidad
    }
    Object.assign(distrital, dto)
    return await this.distritalRepository.save(distrital)
  }

  async remove(id: number): Promise<Distrital> {
    const distrital = await this.distritalRepository.findOne({
      where: { idDistrital: id, estado: Estado.ACTIVO },
    })

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado')
    }

    distrital.estado = Estado.INACTIVO

    return await this.distritalRepository.save(distrital)
  }
}
