import { Module } from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { LocalidadController } from './localidad.controller';
import { DB_SOSPECHOSO } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from '../provincia/entities/departamento.entity';
import { Provincia } from '../provincia/entities/provincia.entity';
import { Localidad } from './entities/localidad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Localidad, Provincia, Departamento],
      DB_SOSPECHOSO
    ),
  ],
  controllers: [LocalidadController],
  providers: [LocalidadService],
  exports: [LocalidadService],
})
export class LocalidadModule {}
