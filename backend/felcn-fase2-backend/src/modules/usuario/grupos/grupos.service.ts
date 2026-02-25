import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Distrital } from '../distritales/entities/distritale.entity';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly repo: Repository<Grupo>,

    @InjectRepository(Distrital)
    private readonly distritalRepo: Repository<Distrital>,
  ) {}

  async create(dto: CreateGrupoDto): Promise<Grupo> {
    const distrital = await this.distritalRepo.findOne({
      where: { id: dto.idDistrital, estado: Estado.ACTIVO },
    });

    if (!distrital) {
      throw new BadRequestException('Unidad no válida o inactiva');
    }

    const exists = await this.repo.findOne({
      where: {
        descripcion: dto.descripcion,
        distrital: { id: dto.idDistrital },
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un grupo con esa descripción en la unidad',
      );
    }

    const grupo = this.repo.create({
      descripcion: dto.descripcion,
      distrital: distrital,
    });

    return await this.repo.save(grupo);
  }

  async findAllPaginado(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Grupo>> {
    const qb = this.repo
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.distrital', 'distrital')
      .where('grupo.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['grupo.descripcion', 'distrital.codigo'],
      sortableColumns: ['grupo.id', 'grupo.descripcion'],
    });
  }

  async findAllDistrito(idDistrital?: number) {
    const qb = this.repo
      .createQueryBuilder('grupo')
      .select(['grupo.id', 'grupo.descripcion'])
      .where('grupo.estado = :estado', { estado: Estado.ACTIVO });

    if (idDistrital) {
      qb.andWhere('grupo.id_distrital = :idDistrital', { idDistrital });
    }

    qb.orderBy('grupo.descripcion', 'ASC');

    return qb.getMany();
  }

  async findAllGeneral(): Promise<Grupo[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['distrital'],
      order: { descripcion: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Grupo> {
    const grupo = await this.repo
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.distrital', 'distrito')
      .where('grupo.id = :id', { id })
      .andWhere('grupo.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .andWhere('distrito.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .getOne();

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return grupo;
  }

  async update(id: number, dto: UpdateGrupoDto): Promise<Grupo> {
    const grupo = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
      relations: ['distrital'],
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    // Validar cambio de descripción
    if (dto.descripcion && dto.descripcion !== grupo.descripcion) {
      const exists = await this.repo.findOne({
        where: {
          descripcion: dto.descripcion,
          distrital: { id: grupo.distrital.id },
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Ya existe un grupo con esa descripción en el distrito',
        );
      }
    }

    if (dto.idDistrital !== undefined) {
      const distrito = await this.distritalRepo.findOne({
        where: { id: dto.idDistrital, estado: Estado.ACTIVO },
      });

      if (!distrito) {
        throw new BadRequestException('Unidad no válida o inactiva');
      }

      grupo.distrital = distrito;
      delete dto.idDistrital;
    }

    Object.assign(grupo, dto);

    return await this.repo.save(grupo);
  }

  async remove(id: number): Promise<void> {
    const grupo = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    grupo.estado = Estado.INACTIVO;

    await this.repo.save(grupo);
  }
}
