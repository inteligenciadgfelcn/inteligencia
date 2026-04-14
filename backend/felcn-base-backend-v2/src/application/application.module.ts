import { Module } from '@nestjs/common'
import { SunesisModule } from './sunesis/sunesis.module'

@Module({
  imports: [SunesisModule],
})
export class ApplicationModule {}
