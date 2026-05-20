# 02 · Plantilla de correo — Verificación OTP

> Esta carpeta contiene la **plantilla del correo electrónico** que se envía al usuario al solicitar un código de verificación. **No es una pantalla de la aplicación.**
> Para las interfaces de UI, ve a `../01_ui_screens/`.

---

## Archivos

| Archivo | Para qué |
|---|---|
| `email-verification.html` | Plantilla HTML del correo (table-layout + inline styles, compatible con Outlook/Gmail/Apple Mail) |
| `email-verification.txt` | Versión texto plano para `multipart/alternative` (clientes legacy, screen readers) |

---

## Cómo usar la plantilla

1. Copia `email-verification.html` y `email-verification.txt` al proyecto del servicio de email.
2. Pásalos por tu motor de plantillas (Jinja2, Handlebars, Mustache, Liquid, Go templates, etc.) reemplazando los placeholders `{{VARIABLE}}`.
3. Envía como `multipart/alternative` (text + html) por SMTP o tu proveedor (SendGrid, Mailgun, AWS SES, Postmark, etc.).
4. Configura los headers SMTP recomendados (ver abajo).
5. Configura `SPF`, `DKIM`, `DMARC` en el dominio del remitente **antes** de enviar a producción.

---

## Placeholders disponibles

| Placeholder | Tipo | Ejemplo |
|---|---|---|
| `{{USER_NAME}}` | string | `"Einstein Montero Churata"` |
| `{{USER_NAME_FIRST}}` | string | `"Einstein"` |
| `{{USER_EMAIL}}` | string | `"einstein@gmail.com"` |
| `{{CODE}}` | string (6 dígitos) | `"444290"` |
| `{{D1}}` … `{{D6}}` | char | `"4"`, `"4"`, `"4"`, `"2"`, `"9"`, `"0"` |
| `{{TTL_HUMAN}}` | string | `"2 minutos y 30 segundos"` |
| `{{EXPIRES_AT}}` | string ISO/local | `"15/05/2026 · 01:28:12 (UTC-4)"` |
| `{{REQUEST_TIME}}` | string | `"15/05/2026 · 01:25:42 (UTC-4)"` |
| `{{USER_AGENT}}` | string parseado | `"Chrome 142 · macOS 15.4"` |
| `{{IP_ADDRESS}}` | string | `"200.105.241.184"` |
| `{{LOCATION}}` | string (ciudad, país) | `"La Paz, Bolivia"` |
| `{{APP_NAME}}` | string | `"Portal Ciudadano (Developer)"` |
| `{{ENV_NAME}}` | string | `"Developer"` / `"QA"` / `"Producción"` |
| `{{BLOCK_URL}}` | URL firmada | `"https://identidad-digital.gob.bo/block?t=..."` |
| `{{SUPPORT_EMAIL}}` | string | `"soporte@identidad-digital.gob.bo"` |
| `{{SUPPORT_PHONE}}` | string | `"800-10-1010"` |
| `{{PRIVACY_URL}}` | URL | `"https://…/privacidad"` |
| `{{TERMS_URL}}` | URL | `"https://…/terminos"` |
| `{{ABOUT_SIGNING_URL}}` | URL | `"https://…/firma-correo"` |

> **Ojo**: el código se renderiza dígito por dígito (`{{D1}}` … `{{D6}}`) para que cada uno tenga su propia caja visual. En tu motor de plantillas haz:
> ```python
> # Jinja2 ejemplo
> code = "444290"
> ctx = {**ctx, **{f"D{i+1}": d for i, d in enumerate(code)}}
> ```

---

## Headers SMTP recomendados

Configúralos en tu servicio de envío. Son **críticos** para que el correo no caiga en spam y respete el protocolo de correos transaccionales.

```
From: Identidad Digital <noreply@identidad-digital.gob.bo>
Reply-To: soporte@identidad-digital.gob.bo
Subject: Tu código de verificación es {{CODE}}

List-Unsubscribe: <mailto:unsub+{{REQUEST_ID}}@identidad-digital.gob.bo>, <https://identidad-digital.gob.bo/unsub?t={{TOKEN}}>
List-Unsubscribe-Post: List-Unsubscribe=One-Click

X-Auto-Response-Suppress: All
Auto-Submitted: auto-generated
Precedence: bulk

X-Entity-Ref-ID: {{REQUEST_ID}}
Message-ID: <{{REQUEST_ID}}@identidad-digital.gob.bo>
```

### ¿Por qué cada header?
- **`Auto-Submitted: auto-generated`**: indica que es un correo de máquina, no de persona. Evita auto-respuestas (fuera de oficina).
- **`Precedence: bulk`**: pide a clientes y filtros tratarlo como correo masivo transaccional.
- **`List-Unsubscribe`**: aunque es transaccional, Gmail / Yahoo exigen este header para correos de servicios masivos. Genera un token único.
- **`X-Auto-Response-Suppress`**: indica a Outlook/Exchange que no responda automáticamente.
- **`X-Entity-Ref-ID`**: ayuda en debugging y permite agrupar reenvíos del mismo intento.

---

## Configuración del dominio (CRÍTICO)

### SPF
DNS TXT en `identidad-digital.gob.bo`:
```
v=spf1 include:_spf.mailprovider.com -all
```

### DKIM
Generar par RSA-2048 con el proveedor y publicar TXT:
```
selector1._domainkey.identidad-digital.gob.bo  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhki..."
```

### DMARC
DNS TXT en `_dmarc.identidad-digital.gob.bo`:
```
v=DMARC1; p=reject; rua=mailto:dmarc-reports@identidad-digital.gob.bo; ruf=mailto:dmarc-forensics@identidad-digital.gob.bo; pct=100; aspf=s; adkim=s;
```
> Empezar con `p=quarantine` y subir a `p=reject` tras validar 2 semanas sin falsos positivos.

### BIMI (opcional, recomendado)
Para mostrar el logo verificado en Gmail/Yahoo:
```
default._bimi.identidad-digital.gob.bo  TXT  "v=BIMI1; l=https://identidad-digital.gob.bo/logo.svg; a=https://identidad-digital.gob.bo/vmc.pem"
```
Requiere un VMC (Verified Mark Certificate) emitido por una CA autorizada.

---

## Buenas prácticas aplicadas (checklist)

- [x] Ancho fijo **600 px** (estándar Outlook).
- [x] Layout con `<table>` y `inline styles`.
- [x] Asunto incluye el código → iOS/Gmail muestran auto-fill.
- [x] **Preheader oculto** ("Código 444290 · Expira en 2 minutos…").
- [x] **Sin enlaces de login** — solo código y "No fui yo" (anti-phishing).
- [x] Código grande y monoespaciado en cajas individuales.
- [x] Vigencia explícita: duración relativa + hora exacta.
- [x] **Detalles del intento** (fecha, dispositivo, IP, ubicación) — anti-phishing.
- [x] CTA **"No fui yo"** prominente, color rojo.
- [x] Disclaimers de seguridad: no compartir, no por teléfono, verificar dominio.
- [x] **Sin tracking pixels** (es transaccional, no marketing).
- [x] **Plain-text fallback** en `email-verification.txt`.
- [x] Headers SMTP correctos (`Auto-Submitted`, `Precedence`, `List-Unsubscribe`).
- [x] HTML accesible: jerarquía `<h1>`/`<h2>`, contraste AA, ARIA en código.
- [x] Sin fuentes externas (web-safe stack).

---

## Testing del correo

Antes de enviar a usuarios reales, prueba en:

1. **Litmus** o **Email on Acid** — render real en Outlook 2016/2019/365, Gmail web/iOS/Android, Apple Mail, Yahoo, Thunderbird.
2. **mail-tester.com** — análisis de spam score, DKIM/SPF/DMARC, blacklists.
3. **Mailtrap** o **MailHog** — sandbox local sin riesgo de enviar a usuarios reales.
4. **Glock Apps** — entrega real a Inbox vs. Spam en múltiples proveedores.

### Casos a probar
- Render con modo claro (default).
- Render con modo oscuro forzado por el cliente (Outlook 2019, Apple Mail).
- Render en Outlook con imágenes bloqueadas por defecto.
- Render en cliente móvil de Gmail en pantallas pequeñas (`< 380 px`).
- Pegar contenido del correo en un cliente que solo renderiza texto plano.

---

## Plain-text version

El archivo `email-verification.txt` debe enviarse como parte `multipart/alternative` junto al HTML. Algunos clientes legacy o cuentas configuradas como "solo texto" lo prefieren. Es **obligatorio** para cumplir RFC 8058 y mejorar el score anti-spam.

Ejemplo Python:
```python
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

msg = MIMEMultipart('alternative')
msg['Subject'] = f'Tu código de verificación es {code}'
msg['From'] = 'Identidad Digital <noreply@identidad-digital.gob.bo>'
msg['To'] = user_email

msg.attach(MIMEText(text_version, 'plain', 'utf-8'))   # primero el texto
msg.attach(MIMEText(html_version, 'html', 'utf-8'))    # luego el HTML
# El cliente elige cuál mostrar (RFC 2046)
```

---

## Seguridad operativa

- **NO** loguees el código OTP en claro en logs aplicativos. Loguea solo el hash o un identificador del intento.
- El `{{BLOCK_URL}}` debe ser un **token firmado de un solo uso** con expiración corta (≤ 30 min). Idealmente:
  - JWT con `exp` corto + `jti` único.
  - Revocación inmediata tras uso.
  - Auditar cada click (fecha, IP).
- Si el usuario hace click en "No fui yo":
  1. Cerrar todas las sesiones activas de la cuenta.
  2. Marcar la cuenta como "comprometida-pendiente-cambio-pwd".
  3. Forzar reset de contraseña en el próximo intento.
  4. Notificar al usuario por SMS de respaldo si lo tiene configurado.
  5. Logear el evento en el sistema de auditoría.

---

## Internacionalización

El correo debe enviarse en el idioma preferido del usuario (`es / ay / qu`). Mantén una plantilla por idioma:

```
templates/
├── email-verification.es.html
├── email-verification.es.txt
├── email-verification.ay.html
├── email-verification.ay.txt
├── email-verification.qu.html
└── email-verification.qu.txt
```

El asunto también se traduce:
- `es` → `Tu código de verificación es {{CODE}}`
- `ay` → `(traducción al aymara)`
- `qu` → `(traducción al quechua)`

> El equipo de localización debe revisar la traducción de los disclaimers de seguridad. Son sensibles culturalmente y NO deben perder fuerza al traducir ("Nunca compartas este código" debe quedar tan claro como en español).
