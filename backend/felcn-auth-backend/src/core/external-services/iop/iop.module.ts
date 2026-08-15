import { Module } from '@nestjs/common'
import { SinModule } from './sin/sin.module'

@Module({
  imports: [SinModule],
  providers: [],
  exports: [SinModule],
})
export class IopModule {}
