import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateEstadoCivilDto } from './dto/create-estado_civil.dto'
import { UpdateEstadoCivilDto } from './dto/update-estado_civil.dto'
import { EstadoCivil } from './entities/estado_civil.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DB_SII } from '@/core/config/database/database.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class EstadoCivilService {
  constructor(
    @InjectRepository(EstadoCivil, DB_SII)
    private readonly estadoCivilRepository: Repository<EstadoCivil>
  ) {}

  async create(dto: CreateEstadoCivilDto): Promise<EstadoCivil> {
    const exists = await this.estadoCivilRepository.findOne({
      where: { descripcion: dto.descripcion },
    })

    if (exists) {
      throw new BadRequestException(
        'Ya existe un estado civil con esa descripcion'
      )
    }

    const data = this.estadoCivilRepository.create(dto)
    return await this.estadoCivilRepository.save(data)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.estadoCivilRepository
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

  async findAll(): Promise<EstadoCivil[]> {
    return this.estadoCivilRepository.find()
  }

  async findOne(id: number): Promise<EstadoCivil> {
    const data = await this.estadoCivilRepository.findOne({
      where: { idEstadoCivil: id },
    })

    if (!data) {
      throw new NotFoundException('Color de ojos no encontrada')
    }
    return data
  }

  async update(id: number, dto: UpdateEstadoCivilDto) {
    const data = await this.estadoCivilRepository.findOne({
      where: { idEstadoCivil: id },
    })

    if (!data) {
      throw new NotFoundException('estado civil no encontrada')
    }

    if (dto.descripcion !== data.descripcion) {
      const exists = await this.estadoCivilRepository.findOne({
        where: { descripcion: dto.descripcion },
      })

      if (exists) {
        throw new BadRequestException(
          'Ya existe un estado civil con esa descripcion'
        )
      }
    }
    Object.assign(data, dto)
    return await this.estadoCivilRepository.save(data)
  }
}
