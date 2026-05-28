/* global React, Icon, BrandMark */

// ── Email Preview ───────────────────────────────────────────────────────────
// Diseño del correo de verificación que se envía al usuario.
// Aplica buenas prácticas de la industria (anti-phishing, accesibilidad,
// soporte de clientes legacy con HTML inline-style).

function EmailPreview({ t }) {
  const [copied, setCopied] = React.useState(false);
  const code = '444290';
  const recipient = 'einstein@gmail.com';
  const userName = 'Einstein Montero Churata';
  const requestTime = '15/05/2026 · 01:25:42 (UTC-4)';
  const expiresAt   = '15/05/2026 · 01:28:12 (UTC-4)';
  const ttl = '2 minutos y 30 segundos';

  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="app" data-accent={t.accent}>
      <header className="topbar">
        <div className="brand">
          <BrandMark />
          <div className="brand-text">
            <strong>Identidad Digital</strong>
            <span>Vista previa del correo</span>
          </div>
        </div>
        <div className="top-actions">
          <button className="lang-pill" type="button"><Icon.Lang width="16" height="16"/><span>Español</span></button>
          <button className="icon-btn" type="button" aria-label="Ayuda"><Icon.Help width="20" height="20"/></button>
        </div>
      </header>

      <main className="stage email-stage">
        {/* Cliente de correo (chrome decorativo) */}
        <div className="mail-client">
          <div className="mail-toolbar">
            <div className="mail-tabs">
              <span className="mail-tab active"><Icon.Mail width="13" height="13"/> Recibidos</span>
              <span className="mail-tab">Enviados</span>
              <span className="mail-tab">Spam</span>
            </div>
            <div className="mail-tool-icons">
              <span className="mail-tool-icon" aria-hidden="true">⤓</span>
              <span className="mail-tool-icon" aria-hidden="true">⤤</span>
              <span className="mail-tool-icon" aria-hidden="true">⋯</span>
            </div>
          </div>

          {/* Cabecera del mensaje */}
          <div className="mail-header">
            <div className="mail-subject">
              <span className="mail-codetag" aria-hidden="true">{code}</span>
              <h2>Tu código de verificación es <code>{code}</code> · Identidad Digital</h2>
            </div>
            <div className="mail-meta">
              <div className="mail-avatar" aria-hidden="true">ID</div>
              <div className="mail-from">
                <div className="mail-from-line">
                  <strong>Identidad Digital</strong>
                  <span className="mail-addr">&lt;noreply@identidad-digital.gob.bo&gt;</span>
                  <span className="mail-verified" title="Dominio verificado (DKIM + SPF + DMARC)">
                    <Icon.CheckCircle width="14" height="14"/> Verificado
                  </span>
                </div>
                <div className="mail-to">
                  para <strong>{recipient}</strong> · <time>01:25 AM (hace 4 seg.)</time>
                </div>
              </div>
              <div className="mail-actions">
                <button className="mail-action" type="button" aria-label="Responder">↩</button>
                <button className="mail-action" type="button" aria-label="Reenviar">↪</button>
                <button className="mail-action" type="button" aria-label="Más">⋯</button>
              </div>
            </div>
          </div>

          {/* Cuerpo del correo */}
          <div className="mail-body" role="article" aria-label="Cuerpo del correo">
            {/* Header del correo (branding) */}
            <div className="email-render">
              <div className="email-brandbar">
                <div className="email-brand">
                  <span className="email-brand-mark"><BrandMark size={32}/></span>
                  <div className="email-brand-text">
                    <strong>Identidad Digital</strong>
                    <span>Plataforma del Estado</span>
                  </div>
                </div>
                <span className="email-brand-env">Ambiente: Developer</span>
              </div>

              {/* Saludo */}
              <h1 className="email-h1">Hola, {userName.split(' ')[0]} 👋</h1>
              <p className="email-lede">
                Recibimos una solicitud para iniciar sesión en tu cuenta de <strong>Identidad Digital</strong>.
                Usa este código para confirmar que fuiste tú:
              </p>

              {/* Bloque del código */}
              <div className="email-code-block">
                <div className="email-code-label">CÓDIGO DE VERIFICACIÓN</div>
                <div className="email-code-row">
                  <div className="email-code" aria-label={`Código: ${code.split('').join(' ')}`}>
                    {code.split('').map((d, i) => <span key={i}>{d}</span>)}
                  </div>
                  <button type="button" className="email-copy" onClick={copy} aria-live="polite">
                    {copied ? <><Icon.Check width="14" height="14"/> Copiado</>
                            : <><Icon.Copy width="14" height="14"/> Copiar</>}
                  </button>
                </div>
                <div className="email-code-ttl">
                  <Icon.Clock width="13" height="13"/>
                  Expira en <strong>{ttl}</strong> ({expiresAt}).
                </div>
              </div>

              {/* Detalles del intento — anti-phishing */}
              <div className="email-section">
                <h2 className="email-h2"><Icon.Shield width="15" height="15"/> Detalles de la solicitud</h2>
                <table className="email-details" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr><th>Fecha y hora</th><td>{requestTime}</td></tr>
                    <tr><th>Dispositivo</th><td>Chrome 142 · macOS 15.4</td></tr>
                    <tr><th>Dirección IP</th><td>200.105.241.184</td></tr>
                    <tr><th>Ubicación aprox.</th><td>La Paz, Bolivia</td></tr>
                    <tr><th>Aplicación</th><td>Portal Ciudadano (Developer)</td></tr>
                  </tbody>
                </table>
              </div>

              {/* ¿No fuiste tú? CTA destacado */}
              <div className="email-alert">
                <Icon.Alert width="18" height="18"/>
                <div>
                  <strong>¿No reconoces esta actividad?</strong>
                  <p>
                    Si tú <u>no</u> intentaste iniciar sesión, <strong>no uses este código</strong>.
                    Tu cuenta podría estar en riesgo. Repórtalo de inmediato:
                  </p>
                  <a href="#" className="email-btn-danger">No fui yo — Bloquear mi cuenta</a>
                  <p className="email-mini">
                    Esto cierra todas las sesiones activas y exige que cambies la contraseña
                    antes de volver a entrar.
                  </p>
                </div>
              </div>

              {/* Buenas prácticas / disclaimer de seguridad */}
              <div className="email-tips">
                <h2 className="email-h2"><Icon.ShieldLock width="15" height="15"/> Importante para tu seguridad</h2>
                <ul>
                  <li>
                    <span className="tip-bullet ok"><Icon.Check width="11" height="11"/></span>
                    Este código es <strong>personal e intransferible</strong>. Nunca lo compartas — ni con familiares, soporte técnico o personal del Estado.
                  </li>
                  <li>
                    <span className="tip-bullet ok"><Icon.Check width="11" height="11"/></span>
                    <strong>Nunca</strong> te pediremos este código por teléfono, WhatsApp, SMS ni redes sociales.
                  </li>
                  <li>
                    <span className="tip-bullet ok"><Icon.Check width="11" height="11"/></span>
                    Solo ingrésalo en <code>https://identidad-digital.gob.bo</code>. Verifica el candado 🔒 y el dominio antes de teclearlo.
                  </li>
                  <li>
                    <span className="tip-bullet ok"><Icon.Check width="11" height="11"/></span>
                    Este correo es <strong>transaccional automático</strong>. No respondas a esta dirección.
                  </li>
                </ul>
              </div>

              {/* Soporte */}
              <div className="email-support">
                <strong>¿Necesitas ayuda?</strong>
                <p>
                  Escríbenos a <a href="mailto:soporte@identidad-digital.gob.bo">soporte@identidad-digital.gob.bo</a> o
                  llama al <a href="tel:+59180010101">800-10-1010</a> (lunes a viernes, 8:00 – 18:00).
                </p>
              </div>

              {/* Despedida */}
              <p className="email-sign">
                Gracias por usar Identidad Digital.<br/>
                <strong>Equipo de Identidad Digital — AGETIC</strong>
              </p>

              {/* Footer legal */}
              <div className="email-footer">
                <p>
                  Recibes este correo porque alguien intentó iniciar sesión con la cuenta
                  asociada a <strong>{recipient}</strong>. Si crees que se trata de un error,
                  ignora este mensaje o repórtalo arriba.
                </p>
                <div className="email-footer-links">
                  <a href="#">Política de privacidad</a>
                  <span>·</span>
                  <a href="#">Términos de uso</a>
                  <span>·</span>
                  <a href="#">Sobre la firma del correo</a>
                </div>
                <p className="email-footer-addr">
                  AGETIC — Agencia de Gobierno Electrónico y Tecnologías de Información y Comunicación<br/>
                  Av. Camacho 1485, La Paz — Bolivia · © 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral: notas de implementación para devs */}
        <aside className="email-notes" aria-label="Notas de implementación">
          <h3>Buenas prácticas aplicadas</h3>
          <ol>
            <li><strong>Asunto con el código.</strong> Algunos clientes (Gmail/iOS Mail) lo extraen para auto-completar OTP sin abrir el correo.</li>
            <li><strong>Remitente verificado.</strong> Dominio configurado con <code>SPF</code>, <code>DKIM</code> y <code>DMARC</code> en política <code>reject</code>.</li>
            <li><strong>Sin enlaces de login.</strong> El correo no contiene un botón "Iniciar sesión" — solo un código. Reduce phishing por suplantación.</li>
            <li><strong>Código grande y monoespaciado.</strong> Fácil de leer y copiar incluso para usuarios mayores.</li>
            <li><strong>Vigencia explícita.</strong> Hora exacta de expiración + duración relativa.</li>
            <li><strong>Contexto del intento.</strong> Fecha, dispositivo, IP, ubicación aproximada — el usuario verifica que fue él.</li>
            <li><strong>Acción "No fui yo" prominente.</strong> Botón rojo que bloquea la cuenta inmediatamente.</li>
            <li><strong>Disclaimers de seguridad.</strong> "Nunca compartas el código", "Nunca te pediremos esto por teléfono", verificar el dominio.</li>
            <li><strong>Sin tracking pixels.</strong> Correos transaccionales no deben perfilar al usuario.</li>
            <li><strong>HTML accesible.</strong> Contraste AA, jerarquía con &lt;h1&gt;/&lt;h2&gt;, alt text, código con aria-label dígito-a-dígito.</li>
            <li><strong>Plain-text fallback.</strong> El correo se envía multipart con versión texto plano para clientes legacy.</li>
            <li><strong>Sin "responder a noreply".</strong> Se indica explícitamente y se da un canal de soporte real.</li>
            <li><strong>Ancho fijo 600 px.</strong> Estándar para clientes legacy (Outlook). Responsive con media query.</li>
            <li><strong>Inline styles.</strong> En producción usa CSS inlined (no <code>&lt;style&gt;</code>) para Outlook/Gmail.</li>
          </ol>
          <div className="email-tech">
            <h4>Headers recomendados</h4>
            <pre>{`From: Identidad Digital <noreply@identidad-digital.gob.bo>
Reply-To: soporte@identidad-digital.gob.bo
Subject: Tu código de verificación es 444290
List-Unsubscribe: <mailto:unsub@…>, <https://…>
X-Auto-Response-Suppress: All
Auto-Submitted: auto-generated
Precedence: bulk
X-Mailer: identidad-digital/2.4`}</pre>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <span>AGETIC 2026</span>
        <span className="sep">·</span>
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
        <a href="#">Estado del servicio</a>
      </footer>
    </div>
  );
}

// ── Loading Overlay bloqueante ──────────────────────────────────────────────
function LoadingOverlay({ visible, label = 'Procesando…' }) {
  return (
    <div className={`load-overlay ${visible ? 'show' : ''}`} aria-hidden={!visible} role="dialog" aria-live="polite">
      <div className="load-card">
        <div className="load-rings" aria-hidden="true">
          <span/><span/><span/>
        </div>
        <div className="load-brand">
          <BrandMark size={20}/>
          <strong>Identidad Digital</strong>
        </div>
        <div className="load-label">{label}</div>
        <div className="load-bar"><i/></div>
      </div>
    </div>
  );
}

window.EmailPreview   = EmailPreview;
window.LoadingOverlay = LoadingOverlay;
