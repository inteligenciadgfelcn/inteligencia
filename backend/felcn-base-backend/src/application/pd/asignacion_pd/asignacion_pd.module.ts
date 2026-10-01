import { Module } from '@nestjs/common'
import { AsignacionPdService } from './asignacion_pd.service'
import { AsignacionPdController } from './asignacion_pd.controller'
import { AsignacionesModule } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/asignaciones.module'
import { AsignacionASIG } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/entities/asignacionAsig.entity'
import { AsignacionLgi } from '@/application/lgi/asignacion_lgi/entities/asignacion_lgi.entity'
import { DB_LGI, DB_ASIG_CASOS } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DistritalLgiRepository } from '@/application/lgi/parametro/parametricas_lgi/repository/distrito.repository'
import { GrupoLgiRepository } from '@/application/lgi/parametro/parametricas_lgi/repository/grupo.repository'
import { AsignacionPdRepository } from './repository/asignacion_pd.repository'
import { EtapaProcesalPdRepository } from './repository/etapa-procesal.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([AsignacionLgi], DB_LGI),
    AsignacionesModule,
    TypeOrmModule.forFeature([AsignacionASIG], DB_ASIG_CASOS),
  ],
  controllers: [AsignacionPdController],
  providers: [
    AsignacionPdService,
    AsignacionPdRepository,
    DistritalLgiRepository,
    GrupoLgiRepository,
    EtapaProcesalPdRepository,
  ],
  exports: [
    AsignacionPdService,
    AsignacionPdRepository,
    DistritalLgiRepository,
    GrupoLgiRepository,
    EtapaProcesalPdRepository,
  ],
})
export class AsignacionPdModule {}
