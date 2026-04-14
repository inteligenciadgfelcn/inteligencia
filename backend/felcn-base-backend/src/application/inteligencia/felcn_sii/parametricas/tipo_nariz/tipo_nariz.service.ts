import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTipoNarizDto } from './dto/create-tipo_nariz.dto'
import { UpdateTipoNarizDto } from './dto/update-tipo_nariz.dto'
import { TipoNariz } from './entities/tipo_nariz.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TipoNarizService {
  constructor(
    @InjectRepository(TipoNariz, DB_SII)
    private readonly tipoNarizRepository: Repository<TipoNariz>
  ) {}

  async create(dto: CreateTipoNarizDto): Promise<TipoNariz> {
    const exists = await this.tipoNarizRepository.findOne({
      where: { descripcion: dto.descripcion },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un tipo de nariz con esa descripcion'
      )
    }

    const data = this.tipoNarizRepository.create(dto)
    return await this.tipoNarizRepository.save(data)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.tipoNarizRepository
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

  async findAll(): Promise<TipoNariz[]> {
    return this.tipoNarizRepository.find()
  }

  async findOne(id: number): Promise<TipoNariz> {
    const data = await this.tipoNarizRepository.findOne({
      where: { idTipoNariz: id },
    })

    if (!data) {
      throw new NotFoundException('Color de ojos no encontrada')
    }
    return data
  }

  async update(id: number, dto: UpdateTipoNarizDto) {
    const data = await this.tipoNarizRepository.findOne({
      where: { idTipoNariz: id },
    })

    if (!data) {
      throw new NotFoundException('tipo de nariz no encontrada')
    }

    if (dto.descripcion !== data.descripcion) {
      const exists = await this.tipoNarizRepository.findOne({
        where: { descripcion: dto.descripcion },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un tipo de nariz con esa descripcion'
        )
      }
    }
    Object.assign(data, dto)
    return await this.tipoNarizRepository.save(data)
  }
}
