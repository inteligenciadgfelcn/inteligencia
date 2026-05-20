# Handoff: Pantalla de Inicio de Sesión — Identidad Digital

> **Audiencia**: desarrolladores que implementarán esta pantalla en el proyecto real (Claude Code, IDE, equipo de frontend).
> **Idioma**: el producto final es en español de Bolivia (`es-BO`), con soporte previsto para Aymara y Quechua.

---

## Resumen

Pantalla de **inicio de sesión** para la plataforma de Identidad Digital (AGETIC). Soporta dos métodos de autenticación en paralelo:

1. **Credenciales**: cédula de identidad (CI) + contraseña.
2. **QR**: escaneo desde la app móvil oficial (login sin contraseña).

El diseño aplica varias **mejoras de usabilidad y accesibilidad** sobre la versión anterior — validación inline, microcopy específico, estados de error útiles, aviso de Bloq. Mayús., contador de expiración del QR, soporte para "confiar dispositivo", y un popover informativo que enseña al usuario dónde encontrar su número de cédula y cuándo aplica el complemento.

## Sobre los archivos de diseño

Los archivos dentro de `prototype/` son **referencias de diseño creadas en HTML** — un prototipo interactivo que muestra el aspecto y el comportamiento deseados. **No son código de producción para copiar directamente.**

Tu tarea es **recrear este diseño en el entorno del proyecto real** (React/Vue/Angular/etc.) usando los patrones, librerías y sistema de diseño que ya existen en la base de código. Si el proyecto aún no tiene un stack definido, **Vite + React + TypeScript** es la opción recomendada — el prototipo ya está escrito en React y la migración será directa.

## Fidelidad

**Alta fidelidad (hi-fi).** Colores, tipografía, espaciado e interacciones están definidos con valores finales. Replícalo pixel-perfect respetando los tokens listados en este README, y usando las equivalencias del sistema de diseño del proyecto donde existan.

---

## Estructura del archivo

```
design_handoff_login_screen/
├── README.md                          ← este archivo
├── prototype/
│   ├── Inicio de sesion.html         ← HTML raíz (estilos + scaffolding)
│   ├── login.jsx                      ← componentes React (LoginScreen, CIHelpPopover, QR, etc.)
│   └── tweaks-panel.jsx               ← panel de ajustes (solo para el prototipo, NO portar)
└── reference/
    └── original-screenshot.png        ← captura del diseño anterior (para comparación)
```

Para abrir el prototipo: sirve la carpeta `prototype/` con cualquier servidor estático (`python -m http.server`, `vite preview`, etc.) y carga `Inicio de sesion.html`. Activa el panel "Tweaks" abajo a la derecha (ícono de la barra de tu IDE/preview) para alternar mejoras.

---

## Pantalla: Inicio de sesión

### Propósito
Permitir al ciudadano autenticarse con CI + contraseña, o más rápido, escaneando un código QR desde la app móvil oficial.

### Layout

- **Contenedor raíz** (`.app`): `min-height: 100vh`, flex column, fondo con dos radial-gradients sutiles encima del color base.
- **Topbar** (`.topbar`): 18×28 px de padding. A la izquierda, logo + texto de marca ("Identidad Digital" / "Plataforma del Estado"). A la derecha, pill de idioma + botón de ayuda.
- **Stage** (`.stage`): `flex: 1`, grid `place-items: center`, padding lateral 28 px, padding inferior 40 px.
- **Card** (`.card`): el contenedor principal del formulario.
  - `width: min(940px, 100%)`
  - `grid-template-columns: 1fr auto 1fr` (columna izquierda · separador · columna derecha)
  - Padding interno: 32 px vertical / 36 px horizontal en cada columna.
  - Borde 1 px `var(--border)`, radius 14 px, fondo con leve gradiente vertical.
  - Sombra: `0 1px 0 oklch(1 0 0 / .04) inset, 0 24px 60px -20px oklch(0 0 0 / .55)`.
- **Footer** (`.footer`): padding 16×28 px, tipografía monoespaciada 12 px.

### Breakpoint mobile (< 820 px)
- Las dos columnas pasan a `1fr` (una sobre otra).
- El separador `<span>·o·<span>` rota a horizontal.
- Padding de las columnas baja a 24 px.
- Las anotaciones UX se ocultan.

---

## Columnas

### Columna izquierda — Credenciales

Orden vertical:

1. **Tag de método**: badge "ACCESO SEGURO" con ícono de escudo. Color de ícono = `var(--accent)`.
2. **Título** (`h1`): "Inicia sesión" — 22 px / 600 / `-0.01em`.
3. **Chip de ambiente**: punto amarillo + "Ambiente · Developer" en JetBrains Mono 12 px.
4. **Campo `Cédula de identidad *`** (ver detalle abajo).
5. **Campo `Contraseña *`** (ver detalle abajo).
6. **Fila**: a la izquierda checkbox "Confiar en este dispositivo por 30 días". A la derecha enlace "Crear cuenta →".
7. **Banner de error de servidor** (cuando aplique).
8. **Acciones**: botón secundario "Volver" + botón primario "Ingresar".

### Columna derecha — QR

1. **Tag de método**: "SIN CONTRASEÑA" con ícono de teléfono.
2. **Título** (`h2`): "Escanea con tu teléfono" — 18 px / 600.
3. **Subtítulo gris**: "Más rápido y sin teclear contraseñas."
4. **QR frame**: 240×240 px, fondo blanco, radius 12 px, sombra. Contiene el SVG del QR.
5. **Status del QR**: punto verde pulsante + "Esperando tu teléfono · expira en 01:29" + botón refrescar.
6. **Pasos numerados** (1, 2, 3).
7. **CTA "¿Aún no tienes la app? Descárgala aquí"** en banner con borde punteado.

---

## Componentes — Detalle

### Campo de texto (`.input-wrap` + `<input>`)

- **Wrap**: fondo `oklch(0.20 0.005 270)`, borde 1 px `var(--border)`, radius 10 px.
- **Input**: altura 44 px, padding lateral 12 px, font-size 14 px, `font-feature-settings: "tnum"`.
- **Estados**:
  - **Focus**: borde a `var(--accent)`, anillo `0 0 0 4px oklch(0.74 0.14 265 / .18)`, fondo aclarado.
  - **Error** (`.has-error`): borde `var(--err)`, anillo rojo.
  - **Válido** (`.is-valid`): borde verde `oklch(0.55 0.10 155)`, check verde a la derecha.
- **Trailing button** (eye toggle, refresh, etc.): 34 px de hit area, color `var(--fg-3)`, hover sobre `var(--surface-2)`.

### Campo "Cédula de identidad"

- **Label** + ícono "?" que abre el popover informativo (ver abajo).
- `inputMode="numeric"` → teclado numérico en móvil.
- `autoComplete="username"` → password managers funcionan.
- `aria-invalid`, `aria-describedby` sincronizados con el mensaje de error/pista.

#### Regla de validación

Esta es **la regla más importante** del formulario. La cédula boliviana puede tener un complemento opcional de 2 caracteres alfanuméricos.

```js
const ciPattern = /^(\d{5,10})(?:-([A-Za-z0-9]{2}))?$/;
```

| Entrada       | Resultado | Razón                                 |
| ------------- | --------- | ------------------------------------- |
| `5808569`     | ✅ válida | 5–10 dígitos sin complemento          |
| `5808569-A1`  | ✅ válida | con complemento (2 chars)             |
| `123`         | ❌        | menos de 5 dígitos                    |
| `12345-A`     | ❌        | complemento de 1 char (faltan)        |
| `5808569 LP`  | ❌        | no se acepta extensión (LP/CB/SC/…)   |
| `58.085.69`   | ❌        | no se aceptan puntos                  |

**Microcopy de la pista** (cuando hay valor parcial):
- Sin complemento aún: `Ej. 5808569 o, si tu cédula tiene complemento, 5808569-A1.`
- Con complemento válido: `✓ Incluye complemento A1 — solo si aparece en tu cédula.`

**Mensaje de error**:
`Formato no válido. Usa 5–10 dígitos y, si tu cédula lo tiene, agrega el complemento (ej. 5808569-A1).`

### Campo "Contraseña"

- **Toggle de visibilidad** (Eye / EyeOff) como botón trailing, `aria-pressed`, `aria-label`.
- **Aviso de Bloq. Mayús.** activo: detectarlo con `event.getModifierState('CapsLock')` en `keydown`/`keyup`. Mostrar mensaje `field-msg warn` "Bloq. mayús. está activado." con ícono.
- **Validación**: mínimo 8 caracteres en cliente. **La validación real de credenciales es del servidor.**
- **`autoComplete="current-password"`**.

### Popover informativo de la CI (`CIHelpPopover`)

Componente importante para reducir errores. Se abre al click del ícono `?` a la derecha del label.

- **Trigger**: botón redondo 18×18 px, color hover = accent, `aria-expanded`.
- **Popover**:
  - Posición: `top: 100% + 10px; left: -8px`.
  - Ancho 360 px, fondo `var(--surface-2)`, borde, radius 12 px, sombra grande.
  - Flecha pequeña (10×10 rotada 45°) apuntando hacia arriba al trigger.
  - Header con título "¿Dónde encuentro mi número?" + botón cerrar (✕).
  - **Diagrama SVG**: ilustración **genérica** de una tarjeta de identidad (NO copia el diseño oficial del DNI; usa formas neutrales). Resalta en violeta el campo `N° DE CÉDULA` mostrando `5808569` en negro + `-A1` en violeta. Anotaciones con líneas y etiquetas: "Número" y "Complemento (si aplica)".
  - **Lista de reglas** con bullets:
    1. Ingresa el número completo tal como aparece en tu carnet.
    2. Si tu cédula **tiene un guion seguido de 2 caracteres** (ej. `-A1`, `-1K`), agrégalos al final.
    3. La mayoría **no tienen complemento**. Solo aparece en casos especiales del SEGIP.
    4. **No incluyas** la extensión (LP, CB, SC…) ni puntos.
- **Cierre**: clic fuera, tecla Esc, o el botón ✕.

### Checkbox "Confiar en este dispositivo"

- Custom checkbox (input oculto + `<span class="check-box">` decorativo).
- Tamaño 16×16 px, radius 5 px. Al marcar: fondo accent, check blanco dentro.
- Texto: "Confiar en este dispositivo por 30 días" / 13 px / `var(--fg-2)`.
- **Backend**: si está marcado, el cliente debe pedir y guardar un device-token de larga vida (30 días) para saltar 2FA o re-login en visitas futuras.

### Botón primario "Ingresar"

- Altura 44 px, padding lateral 22 px, radius 10 px, font 14 px / 600.
- Background `var(--accent)`, texto `oklch(0.22 0.06 265)` (oscuro sobre accent claro).
- Sombras: glow tenue + inset highlight top.
- **Disabled**: cuando `!ciValid || !pwdValid || submitting`. Background gris, sin sombra.
- **Loading** (`submitting`): muestra spinner girando + "Verificando…". `aria-busy={true}`.

### Banner de error de servidor

Estructura:
```jsx
<div className="server-error" role="alert">
  <Icon.Alert />
  <div>
    <strong>No pudimos iniciar tu sesión.</strong>
    <span>{mensaje del servidor}</span>
  </div>
</div>
```

- Fondo: `oklch(0.30 0.08 25 / .25)`, borde rojo, borde izquierdo 3 px destacado.
- **Importante**: el mensaje debe ser **específico** y **accionable**. Ejemplo: "La cédula o la contraseña no coinciden. Te quedan 4 intentos antes de que la cuenta se bloquee." — el contador de intentos lo provee el backend, NO se calcula en cliente.

### QR

- **No usar el SVG del prototipo en producción.** Es un patrón decorativo. Reemplázalo por una librería:
  ```bash
  npm i qrcode.react
  ```
  ```tsx
  import { QRCodeSVG } from 'qrcode.react';
  <QRCodeSVG value={challengeToken} size={216} level="M" includeMargin={false} />
  ```
- **Estados**:
  - **Activo**: punto verde pulsante + "Esperando tu teléfono · expira en MM:SS" + botón refrescar.
  - **Expirado** (`qrSeconds === 0`): blur sobre el QR + overlay oscuro con texto "El código expiró" + botón "Generar otro".
- **Lógica de tiempo**: el TTL del token viene del backend (recomendado: 90–120 s). Cada vez que el usuario pide refrescar, se solicita un nuevo `challenge_token`.
- **Comunicación con la app móvil**: el cliente debe abrir un **WebSocket** (o usar long-polling) hacia `/auth/qr/listen?token={challengeToken}`. Cuando la app móvil completa el handshake, el servidor emite `{ status: 'authenticated', session: ... }` y el cliente redirige al área autenticada.

---

## Interacciones y comportamiento

| Disparador                       | Comportamiento                                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Tipear en CI                     | Estado local; sin validar hasta `onBlur`                                                                        |
| Salir del campo CI con valor inválido | Mostrar mensaje de error inline, `aria-invalid="true"`                                                     |
| Tipear contraseña con Caps Lock  | Mostrar aviso amarillo en tiempo real                                                                           |
| Toggle del ojo                   | Cambia `type` entre `password` y `text`, conserva el foco en el input                                           |
| Submit con form inválido         | Botón está disabled, no se dispara                                                                              |
| Submit con form válido           | Llamar `POST /auth/login`; mostrar spinner; al recibir 401 mostrar banner; al recibir 200 redirigir             |
| Click en `?` de CI               | Abrir popover; cerrar con click fuera / Esc / ✕                                                                 |
| Countdown QR llega a 0           | Mostrar overlay "expirado"; el polling/WebSocket se cierra                                                      |
| Click "Generar otro" QR          | `POST /auth/qr/new` → nuevo token → resetear `qrSeconds` a 90                                                   |
| Idioma                           | Cambiar locale, persistir en cookie `lang=es|ay|qu`                                                             |

### Animaciones

- **Foco en inputs**: `transition: border-color .15s, box-shadow .15s, background .15s`.
- **Punto verde QR**: `pulse` 1.6 s ease-in-out infinite (anillo de glow expandiéndose).
- **Spinner del botón**: `spin` 0.9 s linear infinite.
- **Popover open**: `popIn` 0.14 s ease-out (fade + translateY -4px → 0).
- **Hover en botón primario**: `transform: translateY(-1px); filter: brightness(1.06)`.

---

## State management

Variables locales del componente:

```ts
type LoginState = {
  ci: string;
  pwd: string;
  showPwd: boolean;
  capsOn: boolean;
  touchedCi: boolean;     // bandera para validación inline
  touchedPwd: boolean;
  trustDevice: boolean;
  qrSeconds: number;      // countdown, init 90
  qrToken: string;        // viene del backend
  qrChannel: WebSocket;
  submitting: boolean;
  serverError: string | null;
};
```

Cuando integres con un store (Redux/Zustand/Pinia/etc.):
- `auth.session` global (usuario, token, expiración).
- `auth.qrChallenge` mientras el QR esté activo.
- El form en sí puede mantenerse local con `useState` / `react-hook-form` / etc.

### Endpoints recomendados

| Método | Path                    | Propósito                                          |
| ------ | ----------------------- | -------------------------------------------------- |
| POST   | `/auth/login`           | Login con CI + password. Devuelve session token.   |
| POST   | `/auth/qr/new`          | Crear challenge para QR.                           |
| WS     | `/auth/qr/listen`       | Esperar handshake desde la app.                    |
| POST   | `/auth/logout`          | Cerrar sesión.                                     |
| GET    | `/auth/attempts-left?ci=…` | (opcional) Devolver intentos restantes en errores. |

---

## Tokens de diseño

Todos definidos como variables CSS en `:root` del prototipo. Pórtalas a tu sistema de tokens (Tailwind config, CSS Modules, design tokens JSON, etc.).

### Color (modo oscuro — único modo del prototipo)

| Token            | Valor                          | Uso                                       |
| ---------------- | ------------------------------ | ----------------------------------------- |
| `--bg`           | `oklch(0.18 0.005 270)`        | Fondo de la app                           |
| `--surface`      | `oklch(0.235 0.006 270)`       | Card principal                            |
| `--surface-2`    | `oklch(0.275 0.007 270)`       | Hover / popovers                          |
| `--border`       | `oklch(0.34 0.008 270)`        | Bordes neutros                            |
| `--border-2`     | `oklch(0.42 0.012 270)`        | Bordes énfasis                            |
| `--fg`           | `oklch(0.97 0.005 270)`        | Texto principal                           |
| `--fg-2`         | `oklch(0.82 0.008 270)`        | Texto secundario                          |
| `--fg-3`         | `oklch(0.66 0.010 270)`        | Texto terciario / labels                  |
| `--fg-4`         | `oklch(0.52 0.012 270)`        | Texto deshabilitado / placeholder         |
| `--ok`           | `oklch(0.78 0.13 155)`         | Verde — éxito, status activo              |
| `--warn`         | `oklch(0.82 0.13 80)`          | Ámbar — avisos (Caps Lock, ambiente)      |
| `--err`          | `oklch(0.72 0.18 25)`          | Rojo — errores                            |
| `--accent`       | `oklch(0.74 0.14 265)`         | **Acción primaria — índigo**              |
| `--accent-fg`    | `oklch(0.34 0.14 265)`         | Texto sobre accent                        |
| `--accent-soft`  | `oklch(0.30 0.06 265)`         | Acento atenuado (badges, números de paso) |

> **Variantes de acento** (vienen del Tweak): `teal` `oklch(0.78 0.13 195)`, `amber` `oklch(0.82 0.13 75)`. Decide con producto cuál usar en final.

### Modo "Alto contraste"
Sube luminosidad de `fg-2`, `fg-3`, `fg-4` y aclara `border`/`border-2`. Considera exponerlo como toggle de accesibilidad real en el proyecto.

### Espaciado
No hay escala formal; los valores comunes son **4, 6, 8, 10, 12, 14, 16, 18, 22, 28, 32, 36, 40** px. Usa la escala de tu sistema si ya existe; si no, normalízalos a múltiplos de 4.

### Tipografía

| Familia                       | Uso                                                |
| ----------------------------- | -------------------------------------------------- |
| **Inter** (400, 500, 600, 700) | UI general                                         |
| **JetBrains Mono** (400, 500)  | Códigos, CI, ambiente, footer                       |

| Token                    | Tamaño  | Peso | Letter-spacing | Uso                                       |
| ------------------------ | ------- | ---- | -------------- | ----------------------------------------- |
| Display (h1)             | 22 px   | 600  | -0.01em        | Título de columna                         |
| Heading (h2)             | 18 px   | 600  | -0.005em       | Subtítulo de columna                      |
| Body                     | 14 px   | 400  | 0              | Inputs, párrafos                          |
| Body-strong              | 14 px   | 600  | 0              | Botón primario, énfasis                   |
| Small                    | 12.5 px | 400  | 0              | Pistas, status                            |
| Label                    | 13 px   | 500  | 0              | Etiquetas de campo                        |
| Caption                  | 11 px   | 600  | 0.08em / upper | Method tags, secciones                    |
| Mono small               | 12 px   | 400  | 0              | Ambiente, footer                          |

### Radius

| Token  | Valor  | Uso                          |
| ------ | ------ | ---------------------------- |
| Sm     | 5–6 px | Checkbox, code chips         |
| Md     | 8–10 px| Inputs, popovers, banners    |
| Lg     | 12 px  | QR frame                     |
| Xl     | 14 px  | Card principal               |
| Pill   | 999 px | Pills, status badges         |

### Sombras

- **Card**: `0 1px 0 oklch(1 0 0 / .04) inset, 0 24px 60px -20px oklch(0 0 0 / .55)`
- **QR frame**: `0 12px 28px -12px oklch(0 0 0 / .55)`
- **Popover**: `0 18px 40px -12px oklch(0 0 0 / .7)`
- **Botón primary glow**: `0 1px 0 oklch(1 0 0 / .25) inset, 0 8px 24px -10px oklch(0.74 0.14 265 / .8)`

---

## Accesibilidad

Implementaciones que **debes preservar** al portar:

- `aria-invalid="true"` en inputs con error.
- `aria-describedby` apuntando al mensaje de error o pista.
- `aria-busy="true"` en el botón cuando está enviando.
- `aria-pressed` en el toggle de ojo.
- `aria-expanded` en el trigger del popover; `role="dialog"` y `aria-label` en el popover.
- `role="alert"` en el banner de error de servidor (anuncia al screen reader).
- `inputMode="numeric"` y `pattern="[0-9]*"` en CI para teclado móvil correcto.
- `autoComplete="username"` y `autoComplete="current-password"`.
- **Focus visible**: anillo `2px solid var(--accent)` con `outline-offset: 2px` en todos los interactivos.
- Etiquetas asociadas con `htmlFor`.
- Cerrar el popover con tecla Esc.
- Contraste mínimo AA (4.5:1) para texto sobre fondo en modo normal; AAA disponible en modo "alto contraste".

**A validar antes de producción**:
- Probar con NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android).
- Pasar `axe-core` sobre la página.
- Navegación 100 % con teclado: tab order debe ser lógico (CI → ? → password → eye → forgot → trust → crear cuenta → volver → ingresar → QR refresh).
- Verificar zoom 200 % sin scroll horizontal.

---

## Internacionalización

El producto debe soportar **es / ay / qu** (español, aymara, quechua). Extrae todos los strings a un archivo de mensajes (`i18next`, `react-intl`, etc.):

```json
{
  "login.title": "Inicia sesión",
  "login.method.secure": "Acceso seguro",
  "login.method.passwordless": "Sin contraseña",
  "login.ci.label": "Cédula de identidad",
  "login.ci.hint.basic": "Ej. {example} o, si tu cédula tiene complemento, {exampleWithComplement}.",
  "login.ci.hint.withComplement": "Incluye complemento {value} — solo si aparece en tu cédula.",
  "login.ci.error.format": "Formato no válido. Usa 5–10 dígitos y, si tu cédula lo tiene, agrega el complemento (ej. {example}).",
  "login.ci.help.title": "¿Dónde encuentro mi número?",
  "login.ci.help.rule1": "Ingresa el número completo tal como aparece en tu carnet.",
  "login.ci.help.rule2": "Si tu cédula tiene un guion seguido de 2 caracteres (ej. -A1, -1K), agrégalos al final.",
  "login.ci.help.rule3": "La mayoría no tienen complemento. Solo aparece en casos especiales registrados por el SEGIP.",
  "login.ci.help.rule4": "No incluyas la extensión (LP, CB, SC…) ni puntos.",
  "login.pwd.label": "Contraseña",
  "login.pwd.error.short": "Mínimo 8 caracteres.",
  "login.pwd.warn.caps": "Bloq. mayús. está activado.",
  "login.trust": "Confiar en este dispositivo por 30 días",
  "login.forgot": "¿Olvidaste tu contraseña?",
  "login.createAccount": "Crear cuenta",
  "login.actions.back": "Volver",
  "login.actions.submit": "Ingresar",
  "login.actions.submitting": "Verificando…",
  "login.error.serverTitle": "No pudimos iniciar tu sesión.",
  "login.qr.title": "Escanea con tu teléfono",
  "login.qr.subtitle": "Más rápido y sin teclear contraseñas.",
  "login.qr.waiting": "Esperando tu teléfono · expira en {time}",
  "login.qr.expired": "El código expiró",
  "login.qr.regenerate": "Generar otro",
  "login.qr.steps.1": "Abre la app **Identidad Digital**.",
  "login.qr.steps.2": "Toca **Escanear QR** en el menú principal.",
  "login.qr.steps.3": "Apunta a esta imagen para entrar.",
  "login.qr.getApp": "¿Aún no tienes la app? **Descárgala aquí**"
}
```

---

## Assets

- **Logo de "Identidad Digital"** (`BrandMark` en el prototipo): es un placeholder genérico. **Reemplázalo por el logo oficial** del proyecto. Mantén el tamaño 28×28 px en el topbar.
- **Iconos**: todos son SVG inline en `login.jsx`. Si tu proyecto usa una librería (lucide-react, heroicons, phosphor), reemplázalos por equivalentes. Mapeo recomendado a `lucide-react`:
  - `Icon.Eye` → `Eye`
  - `Icon.EyeOff` → `EyeOff`
  - `Icon.Help` → `HelpCircle`
  - `Icon.Lang` → `Globe`
  - `Icon.Check` → `Check`
  - `Icon.Alert` → `AlertTriangle`
  - `Icon.Refresh` → `RotateCw`
  - `Icon.Spin` → `Loader2` (con `animate-spin`)
  - `Icon.Caps` → `ArrowBigUp`
  - `Icon.Phone` → `Smartphone`
  - `Icon.Shield` → `ShieldCheck`
  - `Icon.Arrow` → `ArrowRight`
- **Diagrama de la cédula** en el popover: es un SVG genérico embebido en el componente. **No copia el diseño oficial.** Puedes refinar con un ilustrador, pero NO uses la imagen real del DNI (no es legal).

---

## Checklist antes de subir a producción

- [ ] Reemplazar el patrón decorativo del QR por la librería `qrcode.react`.
- [ ] Implementar el WebSocket / polling de espera del QR.
- [ ] Conectar `/auth/login` con manejo de 200/401/429/500.
- [ ] Rate limiting **en backend** (no en cliente) + bloqueo tras N intentos.
- [ ] "Confiar dispositivo" → device token de 30 días almacenado en cookie httpOnly secure.
- [ ] Extraer strings a i18n para es/ay/qu.
- [ ] Reemplazar `BrandMark` por el logo oficial.
- [ ] CSP headers estrictos (`script-src 'self'`, etc.).
- [ ] HTTPS obligatorio + HSTS.
- [ ] Tests e2e: validación CI, error 401, expiración QR, refresh QR, login exitoso, login con dispositivo confiado.
- [ ] Tests de accesibilidad: axe-core, navegación por teclado, screen reader.
- [ ] Telemetría: ¿cuántos usuarios usan QR vs contraseña? ¿cuántos abren el popover de ayuda CI? ¿en qué campo se traban más? ¿cuántos fallos por Caps Lock?

---

## Mejoras de usabilidad aplicadas

Lista resumida de cambios vs. la versión anterior. Útil para el ticket / PR description.

1. Validación inline con mensajes específicos al perder el foco.
2. Popover educativo del formato de cédula (con diagrama).
3. Aviso de Bloq. Mayús. al teclear contraseña.
4. Toggle de visibilidad de contraseña con estados accesibles.
5. Botón "Ingresar" deshabilitado hasta que el form sea válido; loading real durante el envío.
6. Banner de error de servidor específico + intentos restantes.
7. QR con cuenta regresiva, status visible y estado expirado.
8. Pasos del QR numerados con jerarquía clara.
9. CTA para descargar la app (corta el callejón sin salida).
10. "Confiar dispositivo (30 días)" reduce fricción para recurrentes.
11. Idioma visible como pill multi-opción.
12. Indicador de ambiente como chip monoespaciado (no confundible con rol del usuario).
13. Contraste AA garantizado; modo AAA disponible.
14. Estados de foco visibles en todos los interactivos.
15. Soporte real para password managers y teclado numérico móvil.

---

## Preguntas abiertas para producto

- **¿"Crear cuenta" lleva a un flujo dentro de la app o a un sitio externo del SEGIP?**
- **¿Cuántos intentos antes de bloqueo?** El prototipo muestra "4 restantes" como ejemplo.
- **¿Cuál es el TTL real del challenge QR?** El prototipo asume 90 s.
- **¿"Confiar dispositivo" requiere 2FA en el login inicial?** Recomendado: sí.
- **¿Hay un flujo de "primer ingreso" distinto (crear contraseña la primera vez)?**
- **¿La extensión LP/CB/SC tiene algún rol en algún flujo, aunque no se pida aquí?**

---

**Última actualización**: handoff generado a partir del prototipo `Inicio de sesion.html`.
