import { Module } from '@nestjs/common';
import { OperativeReportController } from './operativo/operativo-report.controller';
import { ReportBaseService } from './services/reporte-base.service';
import { SiiiModule } from '../siii.module';
import { CruzadasController } from './cruzados/cruzados.controller';
import { CruzadasService } from './cruzados/cruzados.service';
import { CruzadasRepository } from './cruzados/cruzados.repository';

@Module({
    imports: [SiiiModule],
    controllers: [OperativeReportController, CruzadasController],
    providers: [ReportBaseService, CruzadasService, CruzadasRepository],
    exports: [ReportBaseService],
})
export class ReportModule { }
