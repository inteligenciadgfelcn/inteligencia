import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OperativeReportController } from './operativo/operativo-report.controller';
import { ReportBaseService } from './services/reporte-base.service';
import { SiiiModule } from '../siii.module';
import { CruzadasController } from './cruzados/cruzados.controller';
import { CruzadasService } from './cruzados/cruzados.service';
import { CruzadasRepository } from './cruzados/cruzados.repository';
import { CuadrosController } from './cuadros/cuadros.controller';
import { CuadrosService } from './cuadros/cuadros.service';
import { CuadrosRepository } from './cuadros/cuadros.repository';

@Module({
    imports: [SiiiModule, HttpModule],
    controllers: [OperativeReportController, CruzadasController, CuadrosController],
    providers: [ReportBaseService, CruzadasService, CruzadasRepository, CuadrosService, CuadrosRepository],
    exports: [ReportBaseService],
})
export class ReportModule { }
