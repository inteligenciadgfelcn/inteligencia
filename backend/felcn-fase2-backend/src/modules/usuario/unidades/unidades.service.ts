import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { Unidad } from './entities/unidade.entity';
import { CreateUnidadDto } from './dto/create-unidade.dto';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidad)
    private readonly repo: Repository<Unidad>,
  ) {}

  async create(dto: CreateUnidadDto): Promise<Unidad> {
    const exists = await this.repo.findOne({
      where: { codigo: dto.codigo },
    });

    if (exists) {
      throw new BadRequestException('Ya existe una unidad con ese código');
    }

    const unidad = this.repo.create(dto);
    return await this.repo.save(unidad);
  }

  async findAllPaginado(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Unidad>> {
    const qb = this.repo
      .createQueryBuilder('unidad')
      .where('unidad.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['unidad.codigo', 'unidad.descripcion'],
      sortableColumns: ['unidad.id', 'unidad.codigo'],
    });
  }

  async findAllGeneral(): Promise<Unidad[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Unidad> {
    const unidad = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada');
    }

    return unidad;
  }

  async update(id: number, dto: CreateUnidadDto): Promise<Unidad> {
    const unidad = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada');
    }

    if (dto.codigo && dto.codigo !== unidad.codigo) {
      const exists = await this.repo.findOne({
        where: { codigo: dto.codigo },
      });

      if (exists) {
        throw new BadRequestException('Ya existe una unidad con ese código');
      }
    }

    Object.assign(unidad, dto);

    return await this.repo.save(unidad);
  }

  async remove(id: number): Promise<void> {
    const unidad = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!unidad) {
      throw new NotFoundException('Unidad no encontrada');
    }

    unidad.estado = Estado.INACTIVO;

    await this.repo.save(unidad);
  }
}
