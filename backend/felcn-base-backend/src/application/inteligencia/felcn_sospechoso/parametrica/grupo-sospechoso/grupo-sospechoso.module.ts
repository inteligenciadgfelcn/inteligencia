import { Module } from '@nestjs/common'
import { GrupoSospechosoService } from './grupo-sospechoso.service'
import { GrupoSospechosoController } from './grupo-sospechoso.controller'
import { DistritoSospechoso } from '../distrito-sospechoso/entities/distrito-sospechoso.entity'
import { GrupoSospechoso } from './entities/grupo-sospechoso.entity'
import { DB_SOSPECHOSO } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [GrupoSospechoso, DistritoSospechoso],
      DB_SOSPECHOSO
    ),
  ],
  controllers: [GrupoSospechosoController],
  providers: [GrupoSospechosoService],
})
export class GrupoSospechosoModule {}
