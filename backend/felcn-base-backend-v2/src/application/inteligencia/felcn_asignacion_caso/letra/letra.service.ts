import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLetraDto } from './dto/create-letra.dto';
import { UpdateLetraDto } from './dto/update-letra.dto';
import { DB_ASIG_CASOS } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letra } from './entities/letra.entity';

@Injectable()
export class LetraService {
 constructor(
    @InjectRepository(Letra, DB_ASIG_CASOS)
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

  async findAllGeneral(): Promise<Letra[]> {
    return this.repo.find();
  }

  async findOne(descripcion: string): Promise<Letra> {
    const letra = await this.repo.findOne({
      where: { descripcion},
    });

    if (!letra) {
      throw new NotFoundException('Letra no encontrada');
    }

    return letra;
  }

  async update(descripcion: string, dto: UpdateLetraDto): Promise<Letra> {
    const letra = await this.findOne(descripcion);

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

 
}
