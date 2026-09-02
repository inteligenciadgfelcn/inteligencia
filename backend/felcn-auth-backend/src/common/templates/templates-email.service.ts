const YEAR = new Date().getFullYear()

// ─── Colores institucionales FELCN ────────────────────────────────────────────
const C = {
  primary: '#1B3A6B', // azul marino institucional
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

// Todos los correos usan un registro formal (tratamiento de "usted") y un tono
// institucional/ejecutivo. No emplear voseo ("vos", "debés") ni tuteo informal
// ("haz clic", "ignora") en ningún texto de estas plantillas.

export class TemplateEmailService {
  // ─── Template 2: Bloqueo por intentos fallidos ────────────────────────────
  // Uso: autenticación → demasiados intentos fallidos
  static armarPlantillaBloqueoCuenta(url: string): string {
    const content = `
      ${header('Cuenta bloqueada temporalmente')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Su cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong> ha sido
            <strong style="color:${C.danger};">bloqueada temporalmente</strong> debido a que se
            detectaron múltiples intentos fallidos de inicio de sesión.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Si usted originó estos intentos, utilice el botón a continuación para desbloquear
            su cuenta de forma segura.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Desbloquear la cuenta', C.danger)}

      <!-- Aviso de seguridad -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.dangerLight};border:1px solid ${C.dangerBorder};
                        border-left:4px solid ${C.danger};border-radius:10px;">
            <tr>
              <td style="padding:16px 18px;">
                <strong style="display:block;font-size:14px;color:#7b1e1e;margin-bottom:6px;">
                  ¿No reconoce esta actividad?
                </strong>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#8e2410;">
                  Si no reconoce estos intentos de inicio de sesión, es posible que un tercero
                  esté intentando acceder a su cuenta. <strong>No utilice el enlace anterior</strong>
                  y comuníquese de inmediato con el administrador del sistema para resguardar su cuenta.
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
            Hemos recibido una solicitud para <strong style="color:${C.text};">restablecer la contraseña</strong>
            de su cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong>.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Utilice el botón a continuación para definir una nueva contraseña. El enlace tiene
            una vigencia limitada por razones de seguridad.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Restablecer la contraseña')}

      <!-- Si no fue el titular -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.dangerLight};border:1px solid ${C.dangerBorder};
                        border-left:4px solid ${C.danger};border-radius:10px;">
            <tr>
              <td style="padding:16px 18px;">
                <strong style="display:block;font-size:14px;color:#7b1e1e;margin-bottom:6px;">
                  ¿No solicitó este cambio?
                </strong>
                <p style="margin:0;font-size:13px;line-height:1.55;color:#8e2410;">
                  Si usted <u>no</u> solicitó restablecer su contraseña, puede ignorar este
                  correo; su contraseña actual no se modificará. Si considera que su cuenta
                  podría estar en riesgo, comuníquese con el administrador del sistema.
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
      ${header('Active su cuenta')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Su cuenta en el <strong style="color:${C.text};">Sistema FELCN</strong> se encuentra
            habilitada. Para completar el proceso de registro y poder iniciar sesión, debe
            <strong style="color:${C.text};">activar su cuenta</strong> utilizando el
            botón a continuación.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            El enlace de activación tiene una vigencia limitada.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Activar la cuenta', C.success)}

      <!-- Nota informativa -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.successLight};border:1px solid #a3d9b8;
                        border-left:4px solid ${C.success};border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <p style="margin:0;font-size:13px;line-height:1.55;color:#155226;">
                  Una vez activada su cuenta, podrá iniciar sesión con su usuario y la
                  contraseña que registró. Si presenta inconvenientes durante la activación,
                  comuníquese con el administrador del sistema.
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

  // ─── Template 4b: Activación de cuenta creada por un administrador ───────
  // Uso: alta de usuario desde el panel de administración
  static armarPlantillaActivacionCuentaPorAdmin(url: string): string {
    const content = `
      ${header('Active su cuenta')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Un administrador ha creado una cuenta a su nombre en el
            <strong style="color:${C.text};">Sistema FELCN</strong>.
            Para poder iniciar sesión, primero debe
            <strong style="color:${C.text};">activar su cuenta y definir una
            contraseña personal</strong> utilizando el botón a continuación.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Activar la cuenta', C.success)}

      <!-- Nota informativa -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:${C.successLight};border:1px solid #a3d9b8;
                        border-left:4px solid ${C.success};border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <p style="margin:0;font-size:13px;line-height:1.55;color:#155226;">
                  Una vez activada su cuenta, podrá iniciar sesión con su usuario y la
                  contraseña que defina. Si presenta inconvenientes durante la activación,
                  comuníquese con el administrador del sistema.
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
    const content = `
      ${header('Código de verificación')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Para completar el inicio de sesión en el
            <strong style="color:${C.text};">Sistema FELCN</strong>,
            utilice el siguiente código de verificación.
          </p>

          <!-- Bloque de código OTP: un solo nodo de texto, seleccionable/copiable
               de una — separarlo en celdas por dígito rompe el copiado en la
               mayoría de clientes de correo (inserta espacios/saltos de línea). -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="margin-bottom:20px;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="padding:10px 22px;background:${C.successLight};
                               border:1px solid ${C.success};border-radius:6px;">
                      <span style="font-family:'Courier New',monospace;font-size:24px;
                                   font-weight:700;letter-spacing:6px;color:${C.success};">
                        ${codigo}
                      </span>
                    </td>
                  </tr>
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
                  Este código expirará en ${expiracionMin} minutos. Si usted no solicitó este
                  inicio de sesión, puede ignorar este mensaje; su cuenta permanece segura.
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
                  ¿No reconoce esta actividad?
                </strong>
                <p style="margin:0;font-size:12.5px;line-height:1.55;color:#8e2410;">
                  Si usted no inició sesión en el Sistema FELCN, un tercero podría estar
                  intentando acceder a su cuenta. <strong>No comparta este código con nadie.</strong>
                  El personal de soporte nunca se lo solicitará. Comuníquese de inmediato
                  con el administrador.
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

  // ─── Template 6: Acceso al formulario de preregistro ─────────────────────
  // Uso: paso 1 del autorregistro — solo se solicitó un correo, este es el
  // único correo que revela el link al formulario detallado.
  static armarPlantillaSolicitudAccesoRegistro(url: string, expiracionMin: number): string {
    const content = `
      ${header('Complete su preregistro')}

      <tr>
        <td class="px" style="padding:0 28px 18px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Hemos recibido una solicitud para iniciar un
            <strong style="color:${C.text};">preregistro</strong> en el
            <strong style="color:${C.text};">Sistema FELCN</strong> con esta dirección de correo electrónico.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Utilice el botón a continuación para completar el formulario con sus datos. Su
            solicitud quedará pendiente de revisión por parte de un administrador.
          </p>
        </td>
      </tr>

      ${ctaButton(url, 'Completar el preregistro')}

      <!-- Vigencia -->
      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="background:#fff8e1;border:1px solid #ffe082;border-left:4px solid #f9a825;
                        border-radius:10px;">
            <tr>
              <td style="padding:14px 16px;">
                <strong style="display:block;font-size:13px;color:#6d4c00;margin-bottom:4px;">
                  ⏱ Vigencia: ${expiracionMin} minutos
                </strong>
                <p style="margin:0;font-size:12.5px;line-height:1.55;color:#7a5500;">
                  Este enlace expirará en ${expiracionMin} minutos. Si usted no solicitó este
                  preregistro, puede ignorar este mensaje.
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

  // ─── Template 7: Cuenta ya existente detectada en preregistro ────────────
  // Uso: paso 2 del autorregistro — el documento o correo ya pertenecen a
  // una cuenta real, o ya hay una solicitud pendiente con esos mismos datos;
  // no se crea ninguna solicitud nueva, solo se avisa por correo.
  static armarPlantillaCuentaYaExiste(): string {
    const content = `
      ${header('Ya existe un registro con estos datos')}

      <tr>
        <td class="px" style="padding:0 28px 22px;">
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Hemos detectado que ya existe una cuenta, o una solicitud de registro
            pendiente de revisión, en el
            <strong style="color:${C.text};">Sistema FELCN</strong> asociada a los datos
            ingresados en este preregistro.
          </p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${C.textMuted};">
            Si considera que se trata de un error, o si no reconoce dicha cuenta o solicitud,
            comuníquese con el administrador del sistema para que revise su caso.
          </p>
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
                    ¿Necesita ayuda?
                  </strong>
                  <p style="margin:0;font-size:12.5px;color:${C.textMuted};">
                    Comuníquese con el administrador del sistema o con el área de soporte técnico
                    de su unidad.
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
              Por favor, no responda a este mensaje.
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

function ctaButton(
  url: string,
  label: string,
  color: string = C.primary
): string {
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
        Si el botón no funciona, copie y pegue esta URL en su navegador:<br>
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
        <tr><td style="padding:3px 0;">✓ &nbsp; Nunca comparta sus credenciales con otras personas.</td></tr>
        <tr><td style="padding:3px 0;">✓ &nbsp; El personal de soporte <strong>nunca</strong> le solicitará su contraseña.</td></tr>
        <tr><td style="padding:3px 0;">✓ &nbsp; Cierre la sesión siempre que utilice equipos compartidos.</td></tr>
      </table>
    </td>
  </tr>`
}
