import { BaseService } from '@/common/base'
import { Injectable, OnModuleInit } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'
import { WhatsAppChannel } from './whatsapp/whatsapp.channel'

const SMTP_TIMEOUT_MS = 8000

interface CanalSmtp {
  nombre: string
  transporter: Transporter
  from: string
}

@Injectable()
export class MensajeriaService extends BaseService implements OnModuleInit {
  private canales: CanalSmtp[] = []

  constructor(private readonly whatsAppChannel: WhatsAppChannel) {
    super()
  }

  onModuleInit() {
    if (process.env.SMTP_ENABLED === 'false') {
      return
    }

    this.canales = [
      this.construirCanal('primario', {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM,
      }),
      this.construirCanal('respaldo-1', {
        host: process.env.SMTP_BACKUP1_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_BACKUP1_PORT,
        secure: process.env.SMTP_BACKUP1_SECURE === 'true',
        user: process.env.SMTP_BACKUP1_USER,
        pass: process.env.SMTP_BACKUP1_PASS,
        from: process.env.SMTP_BACKUP1_FROM,
      }),
      this.construirCanal('respaldo-2', {
        host: process.env.SMTP_BACKUP2_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_BACKUP2_PORT,
        secure: process.env.SMTP_BACKUP2_SECURE === 'true',
        user: process.env.SMTP_BACKUP2_USER,
        pass: process.env.SMTP_BACKUP2_PASS,
        from: process.env.SMTP_BACKUP2_FROM,
      }),
    ].filter((canal): canal is CanalSmtp => canal !== null)

    if (this.canales.length === 0) {
      this.logger.warn(
        '[SMTP] Ningún canal de correo configurado (ni primario ni respaldos) — los correos se registrarán como no enviados'
      )
    }
  }

  /**
   * Arma un canal SMTP a partir de sus variables de entorno.
   * Devuelve null si faltan credenciales, para no bloquear el arranque
   * ni intentar autenticar con datos vacíos.
   */
  private construirCanal(
    nombre: string,
    cfg: {
      host: string
      port?: string
      secure: boolean
      user?: string
      pass?: string
      from?: string
    }
  ): CanalSmtp | null {
    if (!cfg.user || !cfg.pass) {
      return null
    }
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: parseInt(cfg.port || '587'),
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    })
    return {
      nombre,
      transporter,
      from: cfg.from || `"FELCN Sistema" <${cfg.user}>`,
    }
  }

  /**
   * Envía un correo electrónico via SMTP.
   * @param email Dirección de destino
   * @param subject Asunto del correo
   * @param content Cuerpo HTML del correo
   */
  async sendEmail(email: string, subject: string, content: string): Promise<void> {
    if (this.canales.length === 0) {
      this.logger.warn(
        `[SMTP-DEV] Correo no enviado (sin canales SMTP configurados)\n` +
          `  Para    : ${email}\n` +
          `  Asunto  : ${subject}`
      )
      return
    }

    let ultimoError: unknown
    for (const canal of this.canales) {
      const t1 = Date.now()
      try {
        await canal.transporter.sendMail({
          from: canal.from,
          to: email,
          subject,
          html: content,
          text: this.htmlToText(content),
        })
        this.logger.auditSuccess('mensajeria', 'E-MAIL enviado correctamente', {
          asunto: subject,
          para: email,
          canal: canal.nombre,
          elapsedTimeMs: Date.now() - t1,
        })
        return
      } catch (error) {
        ultimoError = error
        this.logger.auditWarn(
          'mensajeria',
          `Falló el envío por el canal '${canal.nombre}', se intenta el siguiente`,
          {
            asunto: subject,
            para: email,
            canal: canal.nombre,
            error: error instanceof Error ? error.message : String(error),
          }
        )
      }
    }

    this.logger.auditError(
      'mensajeria',
      `Correo NO entregado — fallaron los ${this.canales.length} canal(es) configurados (primario + respaldos)`,
      {
        asunto: subject,
        para: email,
        canalesIntentados: this.canales.map((c) => c.nombre),
        error: ultimoError instanceof Error ? ultimoError.message : String(ultimoError),
      }
    )
    this.logger.error(
      ultimoError,
      `Ocurrió un error al enviar el mensaje por E-MAIL — fallaron los ${this.canales.length} canal(es) configurados`
    )
    throw ultimoError
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
   * Envía el código OTP a través de WhatsApp Cloud API (Meta).
   * Si las variables de entorno no están configuradas, registra un warning sin lanzar error.
   * @param telefono Número de destino (se normaliza a E.164 internamente)
   * @param codigo Código OTP de 6 dígitos (se usa como parámetro de plantilla)
   * @param idUsuario ID del usuario destino para trazabilidad en otp_delivery
   */
  async sendWhatsapp(
    telefono: string,
    codigo: string,
    idUsuario?: string
  ): Promise<void> {
    const resultado = await this.whatsAppChannel.enviar(telefono, codigo, idUsuario)
    if (!resultado.exito) {
      this.logger.warn(
        `[WHATSAPP] Envío no completado: ${resultado.error}\n` +
          `  Para: ${telefono}`
      )
    }
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
