import { Module } from '@nestjs/common'
import { SiiiModule } from './siii/siii.module'
import { ReportModule } from './siii/reportes/reporte.module'
import { S2iModule } from './s2i/s2i.module'

@Module({
  imports: [SiiiModule, ReportModule, S2iModule],
  exports: [SiiiModule, ReportModule, S2iModule],
})
export class SunesisModule {}
