# Propuesta de implementación OTP / MFA — Auth Backend FELCN

## 1. Referencia de mercado — cómo lo hacen las empresas grandes

### Google Workspace / Gmail
- **Config global**: el admin habilita o fuerza 2FA para toda la organización o por unidad organizacional.
- **Config por usuario**: el usuario elige su método (TOTP app, SMS, llave de seguridad física).
- **Dispositivos de confianza**: el usuario puede marcar un dispositivo para no requerir OTP por N días.
- **Canales**: Google Authenticator (TOTP), SMS, llamada, backup codes, FIDO2.

### Microsoft Azure AD / Entra ID
- **Política de Acceso Condicional** (global): aplica MFA según riesgo del inicio de sesión, red, dispositivo y rol.
- **Métodos de autenticación** (admin global): activa o desactiva cada canal para toda la organización.
- **Config por usuario**: el usuario registra sus métodos disponibles; el admin puede forzar re-registro.
- **Canales**: Microsoft Authenticator (push + TOTP), SMS, voz, FIDO2.

### Okta (Identity Platform empresarial)
- **Sign-On Policies** (global): reglas sobre cuándo exigir MFA (siempre, por zona de red, por dispositivo, por riesgo adaptativo).
- **Enrollment Policies**: quién debe registrar MFA, con un período de gracia configurable (ej. 7 días para que el usuario lo active).
- **Por usuario/grupo**: se asigna qué factores están disponibles para cada grupo de usuarios.
- **Factor sequencing**: define el orden de canales (primero push, si falla SMS, etc.).

### Bancos y Fintechs Bolivia (BNB, Banco Unión, Tigo Money)
- OTP numérico de **6 dígitos**, vigencia de **5 minutos**.
- **Máximo 3 intentos** de ingreso por OTP; al tercer fallo se invalida y se solicita uno nuevo.
- **Rate limiting**: máximo 1 OTP generado por minuto por usuario, máximo 5 por hora (anti-spam).
- Canal SMS con fallback a correo si el SMS falla.

---

## 2. Patrones clave identificados

| Patrón | Descripción |
|--------|-------------|
| **Config global primero** | Un switch maestro activa o desactiva OTP para toda la plataforma. Permite encender/apagar sin deployar código. |
| **Override por usuario** | El admin puede forzar OTP a un usuario específico independientemente del global. |
| **Canal por usuario** | El usuario (o admin) elige su canal preferido. Si no tiene preferencia, usa el default global. |
| **Tabla separada para la sesión OTP** | El código OTP no vive en la tabla del usuario; tiene su propia tabla con TTL y contador de intentos. |
| **Hash del código** | Nunca se guarda el código en texto plano — se guarda su hash bcrypt. |
| **Rate limiting** | Se limita cuántos OTPs puede generar un usuario en un período para evitar spam/abuso. |
| **Invalidación por uso** | Una vez verificado, el OTP se marca como consumido e no puede reutilizarse. |

---

## 3. Diagnóstico del estado actual

### Lo que ya existe y se reutiliza

| Componente | Archivo | Estado | Uso en OTP |
|---|---|---|---|
| `MensajeriaService.sendEmail()` | `mensajeria.service.ts` | ✅ Funcional | Canal email listo |
| `MensajeriaService.sendSms()` | `mensajeria.service.ts` | Stub (log) | Evoluciona a WhatsApp |
| `TemplateEmailService` | `templates-email.service.ts` | ✅ 4 templates | Agregar Template 5: OTP |
| `TextService.generateShortRandomText()` | `text.service.ts` | ✅ alfanumérico | Generar código OTP |
| `TextService.encrypt() / compare()` | `text.service.ts` | ✅ bcrypt | Hashear/verificar OTP |
| `Parametro` entity + service | `parametro/` | ✅ Funcional | Config global OTP |
| `Usuario` entity | `usuario.entity.ts` | ✅ Base | Agregar flags OTP |

### Lo que NO existe (a crear)

- Flags OTP en `usuario` (`otp_habilitado`, `otp_canal`)
- Tabla `otp_sesion` (sesión de verificación pendiente)
- Template email para código OTP
- `sendWhatsapp()` en mensajería
- Endpoint `POST /auth/otp` y lógica de verificación
- Constantes de parámetros OTP en tabla `parametro`

---

## 4. Diseño de la solución

### 4.1 Config global — tabla `parametro`

Se usan registros en la tabla existente `parametro`, grupo `OTP`:

| Código | Nombre | Valor | Descripción |
|--------|--------|-------|-------------|
| `OTP_GLOBAL_HABILITADO` | OTP Habilitado globalmente | `true` | Switch maestro. Si es `false`, nadie requiere OTP aunque tenga el flag activo. |
| `OTP_EXPIRACION_MIN` | Expiración en minutos | `5` | Minutos de vigencia del código. |
| `OTP_MAX_INTENTOS` | Máximo de intentos | `3` | Intentos antes de invalidar el OTP. |
| `OTP_LONGITUD` | Longitud del código | `6` | Dígitos del código numérico. |
| `OTP_CANAL_DEFAULT` | Canal por defecto | `EMAIL` | `EMAIL` o `WHATSAPP`. Usado cuando el usuario no tiene canal configurado. |
| `OTP_RATE_LIMIT_MIN` | Rate limit (por minuto) | `1` | Máximos OTPs generables por usuario por minuto. |

**Regla de negocio final:**
```
requiereOtp = (OTP_GLOBAL_HABILITADO === 'true') AND (usuario.otpHabilitado === true)
canal       = usuario.otpCanal ?? OTP_CANAL_DEFAULT
```

### 4.2 Config por usuario — tabla `usuario`

Dos columnas nuevas:

```sql
ALTER TABLE usuario.usuario
  ADD COLUMN otp_habilitado   BOOLEAN     NOT NULL DEFAULT false,
  ADD COLUMN otp_canal        VARCHAR(20)          DEFAULT NULL;
-- otp_canal: 'EMAIL' | 'WHATSAPP' | NULL (usa el default global)
```

### 4.3 Tabla `otp_sesion` — sesión OTP pendiente

```sql
CREATE TABLE usuario.otp_sesion (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario      BIGINT        NOT NULL REFERENCES usuario.usuario(id),
  codigo_hash     VARCHAR(255)  NOT NULL,           -- bcrypt del código
  canal           VARCHAR(20)   NOT NULL,           -- 'EMAIL' | 'WHATSAPP'
  destino         VARCHAR(255)  NOT NULL,           -- correo o teléfono ofuscado
  intentos        INTEGER       NOT NULL DEFAULT 0,
  consumido       BOOLEAN       NOT NULL DEFAULT false,
  expiracion      TIMESTAMPTZ   NOT NULL,
  fecha_creacion  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  -- auditoría mínima: no extiende AuditoriaEntity (es temporal)
  CONSTRAINT chk_canal CHECK (canal IN ('EMAIL', 'WHATSAPP'))
);
CREATE INDEX idx_otp_sesion_usuario ON usuario.otp_sesion(id_usuario);
```

> Esta tabla es **temporal/efímera**: los registros consumidos o expirados se limpian. Se puede agregar un cron job o limpiarlos en cada generación de OTP.

### 4.4 Flujo de autenticación con OTP

```
┌─────────────────────────────────────────────────────────────────────┐
│  PASO 1 — Credenciales                                              │
│                                                                     │
│  POST /auth  { usuario, contrasena }                                │
│                           │                                         │
│                    Validar usuario/contraseña                       │
│                           │                                         │
│              ┌────────────┴─────────────┐                          │
│              │ OTP requerido?            │ NO → JWT directo (actual)│
│              │ (global AND usuario)      │                          │
│              └────────────┬─────────────┘                          │
│                           │ SI                                      │
│                    Rate limit OK?                                   │
│                           │                                         │
│                    Generar código OTP (6 dígitos numéricos)        │
│                    Hashear con bcrypt                               │
│                    Guardar en otp_sesion (TTL 5 min)               │
│                    Enviar por canal (email / WhatsApp)             │
│                           │                                         │
│                    Responder:                                       │
│                    { requiereOtp: true, otpSesionId: UUID }        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  PASO 2 — Verificación OTP                                          │
│                                                                     │
│  POST /auth/otp  { otpSesionId, codigo }                           │
│                           │                                         │
│                    Buscar otp_sesion por ID                         │
│                    ¿Expirado? → 401 "OTP expirado"                 │
│                    ¿Consumido? → 401 "OTP ya utilizado"            │
│                    ¿intentos >= MAX_INTENTOS? → 401 "Bloqueado"    │
│                           │                                         │
│                    bcrypt.compare(codigo, codigo_hash)              │
│                           │                                         │
│              ┌────────────┴─────────────┐                          │
│              │ Incorrecto                │ Correcto                 │
│              │ intentos++                │ consumido = true         │
│              │ 401 "Código incorrecto"   │ Generar JWT              │
│              └───────────────────────────┘ Responder con JWT       │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.5 Canal WhatsApp

`MensajeriaService` se amplía con `sendWhatsapp()`. Opciones de gateway evaluadas:

| Gateway | Tipo | Ventajas | Limitaciones |
|---------|------|----------|--------------|
| **Meta WA Cloud API** | Oficial | Confiable, escalable, soporte oficial | Requiere cuenta de negocio verificada (~7 días) + plantillas aprobadas |
| **Twilio WhatsApp** | Intermediario | SDK NestJS disponible, fácil integración | Costo por mensaje, requiere cuenta Twilio + aprobación Meta |
| **WAHA** (self-hosted) | Informal | Gratis, sin aprobaciones | Riesgo de ban de número, no apto para producción gubernamental |

**Recomendación para FELCN**: Meta WA Cloud API o Twilio. Mientras no se tenga la cuenta, `sendWhatsapp()` actúa como stub (log, mismo patrón que `sendSms()`).

---

## 5. Archivos a crear/modificar

### Modificaciones a existentes

| Archivo | Cambio |
|---------|--------|
| `usuario/entity/usuario.entity.ts` | +2 columnas: `otpHabilitado`, `otpCanal` |
| `usuario/dto/actualizar-usuario.dto.ts` | Agregar campos OTP opcionales |
| `usuario/service/usuario.service.ts` | Método `actualizarConfigOtp()` |
| `mensajeria/mensajeria.service.ts` | Agregar `sendWhatsapp()` (stub) |
| `templates/templates-email.service.ts` | Template 5: código OTP con countdown |
| `authentication/service/authentication.service.ts` | Lógica OTP en `validarUsuario()` + `verificarOtp()` |
| `authentication/controller/authentication.controller.ts` | Endpoint `POST /auth/otp` |
| `authentication/dto/index.dto.ts` | `VerificarOtpDto` |
| `authentication/authentication.module.ts` | Registrar `OtpSesionRepository`, `OtpService` |

### Archivos nuevos

| Archivo | Descripción |
|---------|-------------|
| `authentication/entity/otp-sesion.entity.ts` | Entidad TypeORM de la sesión OTP |
| `authentication/repository/otp-sesion.repository.ts` | Queries: crear, buscar, consumir, limpiar |
| `authentication/service/otp.service.ts` | Generación, envío, verificación y rate limit |
| `database/scripts/otp-sesion.sql` | Migración SQL para la nueva tabla |
| `database/seeds/parametros-otp.ts` | Seeds de parámetros OTP en tabla `parametro` |

---

## 6. Seguridad y consideraciones adicionales

| Aspecto | Decisión |
|---------|----------|
| **Código en texto plano** | Nunca. Siempre `bcrypt.hash()` antes de persistir. |
| **Ofuscación del destino** | La respuesta del paso 1 muestra `"Se envió a j***@felcn.gob.bo"` — nunca el destino completo. |
| **Intentos fallidos** | Al superar `OTP_MAX_INTENTOS`, la sesión OTP se invalida. El usuario debe solicitar uno nuevo. |
| **Rate limiting** | Controlar en `OtpService` con timestamp del último OTP generado (columna `fecha_creacion` de la sesión más reciente). |
| **Limpieza de registros** | Al generar un nuevo OTP, invalidar sesiones previas pendientes del mismo usuario. Limpiar expirados en cada operación. |
| **Auditoría** | Registrar en el logger institucional: canal enviado, destino ofuscado, resultado de verificación. |
| **Retrocompatibilidad** | Usuarios con `otpHabilitado = false` siguen con el flujo actual (usuario+contraseña → JWT directo). Sin impacto en producción existente. |

---

## 7. Impacto en el frontend

El frontend debe manejar la respuesta `{ requiereOtp: true, otpSesionId }` del `POST /auth` y mostrar una pantalla de ingreso de código antes de recibir el JWT. El `otpSesionId` se usa como token temporal de la sesión pendiente (no es el JWT).

---

## 8. Orden de implementación sugerido

1. **Migración BD**: columnas en `usuario` + tabla `otp_sesion` + seeds de parámetros
2. **`OtpSesionEntity` + `OtpSesionRepository`**
3. **`OtpService`**: generación, envío, verificación, rate limit
4. **`MensajeriaService`**: `sendWhatsapp()` stub
5. **Template email OTP** (`TemplateEmailService`)
6. **`AuthenticationService`**: integrar OTP en `validarUsuario()`
7. **`AuthenticationController`**: endpoint `POST /auth/otp`
8. **`UsuarioService`**: método `actualizarConfigOtp()` para admin
9. **Tests unitarios**: `OtpService.verificarOtp()` (casos: expirado, consumido, intentos agotados, correcto)
