import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Letra } from './entities/letra.entity';
import { CreateLetraDto } from './dto/create-letra.dto';
import { UpdateLetraDto } from './dto/update-letra.dto';

import { Estado } from 'src/common/enums/estado.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';

@Injectable()
export class LetrasService {
  constructor(
    @InjectRepository(Letra)
    private readonly repo: Repository<Letra>,
  ) {}

  async create(dto: CreateLetraDto): Promise<Letra> {
    const exists = await this.repo.findOne({
      where: { descripcion: dto.descripcion },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe una letra con esa descripción',
      );
    }

    const letra = this.repo.create(dto);
    return await this.repo.save(letra);
  }

  async findAllPaginado(pagination: PaginationQueryDto) {
    const qb = this.repo
      .createQueryBuilder('letra')
      .where('letra.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['letra.descripcion'],
      sortableColumns: ['letra.id', 'letra.descripcion'],
    });
  }

  async findAllGeneral(): Promise<Letra[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      order: { descripcion: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Letra> {
    const letra = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!letra) {
      throw new NotFoundException('Letra no encontrada');
    }

    return letra;
  }

  async update(id: number, dto: UpdateLetraDto): Promise<Letra> {
    const letra = await this.findOne(id);

    if (
      dto.descripcion &&
      dto.descripcion !== letra.descripcion
    ) {
      const exists = await this.repo.findOne({
        where: { descripcion: dto.descripcion },
      });

      if (exists) {
        throw new BadRequestException(
          'Ya existe una letra con esa descripción',
        );
      }
    }

    Object.assign(letra, dto);
    return await this.repo.save(letra);
  }

  async remove(id: number): Promise<void> {
    const letra = await this.findOne(id);
    letra.estado = Estado.INACTIVO;
    await this.repo.save(letra);
  }
}