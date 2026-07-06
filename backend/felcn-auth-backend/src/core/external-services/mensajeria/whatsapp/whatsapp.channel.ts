import { Injectable } from '@nestjs/common'
import { BaseService } from '@/common/base'
import {
  OtpDeliveryChannel,
  ResultadoEnvio,
} from './interface/otp-delivery-channel.interface'
import { WhatsAppClient } from './whatsapp.client'
import { OtpDeliveryRepository } from './repository/otp-delivery.repository'
import { EstadoEntrega } from './entity/otp-delivery.entity'

@Injectable()
export class WhatsAppChannel extends BaseService implements OtpDeliveryChannel {
  private readonly maxRetries: number
  private readonly backoffMs: number

  constructor(
    private readonly client: WhatsAppClient,
    private readonly deliveryRepo: OtpDeliveryRepository
  ) {
    super()
    this.maxRetries = parseInt(process.env.OTP_DELIVERY_MAX_RETRIES ?? '3', 10)
    this.backoffMs = parseInt(
      process.env.OTP_DELIVERY_RETRY_BACKOFF_MS ?? '1000',
      10
    )
  }

  nombre(): string {
    return 'whatsapp'
  }

  async enviar(
    destino: string,
    codigo: string,
    idUsuario?: string
  ): Promise<ResultadoEnvio> {
    if (!this.client.isConfigured()) {
      this.logger.warn(
        `[WHATSAPP-NO-CONFIGURADO] Variables de entorno de WhatsApp no definidas.\n` +
          `  Para: ${destino}`
      )
      return { messageId: '', exito: false, error: 'WhatsApp no configurado' }
    }

    const destinoE164 = this.client.normalizeToE164(destino)

    const registro = await this.deliveryRepo.crear({
      userId: idUsuario ?? null,
      channel: 'whatsapp',
      messageId: null,
      recipient: destinoE164,
      status: EstadoEntrega.REQUESTED,
      errorDetail: null,
    })

    try {
      const { messageId } = await this.withRetry(
        () => this.client.sendOtpTemplate(destinoE164, codigo),
        this.maxRetries,
        this.backoffMs
      )

      await this.deliveryRepo.actualizarPorId(registro.id, {
        messageId,
        status: EstadoEntrega.SENT,
      })

      this.logger.audit('whatsapp', {
        mensaje: 'OTP enviado vía WhatsApp',
        metadata: { messageId, recipient: destinoE164 },
      })

      return { messageId, exito: true }
    } catch (error) {
      const errorDetail =
        error instanceof Error ? error.message : String(error)

      await this.deliveryRepo.actualizarPorId(registro.id, {
        status: EstadoEntrega.FAILED,
        errorDetail,
      })

      this.logger.error(error, 'Fallo al enviar OTP por WhatsApp')
      throw error
    }
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    backoffMs: number
  ): Promise<T> {
    let lastError: Error = new Error('Sin intentos')
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, backoffMs * Math.pow(2, attempt))
          )
        }
      }
    }
    throw lastError
  }
}
