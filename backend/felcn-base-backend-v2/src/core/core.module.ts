import { Module } from '@nestjs/common'
import { ConfigCoreModule } from './config/config.module'

@Module({
  imports: [ConfigCoreModule],
})
export class CoreModule {}
