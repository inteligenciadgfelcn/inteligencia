import { Module } from '@nestjs/common'
import { ReportesLgiController } from './reportes_lgi.controller'
import { EstadisticasLgiController } from './estadisticas-lgi.controller'
import { ExportModule } from '@/application/inteligencia/reportes/export/export.module'
import { ActuacionReporteRepository } from './repository/actuacion.repository'
import { ActuacionLgiService } from './service/actuacion.service'
import { InicioInvestigacionRepository } from './repository/Inicio-investigacion.repository'
import { InicioInvestigacionService } from './service/inicio_investigacion.service'
import { BienesLgiReporteRepository } from './repository/bienes-lgi.repository'
import { BienesLgiService } from './service/bienes_lgi.service'
import { ConclusionCasoService } from './service/conclusion.service'
import { EstadisticasLgiService } from './service/estadisticas_lgi.service'
import { EstadisticasLgiRepository } from './repository/estadisticas_lgi.repository'
import { ConsultaSiiiRepository } from '../informacion_siii/repository/consulta.repository'
import { DistritalLgiRepository } from '../parametro/parametricas_lgi/repository/distrito.repository'
import { GrupoLgiRepository } from '../parametro/parametricas_lgi/repository/grupo.repository'
import { InvestigadoresModule } from '../investigadores/investigadores.module'

@Module({
  imports: [
    ExportModule,
    InvestigadoresModule,
  ],
  controllers: [
    ReportesLgiController,
    EstadisticasLgiController,
  ],
  providers: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService,
    BienesLgiReporteRepository,
    BienesLgiService,
    ConclusionCasoService,
    EstadisticasLgiService,
    EstadisticasLgiRepository,
    ConsultaSiiiRepository,
    DistritalLgiRepository,
    GrupoLgiRepository,
  ],
  exports: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService,
    BienesLgiReporteRepository,
    BienesLgiService,
    ConclusionCasoService,
    EstadisticasLgiService,
    EstadisticasLgiRepository,
    ConsultaSiiiRepository,
    DistritalLgiRepository,
    GrupoLgiRepository,
  ],
})
export class ReportesLgiModule {}
