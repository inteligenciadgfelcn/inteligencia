import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistritoSospechoso } from './entities/distrito-sospechoso.entity';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { Repository } from 'typeorm';

@Injectable()
export class DistritoSospechosoService {
  constructor(
     @InjectRepository(DistritoSospechoso, DB_SOSPECHOSO)
     private readonly distritoRepository: Repository<DistritoSospechoso>,
   ) {}
 
   async findAll(): Promise<DistritoSospechoso[]> {
  return await this.distritoRepository.find();
}

   async findByUnidad(idUnidad: number): Promise<DistritoSospechoso[]> {
  try {
    return await this.distritoRepository.find({
      where: {
        unidad: {
          idUnidad: idUnidad, 
        },
      },
    });
  } catch (error) {
    throw new InternalServerErrorException(
      'Error al obtener los distritos por unidad',
    );
  }
}
}
