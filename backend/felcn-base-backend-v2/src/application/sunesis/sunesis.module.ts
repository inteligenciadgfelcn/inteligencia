import { Module } from '@nestjs/common'
import { SiiiModule } from './siii/siii.module'
import { ReportModule } from './siii/reportes/reporte.module'

@Module({
  imports: [SiiiModule, ReportModule],
  exports: [SiiiModule, ReportModule],
})
export class SunesisModule {}
