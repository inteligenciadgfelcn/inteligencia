# Propuesta de Implementación — Fases 2, 3 y 4

> **Elaborado:** 2026-02-27
> **Proyecto:** felcn-auth-backend
> **Contexto:** Sistema de gestión de autenticación y autorización institucional FELCN

---

## Resumen ejecutivo

Este documento describe las tres fases de implementación pendientes para completar el sistema empresarial de autenticación y autorización. Las fases se pueden ejecutar de forma secuencial; la Fase 2 (Keycloak) habilita las demás al centralizar la gestión de identidades.

```
Fase 2: Keycloak como IdP central
   ↓
Fase 3: 2FA (email + SMS)
   ↓
Fase 4: Características empresariales
```

---

## Fase 2 — Integración Keycloak

### Objetivo

Reemplazar la autenticación local y OIDC directo por **Keycloak como Identity Provider central**, conservando la autorización fine-grained de Casbin. Todo flujo de autenticación (local, Ciudadanía Digital) pasa por Keycloak; el backend solo valida tokens.

### Arquitectura propuesta

```
Frontend
  │
  ▼
Keycloak (realm: felcn)
  ├── Flujo local (usuario + contraseña + 2FA)
  ├── Broker → Ciudadanía Digital (OIDC)
  └── Emite JWT firmado con clave propia
         │
         ▼
    Backend NestJS
         ├── JwtKeycloakStrategy → valida JWKS de KC
         ├── Sincroniza roles KC → Casbin
         └── Casbin Guard → autorización fine-grained
```

### Componentes a implementar

#### 2.1 Docker Compose — activar Keycloak

En `docker-compose.yml` descomentar el servicio `keycloak` ya preparado:

```yaml
keycloak:
  image: quay.io/keycloak/keycloak:26
  command: start-dev --import-realm
  environment:
    KC_DB: postgres
    KC_DB_URL: jdbc:postgresql://postgres:5432/auth
    KC_DB_SCHEMA: keycloak
    KC_BOOTSTRAP_ADMIN_USERNAME: admin
    KC_BOOTSTRAP_ADMIN_PASSWORD: admin123
  volumes:
    - ./keycloak/realm-felcn.json:/opt/keycloak/data/import/realm-felcn.json
  ports:
    - "8080:8080"
```

#### 2.2 Realm `felcn` — archivo `keycloak/realm-felcn.json`

Configuración del realm a exportar/importar:

```
Realm: felcn
  ├── Clients
  │   ├── felcn-backend  (confidential, service accounts enabled)
  │   └── felcn-frontend (public, PKCE, redirect URIs del frontend)
  │
  ├── Roles (realm-level)
  │   ├── ADMINISTRADOR
  │   ├── TECNICO
  │   └── USUARIO
  │
  ├── Identity Providers
  │   └── ciudadania-digital (OIDC)
  │       ├── issuer: https://account-idetest.agcs.agetic.gob.bo
  │       ├── client_id: (del .env actual OIDC_CLIENT_ID)
  │       ├── client_secret: (del .env actual OIDC_CLIENT_SECRET)
  │       └── mappers:
  │           ├── sub → atributo ciudadaniaDigital
  │           ├── email → correo_electronico
  │           └── given_name + family_name → nombre completo
  │
  └── Authentication Flows
      ├── felcn-browser (con 2FA condicional — Fase 3)
      └── felcn-cd-flow (broker Ciudadanía Digital)
```

#### 2.3 Nuevo módulo `src/core/keycloak/`

```
keycloak/
├── keycloak-admin.service.ts     ← Keycloak Admin REST API
│   Métodos:
│   - crearUsuario(datos)
│   - actualizarUsuario(kcUserId, datos)
│   - asignarRol(kcUserId, rol)
│   - revocarRol(kcUserId, rol)
│   - listarSesionesActivas(kcUserId)
│   - forzarLogout(kcUserId)
│   - resetearContrasena(kcUserId, nueva)
│   - habilitarDeshabilitar2FA(kcUserId, bool)
│
├── token-validation.service.ts   ← Validación JWKS pública de KC
│   Métodos:
│   - validarToken(bearerToken): DecodedToken
│   - obtenerJwks(): JwksResponse
│
└── keycloak.module.ts
```

#### 2.4 Actualizar estrategia JWT (`src/core/authentication/strategies/`)

**Archivo:** `jwt-keycloak.strategy.ts` (nuevo, reemplaza o convive con `jwt.strategy.ts`)

```typescript
// Puntos clave:
// - issuer: process.env.KC_ISSUER
// - jwksUri: process.env.KC_JWKS_URI
// - Extraer roles de: payload.realm_access.roles
// - Mapear kcUserId → idUsuario local (por usuario o email)
// - Al primer login KC: crear/actualizar UsuarioRol en DB
// - Sincronizar roles KC → Casbin automáticamente
```

#### 2.5 Sincronización roles KC ↔ Casbin

Al validar cada token KC:
1. Extraer `realm_access.roles` del JWT
2. Comparar con `UsuarioRol` en DB local
3. Si hay diferencia → actualizar `UsuarioRol` + recargar políticas Casbin
4. Cachear por TTL (evitar query en cada request)

#### 2.6 Variables de entorno (agregar a `.env.sample`)

```env
KC_URL=http://localhost:8080
KC_REALM=felcn
KC_CLIENT_ID=felcn-backend
KC_CLIENT_SECRET=__KC_CLIENT_SECRET__
KC_JWKS_URI=http://localhost:8080/realms/felcn/protocol/openid-connect/certs
KC_ISSUER=http://localhost:8080/realms/felcn
KC_ADMIN_CLIENT_ID=felcn-backend-admin
KC_ADMIN_CLIENT_SECRET=__KC_ADMIN_CLIENT_SECRET__
```

#### 2.7 Migración de usuarios existentes

Script de migración (ejecutar una vez):
1. Leer todos los `Usuario` de la DB
2. Para cada usuario: POST a Keycloak Admin API → crear usuario en realm
3. Asignar roles según `UsuarioRol`
4. El campo `usuario.keycloakId` (nuevo) guarda el UUID de KC

**Nuevo campo en `Usuario`:**
```typescript
keycloakId: string | null  // UUID del usuario en Keycloak
```

**Migration:**
```
1709000004000-AddKeycloakIdToUsuario.ts
```

### Dependencias npm (Fase 2)

```bash
npm install @keycloak/keycloak-admin-client
npm install jwks-rsa
# o alternativamente:
npm install passport-jwt  # ya instalado
```

---

## Fase 3 — Autenticación de Dos Factores (2FA)

### Objetivo

Implementar 2FA obligatorio/opcional con envío de código OTP por **email** usando `MensajeriaService` (SMTP via nodemailer) ya integrado en el proyecto, y por **WhatsApp** (Meta Cloud API, pendiente de credenciales WABA de FELCN).

### Estrategia

#### 3.1 En Keycloak (recomendado para flujos KC)

Desarrollar un **SPI (Service Provider Interface)** de Keycloak para envío de OTP vía SMS/Email del sistema Mensajería de AGETIC.

```
keycloak/providers/
└── felcn-otp-provider/
    ├── pom.xml
    └── src/main/java/bo/gob/felcn/keycloak/
        ├── SmsOtpAuthenticator.java
        │   └── → MensajeriaService.sendEmail() con OTP generado
        ├── EmailOtpAuthenticator.java
        └── FelcnOtpAuthenticatorFactory.java
```

Configuración en KC Authentication Flow:
```
felcn-browser:
  1. Username Password Form
  2. OTP Form (conditional: si usuario tiene 2FA habilitado)
     └── FelcnOtpAuthenticator (SMS o Email)
```

#### 3.2 En Backend NestJS (para flujos sin KC / fallback)

**Nueva entidad:** `ConfiguracionDosFA`

```typescript
// schema: usuarios
ConfiguracionDosFA {
  id             BIGINT PK
  idUsuario      BIGINT FK (unique)
  habilitado     BOOLEAN DEFAULT false
  metodo         ENUM('EMAIL', 'SMS', 'AMBOS', 'TOTP')
  telefonoDosfa  VARCHAR(20)   // puede diferir del tel. principal
  emailDosfa     VARCHAR(100)  // puede diferir del email principal
  secretoTotp    VARCHAR(100)  // para TOTP apps (Google Authenticator)
  codigosBackup  TEXT          // JSON con códigos de respaldo encriptados
  fechaConfig    TIMESTAMP
}
```

**Migration:** `1709000005000-CreateConfiguracionDosFA.ts`

**Nuevo módulo:** `src/core/dos-fa/`

```
dos-fa/
├── entity/configuracion-dos-fa.entity.ts
├── service/
│   ├── dos-fa.service.ts          ← genera/valida OTPs
│   └── otp-generator.service.ts  ← genera código 6 dígitos, TTL 5 min
├── controller/dos-fa.controller.ts
└── dos-fa.module.ts
```

**Flujo de login con 2FA (backend local):**

```
1. POST /auth  → credenciales válidas → si 2FA habilitado:
   ├── Generar OTP (6 dígitos)
   ├── Guardar hash(OTP) + expiración en Redis/DB
   ├── Enviar por email via MensajeriaService (SMTP) y/o WhatsApp via WhatsappService
   └── Retornar: { requires2FA: true, tempToken: "...", method: "SMS" }

2. POST /auth/verificar-2fa  → { tempToken, otp }
   ├── Validar tempToken (JWT corto, 5 min, sin roles)
   ├── Validar OTP (hash + no expirado)
   ├── Registrar en BitacoraLogin con metodo=2FA
   └── Retornar: JWT completo + refreshToken
```

**Endpoints nuevos:**
```
POST   /auth/verificar-2fa            ← validar OTP
POST   /auth/reenviar-codigo          ← reenviar OTP
GET    /api/usuarios/cuenta/dos-fa    ← estado 2FA del usuario
POST   /api/usuarios/cuenta/dos-fa    ← habilitar 2FA
DELETE /api/usuarios/cuenta/dos-fa    ← deshabilitar 2FA
GET    /api/usuarios/cuenta/dos-fa/backup-codes ← generar códigos de respaldo
```

**Extensión de `Usuario` para 2FA temporal:**
```typescript
// Campos a agregar a usuario.entity.ts
codigoDosfa         VARCHAR(100)   // hash del OTP temporal
codigoDofaExpira    TIMESTAMP      // expiración del OTP
```

**Migration:** `1709000006000-AddDofaFieldsToUsuario.ts`

### Dependencias npm (Fase 3)

```bash
npm install otplib          # generación TOTP/HOTP
npm install speakeasy        # alternativa para TOTP
npm install qrcode           # generar QR para TOTP
```

---

## Fase 4 — Características Empresariales

### Objetivo

Completar el sistema con todas las funcionalidades de gestión empresarial de identidades: políticas de contraseñas, historial, gestión de sesiones, rate limiting y notificaciones.

### 4.1 Política de Contraseñas

**Nueva entidad:** `PoliticaContrasena`

```typescript
// schema: usuarios
PoliticaContrasena {
  id                    BIGINT PK
  longitudMinima        INTEGER DEFAULT 8
  longitudMaxima        INTEGER DEFAULT 128
  requiereMayusculas    BOOLEAN DEFAULT true
  requiereMinusculas    BOOLEAN DEFAULT true
  requiereNumeros       BOOLEAN DEFAULT true
  requiereEspeciales    BOOLEAN DEFAULT true
  historialContrasenas  INTEGER DEFAULT 5   // no reusar últimas N
  maxIntentos           INTEGER DEFAULT 5
  duracionBloqueoMin    INTEGER DEFAULT 30  // minutos
  expiracionDias        INTEGER DEFAULT 90  // 0 = no expira
  notificarDiasAntes    INTEGER DEFAULT 15  // avisar N días antes de expirar
  estado                ESTADO
}
```

**Nueva entidad:** `HistorialContrasena`

```typescript
HistorialContrasena {
  id          BIGINT PK
  idUsuario   BIGINT FK
  contrasena  VARCHAR(255)   // bcrypt hash
  fecha       TIMESTAMP
}
```

**Lógica de validación (agregar en `UsuarioService`):**
- Al crear/cambiar contraseña: validar contra `PoliticaContrasena`
- Verificar que nueva contraseña no esté en las últimas N del historial
- Al superar `maxIntentos`: activar `fechaBloqueo` con duración de `duracionBloqueoMin`
- Job programado (@Cron): notificar usuarios con contraseña próxima a expirar

**Migrations:**
- `1709000007000-CreatePoliticaContrasena.ts`
- `1709000008000-CreateHistorialContrasena.ts`

### 4.2 Gestión de Sesiones Activas

**Mejorar endpoint de sesiones:**

```typescript
// Endpoints nuevos:
GET    /api/sesiones/activas              ← sesiones activas del usuario
DELETE /api/sesiones/activas/:sessionId   ← cerrar sesión específica
DELETE /api/sesiones/activas/todas        ← cerrar todas mis sesiones

// Solo ADMINISTRADOR:
GET    /api/admin/sesiones                ← todas las sesiones activas
DELETE /api/admin/sesiones/usuario/:id    ← forzar cierre de sesiones de un usuario
```

### 4.3 Rate Limiting

**Instalar y configurar `@nestjs/throttler`:**

```bash
npm install @nestjs/throttler
```

```typescript
// Configuración en AppModule:
ThrottlerModule.forRoot([
  { name: 'login',  ttl: 60000,  limit: 5  },   // 5 intentos/minuto en /auth
  { name: 'global', ttl: 60000,  limit: 100 },   // 100 req/minuto resto
  { name: 'otp',    ttl: 300000, limit: 3  },    // 3 intentos OTP / 5 min
])
```

### 4.4 Restauración de Contraseña (completar flujo existente)

Ya existe `codigoRecuperacion` en `Usuario`. Completar los endpoints:

```
POST   /auth/recuperar-contrasena      ← { usuario/email } → envía link por email+SMS
POST   /auth/restablecer-contrasena    ← { token, nuevaContrasena } → valida + cambia
GET    /auth/recuperar-contrasena/:token ← valida vigencia del token (para el frontend)
```

**Lógica:**
1. Generar UUID como token (no predecible, TTL 24h)
2. Guardar hash(token) + expiración en `codigoRecuperacion` + campo `codigoRecuperacionExpira`
3. Enviar email con link al frontend: `{URL_FRONTEND}/auth/restablecer?token=...`
4. Al restablecer: validar token, validar nueva contraseña contra política, actualizar hash bcrypt, limpiar token, guardar en historial

**Migration:** `1709000009000-AddRecuperacionExpiraToUsuario.ts`

### 4.5 Desbloqueo de Cuenta (completar flujo existente)

Ya existe `codigoDesbloqueo` en `Usuario`. Completar:

```
POST   /auth/solicitar-desbloqueo   ← { usuario } → envía código por email/SMS
POST   /auth/desbloquear            ← { usuario, codigo } → desbloquea cuenta
```

**Desbloqueo administrativo (ya parcialmente implementado):**
```
PATCH  /api/usuarios/:id/desbloqueo  ← ADMINISTRADOR desbloquea directamente
```

### 4.6 CAPTCHA (opcional, configurable)

Integrar reCAPTCHA v3 / hCaptcha en el endpoint de login para entornos de producción:

```typescript
// Guard opcional: CaptchaGuard
// Variables de entorno:
CAPTCHA_ENABLED=false
CAPTCHA_SECRET=__CAPTCHA_SECRET__
CAPTCHA_THRESHOLD=0.5   // score mínimo reCAPTCHA v3
```

### 4.7 Notificaciones de seguridad

Usar el servicio Mensajería existente para notificar:
- Login exitoso desde nueva IP/dispositivo
- Cambio de contraseña
- Contraseña próxima a vencer (job @Cron)
- Cuenta bloqueada por intentos fallidos

---

## Orden de implementación sugerido

```
Fase 2.1  Docker Compose + Keycloak realm básico           ~2h
Fase 2.2  jwt-keycloak.strategy.ts + validación JWKS       ~3h
Fase 2.3  keycloak-admin.service.ts                        ~4h
Fase 2.4  Sincronización roles KC ↔ Casbin                 ~2h
Fase 2.5  Ciudadanía Digital como IdP broker en KC         ~2h
Fase 2.6  Migration keycloakId + script migración usuarios ~2h
──────────────────────────────────────────────────────────
Fase 3.1  ConfiguracionDosFA entity + migration            ~1h
Fase 3.2  OtpGeneratorService (email + SMS)                ~3h
Fase 3.3  Flujo login con 2FA (tempToken + verificar)      ~4h
Fase 3.4  SPI Keycloak para SMS OTP (Java)                 ~6h
──────────────────────────────────────────────────────────
Fase 4.1  PoliticaContrasena + HistorialContrasena         ~3h
Fase 4.2  Flujo restauración de contraseña completo        ~2h
Fase 4.3  Desbloqueo de cuenta completo                    ~1h
Fase 4.4  Rate limiting con @nestjs/throttler              ~1h
Fase 4.5  Gestión sesiones activas admin                   ~2h
Fase 4.6  Notificaciones de seguridad                      ~3h
```

---

## Dependencias npm pendientes

```bash
# Fase 2
npm install @keycloak/keycloak-admin-client
npm install jwks-rsa

# Fase 3
npm install otplib
npm install qrcode
npm install @types/qrcode

# Fase 4
npm install @nestjs/throttler
npm install @nestjs/schedule        # para jobs @Cron (notificaciones)
npm install @types/node-cron
```

---

## Variables de entorno — resumen completo pendiente

```env
# ── Fase 2: Keycloak ──────────────────────────────────────
KC_URL=http://localhost:8080
KC_REALM=felcn
KC_CLIENT_ID=felcn-backend
KC_CLIENT_SECRET=__KC_CLIENT_SECRET__
KC_JWKS_URI=http://localhost:8080/realms/felcn/protocol/openid-connect/certs
KC_ISSUER=http://localhost:8080/realms/felcn
KC_ADMIN_CLIENT_ID=felcn-backend-admin
KC_ADMIN_CLIENT_SECRET=__KC_ADMIN_CLIENT_SECRET__

# ── Fase 3: 2FA ───────────────────────────────────────────
TWO_FA_OTP_TTL_SECONDS=300         # TTL del OTP (5 min)
TWO_FA_TEMP_TOKEN_EXPIRES=300000   # TTL del tempToken en ms
TWO_FA_BACKUP_CODES_COUNT=8        # cantidad de códigos de respaldo

# ── Fase 4: Rate limiting ─────────────────────────────────
THROTTLE_LOGIN_TTL=60000
THROTTLE_LOGIN_LIMIT=5
THROTTLE_GLOBAL_TTL=60000
THROTTLE_GLOBAL_LIMIT=100

# ── Fase 4: Política de contraseñas ──────────────────────
PASSWORD_MIN_LENGTH=8
PASSWORD_EXPIRY_DAYS=90
PASSWORD_HISTORY_COUNT=5
PASSWORD_MAX_ATTEMPTS=5
PASSWORD_LOCK_DURATION_MIN=30

# ── Fase 4: CAPTCHA (opcional) ────────────────────────────
CAPTCHA_ENABLED=false
CAPTCHA_SECRET=__CAPTCHA_SECRET__
```

---

## Referencias

- [Keycloak 26 Documentation](https://www.keycloak.org/documentation)
- [Keycloak Admin REST API](https://www.keycloak.org/docs-api/26/rest-api/)
- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [otplib — TOTP/HOTP](https://github.com/yeojz/otplib)
- [Ciudadanía Digital OIDC](https://account-idetest.agcs.agetic.gob.bo) — ver `docs/autenticacion/`
