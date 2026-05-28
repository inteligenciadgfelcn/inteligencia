/* global React, Icon, BrandMark */

// ── Pantalla de Verificación (OTP / 2FA) ─────────────────────────────────────
function VerificationScreen({ t, onCancel, onSuccess }) {
  // Email simulado del usuario; en producción viene del backend
  const fullEmail = 'einstein@gmail.com';
  // Enmascarado útil: muestra primeras 2 letras + asteriscos por longitud real + dominio completo
  const maskEmail = (e) => {
    const [local, domain] = e.split('@');
    const visible = local.slice(0, 2);
    const masked = '•'.repeat(Math.max(2, local.length - 2));
    return `${visible}${masked}@${domain}`;
  };
  const maskedEmail = maskEmail(fullEmail);

  const LENGTH = 6;
  const [digits, setDigits] = React.useState(Array(LENGTH).fill(''));
  const [error, setError] = React.useState('');
  const [verifying, setVerifying] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [trust, setTrust] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(121);
  const [channel, setChannel] = React.useState('email');
  const [showChannelSwitch, setShowChannelSwitch] = React.useState(false);
  const inputsRef = React.useRef([]);

  // Demo states forzados desde Tweaks
  React.useEffect(() => {
    if (t.verifyState === 'error')        { setError('El código no es correcto. Te quedan 2 intentos.'); setVerifying(false); setSuccess(false); }
    else if (t.verifyState === 'expired') { setError('Este código expiró. Solicita uno nuevo.'); setVerifying(false); setSuccess(false); }
    else if (t.verifyState === 'verifying'){ setVerifying(true); setError(''); setSuccess(false); }
    else if (t.verifyState === 'success') { setSuccess(true); setVerifying(false); setError(''); setDigits('123456'.split('')); }
    else                                   { setError(''); setVerifying(false); setSuccess(false); }
  }, [t.verifyState]);

  // Auto-focus primer input al montar
  React.useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Countdown del reenvío (MM:SS)
  React.useEffect(() => {
    if (resendIn === 0) {
      // Tras la primera expiración del countdown, ofrecer canal alterno
      setShowChannelSwitch(true);
      return;
    }
    const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const handleChange = (i, raw) => {
    if (success || verifying) return;
    setError('');
    // Soporte de pegar 6 dígitos
    if (raw.length > 1) {
      const cleaned = raw.replace(/\D/g, '').slice(0, LENGTH);
      if (!cleaned) return;
      const next = Array(LENGTH).fill('');
      for (let k = 0; k < cleaned.length; k++) next[k] = cleaned[k];
      setDigits(next);
      const focusAt = Math.min(cleaned.length, LENGTH - 1);
      inputsRef.current[focusAt]?.focus();
      if (cleaned.length === LENGTH) attemptVerify(next.join(''));
      return;
    }
    const v = raw.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < LENGTH - 1) inputsRef.current[i + 1]?.focus();
    if (next.every((d) => d.length === 1)) attemptVerify(next.join(''));
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
      const next = [...digits]; next[i - 1] = ''; setDigits(next);
    }
    if (e.key === 'ArrowLeft' && i > 0)  inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const attemptVerify = (code) => {
    if (t.verifyState !== 'idle') return; // estados forzados desde tweaks tienen prioridad
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (code === '123456') { setSuccess(true); setTimeout(() => onSuccess?.(), 1100); }
      else { setError('El código no es correcto. Te quedan 2 intentos.'); }
    }, 900);
  };

  const resend = () => {
    setResendIn(121);
    setDigits(Array(LENGTH).fill(''));
    setError('');
    inputsRef.current[0]?.focus();
  };
  const switchToSms = () => { setChannel('sms'); resend(); };

  const mm = String(Math.floor(resendIn / 60)).padStart(2, '0');
  const ss = String(resendIn % 60).padStart(2, '0');
  const filled = digits.every((d) => d.length === 1);

  return (
    <div className="app" data-accent={t.accent}>
      <header className="topbar">
        <div className="brand">
          <BrandMark />
          <div className="brand-text">
            <strong>Identidad Digital</strong>
            <span>Plataforma del Estado</span>
          </div>
        </div>
        <div className="top-actions">
          <button className="lang-pill" type="button"><Icon.Lang width="16" height="16"/><span>Español</span></button>
          <button className="icon-btn" type="button" aria-label="Ayuda"><Icon.Help width="20" height="20"/></button>
        </div>
      </header>

      <main className="stage">
        <div className="card v-card">
          {/* Header de la pantalla */}
          <div className="v-head">
            <div className="v-step">
              <span className="step-pill done">1 · Credenciales</span>
              <span className="step-line"/>
              <span className="step-pill active">2 · Verificación</span>
            </div>
            <h1>Verificación en dos pasos</h1>
            <p>Para proteger tu cuenta, confirma que esta solicitud es tuya.</p>
          </div>

          {/* Banner de canal: email o SMS */}
          <div className={`v-channel ${channel === 'sms' ? 'is-sms' : ''}`}>
            <div className="v-channel-icon" aria-hidden="true">
              {channel === 'email' ? <Icon.Mail width="22" height="22"/> : <Icon.Phone width="22" height="22"/>}
            </div>
            <div className="v-channel-body">
              <div className="v-channel-label">
                {channel === 'email' ? 'Enviado por correo electrónico a' : 'Enviado por SMS al'}
              </div>
              <div className="v-channel-addr">
                <strong>{channel === 'email' ? maskedEmail : '+591 7•• ••1 234'}</strong>
                <button type="button" className="v-edit" onClick={onCancel} aria-label="Cambiar destino">
                  <Icon.Edit width="13" height="13"/> No es mío
                </button>
              </div>
            </div>
          </div>

          {/* Info del intento — anti-phishing */}
          {t.showRequestInfo && (
            <div className="v-request-info">
              <Icon.Shield width="14" height="14"/>
              <span>Solicitud desde <strong>Chrome · macOS</strong> en <strong>La Paz, BO</strong> · hace pocos segundos.</span>
            </div>
          )}

          {/* OTP input */}
          <div className="v-otp-block">
            <label className="v-otp-label" htmlFor="otp-0">
              Ingresa el código de 6 dígitos
              {t.helpHints && (
                <span className="v-otp-meta">Puedes pegar el código completo</span>
              )}
            </label>
            <div
              className={`v-otp ${error ? 'has-error' : ''} ${success ? 'is-success' : ''} ${verifying ? 'is-busy' : ''}`}
              role="group"
              aria-label="Código de verificación de 6 dígitos"
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={(el) => (inputsRef.current[i] = el)}
                  inputMode="numeric"
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  pattern="[0-9]*"
                  maxLength={i === 0 ? LENGTH : 1}
                  value={d}
                  disabled={verifying || success}
                  aria-label={`Dígito ${i + 1} de ${LENGTH}`}
                  aria-invalid={!!error}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            {/* Estado debajo del OTP */}
            {success ? (
              <div className="v-status ok" role="status">
                <Icon.CheckCircle width="16" height="16"/>
                <span>Verificado. Redirigiendo…</span>
              </div>
            ) : verifying ? (
              <div className="v-status" role="status">
                <Icon.Spin className="spin" width="14" height="14"/>
                <span>Verificando código…</span>
              </div>
            ) : error ? (
              <div className="v-status err" role="alert">
                <Icon.Alert width="14" height="14"/>
                <span>{error}</span>
              </div>
            ) : (
              <div className="v-status muted">
                <span>Se completará automáticamente al ingresar los 6 dígitos.</span>
              </div>
            )}
          </div>

          {/* Reenvío + canal alterno */}
          <div className="v-resend">
            <span className="muted-line">¿No te llegó?</span>
            {resendIn > 0 ? (
              <span className="v-resend-wait">
                Podrás reenviarlo en <strong>{mm}:{ss}</strong>
              </span>
            ) : (
              <button type="button" className="v-link" onClick={resend}>
                <Icon.Refresh width="13" height="13"/> Volver a enviar el código
              </button>
            )}
            {showChannelSwitch && channel === 'email' && (
              <button type="button" className="v-link alt" onClick={switchToSms}>
                <Icon.Phone width="13" height="13"/> Recibir por SMS
              </button>
            )}
          </div>

          {/* Trust device */}
          <label className="check v-trust">
            <input type="checkbox" checked={trust} onChange={(e) => setTrust(e.target.checked)} />
            <span className="check-box" aria-hidden="true"><Icon.Check width="11" height="11"/></span>
            <span>
              Confiar en este dispositivo por 30 días
              <em className="v-trust-hint">No se pedirá este código en próximos ingresos desde aquí.</em>
            </span>
          </label>

          {/* Acciones */}
          <div className="actions v-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
            <button
              type="button"
              className="btn-primary"
              disabled={!filled || verifying || success}
              onClick={() => attemptVerify(digits.join(''))}
              aria-busy={verifying}
            >
              {verifying ? <><Icon.Spin className="spin" width="16" height="16"/> Verificando…</>
                         : success ? <><Icon.Check width="16" height="16"/> Listo</>
                         : <>Continuar <Icon.Arrow width="16" height="16"/></>}
            </button>
          </div>

          {/* Ayuda adicional */}
          <div className="v-help-foot">
            <Icon.Help width="14" height="14"/>
            <span>
              ¿Sigues sin recibir el código?
              <a href="#"> Usa la app autenticadora</a> o
              <a href="#"> contacta soporte</a>.
            </span>
          </div>
        </div>
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

window.VerificationScreen = VerificationScreen;
