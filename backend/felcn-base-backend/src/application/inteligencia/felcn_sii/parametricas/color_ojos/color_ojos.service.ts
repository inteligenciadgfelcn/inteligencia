import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateColorOjoDto } from './dto/create-color_ojo.dto'
import { UpdateColorOjoDto } from './dto/update-color_ojo.dto'
import { ColorOjo } from './entities/color_ojo.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class ColorOjosService {
  constructor(
    @InjectRepository(ColorOjo, DB_SII)
    private readonly colorOjoRepository: Repository<ColorOjo>
  ) {}

  async create(dto: CreateColorOjoDto): Promise<ColorOjo> {
    const exists = await this.colorOjoRepository.findOne({
      where: { descripcion: dto.descripcion },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un color de ojos con esa descripcion'
      )
    }

    const data = this.colorOjoRepository.create(dto)
    return await this.colorOjoRepository.save(data)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.colorOjoRepository
      .createQueryBuilder('c')
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('c.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    query.orderBy('c.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')
    return await query.getManyAndCount()
  }

  async findAll(): Promise<ColorOjo[]> {
    return this.colorOjoRepository.find()
  }

  async findOne(id: number): Promise<ColorOjo> {
    const data = await this.colorOjoRepository.findOne({
      where: { idColorOjo: id },
    })

    if (!data) {
      throw new NotFoundException('Color de ojos no encontrada')
    }
    return data
  }

  async update(id: number, dto: UpdateColorOjoDto) {
    const data = await this.colorOjoRepository.findOne({
      where: { idColorOjo: id },
    })

    if (!data) {
      throw new NotFoundException('color de ojos no encontrada')
    }

    if (dto.descripcion !== data.descripcion) {
      const exists = await this.colorOjoRepository.findOne({
        where: { descripcion: dto.descripcion },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un color de ojos con esa descripcion'
        )
      }
    }
    Object.assign(data, dto)
    return await this.colorOjoRepository.save(data)
  }
}
