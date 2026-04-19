import { Module } from '@nestjs/common'
import { DatosFamiliaresService } from './datos_familiares.service'
import { DatosFamiliaresController } from './datos_familiares.controller'
import { DatosFamiliares } from './entities/datos_familiare.entity'
import { DB_SII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Detenido } from '../filiacion/detenido/entities/detenido.entity'
import { DatosFamiliaresRepository } from './repository/datos_familiares.repository'
import { Parentezco } from '../parametricas/parentezco/entities/parentezco.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([DatosFamiliares, Detenido, Parentezco], DB_SII),
  ],
  controllers: [DatosFamiliaresController],
  providers: [DatosFamiliaresService, DatosFamiliaresRepository],
  exports: [DatosFamiliaresService],
})
export class DatosFamiliaresModule {}
