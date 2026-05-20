import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    if (process.env.SMTP_ENABLED === 'true') {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    }
  }

  async enviarOtp(email: string, codigo: string, nombre?: string): Promise<void> {
    const nombrePrimero = nombre || 'ciudadano/a'
    const appName = 'Portal Ciudadano (Developer)'
    const envName = 'Developer'

    if (process.env.SMTP_ENABLED !== 'true') {
      console.log('\n╔══════════════════════════════════════╗')
      console.log('║   FAKE CIUDADANÍA DIGITAL — OTP      ║')
      console.log('╠══════════════════════════════════════╣')
      console.log(`║  Para    : ${email.padEnd(28)}║`)
      console.log(`║  Código  : ${codigo.padEnd(28)}║`)
      console.log(`║  Expira  : 150 segundos              ║`)
      console.log('╚══════════════════════════════════════╝\n')
      return
    }

    const ttlHuman = '2 minutos y 30 segundos'
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 150_000)
    const fmt = (d: Date) =>
      d.toLocaleString('es-BO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })

    await this.transporter!.sendMail({
      from: `"Identidad Digital" <${process.env.SMTP_FROM || 'noreply@identidad-digital.gob.bo'}>`,
      to: email,
      subject: `Tu código de verificación es ${codigo}`,
      headers: {
        'Auto-Submitted': 'auto-generated',
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'All',
      },
      text: this.buildTextVersion({ email, codigo, nombrePrimero, appName, ttlHuman, expiresAt: fmt(expiresAt), requestTime: fmt(now) }),
      html: this.buildHtml({ email, codigo, nombrePrimero, appName, envName, ttlHuman, expiresAt: fmt(expiresAt), requestTime: fmt(now) }),
    })
  }

  /** Enmascara el email: co***@m***.com */
  maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    const maskedLocal = local.slice(0, 2) + '•'.repeat(Math.max(2, local.length - 2))
    const domainParts = domain.split('.')
    const maskedDomain = domainParts[0].slice(0, 1) + '***.' + domainParts.slice(1).join('.')
    return `${maskedLocal}@${maskedDomain}`
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HTML email template (table-layout + inline styles — compatible Outlook/Gmail)
  // ──────────────────────────────────────────────────────────────────────────
  private buildHtml(p: {
    email: string
    codigo: string
    nombrePrimero: string
    appName: string
    envName: string
    ttlHuman: string
    expiresAt: string
    requestTime: string
  }): string {
    return `<!doctype html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>Tu código de verificación</title>
  <style>
    @media only screen and (max-width:620px){
      .container{width:100%!important;}
      .px{padding-left:18px!important;padding-right:18px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f3f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a2235;">

  <!-- Preheader oculto -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;">
    Código ${p.codigo} · Expira en ${p.ttlHuman}. No lo compartas con nadie.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f3f4f7;">
    <tr><td align="center" style="padding:32px 16px;">

      <!-- Contenedor 600px -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container"
             style="width:600px;max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.06);">

        <!-- Brand bar -->
        <tr>
          <td class="px" style="padding:20px 28px;border-bottom:1px solid #e8eaf0;background:#fafbfc;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td valign="middle">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle" style="padding-right:10px;">
                        <table role="presentation" width="36" height="36" cellpadding="0" cellspacing="0" border="0"
                               style="width:36px;height:36px;border-radius:8px;background:#e8e9ff;">
                          <tr><td align="center" valign="middle"
                                  style="text-align:center;font:bold 14px/36px Arial,sans-serif;color:#4f3fde;">CD</td></tr>
                        </table>
                      </td>
                      <td valign="middle" style="line-height:1.2;">
                        <div style="font-size:14px;font-weight:600;color:#1a2235;">Ciudadanía Digital</div>
                        <div style="font-size:10.5px;color:#5a6478;text-transform:uppercase;letter-spacing:.06em;">Plataforma del Estado · Bolivia</div>
                      </td>
                    </tr>
                  </table>
                </td>
                <td valign="middle" align="right">
                  <span style="display:inline-block;font:600 11px/1.2 'Courier New',monospace;padding:4px 8px;border-radius:999px;background:#fff7d6;color:#8a5b00;">
                    Ambiente: ${p.envName}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Saludo -->
        <tr>
          <td class="px" style="padding:24px 28px 0;">
            <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1a2235;letter-spacing:-.005em;">
              Hola, ${p.nombrePrimero}
            </h1>
            <p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#3a4258;">
              Recibimos una solicitud para iniciar sesión en tu cuenta de
              <strong>Ciudadanía Digital</strong>. Usa este código para confirmar que fuiste tú:
            </p>
          </td>
        </tr>

        <!-- Bloque del código -->
        <tr>
          <td class="px" style="padding:0 28px 22px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="background:#f0f1ff;border:1px solid #d5d8ff;border-radius:10px;">
              <tr>
                <td style="padding:18px 20px;">
                  <div style="font:700 11px/1.2 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#4f3fde;margin-bottom:10px;">
                    Código de verificación
                  </div>
                  <div style="text-align:center;font-family:'Courier New','Lucida Console',monospace;font-size:38px;font-weight:700;letter-spacing:10px;color:#1a2235;padding:12px 0;">
                    ${p.codigo}
                  </div>
                  <div style="margin-top:10px;font-size:12.5px;color:#5a6478;">
                    ⏱ Expira en <strong style="color:#1a2235;">${p.ttlHuman}</strong> (${p.expiresAt}).
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Detalles del intento -->
        <tr>
          <td class="px" style="padding:0 28px 22px;">
            <h2 style="margin:0 0 8px;font:600 12px/1.2 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#4f3fde;">
              🛡 Detalles de la solicitud
            </h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="font-size:13px;color:#1a2235;">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eef0f4;color:#5a6478;width:35%;">Fecha y hora</td>
                <td style="padding:8px 0;border-bottom:1px solid #eef0f4;font-family:'Courier New',monospace;font-size:12.5px;">${p.requestTime}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #eef0f4;color:#5a6478;">Aplicación</td>
                <td style="padding:8px 0;border-bottom:1px solid #eef0f4;font-family:'Courier New',monospace;font-size:12.5px;">${p.appName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#5a6478;">Entorno</td>
                <td style="padding:8px 0;font-family:'Courier New',monospace;font-size:12.5px;">${p.envName}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ¿No fuiste tú? -->
        <tr>
          <td class="px" style="padding:0 28px 22px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="background:#fef1ee;border:1px solid #f7c6bb;border-left:4px solid #d04527;border-radius:10px;">
              <tr>
                <td style="padding:16px 18px;">
                  <strong style="display:block;font-size:14px;font-weight:700;color:#8e2410;margin-bottom:4px;">
                    ⚠ ¿No reconoces esta actividad?
                  </strong>
                  <p style="margin:0 0 8px;font-size:13px;line-height:1.55;color:#722010;">
                    Si tú <u>no</u> intentaste iniciar sesión, <strong>no uses este código</strong>.
                    Ignora este correo y cambia tu contraseña a la brevedad.
                  </p>
                  <p style="margin:0;font-size:12px;color:#8a4030;">
                    Si crees que tu cuenta está comprometida, contacta soporte de inmediato.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Tips de seguridad -->
        <tr>
          <td class="px" style="padding:0 28px 22px;">
            <h2 style="margin:0 0 10px;font:600 12px/1.2 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#4f3fde;">
              🔒 Importante para tu seguridad
            </h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="font-size:13px;line-height:1.55;color:#2a3148;">
              <tr><td style="padding:4px 0;">✓ &nbsp; Este código es <strong>personal e intransferible</strong>. Nunca lo compartas — ni con familiares, soporte técnico o personal del Estado.</td></tr>
              <tr><td style="padding:4px 0;">✓ &nbsp; <strong>Nunca</strong> te pediremos este código por teléfono, WhatsApp, SMS ni redes sociales.</td></tr>
              <tr><td style="padding:4px 0;">✓ &nbsp; Este correo es <strong>transaccional automático</strong>. No respondas a esta dirección.</td></tr>
            </table>
          </td>
        </tr>

        <!-- Soporte -->
        <tr>
          <td class="px" style="padding:0 28px 18px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="background:#f5f6fa;border-left:3px solid #4f3fde;border-radius:4px;">
              <tr>
                <td style="padding:12px 14px;">
                  <strong style="display:block;font-size:13px;margin-bottom:4px;color:#1a2235;">¿Necesitas ayuda?</strong>
                  <p style="margin:0;font-size:12.5px;color:#3a4258;">
                    Contacta a soporte técnico de tu institución o al administrador del sistema.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Despedida -->
        <tr>
          <td class="px" style="padding:0 28px 28px;font-size:13px;color:#3a4258;">
            Gracias por usar Ciudadanía Digital.<br>
            <strong>Equipo de Identidad Digital — AGETIC</strong>
          </td>
        </tr>

        <!-- Footer legal -->
        <tr>
          <td class="px" style="padding:18px 28px;background:#f5f6fa;border-top:1px solid #e8eaf0;color:#5a6478;font-size:11.5px;line-height:1.55;">
            <p style="margin:0 0 8px;">
              Recibes este correo porque alguien intentó iniciar sesión con la cuenta
              asociada a <strong>${p.email}</strong>. Si crees que se trata de un error,
              ignora este mensaje.
            </p>
            <p style="margin:0;font-size:11px;color:#7a8298;">
              AGETIC — Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación<br>
              Av. Camacho 1485, La Paz — Bolivia · © ${new Date().getFullYear()}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Plain-text fallback (multipart/alternative)
  // ──────────────────────────────────────────────────────────────────────────
  private buildTextVersion(p: {
    email: string
    codigo: string
    nombrePrimero: string
    appName: string
    ttlHuman: string
    expiresAt: string
    requestTime: string
  }): string {
    return `================================================================
CIUDADANÍA DIGITAL — Código de verificación
================================================================

Hola, ${p.nombrePrimero}.

Recibimos una solicitud para iniciar sesión en tu cuenta de
Ciudadanía Digital. Usa este código para confirmar que fuiste tú:

    ┌──────────────────────┐
    │                      │
    │      ${p.codigo}          │
    │                      │
    └──────────────────────┘

Este código expira en ${p.ttlHuman} (a las ${p.expiresAt}).


--- DETALLES DE LA SOLICITUD -----------------------------------

  Fecha y hora  : ${p.requestTime}
  Aplicación    : ${p.appName}


--- IMPORTANTE PARA TU SEGURIDAD -------------------------------

  ✓ Este código es personal e intransferible. Nunca lo compartas
    — ni con familiares, soporte técnico o personal del Estado.

  ✓ NUNCA te pediremos este código por teléfono, WhatsApp, SMS
    ni redes sociales.

  ✓ Este correo es transaccional automático. No respondas a
    esta dirección.


-------------------------------------------------------------------

Gracias por usar Ciudadanía Digital.

Equipo de Identidad Digital — AGETIC


===================================================================
Recibes este correo porque alguien intentó iniciar sesión con la
cuenta asociada a ${p.email}. Si crees que se trata de un
error, ignora este mensaje.

AGETIC — Agencia de Gobierno Electrónico y Tecnologías de
Información y Comunicación.
Av. Camacho 1485, La Paz — Bolivia · © ${new Date().getFullYear()}
===================================================================`
  }
}
