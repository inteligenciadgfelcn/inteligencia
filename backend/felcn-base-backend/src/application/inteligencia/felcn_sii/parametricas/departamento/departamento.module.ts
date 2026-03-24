import { Module } from '@nestjs/common'
import { DepartamentoService } from './departamento.service'
import { DepartamentoController } from './departamento.controller'
import { Pais } from '../pais/entities/pais.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Departamento } from './entities/departamento.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Departamento, Pais], DB_SII)],
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
})
export class DepartamentoModule {}
