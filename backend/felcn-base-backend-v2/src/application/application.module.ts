import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { HealthModule } from './health/health.module'
import { SunesisModule } from './sunesis/sunesis.module'

@Module({
  imports: [ParametroModule, HealthModule, SunesisModule],
})
export class ApplicationModule {}
