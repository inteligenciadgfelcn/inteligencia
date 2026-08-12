import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AsignacionLgiService } from './asignacion_lgi.service'
import { AsignacionLgiController } from './asignacion_lgi.controller'
import { AsignacionLgi } from './entities/asignacion_lgi.entity'
import { DB_LGI } from '@/core/config/database/database.module'
import { AsignacionLgiRepository } from './repository/asignacion_lgi.repository'
import { AsignacionesModule } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/asignaciones.module'
import { DistritalLgiRepository } from '../parametro/parametricas_lgi/repository/distrito.repository'

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionLgi], DB_LGI), AsignacionesModule],
  controllers: [AsignacionLgiController],
  providers: [AsignacionLgiService,AsignacionLgiRepository,DistritalLgiRepository],
  exports: [AsignacionLgiService],
})
export class AsignacionLgiModule {}
