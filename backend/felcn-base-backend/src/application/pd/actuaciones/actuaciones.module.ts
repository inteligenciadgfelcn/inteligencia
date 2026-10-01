import { Module } from '@nestjs/common'
import { ActuacionesPdService } from './actuaciones.service'
import { ActuacionesController } from './actuaciones.controller'
import {OperativoPdRepository } from './repository/operativo_lgi.repository'
import { TypeOrmModule } from '@nestjs/typeorm/dist'
import { DB_LGI } from '@/core/config/database/database.module'
import { OperativoLgi } from '@/application/lgi/actuaciones/entities/operativoLgi.entity'

@Module({
  imports: [TypeOrmModule.forFeature([OperativoLgi], DB_LGI)],
  controllers: [ActuacionesController],
  providers: [ActuacionesPdService, OperativoPdRepository],
  exports: [ActuacionesPdService, OperativoPdRepository],
})
export class ActuacionesPdModule {}
