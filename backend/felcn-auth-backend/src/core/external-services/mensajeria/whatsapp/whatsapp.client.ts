import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { BaseService } from '@/common/base'

export interface WhatsAppSendResult {
  messageId: string
}

@Injectable()
export class WhatsAppClient extends BaseService {
  private readonly apiVersion: string
  private readonly graphBaseUrl: string
  private readonly phoneNumberId: string
  private readonly accessToken: string
  private readonly templateName: string

  constructor(private readonly httpService: HttpService) {
    super()
    this.apiVersion = process.env.WHATSAPP_API_VERSION ?? 'v21.0'
    this.graphBaseUrl =
      process.env.WHATSAPP_GRAPH_BASE_URL ?? 'https://graph.facebook.com'
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID ?? ''
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN ?? ''
    this.templateName =
      process.env.WHATSAPP_OTP_TEMPLATE_NAME ?? 'codigo_verificacion_felcn'
  }

  isConfigured(): boolean {
    return !!(this.phoneNumberId && this.accessToken && this.templateName)
  }

  async sendOtpTemplate(
    destinoE164: string,
    codigo: string
  ): Promise<WhatsAppSendResult> {
    const url = `${this.graphBaseUrl}/${this.apiVersion}/${this.phoneNumberId}/messages`

    const payload = {
      messaging_product: 'whatsapp',
      to: destinoE164,
      type: 'template',
      template: {
        name: this.templateName,
        language: { code: 'es' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: codigo }],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [{ type: 'text', text: codigo }],
          },
        ],
      },
    }

    const response = await firstValueFrom(
      this.httpService.post(url, payload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    )

    const messageId: string | undefined = response.data?.messages?.[0]?.id
    if (!messageId) {
      throw new Error('Meta no devolvió un message_id en la respuesta')
    }

    return { messageId }
  }

  normalizeToE164(telefono: string): string {
    const clean = telefono.replace(/[\s\-.()]/g, '').replace(/^\+/, '')

    // Ya tiene código de país Bolivia
    if (clean.startsWith('591') && clean.length >= 11) return `+${clean}`

    // Número boliviano de 8 dígitos (empieza en 6 o 7)
    if (clean.length === 8 && (clean.startsWith('6') || clean.startsWith('7'))) {
      return `+591${clean}`
    }

    // Con cero delante (09xxxxxxx → +5919xxxxxxx)
    if (clean.startsWith('0') && clean.length === 9) {
      return `+591${clean.slice(1)}`
    }

    return `+${clean}`
  }
}
