import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradoDto } from './dto/create-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DB_S2I } from '@/core/config/database/database.module';
import { DataSource } from 'typeorm';
import { Grado } from './entities/grado.entity';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { Estado } from '../../estado.enum';

@Injectable()
export class GradoService {
  constructor(
      @InjectDataSource(DB_S2I)
      private readonly datasource: DataSource
    ) {}

   async create(dto: CreateGradoDto) {
    const exists = await this.datasource.getRepository(Grado).findOne({
      where: { abreviatura: dto.abreviatura },
    });

    if (exists) {
      throw new BadRequestException('Ya existe un grado con esa abreviatura');
    }

    const grado = this.datasource.getRepository(Grado).create(dto);
    return await this.datasource.getRepository<Grado>(Grado).save(grado);
  }

  async findAll(pagination: PaginacionQueryDto){
    const { limite, saltar, filtro, sentido } = pagination
    const query = this.datasource.getRepository(Grado)
      .createQueryBuilder('grado')
      .where('grado.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    if (filtro) {
      query.andWhere(
        '(grado.descripcion ILIKE :filtro OR grado.abreviatura ILIKE :filtro)',
        { filtro: `%${filtro}%` }
      )
    }
     return await query.getManyAndCount()
  }

  async findAllGeneral(): Promise<Grado[]> {
    return this.datasource.getRepository<Grado>(Grado).find({
      where: { estado: Estado.ACTIVO },
      order: { abreviatura: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Grado> {
    const grado = await this.datasource.getRepository<Grado>(Grado).findOne({
      where: { idGrado:id },
    });

    if (!grado) {
      throw new NotFoundException('Grado no encontrado');
    }

    return grado;
  }

  async update(id: number, dto: UpdateGradoDto): Promise<Grado> {
    const grado = await this.datasource.getRepository(Grado).findOne({
      where: {
        idGrado:id,
        estado: Estado.ACTIVO,
      },
    });

    if (!grado) {
      throw new NotFoundException('Grado no encontrado');
    }

    // Validar duplicado si se cambia abreviatura
    if (dto.abreviatura) {
      const exists = await this.datasource.getRepository(Grado).findOne({
        where: { abreviatura: dto.abreviatura },
      });

      if (exists && exists.idGrado !== id) {
        throw new BadRequestException('Ya existe un grado con esa abreviatura');
      }
    }

    Object.assign(grado, dto);

    return await this.datasource.getRepository<Grado>(Grado).save(grado);
  }

  async remove(id: number): Promise<Grado> {
    const grado = await this.datasource.getRepository(Grado).findOne({
      where: {
        idGrado:id,
        estado: Estado.ACTIVO,
      },
    });

    if (!grado) {
      throw new NotFoundException('Grado no encontrado');
    }

    grado.estado = Estado.INACTIVO;

   return await this.datasource.getRepository<Grado>(Grado).save(grado);
  }
}

