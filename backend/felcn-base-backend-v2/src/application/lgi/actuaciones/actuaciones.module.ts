import { Module } from '@nestjs/common'
import { ActuacionesService } from './actuaciones.service'
import { ActuacionesController } from './actuaciones.controller'
import { OperativoLgi } from './entities/operativoLgi.entity'
import { OperativoLgiRepository } from './repository/operativo_lgi.repository'
import { TypeOrmModule } from '@nestjs/typeorm/dist'
import { DB_LGI } from '@/core/config/database/database.module'

@Module({
  imports: [TypeOrmModule.forFeature([OperativoLgi], DB_LGI)],
  controllers: [ActuacionesController],
  providers: [ActuacionesService, OperativoLgiRepository],
  exports: [ActuacionesService, OperativoLgiRepository],
})
export class ActuacionesModule {}
