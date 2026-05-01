import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadSospechoso } from './entities/unidad.entity';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';

@Injectable()
export class UnidadSospechosoService {
  constructor(
    @InjectRepository(UnidadSospechoso, DB_SOSPECHOSO)
    private readonly unidadRepository: Repository<UnidadSospechoso>,
  ) {}

  async findAll(): Promise<UnidadSospechoso[]> {
    try {
      return await this.unidadRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener las unidades',
      );
    }
  }
}