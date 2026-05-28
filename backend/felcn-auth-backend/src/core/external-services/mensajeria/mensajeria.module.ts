import { Module } from '@nestjs/common'
import { MensajeriaService } from './mensajeria.service'

@Module({
  providers: [MensajeriaService],
  exports: [MensajeriaService],
})
export class MensajeriaModule {}
