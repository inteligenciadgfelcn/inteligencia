import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaOperativo } from './entities/categoria_operativo.entity';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';

@Injectable()
export class CategoriaOperativoService {
   constructor(
    @InjectRepository(CategoriaOperativo, DB_SOSPECHOSO)
    private readonly categoriaRepository: Repository<CategoriaOperativo>
  ) {}
  
   async findAll(): Promise<CategoriaOperativo[]> {
    return await this.categoriaRepository.find({
      order: {
        idCategoriaOperativo: 'ASC',
      },
    })
  }

}
