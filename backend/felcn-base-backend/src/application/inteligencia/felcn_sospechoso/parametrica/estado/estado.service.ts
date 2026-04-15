import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';

@Injectable()
export class EstadoService {
 constructor(
    @InjectRepository(Estado, DB_SOSPECHOSO)
    private readonly estadoRepository: Repository<Estado>
  ) {}

   findAll() {
    return this.estadoRepository.find({
      order: {
        idEstado: 'ASC',
      },
    })
  }

  
}
