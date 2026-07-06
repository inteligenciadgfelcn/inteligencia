import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common'
import { Response } from 'express'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { WhatsAppWebhookService } from './whatsapp-webhook.service'

@Controller('whatsapp')
@ApiTags('WhatsApp Webhook')
export class WhatsAppWebhookController {
  constructor(private readonly webhookService: WhatsAppWebhookService) {}

  @ApiOperation({ summary: 'Validación del webhook Meta (handshake)' })
  @Get('webhook')
  verificar(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') verifyToken: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ): void {
    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN ?? ''
    if (mode === 'subscribe' && verifyToken === expectedToken) {
      res.status(200).send(challenge)
    } else {
      res.status(403).send('Forbidden')
    }
  }

  @ApiOperation({ summary: 'Recepción de eventos de estado Meta (sent / delivered / read / failed)' })
  @Post('webhook')
  async recibirEvento(
    @Body() body: unknown,
    @Res() res: Response
  ): Promise<void> {
    // Responder 200 de inmediato para cumplir con el límite de 5s de Meta
    res.status(200).send('OK')
    this.webhookService.procesarEventos(body).catch(() => undefined)
  }
}
