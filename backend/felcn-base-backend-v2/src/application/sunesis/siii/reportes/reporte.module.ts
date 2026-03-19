import { Module } from '@nestjs/common';
import { ReportController } from './reporte.controller';
import { ReportBaseService } from './services/reporte-base.service';
import { SiiiModule } from '../siii.module';

@Module({
    imports: [SiiiModule],
    controllers: [ReportController],
    providers: [ReportBaseService],
    exports: [ReportBaseService],
})
export class ReportModule { }
