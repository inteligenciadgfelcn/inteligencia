import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperativeReportController } from './operativo/operativo-report.controller';
import { ReportBaseService } from './services/reporte-base.service';
import { SiiiModule } from '../siii.module';
import { CruzadasController } from './cruzados/cruzados.controller';
import { CruzadasService } from './cruzados/cruzados.service';
import { CruzadasRepository } from './cruzados/cruzados.repository';
import { CuadrosController } from './cuadros/cuadros.controller';
import { CuadrosService } from './cuadros/cuadros.service';
import { CuadrosRepository } from './cuadros/cuadros.repository';
import { SeguimientoReportController } from './seguimiento/seguimiento-report.controller';
import { DB_AUTH } from '@/core/config/database/database.module';

@Module({
    // TypeOrmModule.forFeature([], DB_AUTH): habilita @InjectDataSource(DB_AUTH) en
    // ReportBaseService (nombre de usuario para el pie de los reportes PDF).
    imports: [SiiiModule, TypeOrmModule.forFeature([], DB_AUTH)],
    controllers: [OperativeReportController, CruzadasController, CuadrosController, SeguimientoReportController],
    providers: [ReportBaseService, CruzadasService, CruzadasRepository, CuadrosService, CuadrosRepository],
    exports: [ReportBaseService],
})
export class ReportModule { }
