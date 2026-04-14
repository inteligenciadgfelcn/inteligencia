import { Module } from '@nestjs/common'
import { SiiiModule } from './siii/siii.module'

@Module({
  imports: [SiiiModule],
  exports: [SiiiModule],
})
export class SunesisModule {}
