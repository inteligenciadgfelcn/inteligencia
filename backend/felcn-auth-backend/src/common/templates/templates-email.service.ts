const YEAR = new Date().getFullYear()

// ─── Colores institucionales FELCN ────────────────────────────────────────────
const C = {
  primary: '#1B3A6B',     // azul marino institucional
  primaryLight: '#dde6f5',
  primaryDark: '#122850',
  danger: '#C0392B',
  dangerLight: '#fdecea',
  dangerBorder: '#f5c6c0',
  success: '#1a6b3a',
  successLight: '#e6f5ec',
  bg: '#f3f4f6',
  white: '#ffffff',
  text: '#1a2235',
  textMuted: '#5a6478',
  border: '#e8eaf0',
  borderLight: '#eef0f4',
}

export class TemplateEmailService {
  // ─── Template 1: Credenciales de acceso ──────────────────────────────────
  // Uso: admin crea usuario / admin resetea contraseña
  static armarPlantillaActivacionCuenta(
    url: string,
    usuario: string,
    contrasena: string
  ): string {
    const content = `
      ${header('Tus credenciales de acceso')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Tu cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong> ha sido creada.
            A continuación encontrarás tus credenciales para ingresar por primera vez.
            Te recomendamos cambiar tu contraseña inmediatamente después de acceder.
          </p>

          <!-- Bloque de credenciales -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.primaryLight};border:1px solid #b8cde8;border-radius:10px;margin-bottom:20px;">
            <tr>
              <td style="padding:18px 22px;">
                <div style="font:700 11px/1.2 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;
                            color:${C.primary};margin-bottom:14px;">
                  Datos de acceso
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                       style="font-size:14px;color:${C.text};">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #b8cde8;color:${C.textMuted};width:35%;
                               font-size:13px;">Usuario</td>
                    <td style="padding:8px 0;border-bottom:1px solid #b8cde8;
                               font-family:'Courier New',monospace;font-size:18px;font-weight:700;
                               letter-spacing:2px;color:${C.primary};">${usuario}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 0;color:${C.textMuted};font-size:13px;">Contraseña</td>
                    <td style="padding:10px 0 0;font-family:'Courier New',monospace;font-size:18px;
                               font-weight:700;letter-spacing:3px;color:${C.primary};">${contrasena}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${ctaButton(url, 'Acceder al sistema')}

      <!-- Advertencia cambio de contraseña -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:#fff8e1;border:1px solid #ffe082;border-left:4px solid #f9a825;border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <strong style="display:block;font-size:13px;color:#6d4c00;margin-bottom:4px;">
                  ⚠ Importante: cambia tu contraseña
                </strong>
                <p style="margin:0;font-size:12.5px;line-height:1.55;color:#7a5500;">
                  Esta contraseña fue generada automáticamente. Por seguridad, cámbiala en tu
                  primer inicio de sesión. No la compartas con nadie.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${securityTips()}
    `
    return buildLayout(content)
  }

  // ─── Template 2: Bloqueo por intentos fallidos ────────────────────────────
  // Uso: autenticación → demasiados intentos fallidos
  static armarPlantillaBloqueoCuenta(url: string): string {
    const content = `
      ${header('Cuenta bloqueada temporalmente')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Tu cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong> ha sido
            <strong style="color:${C.danger};">bloqueada temporalmente</strong> porque se
            detectaron múltiples intentos fallidos de inicio de sesión.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Si fuiste tú, haz clic en el botón para desbloquear tu cuenta de forma segura.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Desbloquear mi cuenta', C.danger)}

      <!-- Aviso de seguridad -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.dangerLight};border:1px solid ${C.dangerBorder};
                        border-left:4px solid ${C.danger};border-radius:10px;">
            <tr>
              <td style="padding:16px 18px;">
                <strong style="display:block;font-size:14px;color:#7b1e1e;margin-bottom:6px;">
                  ¿No fuiste tú?
                </strong>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#8e2410;">
                  Si no reconoces estos intentos de inicio de sesión, es posible que alguien
                  esté intentando acceder a tu cuenta. <strong>No hagas clic en el enlace</strong>
                  y comunícate de inmediato con el administrador del sistema para asegurar tu cuenta.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${securityTips()}
    `
    return buildLayout(content)
  }

  // ─── Template 3: Recuperación de cuenta ──────────────────────────────────
  // Uso: usuario solicita recuperar acceso / restablecer contraseña
  static armarPlantillaRecuperacionCuenta(url: string): string {
    const content = `
      ${header('Solicitud de recuperación de cuenta')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Recibimos una solicitud para <strong style="color:${C.text};">restablecer la contraseña</strong>
            de tu cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong>.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Haz clic en el botón para crear una nueva contraseña. El enlace tiene una
            vigencia limitada por razones de seguridad.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Restablecer mi contraseña')}

      <!-- Si no fuiste tú -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.dangerLight};border:1px solid ${C.dangerBorder};
                        border-left:4px solid ${C.danger};border-radius:10px;">
            <tr>
              <td style="padding:16px 18px;">
                <strong style="display:block;font-size:14px;color:#7b1e1e;margin-bottom:6px;">
                  ¿No solicitaste este cambio?
                </strong>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#8e2410;">
                  Si tú <u>no</u> solicitaste restablecer tu contraseña, <strong>ignora este
                  correo</strong> — tu contraseña actual no cambiará. Si crees que tu cuenta
                  está en riesgo, contacta al administrador del sistema.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${securityTips()}
    `
    return buildLayout(content)
  }

  // ─── Template 4: Activación de cuenta (auto-registro / activación manual) ─
  // Uso: auto-registro por el usuario / admin activa manualmente
  static armarPlantillaActivacionCuentaManual(url: string): string {
    const content = `
      ${header('Activa tu cuenta')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Tu cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong> está lista.
            Para completar el proceso de registro y poder iniciar sesión, debes
            <strong style="color:${C.text};">activar tu cuenta</strong> haciendo clic en el
            botón a continuación.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            El enlace de activación tiene una vigencia limitada.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Activar mi cuenta', C.success)}

      <!-- Nota informativa -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.successLight};border:1px solid #a3d9b8;
                        border-left:4px solid ${C.success};border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <p style="margin:0;font-size:13px;line-height:1.55;color:#155226;">
                  Una vez activada tu cuenta podrás iniciar sesión con tu usuario y la
                  contraseña que registraste. Si tienes problemas para activar tu cuenta,
                  comunícate con el administrador del sistema.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${securityTips()}
    `
    return buildLayout(content)
  }
  // ─── Template 5: Código OTP / Verificación en dos pasos ──────────────────
  // Uso: login con 2FA habilitado
  static armarPlantillaOtp(codigo: string, expiracionMin: number): string {
    const digitos = codigo.split('')
    const bloqueDigitos = digitos
      .map(
        (d) =>
          `<td style="padding:0 5px;">
             <div style="width:44px;height:56px;line-height:56px;text-align:center;
                         background:${C.primaryLight};border:2px solid ${C.primary};
                         border-radius:8px;font-family:'Courier New',monospace;
                         font-size:28px;font-weight:700;color:${C.primary};">
               ${d}
             </div>
           </td>`
      )
      .join('')

    const content = `
      ${header('Código de verificación')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Para completar el inicio de sesión en el
            <strong style="color:${C.text};">Sistema FELCN</strong>,
            introduce el siguiente código de verificación.
          </p>

          <!-- Bloque de código OTP -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="margin-bottom:20px;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>${bloqueDigitos}</tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Vigencia -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:#fff8e1;border:1px solid #ffe082;border-left:4px solid #f9a825;
                        border-radius:10px;margin-bottom:20px;">
            <tr>
              <td style="padding:14px 16px;">
                <strong style="display:block;font-size:13px;color:#6d4c00;margin-bottom:4px;">
                  ⏱ Vigencia: ${expiracionMin} minutos
                </strong>
                <p style="margin:0;font-size:12.5px;line-height:1.55;color:#7a5500;">
                  Este código expirará en ${expiracionMin} minutos. Si no lo solicitaste tú,
                  ignora este mensaje — tu cuenta permanece segura.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Aviso de seguridad OTP -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.dangerLight};border:1px solid ${C.dangerBorder};
                        border-left:4px solid ${C.danger};border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <strong style="display:block;font-size:13px;color:#7b1e1e;margin-bottom:4px;">
                  ¿No fuiste tú?
                </strong>
                <p style="margin:0;font-size:12.5px;line-height:1.55;color:#8e2410;">
                  Si no iniciaste sesión en el Sistema FELCN, alguien puede estar intentando
                  acceder a tu cuenta. <strong>No compartas este código con nadie</strong>
                  — el personal de soporte nunca te lo pedirá. Contacta al administrador
                  de inmediato.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${securityTips()}
    `
    return buildLayout(content)
  }
}

// ─── Helpers privados de construcción HTML ────────────────────────────────────

function buildLayout(content: string): string {
  return `<!doctype html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <style>
    @media only screen and (max-width:620px){
      .container{width:100%!important;}
      .px{padding-left:18px!important;padding-right:18px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.bg};
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
             color:${C.text};">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
         style="background:${C.bg};">
    <tr><td align="center" style="padding:32px 16px;">

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"
             class="container"
             style="width:600px;max-width:600px;background:${C.white};border-radius:12px;
                    overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.07);">

        <!-- Barra de marca FELCN -->
        <tr>
          <td class="px"
              style="padding:20px 28px;border-bottom:1px solid ${C.border};background:#fafbfc;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td valign="middle">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle" style="padding-right:12px;">
                        <table role="presentation" width="40" height="40" cellpadding="0"
                               cellspacing="0" border="0"
                               style="width:40px;height:40px;border-radius:8px;background:${C.primary};">
                          <tr><td align="center" valign="middle"
                                  style="text-align:center;font:bold 13px/40px Arial,sans-serif;
                                         color:${C.white};">FELCN</td></tr>
                        </table>
                      </td>
                      <td valign="middle" style="line-height:1.2;">
                        <div style="font-size:14px;font-weight:600;color:${C.text};">
                          FELCN — Sistema de Autenticación
                        </div>
                        <div style="font-size:10.5px;color:${C.textMuted};text-transform:uppercase;
                                    letter-spacing:.06em;">
                          Fuerza Especial de Lucha Contra el Narcotráfico · Bolivia
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${content}

        <!-- Soporte -->
        <tr>
          <td class="px" style="padding:0 28px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="background:#f5f6fa;border-left:3px solid ${C.primary};border-radius:4px;">
              <tr>
                <td style="padding:12px 14px;">
                  <strong style="display:block;font-size:13px;margin-bottom:4px;color:${C.text};">
                    ¿Necesitas ayuda?
                  </strong>
                  <p style="margin:0;font-size:12.5px;color:${C.textMuted};">
                    Comunícate con el administrador del sistema o con el área de soporte técnico
                    de tu unidad.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer legal -->
        <tr>
          <td class="px"
              style="padding:18px 28px;background:#f5f6fa;border-top:1px solid ${C.border};
                     color:${C.textMuted};font-size:11.5px;line-height:1.55;">
            <p style="margin:0 0 8px;">
              Este es un correo automático generado por el Sistema de Autenticación FELCN.
              Por favor no respondas a este mensaje.
            </p>
            <p style="margin:0;font-size:11px;color:#7a8298;">
              Fuerza Especial de Lucha Contra el Narcotráfico (FELCN) · Bolivia
              &copy; ${YEAR}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function header(titulo: string): string {
  return `
  <tr>
    <td class="px" style="padding:28px 28px 8px;">
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:${C.text};letter-spacing:-.01em;">
        ${titulo}
      </h1>
      <div style="width:40px;height:3px;background:${C.primary};border-radius:2px;"></div>
    </td>
  </tr>`
}

function ctaButton(url: string, label: string, color: string = C.primary): string {
  return `
  <tr>
    <td class="px" style="padding:0 28px 22px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:8px;background:${color};">
            <a href="${url}"
               style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;
                      color:#ffffff;text-decoration:none;border-radius:8px;
                      background:${color};mso-padding-alt:0;text-align:center;">
              ${label} →
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:10px 0 0;font-size:12px;color:${C.textMuted};">
        Si el botón no funciona, copia y pega esta URL en tu navegador:<br>
        <a href="${url}" style="color:${color};word-break:break-all;">${url}</a>
      </p>
    </td>
  </tr>`
}

function securityTips(): string {
  return `
  <tr>
    <td class="px" style="padding:0 28px 28px;">
      <h2 style="margin:0 0 10px;font:600 11px/1.2 Arial,sans-serif;letter-spacing:.05em;
                 text-transform:uppercase;color:${C.primary};">
        🔒 Recomendaciones de seguridad
      </h2>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="font-size:12.5px;line-height:1.6;color:${C.textMuted};">
        <tr><td style="padding:3px 0;">✓ &nbsp; Nunca compartas tus credenciales con otras personas.</td></tr>
        <tr><td style="padding:3px 0;">✓ &nbsp; El personal de soporte <strong>nunca</strong> te pedirá tu contraseña.</td></tr>
        <tr><td style="padding:3px 0;">✓ &nbsp; Cierra sesión siempre que uses equipos compartidos.</td></tr>
      </table>
    </td>
  </tr>`
}
