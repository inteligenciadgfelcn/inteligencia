import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateContinenteDto } from './dto/create-continente.dto'
import { UpdateContinenteDto } from './dto/update-continente.dto'
import { DB_SIII } from '@/core/config/database/database.module'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Continente } from './entities/continente.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Estado } from '@/application/felcn_siii/estado.enum'

@Injectable()
export class ContinenteService {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly datasource: DataSource
  ) {}

  private get repo() {
    return this.datasource.getRepository(Continente)
  }

  async create(dto: CreateContinenteDto): Promise<Continente> {
    const exists = await this.repo.findOne({
      where: { descripcion: dto.descripcion },
    })

    if (exists) {
      throw new BadRequestException('Ya existe un continente con ese código')
    }

    const continente = this.repo.create(dto)
    return await this.repo.save(continente)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.datasource
      .getRepository(Continente)
      .createQueryBuilder('continente')
      .where('continente.estado = :estado', { estado: Estado.ACTIVO })
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('continente.descripcion ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }

    query.orderBy('continente.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')
    return await query.getManyAndCount()
  }

  async findAll(): Promise<Continente[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
    })
  }

  async findOne(id: number): Promise<Continente> {
    const continente = await this.repo.findOne({
      where: { idContinente: Number(id) },
    })

    if (!continente) {
      throw new NotFoundException('Continente no encontrado')
    }

    return continente
  }

  async update(id: number, dto: UpdateContinenteDto): Promise<Continente> {
    const continente = await this.repo.findOne({
      where: {
        idContinente: id,
        estado: Estado.ACTIVO,
      },
    })

    if (!continente) {
      throw new NotFoundException('Continente no encontrado')
    }

    Object.assign(continente, dto)

    return await this.repo.save(continente)
  }

  async remove(id: number): Promise<Continente> {
    const continente = await this.repo.findOne({
      where: {
        idContinente: id,
        estado: Estado.ACTIVO,
      },
    })

    if (!continente) {
      throw new NotFoundException('Continente no encontrado')
    }

    continente.estado = Estado.INACTIVO

    return await this.repo.save(continente)
  }
}
