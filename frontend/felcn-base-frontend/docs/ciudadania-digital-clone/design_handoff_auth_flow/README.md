# Handoff: Flujo de Autenticación — Identidad Digital

> **Audiencia**: desarrolladores que implementarán este flujo en el codebase real.
> **Idioma del producto**: español de Bolivia (`es-BO`), con soporte previsto para Aymara y Quechua.
> **Marca**: el prototipo usa el nombre genérico "Identidad Digital". Reemplaza el logo `BrandMark` y los strings de marca por los oficiales del proyecto.

---

## 📦 Contenido del paquete

El paquete contiene **dos tipos de entregables distintos**. Es crítico no confundirlos al implementar.

```
design_handoff_auth_flow/
├── README.md                              ← este archivo (índice y guía)
│
├── 01_ui_screens/                         ← INTERFACES DE USUARIO (web app)
│   ├── README.md                          ← guía específica de las pantallas
│   └── prototype/
│       ├── Inicio de sesion.html         ← HTML raíz del prototipo
│       ├── login.jsx                      ← pantalla de login (CI + QR)
│       ├── verification.jsx               ← pantalla de verificación (OTP)
│       ├── email-and-loader.jsx           ← preview del correo + loader bloqueante
│       └── tweaks-panel.jsx               ← panel de ajustes (NO portar a producción)
│
├── 02_email_template/                     ← PLANTILLA DE CORREO ELECTRÓNICO
│   ├── README.md                          ← guía específica del email
│   ├── email-verification.html            ← HTML del correo (inline styles)
│   └── email-verification.txt             ← versión texto plano (multipart fallback)
│
└── reference/                             ← capturas del diseño anterior
    ├── original-login.png
    ├── original-verification.png
    └── original-email.png
```

---

## 🎯 ¿Qué hay que implementar?

### Frontend de la aplicación (carpeta `01_ui_screens/`)

Tres pantallas + un componente compartido, parte de la **app web** de Identidad Digital:

| Pantalla / Componente | Propósito |
|---|---|
| `LoginScreen` | Ingreso con cédula + contraseña, o QR desde la app móvil |
| `VerificationScreen` | Ingreso del código OTP de 6 dígitos (2FA) |
| `LoadingOverlay` | Overlay bloqueante durante transiciones de servidor |
| `EmailPreview` | **Solo para revisión de diseño** — NO es una pantalla del producto |

### Backend / servicio de email (carpeta `02_email_template/`)

**No es una pantalla.** Es la plantilla del correo electrónico **transaccional** que se envía al usuario cuando solicita iniciar sesión. La implementa el equipo de backend / infraestructura de email, no el equipo de frontend.

| Archivo | Propósito |
|---|---|
| `email-verification.html` | HTML del correo (con `<table>` layout e inline styles, listo para Outlook/Gmail) |
| `email-verification.txt` | Versión texto plano para `multipart/alternative` |

---

## 🧭 Guía rápida para implementar

**Si estás aquí para implementar la app web (UI):**
1. Lee `01_ui_screens/README.md`.
2. Abre el prototipo en `01_ui_screens/prototype/Inicio de sesion.html` para ver el comportamiento.
3. Recrea las pantallas en el stack del proyecto. Los archivos `.jsx` están en React puro — adáptalos a tu framework.

**Si estás aquí para implementar el correo electrónico:**
1. Lee `02_email_template/README.md`.
2. Toma `email-verification.html` y `email-verification.txt`.
3. Conéctalo a tu servicio de envío (SendGrid, Mailgun, AWS SES, Postmark, SMTP, etc.).
4. Reemplaza los placeholders `{{VARIABLE}}` con tu motor de plantillas (Jinja, Mustache, Handlebars, Liquid, etc.).
5. Configura los headers SMTP listados.
6. **Importante**: configura `SPF`, `DKIM` y `DMARC` en el dominio `identidad-digital.gob.bo` (o el que uses) antes de enviar.

---

## 🎨 Sistema de diseño compartido

Ambas implementaciones (UI y correo) comparten valores de marca. Adáptalos si tu sistema de diseño tiene equivalentes oficiales.

### Color (UI usa modo oscuro; correo usa modo claro)

| Token UI                | UI (dark)               | Correo (light)          | Uso                        |
| ----------------------- | ----------------------- | ----------------------- | -------------------------- |
| Fondo                   | `oklch(0.18 .005 270)`  | `#f3f4f7`               | Fondo base                 |
| Superficie principal    | `oklch(0.235 .006 270)` | `#ffffff`               | Card / contenedor          |
| Texto principal         | `oklch(0.97 .005 270)`  | `#1a2235`               | Headings, body             |
| Texto secundario        | `oklch(0.82 .008 270)`  | `#3a4258`               | Párrafos                   |
| Texto terciario         | `oklch(0.66 .010 270)`  | `#5a6478`               | Labels, microcopy          |
| Accent (primario)       | `oklch(0.74 .14 265)`   | `#4f3fde`               | CTAs, links, focus         |
| Accent suave            | `oklch(0.30 .06 265)`   | `#f0f1ff`               | Backgrounds de accent      |
| Éxito                   | `oklch(0.78 .13 155)`   | `#3fa856` / `#e2f4e6`   | OK, verified               |
| Advertencia             | `oklch(0.82 .13 80)`    | `#8a5b00` / `#fff7d6`   | Ambiente, caps lock        |
| Error                   | `oklch(0.72 .18 25)`    | `#d04527` / `#fef1ee`   | Validación, alertas        |

### Tipografía

| Familia (UI)    | Familia (correo, web-safe stack)                   | Uso                |
| --------------- | -------------------------------------------------- | ------------------ |
| Inter           | `-apple-system, Segoe UI, Roboto, Helvetica, sans` | UI / body          |
| JetBrains Mono  | `Courier New, monospace`                           | Códigos, datos     |

> **Importante para email**: NO uses fuentes de Google Fonts en el correo. Muchos clientes (Outlook, Apple Mail) las ignoran o las bloquean. Usa el stack web-safe.

### Espaciado y radius

| Token   | Valor      |
| ------- | ---------- |
| Radius sm  | 6–8 px |
| Radius md  | 10 px |
| Radius lg  | 12 px |
| Radius card| 14 px |
| Pill    | 999 px |

---

## ✅ Mejoras de usabilidad aplicadas (resumen ejecutivo)

### En las pantallas (UI)
- Validación inline con microcopy específico (CI + complemento `-XX` boliviano).
- Popover educativo con diagrama mostrando dónde está el número en la cédula.
- Aviso de Bloq. Mayús. al teclear contraseña.
- Botón "Mostrar/ocultar contraseña" accesible.
- Botón "Ingresar" deshabilitado hasta que el form sea válido; loading state real.
- Banner de error específico con intentos restantes.
- QR con cuenta regresiva, status "esperando teléfono", estado expirado.
- Trust device (30 días).
- Idioma visible como pill (es / ay / qu).
- Indicador de ambiente (Developer / QA / Producción).
- **Loader bloqueante** durante transiciones servidor (anti-doble-submit).
- Contraste AA garantizado; modo AAA disponible.

### En la verificación (OTP)
- 6 celdas individuales en lugar de "rayitas".
- Auto-foco, auto-avance, backspace al anterior, flechas para navegar.
- Pegar 6 dígitos a la vez.
- `autoComplete="one-time-code"` → iOS/Android sugieren el código del SMS.
- Auto-submit al completar.
- Cuenta regresiva en formato `MM:SS`.
- Canal alternativo SMS tras primer reenvío.
- Banner del email con "No es mío" para volver al login.
- Info anti-phishing del intento (Chrome · macOS · La Paz, BO).
- Estados de éxito, error y expirado.

### En el correo
- **Asunto incluye el código** → iOS/Gmail muestran auto-fill desde la notificación.
- **Remitente verificado** (DKIM/SPF/DMARC).
- **Sin enlaces de login** → no se puede phishear con suplantación.
- **Código grande y monoespaciado** en cajas individuales.
- **Vigencia explícita** (relativa + hora exacta).
- **Detalles del intento** visibles (anti-phishing).
- **CTA "No fui yo"** prominente y rojo.
- **Disclaimers de seguridad** (no compartir, no por teléfono, verificar dominio).
- **Sin tracking pixels**.
- **Plain-text fallback** para clientes legacy.
- **Layout `<table>` + inline styles** → compatible con Outlook.
- **Headers SMTP** (`Auto-Submitted`, `Precedence`, `List-Unsubscribe`) bien configurados.

---

## 📋 Checklist global de producción

### App web (UI)
- [ ] Reemplazar `BrandMark` por el logo oficial.
- [ ] Sustituir el QR placeholder por `qrcode.react` u otra librería.
- [ ] Implementar WebSocket/polling para el handshake del QR.
- [ ] Conectar `/auth/login`, `/auth/verify`, `/auth/qr/*` con manejo de errores.
- [ ] Rate limiting en backend + bloqueo tras N intentos.
- [ ] Device-token de 30 días en cookie `httpOnly secure` si trust device está marcado.
- [ ] i18n: extraer strings a `es / ay / qu`.
- [ ] CSP headers estrictos.
- [ ] HTTPS + HSTS obligatorio.
- [ ] Tests e2e: validación CI, error 401, expiración QR/OTP, refresh, login exitoso, trust device.
- [ ] Auditoría axe-core + navegación por teclado.

### Correo
- [ ] Configurar **SPF**, **DKIM**, **DMARC** en el dominio del remitente.
- [ ] Configurar headers: `Auto-Submitted: auto-generated`, `Precedence: bulk`, `List-Unsubscribe`.
- [ ] Enviar como `multipart/alternative` con HTML + texto plano.
- [ ] Probar en Litmus / Email on Acid (Outlook 2016+, Gmail web/iOS/Android, Apple Mail, Yahoo).
- [ ] NO incluir tracking pixels (es un correo transaccional, no marketing).
- [ ] URL de "No fui yo" (`{{BLOCK_URL}}`) firmada y de un solo uso, con expiración corta.
- [ ] Plantilla del asunto: `Tu código de verificación es {{CODE}}` (algunos clientes lo extraen).
- [ ] Logear envíos y bounces para monitoreo.
- [ ] Suprimir envío si el usuario hizo "Reportar como phishing" recientemente.
- [ ] Internacionalizar plantilla por idioma (es / ay / qu).

---

## 🔐 Notas de seguridad importantes

### Anti-phishing
- El correo **nunca** debe contener un botón "Iniciar sesión" o "Ver mi cuenta". Solo:
  - El código (en texto, no como imagen).
  - El botón "No fui yo" (acción de bloqueo, no de login).
- El correo **nunca** debe pedir al usuario que comparta el código o lo escriba en otro lugar que no sea el portal oficial.
- Capacitar a usuarios: "Identidad Digital nunca te pedirá este código por teléfono".

### Anti-suplantación
- DKIM + SPF + DMARC con política `reject` (no `quarantine`).
- Si es posible, registrar el dominio en **BIMI** para mostrar logo verificado en Gmail/Yahoo.
- Subdominio dedicado para transaccionales (`noreply.identidad-digital.gob.bo`).

### Privacidad
- IP y geolocalización van en el correo solo de forma aproximada (ciudad, no calle).
- No logar el código en claro en ningún sistema (incluso bases de auditoría).
- Cumplir con la **Ley 164** (Bolivia) sobre telecomunicaciones y la **Ley 1178** sobre administración.

---

## 📎 Archivos de referencia

- `reference/original-login.png` — captura del login anterior (antes del rediseño).
- `reference/original-verification.png` — captura de la pantalla de verificación anterior.
- `reference/original-email.png` — captura del correo anterior.

Útiles para mostrarle a stakeholders el **antes vs. después** y entender qué problemas se resolvieron.

---

## ❓ Preguntas abiertas para producto

1. ¿La extensión LP/CB/SC de la cédula tiene rol en algún flujo posterior?
2. ¿Cuántos intentos antes del bloqueo de cuenta? (El prototipo muestra 4–2 como ejemplo.)
3. ¿TTL real del challenge QR y del código OTP? (Prototipo asume 90 s y 150 s respectivamente.)
4. ¿"Confiar dispositivo" requiere 2FA en el login inicial?
5. ¿Existe un flujo de "primer ingreso" diferente (creación de contraseña)?
6. ¿Qué proveedor de email usaremos? (Afecta a si necesitamos un workaround para Outlook/iOS.)
7. ¿La cuenta puede tener email **y** SMS como segundos factores, o solo uno?

---

**Última actualización**: prototipo `Inicio de sesion.html` (login + verificación + correo + loader).
**Próximos pasos sugeridos**: pantallas de olvidé contraseña, crear cuenta, gestionar dispositivos confiables.
