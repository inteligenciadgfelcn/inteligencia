import { Module } from '@nestjs/common';
import { ReportesLgiService } from './reportes_lgi.service';
import { ReportesLgiController } from './reportes_lgi.controller';
import { ExportModule } from '@/application/inteligencia/reportes/export/export.module';

@Module({
   imports: [
    ExportModule,
  ],
  controllers: [ReportesLgiController],
  providers: [ReportesLgiService],
})
export class ReportesLgiModule {}
