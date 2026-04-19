import { Module } from '@nestjs/common';
import { ProvinciaService } from './provincia.service';
import { ProvinciaController } from './provincia.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { Provincia } from './entities/provincia.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature(
    [Provincia, Departamento], 
    DB_SOSPECHOSO
  ),
],
  controllers: [ProvinciaController],
  providers: [ProvinciaService],
})
export class ProvinciaModule {}
