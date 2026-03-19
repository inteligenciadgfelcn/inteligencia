import { Module } from '@nestjs/common'
import { AsigCasosModule } from './asig-casos/asig-casos.module'
import { S2iModule } from './s2i/s2i.module'
import { SiiiModule } from './siii/siii.module'
import { ReportModule } from './siii/reportes/reporte.module'

/**
 * Módulo principal SUNESIS
 * Agrupa los 3 submódulos que corresponden a las 3 bases de datos:
 * - AsigCasosModule: felcn_asignacion_casos
 * - S2iModule: felcn_s3i
 * - SiiiModule: felcn_iii
 */
@Module({
  imports: [AsigCasosModule, S2iModule, SiiiModule, ReportModule],
  exports: [AsigCasosModule, S2iModule, SiiiModule, ReportModule],
})
export class SunesisModule {}
