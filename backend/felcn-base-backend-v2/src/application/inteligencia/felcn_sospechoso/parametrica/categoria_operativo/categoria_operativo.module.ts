import { Module } from '@nestjs/common';
import { CategoriaOperativoService } from './categoria_operativo.service';
import { CategoriaOperativoController } from './categoria_operativo.controller';
import { CategoriaOperativo } from './entities/categoria_operativo.entity';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaOperativo], DB_SOSPECHOSO), 
  ],
  controllers: [CategoriaOperativoController],
  providers: [CategoriaOperativoService],
})
export class CategoriaOperativoModule {}
