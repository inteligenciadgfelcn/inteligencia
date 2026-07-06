import { Module } from '@nestjs/common'
import { MensajeriaService } from './mensajeria.service'
import { WhatsappModule } from './whatsapp/whatsapp.module'

@Module({
  imports: [WhatsappModule],
  providers: [MensajeriaService],
  exports: [MensajeriaService],
})
export class MensajeriaModule {}
