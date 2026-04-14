import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Grado } from './entity/grado.entity'
import { Unidad } from './entity/unidad.entity'
import { Distrital } from './entity/distrital.entity'
import { Grupo } from './entity/grupo.entity'
import { GradoRepository } from './repository/grado.repository'
import { UnidadRepository } from './repository/unidad.repository'
import { DistritaRepository } from './repository/distrital.repository'
import { GrupoRepository } from './repository/grupo.repository'
import { GradoService } from './service/grado.service'
import { UnidadService } from './service/unidad.service'
import { DistritaService } from './service/distrital.service'
import { GrupoService } from './service/grupo.service'
import { LookupsController } from './controller/lookups.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Grado, Unidad, Distrital, Grupo])],
  controllers: [
    LookupsController,
  ],
  providers: [
    GradoService,
    GradoRepository,
    UnidadService,
    UnidadRepository,
    DistritaService,
    DistritaRepository,
    GrupoService,
    GrupoRepository,
  ],
  exports: [GradoService, UnidadService, DistritaService, GrupoService],
})
export class EstructuraModule {}
