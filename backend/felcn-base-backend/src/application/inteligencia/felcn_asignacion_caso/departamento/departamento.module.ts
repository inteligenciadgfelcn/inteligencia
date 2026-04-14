import { Module } from '@nestjs/common'
import { DepartamentoService } from './departamento.service'
import { DepartamentoController } from './departamento.controller'
import { DB_ASIG_CASOS } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Departamento } from './entities/departamento.entity'
import { Pais } from '../../felcn_sii/parametricas/pais/entities/pais.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Departamento, Pais], DB_ASIG_CASOS)],
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
})
export class DepartamentoModule {}
