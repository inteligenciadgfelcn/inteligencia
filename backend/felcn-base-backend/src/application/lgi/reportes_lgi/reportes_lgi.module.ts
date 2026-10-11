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
import { EstadisticasLgiService } from './service/estadisticas_lgi.service'
import { EstadisticasLgiRepository } from './repository/estadisticas_lgi.repository'

import { ConsultaSiiiRepository } from '../informacion_siii/repository/consulta.repository'
import { DistritalLgiRepository } from '../parametro/parametricas_lgi/repository/distrito.repository'
import { GrupoLgiRepository } from '../parametro/parametricas_lgi/repository/grupo.repository'
import { InvestigadoresModule } from '../investigadores/investigadores.module'
import { BienesSecuestradosModule } from '../bienes_secuestrados/bienes_secuestrados.module'

import { PersonasJuridicasReporteRepository } from './repository/personas-juridica.repository'
import { PersonasJuridicasReporteService } from './service/personas-juridicas.service'
import { ConclusionReporteRepository } from './repository/lgi-conclusion.repository'
import { ConclusionReporteService } from './service/conclusion.service'
import { CasoIntegralRepository } from './repository/caso-integral.repository'
import { CasoIntegralService } from './service/caso-integral.service'

@Module({
  imports: [
    ExportModule,
    InvestigadoresModule,
    BienesSecuestradosModule,
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
    EstadisticasLgiService,
    EstadisticasLgiRepository,
    ConsultaSiiiRepository,
    DistritalLgiRepository,
    GrupoLgiRepository,
    PersonasJuridicasReporteRepository,
    PersonasJuridicasReporteService,
    ConclusionReporteRepository,
    ConclusionReporteService,
    CasoIntegralRepository, CasoIntegralService,
  ],
  exports: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService,
    BienesLgiReporteRepository,
    BienesLgiService,
    EstadisticasLgiService,
    EstadisticasLgiRepository,
    ConsultaSiiiRepository,
    DistritalLgiRepository,
    GrupoLgiRepository,
    CasoIntegralService,
  ],
})
export class ReportesLgiModule {}