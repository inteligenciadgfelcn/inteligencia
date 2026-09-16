import { Module } from '@nestjs/common';
import { ReportesLgiController } from './reportes_lgi.controller';
import { ExportModule } from '@/application/inteligencia/reportes/export/export.module';
import { ActuacionReporteRepository } from './repository/actuacion.repository';
import { ActuacionLgiService } from './service/actuacion.service';
import { InicioInvestigacionRepository } from './repository/Inicio-investigacion.repository';
import { InicioInvestigacionService } from './service/inicio_investigacion.service';

@Module({
   imports: [
    ExportModule,
  ],
  controllers: [ReportesLgiController],
   providers: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService
  ],

  exports: [
    ActuacionLgiService,
    ActuacionReporteRepository,
    InicioInvestigacionRepository,
    InicioInvestigacionService
  ],

})
export class ReportesLgiModule {}