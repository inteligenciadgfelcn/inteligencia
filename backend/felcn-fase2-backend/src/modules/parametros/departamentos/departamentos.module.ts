import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { Departamento } from './entities/departamento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pais } from '../paises/entities/paise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departamento, Pais])],
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
  exports: [TypeOrmModule],
})
export class DepartamentosModule {}
