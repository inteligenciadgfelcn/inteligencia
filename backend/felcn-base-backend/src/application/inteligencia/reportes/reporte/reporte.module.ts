import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DB_SII } from '@/core/config/database/database.module'
import { Detenido } from '../../felcn_sii/filiacion/detenido/entities/detenido.entity'
import { Huella } from '../../felcn_sii/huella/entities/huella.entity'
import { ExportModule } from '../export/export.module'
import { ReporteController } from './reporte.controller'
import { ReporteService } from './reporte.service'
import { TarjetaProntuariaService } from './services/tarjeta-prontuaria.service'
import { ReporteServicioService } from './services/reporte-servicio.service'
import { VariablesCruzadasService } from './services/variables-cruzadas.service'
import { TarjetaProntuariaRepository } from './repository/tarjeta-prontuaria.repository'
import { ReporteServicioRepository } from './repository/reporte_servicio.repository'
import { VariablesCruzadasRepository } from './repository/variables-cruzadas.repository'
import { DetenidoReporteRepository } from './repository/detenido-reporte.repository'
import { DetenidoReporteService } from './services/detenido-reporte.service'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Detenido, Huella],
       DB_SII
      ), 
      ExportModule],

  controllers: [ReporteController],

  providers: [
    ReporteService,

    TarjetaProntuariaService,
    ReporteServicioService,
    VariablesCruzadasService,
    DetenidoReporteService,

    TarjetaProntuariaRepository,
    ReporteServicioRepository,
    VariablesCruzadasRepository,
    DetenidoReporteRepository,
  ],

  exports: [
    ReporteService,
    TarjetaProntuariaService,
    ReporteServicioService,
    VariablesCruzadasService,
    DetenidoReporteService,
    TarjetaProntuariaRepository,
    ReporteServicioRepository,
    VariablesCruzadasRepository,
    DetenidoReporteRepository,
  ],
})
export class ReporteModule {}
