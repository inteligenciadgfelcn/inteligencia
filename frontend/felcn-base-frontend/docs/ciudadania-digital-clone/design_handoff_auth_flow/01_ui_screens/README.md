# 01 · Pantallas de UI — Aplicación web

> Esta carpeta contiene las **interfaces de usuario** del flujo de autenticación.
> Para la plantilla del correo electrónico, mira `../02_email_template/`.

---

## Sobre los archivos

Los archivos en `prototype/` son **referencias de diseño creadas en HTML+React** — un prototipo interactivo que muestra el aspecto y comportamiento deseados. **NO son código de producción para copiar directamente.**

Tu tarea es **recrear este diseño en el entorno del proyecto real** (React/Vue/Angular/etc.) usando los patrones, librerías y sistema de diseño existentes. Si no hay un stack definido, **Vite + React + TypeScript** es la recomendación natural — el prototipo ya está en React, la migración es directa.

## Fidelidad

**Alta fidelidad (hi-fi).** Replícalo pixel-perfect respetando los tokens en el README maestro.

---

## Pantallas

### 1. LoginScreen (`login.jsx`)

Doble método de autenticación: credenciales (CI + contraseña) y QR (app móvil).

**Características clave**:
- Campo CI con validación inline: regex `^(\d{5,10})(?:-([A-Za-z0-9]{2}))?$`.
  - Acepta `5808569` o `5808569-A1` (con complemento alfanumérico).
- Popover educativo con diagrama mostrando dónde encontrar el número y el complemento.
- Campo contraseña con toggle de visibilidad + aviso de Bloq. Mayús.
- Trust device (30 días).
- QR con countdown, estado pulsante y manejo de expiración.
- Banner de error específico con intentos restantes.

**Endpoints requeridos**:
| Método | Path | Propósito |
|---|---|---|
| POST | `/auth/login` | CI + password |
| POST | `/auth/qr/new` | Crear challenge QR |
| WS / SSE | `/auth/qr/listen` | Esperar handshake desde la app |

### 2. VerificationScreen (`verification.jsx`)

Ingreso del código OTP de 6 dígitos enviado por email/SMS.

**Características clave**:
- 6 inputs individuales con auto-foco, auto-avance, backspace al anterior, flechas izq/der.
- Soporte de `paste` (pega 6 dígitos a la vez).
- `autoComplete="one-time-code"` en el primer input.
- Auto-submit al completar.
- Countdown del reenvío en `MM:SS`.
- Canal alterno SMS tras primera expiración.
- Stepper de progreso `1 · Credenciales → 2 · Verificación`.
- Info anti-phishing del intento.

**Endpoints requeridos**:
| Método | Path | Propósito |
|---|---|---|
| POST | `/auth/otp/send` | Enviar código (email o SMS) |
| POST | `/auth/otp/verify` | Verificar código |
| POST | `/auth/otp/resend` | Reenviar con throttle |

### 3. LoadingOverlay (`email-and-loader.jsx`, exportado como `window.LoadingOverlay`)

Overlay bloqueante full-screen para transiciones que tardan (ej. envío de OTP).

**Cuándo usarlo**:
- Durante POST `/auth/login` → muestra el loader hasta que el OTP se envió.
- Durante POST `/auth/otp/verify` exitoso → hasta que la sesión se establezca y se redirija.
- Cualquier acción que tarde >300ms en el servidor.

**Props**:
```ts
interface LoadingOverlayProps {
  visible: boolean;
  label: string;  // mensaje contextual: "Enviando código a tu correo…"
}
```

**Implementación**:
- Backdrop con blur, bloquea interacción.
- Tarjeta centrada con 3 anillos animados, logo, mensaje, barra indeterminada.
- Animación de entrada/salida (fade + scale).

### 4. EmailPreview (`email-and-loader.jsx`, exportado como `window.EmailPreview`)

> ⚠️ **Esto NO es una pantalla del producto.** Es una vista previa del correo electrónico que se envía al usuario, renderizada como referencia de diseño para el equipo.
> Para implementar el correo real, ve a `../02_email_template/`.

---

## Tokens de diseño

Ver el [README maestro](../README.md#sistema-de-diseño-compartido) — sección "Sistema de diseño compartido". Variables CSS definidas en `<style>` de `Inicio de sesion.html`.

Adicionalmente, las variantes de **acento** disponibles vía Tweaks (decide con producto cuál es el final):
- `indigo` (default): `oklch(0.74 .14 265)`
- `teal`: `oklch(0.78 .13 195)`
- `amber`: `oklch(0.82 .13 75)`

---

## Accesibilidad — implementaciones a preservar

- `aria-invalid` + `aria-describedby` en inputs.
- `aria-busy` en botón de submit.
- `aria-pressed` en toggle de ojo / mostrar contraseña.
- `aria-expanded` + `role="dialog"` en popover.
- `role="alert"` en banners de error.
- `aria-label` por dígito en OTP (`"Dígito 3 de 6"`).
- `inputMode="numeric"` + `pattern="[0-9]*"` en CI y OTP.
- `autoComplete="username" | "current-password" | "one-time-code"`.
- Focus visible 2px en todos los interactivos.
- Tab order lógico.
- Cerrar popovers con Esc.
- Contraste mínimo AA; modo AAA disponible.

---

## Equivalencia de iconos

El prototipo usa SVG inline. Mapeo a `lucide-react`:

| Prototipo | lucide-react |
|---|---|
| `Icon.Eye / EyeOff` | `Eye / EyeOff` |
| `Icon.Help` | `HelpCircle` |
| `Icon.Lang` | `Globe` |
| `Icon.Check` | `Check` |
| `Icon.Alert` | `AlertTriangle` |
| `Icon.Refresh` | `RotateCw` |
| `Icon.Spin` | `Loader2` (con clase `animate-spin`) |
| `Icon.Caps` | `ArrowBigUp` |
| `Icon.Phone` | `Smartphone` |
| `Icon.Shield / ShieldLock` | `ShieldCheck / Shield` |
| `Icon.Arrow` | `ArrowRight` |
| `Icon.Mail` | `Mail` |
| `Icon.Edit` | `Pencil` |
| `Icon.CheckCircle` | `CheckCircle2` |
| `Icon.Copy` | `Copy` |
| `Icon.Clock` | `Clock` |

---

## Cómo correr el prototipo

```bash
cd 01_ui_screens/prototype
python3 -m http.server 8000
# o cualquier servidor estático
```

Abrir `http://localhost:8000/Inicio de sesion.html`.

Activa el toggle **Tweaks** en la barra del editor para alternar entre pantallas (Login / Verificación / Correo enviado), forzar estados (idle / loading / error / success) y ver el comportamiento del loader.
