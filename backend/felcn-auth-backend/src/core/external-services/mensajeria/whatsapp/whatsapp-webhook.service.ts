import { Injectable } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { OtpDeliveryRepository } from './repository/otp-delivery.repository'
import { EstadoEntrega } from './entity/otp-delivery.entity'

interface WhatsAppStatusEvent {
  id: string
  status: string
  timestamp: string
  recipient_id?: string
  errors?: Array<{ code: number; title: string }>
}

@Injectable()
export class WhatsAppWebhookService extends BaseService {
  constructor(private readonly deliveryRepo: OtpDeliveryRepository) {
    super()
  }

  async procesarEventos(body: unknown): Promise<void> {
    const statuses = this.extraerStatuses(body)
    for (const status of statuses) {
      await this.procesarStatus(status).catch((err) =>
        this.logger.error(
          err,
          `Error procesando status webhook messageId=${status.id}`
        )
      )
    }
  }

  private async procesarStatus(evento: WhatsAppStatusEvent): Promise<void> {
    const estadoMapeado = this.mapearEstado(evento.status)
    const errorDetail = evento.errors
      ?.map((e) => `[${e.code}] ${e.title}`)
      .join('; ')

    await this.deliveryRepo.actualizarEstadoPorMessageId(
      evento.id,
      estadoMapeado,
      errorDetail
    )

    this.logger.audit('whatsapp-webhook', {
      mensaje: `Estado WhatsApp actualizado: ${evento.status}`,
      metadata: {
        messageId: evento.id,
        status: estadoMapeado,
        recipientId: evento.recipient_id,
      },
    })
  }

  private mapearEstado(status: string): string {
    const mapa: Record<string, string> = {
      sent: EstadoEntrega.SENT,
      delivered: EstadoEntrega.DELIVERED,
      read: EstadoEntrega.READ,
      failed: EstadoEntrega.FAILED,
    }
    return mapa[status] ?? status
  }

  private extraerStatuses(body: unknown): WhatsAppStatusEvent[] {
    const statuses: WhatsAppStatusEvent[] = []
    try {
      const payload = body as Record<string, unknown>
      const entries = (payload?.entry as unknown[]) ?? []
      for (const entry of entries) {
        const changes = ((entry as Record<string, unknown>)?.changes as unknown[]) ?? []
        for (const change of changes) {
          const value = (change as Record<string, unknown>)?.value as Record<string, unknown>
          const statusList = (value?.statuses as WhatsAppStatusEvent[]) ?? []
          statuses.push(...statusList)
        }
      }
    } catch {
      // payload mal formado — ignorar
    }
    return statuses
  }
}
