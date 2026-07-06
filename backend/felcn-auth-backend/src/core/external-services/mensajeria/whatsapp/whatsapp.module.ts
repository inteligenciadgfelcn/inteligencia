import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WhatsAppClient } from './whatsapp.client'
import { WhatsAppChannel } from './whatsapp.channel'
import { WhatsAppWebhookService } from './whatsapp-webhook.service'
import { WhatsAppWebhookController } from './whatsapp-webhook.controller'
import { OtpDelivery } from './entity/otp-delivery.entity'
import { OtpDeliveryRepository } from './repository/otp-delivery.repository'

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([OtpDelivery])],
  controllers: [WhatsAppWebhookController],
  providers: [
    WhatsAppClient,
    WhatsAppChannel,
    WhatsAppWebhookService,
    OtpDeliveryRepository,
  ],
  exports: [WhatsAppChannel],
})
export class WhatsappModule {}
