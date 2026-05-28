/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakColor */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "screen": "login",
  "inlineValidation": true,
  "capsLockWarning": true,
  "qrCountdown": true,
  "trustDevice": true,
  "visibleLanguage": true,
  "helpHints": true,
  "showRequestInfo": true,
  "annotations": false,
  "highContrast": false,
  "accent": "indigo",
  "demoState": "idle",
  "verifyState": "idle"
}/*EDITMODE-END*/;

// ── Iconos inline (pequeños y sin libs) ──────────────────────────────────────
const Icon = {
  Eye:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3l18 18"/><path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a17.5 17.5 0 0 1-3.4 4"/><path d="M6.6 6.6A17.6 17.6 0 0 0 2 12s3.5 6 10 6a10.5 10.5 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>,
  Help:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1.5 1-1.5 2"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>,
  Lang:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
  Check:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>,
  Alert:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5M12 18v.5"/></svg>,
  Refresh:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></svg>,
  Spin:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M21 12a9 9 0 1 1-3.2-6.9" /></svg>,
  Caps:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 4 12h4v6h8v-6h4Z"/></svg>,
  Phone:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>,
  Shield: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 4.5 3.3 8 8 9 4.7-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/></svg>,
  Arrow:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  Mail:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  Edit:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4l6 6L9 21H3v-6Z"/><path d="m13 5 6 6"/></svg>,
  CheckCircle:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>,
  Copy:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>,
  Clock:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  ShieldLock:(p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 4.5 3.3 8 8 9 4.7-1 8-4.5 8-9V6Z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10.5 11V9.5a1.5 1.5 0 1 1 3 0V11"/></svg>,
};

window.Icon = Icon;
window.BrandMark = BrandMark;

// QR placeholder — patrón determinista para que parezca un QR real
function QRPattern({ size = 200, seed = 0 }) {
  const cells = 25;
  const c = size / cells;
  const rng = (i) => {
    const x = Math.sin((i + 1) * (seed + 1) * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const isFinder = (x, y) => (
    (x < 7 && y < 7) || (x >= cells - 7 && y < 7) || (x < 7 && y >= cells - 7)
  );
  const isFinderRing = (x, y) => {
    const inBox = (bx, by) => x >= bx && x < bx + 7 && y >= by && y < by + 7;
    const corners = [[0,0],[cells-7,0],[0,cells-7]];
    return corners.some(([bx,by]) => inBox(bx,by) && (
      x === bx || y === by || x === bx+6 || y === by+6 ||
      (x >= bx+2 && x <= bx+4 && y >= by+2 && y <= by+4)
    ));
  };
  const rects = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (isFinder(x, y)) {
        if (isFinderRing(x, y)) rects.push(<rect key={x+'-'+y} x={x*c} y={y*c} width={c} height={c} fill="#0a0a0a"/>);
      } else if (rng(x*cells + y) > 0.55) {
        rects.push(<rect key={x+'-'+y} x={x*c} y={y*c} width={c} height={c} fill="#0a0a0a"/>);
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{display:'block'}}>
      <rect width={size} height={size} fill="#ffffff"/>
      {rects}
      {/* logo centrado */}
      <circle cx={size/2} cy={size/2} r={size*0.11} fill="#ffffff"/>
      <circle cx={size/2} cy={size/2} r={size*0.085} fill="none" stroke="var(--accent-fg)" strokeWidth="3"/>
      <circle cx={size/2} cy={size/2} r={size*0.03} fill="var(--accent-fg)"/>
    </svg>
  );
}

// ── Logo genérico (no recrea ninguna marca específica) ──────────────────────
function BrandMark({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="8"  fill="none" stroke="currentColor" strokeWidth="2" opacity=".55"/>
      <circle cx="16" cy="16" r="3"  fill="currentColor"/>
    </svg>
  );
}

// ── Popover de ayuda para la CI ─────────────────────────────────────────────
// Diagrama GENÉRICO de tarjeta de identidad (no recrea el diseño oficial),
// con anotaciones que indican dónde está el "Número" y el "Complemento".
function CIHelpPopover() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <span className="ci-help" ref={ref}>
      <button
        type="button"
        className="ci-help-trigger"
        aria-expanded={open}
        aria-label="¿Dónde encuentro mi número de cédula?"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon.Help width="14" height="14"/>
      </button>
      {open && (
        <div className="ci-help-pop" role="dialog" aria-label="Ubicación del número en la cédula">
          <div className="ci-help-arrow"/>
          <header className="ci-help-head">
            <strong>¿Dónde encuentro mi número?</strong>
            <button type="button" className="ci-help-close" aria-label="Cerrar" onClick={() => setOpen(false)}>✕</button>
          </header>

          {/* Diagrama genérico de carnet — no recrea el diseño oficial */}
          <svg viewBox="0 0 320 200" className="ci-diagram" aria-hidden="true">
            {/* Cuerpo de la tarjeta */}
            <defs>
              <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#eef2f7"/>
                <stop offset="100%" stopColor="#dde3ec"/>
              </linearGradient>
              <pattern id="cardStripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#c8d1de" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect x="10" y="10" width="300" height="180" rx="10" fill="url(#cardBg)" stroke="#b8c2d1" strokeWidth="1"/>
            <rect x="10" y="10" width="300" height="26" rx="10" fill="#3a4a63"/>
            <rect x="10" y="20" width="300" height="16" fill="#3a4a63"/>
            {/* Texto del header */}
            <text x="22" y="27" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill="#fff" letterSpacing="1.5">DOCUMENTO DE IDENTIDAD</text>
            {/* Foto */}
            <rect x="22" y="50" width="60" height="74" rx="3" fill="url(#cardStripes)" stroke="#b8c2d1"/>
            <circle cx="52" cy="78" r="11" fill="#c8d1de"/>
            <path d="M34 116 Q52 96 70 116 Z" fill="#c8d1de"/>
            {/* Líneas de datos (nombre, fecha, etc) */}
            <text x="98" y="58" fontFamily="Inter, sans-serif" fontSize="7" fill="#8693a8" letterSpacing=".5">NOMBRES</text>
            <rect x="98" y="62" width="120" height="8" rx="2" fill="#c8d1de"/>
            <text x="98" y="82" fontFamily="Inter, sans-serif" fontSize="7" fill="#8693a8" letterSpacing=".5">APELLIDOS</text>
            <rect x="98" y="86" width="140" height="8" rx="2" fill="#c8d1de"/>
            <text x="98" y="106" fontFamily="Inter, sans-serif" fontSize="7" fill="#8693a8" letterSpacing=".5">FECHA DE NACIMIENTO</text>
            <rect x="98" y="110" width="80" height="8" rx="2" fill="#c8d1de"/>

            {/* CAMPO DESTACADO: Número + complemento */}
            <rect x="22" y="138" width="180" height="34" rx="4" fill="#fff" stroke="#7a5af0" strokeWidth="2"/>
            <text x="30" y="151" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600" fill="#7a5af0" letterSpacing=".5">N° DE CÉDULA</text>
            <text x="30" y="167" fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="600" fill="#1a2235">5808569</text>
            <text x="118" y="167" fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="600" fill="#7a5af0">-A1</text>

            {/* Etiqueta "Número" */}
            <line x1="60" y1="178" x2="60" y2="188" stroke="#7a5af0" strokeWidth="1.5"/>
            <text x="60" y="196" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600" textAnchor="middle" fill="#1a2235">Número</text>

            {/* Etiqueta "Complemento (si aplica)" */}
            <line x1="130" y1="178" x2="130" y2="188" stroke="#7a5af0" strokeWidth="1.5" strokeDasharray="2 2"/>
            <text x="130" y="196" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="600" textAnchor="start" fill="#7a5af0">Complemento (si aplica)</text>

            {/* Firma decorativa */}
            <path d="M220 150 q8 -6 16 0 t16 0" stroke="#8693a8" strokeWidth="1" fill="none"/>
          </svg>

          <ul className="ci-help-list">
            <li><span className="bullet" aria-hidden="true"/> <span>Ingresa el <strong>número completo</strong> tal como aparece en tu carnet.</span></li>
            <li><span className="bullet alt" aria-hidden="true"/> <span>Si tu cédula <strong>tiene un guion seguido de 2 caracteres</strong> (ej. <code>-A1</code>, <code>-1K</code>), agrégalos al final: <code>5808569-A1</code>.</span></li>
            <li><span className="bullet" aria-hidden="true"/> <span>La mayoría de cédulas <strong>no tienen complemento</strong>. Solo aparece en casos especiales registrados por el SEGIP (homónimos, recuperaciones, etc.).</span></li>
            <li><span className="bullet" aria-hidden="true"/> <span><strong>No incluyas</strong> la extensión (LP, CB, SC, …) ni puntos.</span></li>
          </ul>
        </div>
      )}
    </span>
  );
}

// ── Anotación con flecha (didáctica, on/off por tweak) ──────────────────────
function Annotation({ x, y, w = 220, anchor = 'left', children }) {
  return (
    <div className={`annot annot-${anchor}`} style={{ left: x, top: y, width: w }}>
      <div className="annot-bubble">{children}</div>
    </div>
  );
}

// ── Pantalla de inicio de sesión ────────────────────────────────────────────
function LoginScreen({ t, onSubmitSuccess }) {
  const [ci, setCi] = React.useState('5808569');
  const [pwd, setPwd] = React.useState('correcthorse');
  const [showPwd, setShowPwd] = React.useState(false);
  const [caps, setCaps] = React.useState(false);
  const [touchedCi, setTouchedCi] = React.useState(true);
  const [touchedPwd, setTouchedPwd] = React.useState(true);
  const [trust, setTrust] = React.useState(false);
  const [qrSeconds, setQrSeconds] = React.useState(90);
  const [qrSeed, setQrSeed] = React.useState(7);
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  // Demo states forced via Tweak
  React.useEffect(() => {
    if (t.demoState === 'loading')      { setSubmitting(true);  setServerError(''); }
    else if (t.demoState === 'error')   { setSubmitting(false); setServerError('La cédula o la contraseña no coinciden. Te quedan 4 intentos antes de que la cuenta se bloquee.'); }
    else                                { setSubmitting(false); setServerError(''); }
  }, [t.demoState]);

  // Caps lock detector
  const onPwdKey = (e) => {
    if (typeof e.getModifierState === 'function') setCaps(e.getModifierState('CapsLock'));
  };

  // QR countdown
  React.useEffect(() => {
    if (!t.qrCountdown) return;
    const id = setInterval(() => setQrSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [t.qrCountdown]);

  // Validación CI Bolivia: 5–10 dígitos, opcionalmente con complemento "-XX"
  // (2 caracteres alfanuméricos, p. ej. 5808569-A1). El complemento solo aparece
  // en cédulas de ciudadanos con un caso especial registrado por el SEGIP.
  const ciPattern = /^(\d{5,10})(?:-([A-Za-z0-9]{2}))?$/;
  const ciMatch   = ci.match(ciPattern);
  const ciValid   = !!ciMatch;
  const ciHasComp = !!(ciMatch && ciMatch[2]);
  const ciError   = t.inlineValidation && touchedCi && ci.length > 0 && !ciValid
    ? 'Formato no válido. Usa 5–10 dígitos y, si tu cédula lo tiene, agrega el complemento (ej. 5808569-A1).' : '';
  const pwdValid = pwd.length >= 8;
  const pwdError = t.inlineValidation && touchedPwd && pwd.length > 0 && !pwdValid
    ? 'Mínimo 8 caracteres.' : '';
  const canSubmit = ciValid && pwdValid && !submitting;

  const refreshQR = () => { setQrSeed((s) => s + 1); setQrSeconds(90); };
  const qrExpired = t.qrCountdown && qrSeconds === 0;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setServerError('');
    setTimeout(() => {
      setSubmitting(false);
      if (t.demoState === 'error') {
        setServerError('La cédula o la contraseña no coinciden. Te quedan 4 intentos antes de que la cuenta se bloquee.');
      } else {
        onSubmitSuccess?.();
      }
    }, 1000);
  };

  const mm = String(Math.floor(qrSeconds / 60)).padStart(2, '0');
  const ss = String(qrSeconds % 60).padStart(2, '0');

  return (
    <div className={`app ${t.highContrast ? 'hc' : ''}`} data-accent={t.accent}>
      {/* Top bar */}
      <header className="topbar">
        <div className="brand">
          <BrandMark />
          <div className="brand-text">
            <strong>Identidad Digital</strong>
            <span>Plataforma del Estado</span>
          </div>
        </div>
        <div className="top-actions">
          {t.visibleLanguage ? (
            <button className="lang-pill" type="button" aria-label="Cambiar idioma">
              <Icon.Lang width="16" height="16"/>
              <span>Español</span>
              <span className="lang-alt">· ES / Aymara · QU</span>
            </button>
          ) : (
            <button className="icon-btn" type="button" aria-label="Idioma"><Icon.Lang width="20" height="20"/></button>
          )}
          <button className="icon-btn" type="button" aria-label="Ayuda"><Icon.Help width="20" height="20"/></button>
        </div>
      </header>

      <main className="stage">
        <form className="card" onSubmit={submit} noValidate>
          {/* Columna izquierda: credenciales */}
          <section className="col col-credentials" aria-labelledby="credtitle">
            <div className="col-head">
              <div className="method-tag"><Icon.Shield width="14" height="14"/> Acceso seguro</div>
              <h1 id="credtitle">Inicia sesión</h1>
              <p className="env-chip" aria-label="Ambiente">
                <span className="env-dot"/> Ambiente · <strong>Developer</strong>
              </p>
            </div>

            {/* CI */}
            <div className="field">
              <label htmlFor="ci">
                Cédula de identidad <span aria-hidden="true">*</span>
                {t.helpHints && <CIHelpPopover />}
              </label>
              <div className={`input-wrap ${ciError ? 'has-error' : ''} ${touchedCi && ciValid ? 'is-valid' : ''}`}>
                <input
                  id="ci"
                  inputMode="numeric"
                  autoComplete="username"
                  pattern="[0-9]*"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  onBlur={() => setTouchedCi(true)}
                  aria-invalid={!!ciError}
                  aria-describedby={ciError ? 'ci-err' : (t.helpHints ? 'ci-hint' : undefined)}
                />
                {touchedCi && ciValid && <Icon.Check className="input-trailing ok" width="16" height="16"/>}
              </div>
              {ciError
                ? <div id="ci-err" className="field-msg err"><Icon.Alert width="13" height="13"/>{ciError}</div>
                : t.helpHints && (
                  <div id="ci-hint" className="field-msg muted">
                    {ciHasComp
                      ? <><Icon.Check width="13" height="13" style={{color:'var(--ok)'}}/> Incluye complemento <code>{ciMatch[2].toUpperCase()}</code> — solo si aparece en tu cédula.</>
                      : <>Ej. <code>5808569</code> o, si tu cédula tiene complemento, <code>5808569-A1</code>.</>}
                  </div>
                )}
            </div>

            {/* Contraseña */}
            <div className="field">
              <label htmlFor="pwd">
                Contraseña <span aria-hidden="true">*</span>
                <a href="#" className="label-link" tabIndex={0}>¿Olvidaste tu contraseña?</a>
              </label>
              <div className={`input-wrap ${pwdError ? 'has-error' : ''}`}>
                <input
                  id="pwd"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onBlur={() => setTouchedPwd(true)}
                  onKeyUp={onPwdKey}
                  onKeyDown={onPwdKey}
                  aria-invalid={!!pwdError}
                  aria-describedby={pwdError ? 'pwd-err' : undefined}
                />
                <button
                  type="button"
                  className="input-trailing btn-eye"
                  aria-pressed={showPwd}
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPwd((v) => !v)}
                >
                  {showPwd ? <Icon.EyeOff width="18" height="18"/> : <Icon.Eye width="18" height="18"/>}
                </button>
              </div>
              {pwdError && <div id="pwd-err" className="field-msg err"><Icon.Alert width="13" height="13"/>{pwdError}</div>}
              {t.capsLockWarning && caps && !pwdError && (
                <div className="field-msg warn"><Icon.Caps width="13" height="13"/> Bloq. mayús. está activado.</div>
              )}
            </div>

            {/* Trust + crear cuenta */}
            <div className="row-between">
              {t.trustDevice ? (
                <label className="check">
                  <input type="checkbox" checked={trust} onChange={(e) => setTrust(e.target.checked)} />
                  <span className="check-box" aria-hidden="true"><Icon.Check width="11" height="11"/></span>
                  <span>Confiar en este dispositivo por 30 días</span>
                </label>
              ) : <span/>}
              <a href="#" className="secondary-link">Crear cuenta <Icon.Arrow width="14" height="14"/></a>
            </div>

            {/* Error de servidor */}
            {serverError && (
              <div className="server-error" role="alert">
                <Icon.Alert width="16" height="16"/>
                <div>
                  <strong>No pudimos iniciar tu sesión.</strong>
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="actions">
              <button type="button" className="btn-ghost">Volver</button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!canSubmit}
                aria-busy={submitting}
              >
                {submitting ? <><Icon.Spin className="spin" width="16" height="16"/> Verificando…</> : <>Ingresar <Icon.Arrow width="16" height="16"/></>}
              </button>
            </div>
          </section>

          {/* Separador */}
          <div className="separator" aria-hidden="true">
            <span/><em>o</em><span/>
          </div>

          {/* Columna derecha: QR */}
          <section className="col col-qr" aria-labelledby="qrtitle">
            <div className="col-head">
              <div className="method-tag"><Icon.Phone width="14" height="14"/> Sin contraseña</div>
              <h2 id="qrtitle">Escanea con tu teléfono</h2>
              <p className="muted-line">Más rápido y sin teclear contraseñas.</p>
            </div>

            <div className={`qr-frame ${qrExpired ? 'expired' : ''}`}>
              <QRPattern size={216} seed={qrSeed}/>
              {qrExpired && (
                <div className="qr-overlay">
                  <Icon.Refresh width="22" height="22"/>
                  <strong>El código expiró</strong>
                  <button type="button" className="btn-ghost sm" onClick={refreshQR}>Generar otro</button>
                </div>
              )}
            </div>

            {t.qrCountdown && !qrExpired && (
              <div className="qr-status">
                <span className="dot pulse"/>
                <span>Esperando tu teléfono · expira en <strong>{mm}:{ss}</strong></span>
                <button type="button" className="link-btn" onClick={refreshQR} aria-label="Refrescar código">
                  <Icon.Refresh width="13" height="13"/>
                </button>
              </div>
            )}

            <ol className="qr-steps">
              <li><span className="step-n">1</span> Abre la app <strong>Identidad Digital</strong>.</li>
              <li><span className="step-n">2</span> Toca <strong>Escanear QR</strong> en el menú principal.</li>
              <li><span className="step-n">3</span> Apunta a esta imagen para entrar.</li>
            </ol>

            <a href="#" className="get-app">
              <Icon.Phone width="16" height="16"/>
              <span>¿Aún no tienes la app? <strong>Descárgala aquí</strong></span>
            </a>
          </section>
        </form>

        {/* Anotaciones didácticas */}
        {t.annotations && (
          <>
            <Annotation x={-260} y={70} w={230} anchor="right">
              <b>1 · Etiquetas legibles.</b> Contraste AA garantizado y tamaño 13&nbsp;px mínimo. Antes: gris claro sobre gris oscuro.
            </Annotation>
            <Annotation x={-260} y={210} w={230} anchor="right">
              <b>2 · Validación inline.</b> Mensajes específicos en cuanto sales del campo, no recién al enviar.
            </Annotation>
            <Annotation x={-260} y={360} w={230} anchor="right">
              <b>3 · Microcopy de error útil.</b> Dice qué pasó, qué hacer y cuántos intentos quedan.
            </Annotation>
            <Annotation x={760} y={70} w={230} anchor="left">
              <b>4 · QR con estado.</b> Cuenta regresiva + “esperando teléfono” reducen la ansiedad de “¿funcionará?”.
            </Annotation>
            <Annotation x={760} y={220} w={230} anchor="left">
              <b>5 · Pasos numerados.</b> Mismo flujo, jerarquía clara y verbos al frente.
            </Annotation>
            <Annotation x={760} y={360} w={230} anchor="left">
              <b>6 · Confiar dispositivo.</b> Reduce fricción para usuarios recurrentes (auth segura por 30 días).
            </Annotation>
          </>
        )}
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

// ── App raíz con Tweaks ─────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const screen = t.screen || 'login';
  const [loading, setLoading] = React.useState(false);
  const [loadingLabel, setLoadingLabel] = React.useState('Procesando…');

  // Navegación con loader bloqueante. Acepta un label de espera.
  const goTo = (s, label) => {
    if (label) {
      setLoadingLabel(label);
      setLoading(true);
      setTimeout(() => {
        setTweak('screen', s);
        setTimeout(() => setLoading(false), 250);
      }, 900);
    } else {
      setTweak('screen', s);
    }
  };

  return (
    <>
      {screen === 'login'
        ? <LoginScreen t={t} onSubmitSuccess={() => goTo('verification', 'Enviando código de verificación a tu correo…')} />
        : screen === 'verification'
        ? <window.VerificationScreen t={t}
            onCancel={() => goTo('login')}
            onSuccess={() => goTo('login', 'Validando tu identidad y preparando tu sesión…')} />
        : <window.EmailPreview t={t} />}

      <window.LoadingOverlay visible={loading} label={loadingLabel} />

      <TweaksPanel title="Mejoras de usabilidad">
        <TweakSection label="Pantalla">
          <TweakSelect label="Vista" value={screen}
            options={[
              {value:'login',label:'Login'},
              {value:'verification',label:'Verificación'},
              {value:'email',label:'Correo enviado'},
            ]}
            onChange={(v) => goTo(v)} />
          <TweakButton label="Demo: ver loader 2 s"
            onClick={() => {
              setLoadingLabel('Procesando…');
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }} />
        </TweakSection>
        <TweakSection label="Color">
          <TweakRadio label="Acento" value={t.accent}
            options={['indigo','teal','amber']}
            onChange={(v) => setTweak('accent', v)} />
          <TweakToggle label="Contraste alto" value={t.highContrast}
            onChange={(v) => setTweak('highContrast', v)} />
        </TweakSection>
        {screen === 'login' && (
          <>
            <TweakSection label="Mejoras · Login">
              <TweakToggle label="Validación inline"      value={t.inlineValidation} onChange={(v) => setTweak('inlineValidation', v)} />
              <TweakToggle label="Aviso Bloq. mayús."     value={t.capsLockWarning}  onChange={(v) => setTweak('capsLockWarning', v)} />
              <TweakToggle label="Pistas y tooltips"      value={t.helpHints}        onChange={(v) => setTweak('helpHints', v)} />
              <TweakToggle label="QR con cuenta regresiva" value={t.qrCountdown}     onChange={(v) => setTweak('qrCountdown', v)} />
              <TweakToggle label="Confiar dispositivo"    value={t.trustDevice}      onChange={(v) => setTweak('trustDevice', v)} />
              <TweakToggle label="Idioma visible"         value={t.visibleLanguage}  onChange={(v) => setTweak('visibleLanguage', v)} />
            </TweakSection>
            <TweakSection label="Estados · Login">
              <TweakRadio label="Estado"
                value={t.demoState}
                options={[{value:'idle',label:'Reposo'},{value:'loading',label:'Cargando'},{value:'error',label:'Error'}]}
                onChange={(v) => setTweak('demoState', v)} />
            </TweakSection>
          </>
        )}
        {screen === 'verification' && (
          <>
            <TweakSection label="Mejoras · Verificación">
              <TweakToggle label="Info del intento" value={t.showRequestInfo} onChange={(v) => setTweak('showRequestInfo', v)} />
              <TweakToggle label="Pistas y tooltips" value={t.helpHints}      onChange={(v) => setTweak('helpHints', v)} />
            </TweakSection>
            <TweakSection label="Estados · Verificación">
              <TweakRadio label="Estado"
                value={t.verifyState}
                options={[{value:'idle',label:'Reposo'},{value:'error',label:'Error'},{value:'success',label:'Éxito'}]}
                onChange={(v) => setTweak('verifyState', v)} />
            </TweakSection>
          </>
        )}
        <TweakSection label="Anotaciones">
          <TweakToggle label="Mostrar análisis UX" value={t.annotations} onChange={(v) => setTweak('annotations', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
