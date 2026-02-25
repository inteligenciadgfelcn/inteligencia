import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Continente } from '../continentes/entities/continente.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { Pais } from './entities/paise.entity';
import { CreatePaisDto } from './dto/create-paise.dto';
import { UpdatePaisDto } from './dto/update-paise.dto';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Pais)
    private readonly repo: Repository<Pais>,

    @InjectRepository(Continente)
    private readonly continenteRepo: Repository<Continente>,
  ) {}

  async create(dto: CreatePaisDto): Promise<Pais> {
    const exists = await this.repo.findOne({
      where: { codigo: dto.codigo },
    });

    if (exists) {
      throw new BadRequestException('Ya existe un país con ese código');
    }

    // Validar continente
    const continente = await this.continenteRepo.findOne({
      where: {
        id: dto.idContinente,
        estado: Estado.ACTIVO,
      },
    });

    if (!continente) {
      throw new BadRequestException('Continente no válido o inactivo');
    }

    const pais = this.repo.create({
      ...dto,
      continente,
    });

    return await this.repo.save(pais);
  }

  async findAllContinente(idContinente?: number) {
    const qb = this.repo
      .createQueryBuilder('pais')
      .select(['pais.id', 'pais.nombre'])
      .where('pais.estado = :estado', { estado: Estado.ACTIVO });

    if (idContinente) {
      qb.andWhere('pais.id_continente = :idContinente', {
        idContinente,
      });
    }

    qb.orderBy('pais.nombre', 'ASC');

    return await qb.getMany();
  }

  async findAllGeneral(): Promise<Pais[]> {
    return await this.repo.find({
      where: {
        estado: Estado.ACTIVO,
      },
      relations: ['continente'],
      order: {
        nombre: 'ASC',
      },
    });
  }

  async findAllPaginado(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Pais>> {
    const qb = this.repo
      .createQueryBuilder('pais')
      .leftJoinAndSelect('pais.continente', 'continente')
      .where('pais.estado = :estado', { estado: Estado.ACTIVO });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['pais.nombre', 'pais.codigo', 'continente.nombre'],
      sortableColumns: ['pais.id', 'pais.nombre', 'pais.codigo'],
    });
  }

  async findOne(id: number): Promise<Pais> {
    const pais = await this.repo.findOne({
      where: { id },
      relations: ['continente'],
    });

    if (!pais) {
      throw new NotFoundException('País no encontrado');
    }

    return pais;
  }

  async update(id: number, dto: UpdatePaisDto): Promise<Pais> {
    const pais = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
      relations: ['continente'],
    });

    if (!pais) {
      throw new NotFoundException('País no encontrado');
    }

    // Validar código único si lo están actualizando
    if (dto.codigo && dto.codigo !== pais.codigo) {
      const exists = await this.repo.findOne({
        where: { codigo: dto.codigo },
      });

      if (exists) {
        throw new BadRequestException('Ya existe un país con ese código');
      }
    }

    // Validar continente si lo envían
    if (dto.idContinente !== undefined) {
      const continente = await this.continenteRepo.findOne({
        where: { id: dto.idContinente, estado: Estado.ACTIVO },
      });

      if (!continente) {
        throw new BadRequestException('Continente no válido o inactivo');
      }

      pais.continente = continente;
      delete dto.idContinente;
    }

    Object.assign(pais, dto);

    return await this.repo.save(pais);
  }

  async remove(id: number): Promise<void> {
    const pais = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!pais) {
      throw new NotFoundException('País no encontrado');
    }

    pais.estado = Estado.INACTIVO;

    await this.repo.save(pais);
  }
}
