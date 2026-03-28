import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Continente } from './entities/continente.entity';
import { Repository } from 'typeorm';
import { CreateContinenteDto } from './dto/create-continente.dto';
import { UpdateContinenteDto } from './dto/update-continente.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';

@Injectable()
export class ContinentesService {
  constructor(
    @InjectRepository(Continente)
    private readonly repo: Repository<Continente>,
  ) {}

  async create(dto: CreateContinenteDto): Promise<Continente> {
    const exists = await this.repo.findOne({
      where: { codigo: dto.codigo },
    });

    if (exists) {
      throw new BadRequestException('Ya existe un continente con ese código');
    }

    const continente = this.repo.create(dto);
    return await this.repo.save(continente);
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Continente>> {
    const qb = this.repo
      .createQueryBuilder('continente')
      .where('continente.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['continente.nombre', 'continente.codigo'],
      sortableColumns: [
        'continente.id',
        'continente.nombre',
        'continente.codigo',
      ],
    });
  }

  async findOne(id: number): Promise<Continente> {
    const continente = await this.repo.findOne({ where: { id: Number(id) } });

    if (!continente) {
      throw new NotFoundException('Continente no encontrado');
    }

    return continente;
  }

  async update(id: number, dto: UpdateContinenteDto): Promise<Continente> {
    const continente = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!continente) {
      throw new NotFoundException('Continente no encontrado');
    }

    Object.assign(continente, dto);

    return await this.repo.save(continente);
  }

  async remove(id: number): Promise<void> {
    const continente = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!continente) {
      throw new NotFoundException('Continente no encontrado');
    }

    continente.estado = Estado.INACTIVO;

    await this.repo.save(continente);
  }
}
