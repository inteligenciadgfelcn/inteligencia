import { Module } from '@nestjs/common';
import { ReportesLgiController } from './reportes_lgi.controller';
import { ExportModule } from '@/application/inteligencia/reportes/export/export.module';
import { ActuacionReporteRepository } from './repository/actuacion.repository';
import { ActuacionLgiService } from './service/actuacion.service';
import { InicioInvestigacionRepository } from './repository/Inicio-investigacion.repository';
import { InicioInvestigacionService } from './service/inicio_investigacion.service';
import { BienesLgiReporteRepository } from './repository/bienes-lgi.repository';
import { BienesLgiService } from './service/bienes_lgi.service';
import { ConclusionCasoService } from './service/conclusion.service';

@Module({
  imports: [
    ExportModule,
  ],
  controllers: [ReportesLgiController],
  providers: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService,
    BienesLgiReporteRepository,
    BienesLgiService,
    ConclusionCasoService,
  
  ],

  exports: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService, 
    BienesLgiReporteRepository,
    BienesLgiService,
    ConclusionCasoService,
  ],

})
export class ReportesLgiModule { }