import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidad } from '../unidades/entities/unidade.entity';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Distrital } from './entities/distritale.entity';
import { CreateDistritalDto } from './dto/create-distritale.dto';
import { UpdateDistritalDto } from './dto/update-distritale.dto';

@Injectable()
export class DistritalesService {
  constructor(
    @InjectRepository(Distrital)
    private readonly repo: Repository<Distrital>,

    @InjectRepository(Unidad)
    private readonly unidadRepo: Repository<Unidad>,
  ) {}

  async create(dto: CreateDistritalDto): Promise<Distrital> {
    const unidad = await this.unidadRepo.findOne({
      where: { id: dto.idUnidad, estado: Estado.ACTIVO },
    });

    if (!unidad) {
      throw new BadRequestException('Unidad no válida o inactiva');
    }

    const exists = await this.repo.findOne({
      where: {
        descripcion: dto.descripcion,
        unidad: { id: dto.idUnidad },
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un distrital con esa descripción en la unidad',
      );
    }

    const distrital = this.repo.create({
      descripcion: dto.descripcion,
      unidad,
    });

    return await this.repo.save(distrital);
  }

  async findAllPaginado(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Distrital>> {
    const qb = this.repo
      .createQueryBuilder('distrital')
      .leftJoinAndSelect('distrital.unidad', 'unidad')
      .where('distrital.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['distrital.descripcion', 'unidad.codigo'],
      sortableColumns: ['distrital.id', 'distrital.descripcion'],
    });
  }

  async findAllGeneral(): Promise<Distrital[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['unidad'],
      order: { descripcion: 'ASC' },
    });
  }

  async findAllUnidad(idUnidad?: number) {
    const qb = this.repo
      .createQueryBuilder('distrital')
      .select(['distrital.id', 'distrital.descripcion'])
      .where('distrital.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    if (idUnidad) {
      qb.andWhere('distrital.id_unidad = :idUnidad', { idUnidad });
    }

    qb.orderBy('distrital.descripcion', 'ASC');

    return qb.getMany();
  }

  async findOne(id: number): Promise<Distrital> {
    const distrital = await this.repo
      .createQueryBuilder('distrital')
      .leftJoinAndSelect('distrital.unidad', 'unidad')
      .where('distrital.id = :id', { id })
      .andWhere('distrital.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .andWhere('unidad.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .getOne();

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado');
    }

    return distrital;
  }

  async update(id: number, dto: UpdateDistritalDto): Promise<Distrital> {
    const distrital = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
      relations: ['unidad'],
    });

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado');
    }

    // Validar unique si cambia descripcion
    if (dto.descripcion && dto.descripcion !== distrital.descripcion) {
      const exists = await this.repo.findOne({
        where: {
          descripcion: dto.descripcion,
          unidad: { id: distrital.unidad.id },
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Ya existe un distrital con esa descripción en la unidad',
        );
      }
    }

    // Cambiar unidad si envían idUnidad
    if (dto.idUnidad !== undefined) {
      const unidad = await this.unidadRepo.findOne({
        where: { id: dto.idUnidad, estado: Estado.ACTIVO },
      });

      if (!unidad) {
        throw new BadRequestException('Unidad no válida o inactiva');
      }

      distrital.unidad = unidad;
      delete dto.idUnidad;
    }

    Object.assign(distrital, dto);

    return await this.repo.save(distrital);
  }

  async remove(id: number): Promise<void> {
    const distrital = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!distrital) {
      throw new NotFoundException('Distrital no encontrado');
    }

    distrital.estado = Estado.INACTIVO;

    await this.repo.save(distrital);
  }
}
