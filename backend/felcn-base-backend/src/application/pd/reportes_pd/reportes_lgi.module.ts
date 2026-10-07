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

import { PersonasJuridicasReporteRepository } from './repository/personas-juridica.repository'
import { PersonasJuridicasReporteService } from './service/personas-juridicas.service'
import { ConclusionReporteRepository } from './repository/lgi-conclusion.repository'
import { ConclusionReporteService } from './service/conclusion.service'
import { InvestigadoresModule } from '@/application/lgi/investigadores/investigadores.module'
import { BienesSecuestradosModule } from '@/application/lgi/bienes_secuestrados/bienes_secuestrados.module'
import { ConsultaSiiiRepository } from '@/application/lgi/informacion_siii/repository/consulta.repository'
import { DistritalLgiRepository } from '@/application/lgi/parametro/parametricas_lgi/repository/distrito.repository'
import { GrupoLgiRepository } from '@/application/lgi/parametro/parametricas_lgi/repository/grupo.repository'

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
  ],
})
export class ReportesLgiModule {}