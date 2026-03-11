import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Grado } from './entities/grado.entity';
import { CreateGradoDto } from './dto/create-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';

@Injectable()
export class GradosService {
  constructor(
    @InjectRepository(Grado)
    private readonly repo: Repository<Grado>,
  ) {}

  async create(dto: CreateGradoDto): Promise<Grado> {
    const exists = await this.repo.findOne({
      where: { abreviatura: dto.abreviatura },
    });

    if (exists) {
      throw new BadRequestException('Ya existe un grado con esa abreviatura');
    }

    const grado = this.repo.create(dto);
    return await this.repo.save(grado);
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Grado>> {
    const qb = this.repo
      .createQueryBuilder('grado')
      .where('grado.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['grado.abreviatura', 'grado.descripcion'],
      sortableColumns: ['grado.id', 'grado.abreviatura', 'grado.descripcion'],
    });
  }

  async findAllGeneral(): Promise<Grado[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      order: { abreviatura: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Grado> {
    const grado = await this.repo.findOne({
      where: { id },
    });

    if (!grado) {
      throw new NotFoundException('Grado no encontrado');
    }

    return grado;
  }

  async update(id: number, dto: UpdateGradoDto): Promise<Grado> {
    const grado = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!grado) {
      throw new NotFoundException('Grado no encontrado');
    }

    // Validar duplicado si se cambia abreviatura
    if (dto.abreviatura) {
      const exists = await this.repo.findOne({
        where: { abreviatura: dto.abreviatura },
      });

      if (exists && exists.id !== id) {
        throw new BadRequestException('Ya existe un grado con esa abreviatura');
      }
    }

    Object.assign(grado, dto);

    return await this.repo.save(grado);
  }

  async remove(id: number): Promise<void> {
    const grado = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!grado) {
      throw new NotFoundException('Grado no encontrado');
    }

    grado.estado = Estado.INACTIVO;

    await this.repo.save(grado);
  }
}
