import { Module } from '@nestjs/common'
import { ParametroModule } from './parametro/parametro.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [ParametroModule, HealthModule],
})
export class ApplicationModule {}
