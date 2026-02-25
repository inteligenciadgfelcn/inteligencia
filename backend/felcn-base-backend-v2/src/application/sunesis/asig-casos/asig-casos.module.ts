import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_ASIG_CASOS } from '../shared/constants'

// Entidades
import { Asignacion } from './asignacion/entity/asignacion.entity'
import { Servicio } from './servicio/entity/servicio.entity'
import { DepartamentoCaso } from './lookup/entity/departamento-caso.entity'
import { UnidadCaso } from './lookup/entity/unidad-caso.entity'
import { Letra } from './lookup/entity/letra.entity'
import { UsuarioUnidad } from './lookup/entity/usuario-unidad.entity'
import { UsuarioIcia } from './lookup/entity/usuario-icia.entity'

// Controllers
import { AsignacionController } from './asignacion/controller/asignacion.controller'
import { ServicioController } from './servicio/controller/servicio.controller'
import { AsigLookupController } from './lookup/controller/asig-lookup.controller'

// Services
import { AsignacionService } from './asignacion/service/asignacion.service'
import { ServicioService } from './servicio/service/servicio.service'
import { AsigLookupService } from './lookup/service/asig-lookup.service'

// Repositories
import { AsignacionRepository } from './asignacion/repository/asignacion.repository'
import { ServicioRepository } from './servicio/repository/servicio.repository'
import { AsigLookupRepository } from './lookup/repository/asig-lookup.repository'

const entities = [
  Asignacion,
  Servicio,
  DepartamentoCaso,
  UnidadCaso,
  Letra,
  UsuarioUnidad,
  UsuarioIcia,
]

@Module({
  imports: [TypeOrmModule.forFeature(entities, DB_ASIG_CASOS)],
  controllers: [AsignacionController, ServicioController, AsigLookupController],
  providers: [
    AsignacionService,
    ServicioService,
    AsigLookupService,
    AsignacionRepository,
    ServicioRepository,
    AsigLookupRepository,
  ],
  exports: [AsignacionService, ServicioService, AsigLookupService],
})
export class AsigCasosModule {}
