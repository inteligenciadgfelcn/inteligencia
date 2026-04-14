import { Module } from '@nestjs/common'

import { AsignacionesService } from './asignaciones.service'
import { AsignacionesController } from './asignaciones.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_ASIG_CASOS, DB_SIII } from '@/core/config/database/database.module'
import { AsignacionesRepository } from './repository/asignaciones.repository'
import { AsignacionASIG } from './entities/asignacionAsig.entity'
import { Asignacion } from '../../felcn_siii/operaciones/asignacion/entities/asignacione.entity'
import { Departamento } from '../departamento/entities/departamento.entity'
import { Unidad } from '../unidad/entities/unidad.entity'
import { Letra } from '../letra/entities/letra.entity'
import { Servicio } from '../servicio/entities/servicio.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Asignacion], DB_SIII),
    TypeOrmModule.forFeature(
      [AsignacionASIG, Departamento, Unidad, Letra, Servicio],
      DB_ASIG_CASOS
    ),
  ],
  providers: [AsignacionesService, AsignacionesRepository],
  controllers: [AsignacionesController],
})
export class AsignacionesModule {}
