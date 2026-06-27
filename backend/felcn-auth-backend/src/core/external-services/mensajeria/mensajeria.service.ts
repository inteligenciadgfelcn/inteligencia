import { BaseService } from '@/common/base'
import { Injectable, OnModuleInit } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'

@Injectable()
export class MensajeriaService extends BaseService implements OnModuleInit {
  private transporter: Transporter | null = null

  onModuleInit() {
    if (process.env.SMTP_ENABLED !== 'false') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    }
  }

  /**
   * Envía un correo electrónico via SMTP.
   * @param email Dirección de destino
   * @param subject Asunto del correo
   * @param content Cuerpo HTML del correo
   */
  async sendEmail(email: string, subject: string, content: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(
        `[SMTP-DEV] Correo no enviado (SMTP_ENABLED=false)\n` +
          `  Para    : ${email}\n` +
          `  Asunto  : ${subject}`
      )
      return
    }
    try {
      const t1 = Date.now()
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"FELCN Sistema" <noreply@felcn.gob.bo>',
        to: email,
        subject,
        html: content,
        text: this.htmlToText(content),
      })
      this.logger.audit('mensajeria', {
        mensaje: 'E-MAIL enviado correctamente',
        metadata: {
          asunto: subject,
          para: email,
          elapsedTimeMs: Date.now() - t1,
        },
      })
    } catch (error) {
      this.logger.error(error, 'Ocurrió un error al enviar el mensaje por E-MAIL')
      throw error
    }
  }

  /**
   * SMS no disponible via SMTP.
   * Se registra en logs como advertencia. Cuando FELCN provea un gateway SMS
   * se implementará aquí sin cambiar los callers.
   */
  async sendSms(cellphone: string, content: string): Promise<void> {
    this.logger.warn(
      `[SMS-NO-DISPONIBLE] Envío SMS pendiente de gateway.\n` +
        `  Para    : ${cellphone}\n` +
        `  Mensaje : ${content}`
    )
  }

  /**
   * Envía un mensaje de WhatsApp con el código OTP.
   * Pendiente de integración con proveedor autorizado (Meta WA Cloud API / Twilio).
   * Cuando FELCN provea las credenciales del gateway, se implementa aquí
   * sin modificar los callers.
   */
  async sendWhatsapp(telefono: string, content: string): Promise<void> {
    this.logger.warn(
      `[WHATSAPP-NO-DISPONIBLE] Envío WhatsApp pendiente de gateway.\n` +
        `  Para    : ${telefono}\n` +
        `  Mensaje : ${content}`
    )
  }

  /** Fallback de texto plano para clientes que no renderizan HTML. */
  private htmlToText(html: string): string {
    return html
      .replace(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi, '$2 ($1)')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(p|div|tr|td|th|h[1-6])[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }
}
