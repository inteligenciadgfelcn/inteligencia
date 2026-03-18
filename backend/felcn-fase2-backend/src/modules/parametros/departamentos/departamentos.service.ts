import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { Repository } from 'typeorm';
import { Pais } from '../paises/entities/paise.entity';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly repo: Repository<Departamento>,

    @InjectRepository(Pais)
    private readonly paisRepo: Repository<Pais>,
  ) {}
  async create(dto: CreateDepartamentoDto): Promise<Departamento> {
    const pais = await this.paisRepo.findOne({
      where: { id: dto.idPais, estado: Estado.ACTIVO },
    });

    if (!pais) {
      throw new BadRequestException('País no válido o inactivo');
    }

    const exists = await this.repo.findOne({
      where: {
        codigo: dto.codigo,
        pais: { id: dto.idPais },
      },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un departamento con ese código en el país',
      );
    }

    const departamento = this.repo.create({
      ...dto,
      pais,
    });

    return await this.repo.save(departamento);
  }

  async findAllPaginado(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Departamento>> {
    const qb = this.repo
      .createQueryBuilder('departamento')
      .leftJoinAndSelect('departamento.pais', 'pais')
      .where('departamento.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: [
        'departamento.nombre',
        'departamento.codigo',
        'pais.nombre',
      ],
      sortableColumns: [
        'departamento.id',
        'departamento.nombre',
        'departamento.codigo',
      ],
    });
  }

  async findAllGeneral(): Promise<Departamento[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['pais'],
      order: { nombre: 'ASC' },
    });
  }

  async findAllPais(idPais?: number) {
    const qb = this.repo
      .createQueryBuilder('departamento')
      .select(['departamento.id', 'departamento.nombre'])
      .where('departamento.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    if (idPais) {
      qb.andWhere('departamento.id_pais = :idPais', { idPais });
    }

    qb.orderBy('departamento.nombre', 'ASC');

    return qb.getMany();
  }

  async findOne(id: number): Promise<Departamento> {
    const departamento = await this.repo
      .createQueryBuilder('departamento')
      .leftJoinAndSelect('departamento.pais', 'pais')
      .where('departamento.id = :id', { id })
      .andWhere('departamento.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .andWhere('pais.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .getOne();

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    return departamento;
  }

  async update(id: number, dto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
      relations: ['pais'],
    });

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    // Validar código único si cambia
    if (dto.codigo && dto.codigo !== departamento.codigo) {
      const exists = await this.repo.findOne({
        where: {
          codigo: dto.codigo,
          pais: { id: departamento.pais.id },
        },
      });

      if (exists) {
        throw new BadRequestException(
          'Ya existe un departamento con ese código en el país',
        );
      }
    }

    // Cambiar país si lo envían
    if (dto.idPais !== undefined) {
      const pais = await this.paisRepo.findOne({
        where: { id: dto.idPais, estado: Estado.ACTIVO },
      });

      if (!pais) {
        throw new BadRequestException('País no válido o inactivo');
      }

      departamento.pais = pais;
      delete dto.idPais;
    }

    Object.assign(departamento, dto);

    return await this.repo.save(departamento);
  }

  async remove(id: number): Promise<void> {
    const departamento = await this.repo.findOne({
      where: { id, estado: Estado.ACTIVO },
    });

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    departamento.estado = Estado.INACTIVO;

    await this.repo.save(departamento);
  }
}
