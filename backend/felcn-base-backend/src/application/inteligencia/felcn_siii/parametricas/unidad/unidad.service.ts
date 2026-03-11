import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUnidadDto } from './dto/create-unidad.dto'
import { UpdateUnidadDto } from './dto/update-unidad.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { Repository } from 'typeorm'
import { Unidad } from './entities/unidad.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Estado } from '../../estado.enum'

@Injectable()
export class UnidadService {
 constructor(
    @InjectRepository(Unidad, DB_SIII)
    private readonly unidadRepository: Repository<Unidad>,
  ) {}


  async create(dto: CreateUnidadDto): Promise<Unidad> {
    const exists = await this.unidadRepository.findOne({
      where: { abreviatura: dto.abreviatura },
    })

    if (exists) {
      throw new BadRequestException('Ya existe una unidad con ese código')
    }

    const unidad = this.unidadRepository.create(dto)
    return await this.unidadRepository.save(unidad)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.unidadRepository
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
    return this.unidadRepository.find({
      where: { estado: Estado.ACTIVO },
      order: { abreviatura: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Unidad> {
    const unidad = await this.unidadRepository
      .findOne({
        where: { idUnidad: id, estado: Estado.ACTIVO },
      })

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada')
    }
    return unidad
  }

  async update(id: number, dto: UpdateUnidadDto) {
    const unidad = await this.unidadRepository.findOne({
      where: { idUnidad: id, estado: Estado.ACTIVO },
    })

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada')
    }

    if (dto.abreviatura && dto.abreviatura !== unidad.abreviatura) {
      const exists = await this.unidadRepository.findOne({
        where: { abreviatura: dto.abreviatura },
      })

      if (exists) {
        throw new BadRequestException('Ya existe una unidad con ese código')
      }
    }

    Object.assign(unidad, dto)

    return await this.unidadRepository.save(unidad)
  }

  async remove(id: number): Promise<Unidad> {
    const unidad = await this.unidadRepository.findOne({
      where: { idUnidad: id, estado: Estado.ACTIVO },
    })

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada')
    }

    unidad.estado = Estado.INACTIVO

    return await this.unidadRepository.save(unidad)
  }
}
