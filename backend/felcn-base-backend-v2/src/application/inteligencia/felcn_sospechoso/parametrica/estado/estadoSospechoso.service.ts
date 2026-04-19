import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoSospechoso } from './entities/estadoSospechoso.entity';

@Injectable()
export class EstadoSospechosoService {
 constructor(
    @InjectRepository(EstadoSospechoso, DB_SOSPECHOSO)
    private readonly estadoSospechosoRepository: Repository<EstadoSospechoso>
  ) {}

   findAll() {
    return this.estadoSospechosoRepository.find({
      order: {
        idEstado: 'ASC',
      },
    })
  }

  
}
