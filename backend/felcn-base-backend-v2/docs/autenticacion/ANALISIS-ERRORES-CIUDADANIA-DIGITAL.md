# Análisis de Errores - Ciudadanía Digital

**Fecha:** 2025-12-13
**Servidor:** http://localhost:3000
**Frontend:** http://localhost:8080

---

## Resumen Ejecutivo

Se identificaron múltiples errores críticos que impiden el funcionamiento de la autenticación con Ciudadanía Digital. El error principal es la falta de configuración del parámetro `SESSION_SECRET` requerido por `express-session`.

**Estado:** 🔴 **BLOQUEADO** - Todos los endpoints retornan Error 500

---

## Errores Identificados

### 1. ERROR CRÍTICO: SESSION_SECRET no configurado

**Severidad:** 🔴 CRÍTICA
**Impacto:** Bloquea TODOS los endpoints de la aplicación

**Error completo:**
```
Error: secret option required for sessions
    at session (node_modules\express-session\index.js:204:12)
```

**Endpoints afectados:**
- ❌ `OPTIONS /api/estado` → 500
- ❌ `GET /api/estado` → 500
- ❌ `POST /api/usuarios/crear-cuenta` → 500
- ❌ `GET /api/ciudadania-auth` → 500
- ❌ `GET /api/ciudadania-autorizar` → 500

**Causa raíz:**
En `src/main.ts:69`:
```typescript
app.use(
  session({
    secret: configService.get('SESSION_SECRET') || '',  // ← Retorna '' (string vacío)
    resave: false,
    saveUninitialized: false,
    // ...
  })
)
```

La variable `SESSION_SECRET` NO está definida en `.env`, por lo que retorna un string vacío `''`. Express-session requiere que el secret sea una string no vacía.

**Ubicación en .env:**
```bash
# Línea 54 - COMENTADA
# SESSION_SECRET=__SESSION_SECRET__
```

---

### 2. ERROR: OIDC_SCOPE no configurado

**Severidad:** 🟠 ALTA
**Impacto:** Impide autenticación con Ciudadanía Digital

**Uso en código:** `src/core/authentication/strategies/oidc.strategy.ts:25`
```typescript
super({
  client: client,
  params: {
    redirect_uri: process.env.OIDC_REDIRECT_URI,
    scope: process.env.OIDC_SCOPE,  // ← undefined
  },
  // ...
})
```

**Estado en .env:**
```bash
# Línea 51 - COMENTADA
# OIDC_SCOPE=__OIDC_SCOPE__
```

**Scopes requeridos por el código:**
Según el análisis del flujo en `src/core/authentication/strategies/oidc.strategy.ts`, el backend espera recibir:
- `profile.documento_identidad` (línea 39-44)
- `fecha_nacimiento` (línea 46-50)
- `email` (línea 52-56)
- `celular` (línea 58-62)
- `sub` (línea 64-68)

Por lo tanto, los scopes requeridos son:
```
openid profile fecha_nacimiento email celular
```

---

### 3. ERROR: OIDC_REDIRECT_URI no configurado

**Severidad:** 🟠 ALTA
**Impacto:** El callback de Ciudadanía Digital no funciona

**Uso en código:** `src/core/authentication/strategies/oidc.strategy.ts:24`
```typescript
params: {
  redirect_uri: process.env.OIDC_REDIRECT_URI,  // ← undefined
  scope: process.env.OIDC_SCOPE,
}
```

**Estado en .env:**
```bash
# Línea 52 - COMENTADA
# OIDC_REDIRECT_URI=__OIDC_REDIRECT_URI__
```

**Valor requerido:**
Debe apuntar al endpoint de callback en el backend:
```
http://localhost:3000/api/ciudadania-autorizar
```

**Importante:** Esta URI debe estar registrada en el Módulo Developer de Ciudadanía Digital.

---

### 4. ERROR: OIDC_POST_LOGOUT_REDIRECT_URI no configurado

**Severidad:** 🟡 MEDIA
**Impacto:** El logout no redirige correctamente al frontend

**Uso en código:** `src/core/authentication/controller/authentication.controller.ts:181`
```typescript
urlResponse.searchParams.append(
  'post_logout_redirect_uri',
  this.configService.get('OIDC_POST_LOGOUT_REDIRECT_URI') ?? ''  // ← undefined
)
```

**Estado en .env:**
```bash
# Línea 53 - COMENTADA
# OIDC_POST_LOGOUT_REDIRECT_URI=__OIDC_POST_LOGOUT_REDIRECT_URI__
```

**Valor requerido:**
Debe apuntar a la página de login del frontend:
```
http://localhost:8080/login
```

---

## Análisis de Logs del Servidor

### Errores registrados (18:31:18 - 18:33:05)

```
[2025-12-13 18:31:18.598] [ERROR] Error Interno
─ Causa  : Error: secret option required for sessions
─ Código : Error desconocido (E-500)
OPTIONS /api/estado status=500

[2025-12-13 18:32:49.296] [ERROR] Error Interno
─ Causa  : Error: secret option required for sessions
OPTIONS /api/usuarios/crear-cuenta status=500

[2025-12-13 18:33:04.501] [ERROR] Error Interno
─ Causa  : Error: secret option required for sessions
GET /api/ciudadania-auth status=500
```

**Patrón identificado:**
- Todos los errores son del mismo tipo: `secret option required for sessions`
- El error ocurre antes de que cualquier endpoint pueda ejecutarse
- El middleware de sesión falla en TODAS las peticiones

---

## Parámetros OIDC - Estado Actual

| Parámetro | Estado | Valor en .env | Requerido |
|-----------|--------|---------------|-----------|
| `OIDC_ISSUER` | ✅ OK | `https://proveedor.ciudadania.demo.agetic.gob.bo` | Sí |
| `OIDC_CLIENT_ID` | ✅ OK | `p7wK6IAKYp6zUKtRgPiHq` | Sí |
| `OIDC_CLIENT_SECRET` | ✅ OK | `-AxIUgTC4EXlbQXmvALPInU_C...` | Sí |
| `OIDC_SCOPE` | ❌ FALTA | No definido | Sí |
| `OIDC_REDIRECT_URI` | ❌ FALTA | No definido | Sí |
| `OIDC_POST_LOGOUT_REDIRECT_URI` | ❌ FALTA | No definido | Sí |
| `SESSION_SECRET` | ❌ FALTA | No definido | **SÍ** |

---

## Soluciones

### SOLUCIÓN 1: Configurar SESSION_SECRET (CRÍTICO)

**Archivo:** `.env`
**Línea:** 54

**Antes:**
```bash
# SESSION_SECRET=__SESSION_SECRET__
```

**Después:**
```bash
SESSION_SECRET=mi-secreto-super-seguro-para-sesiones-2025
```

**Recomendación:**
Generar un secret aleatorio y seguro. Puedes usar:

```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

O un valor seguro como:
```bash
SESSION_SECRET=8f3e7a2b9c4d1e6f0a5b8c7d9e2f1a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a
```

---

### SOLUCIÓN 2: Configurar OIDC_SCOPE

**Archivo:** `.env`
**Línea:** 51

**Antes:**
```bash
# OIDC_SCOPE=__OIDC_SCOPE__
```

**Después:**
```bash
OIDC_SCOPE=openid profile fecha_nacimiento email celular
```

**Explicación:**
- `openid`: Requerido para OIDC
- `profile`: Obtiene documento_identidad y nombre
- `fecha_nacimiento`: Fecha de nacimiento del ciudadano
- `email`: Correo electrónico
- `celular`: Número de teléfono

---

### SOLUCIÓN 3: Configurar OIDC_REDIRECT_URI

**Archivo:** `.env`
**Línea:** 52

**Antes:**
```bash
# OIDC_REDIRECT_URI=__OIDC_REDIRECT_URI__
```

**Después (Desarrollo):**
```bash
OIDC_REDIRECT_URI=http://localhost:3000/api/ciudadania-autorizar
```

**Después (Producción):**
```bash
OIDC_REDIRECT_URI=https://tu-dominio.com/api/ciudadania-autorizar
```

**⚠️ IMPORTANTE:** Esta URI debe estar registrada exactamente igual en el Módulo Developer de Ciudadanía Digital.

---

### SOLUCIÓN 4: Configurar OIDC_POST_LOGOUT_REDIRECT_URI

**Archivo:** `.env`
**Línea:** 53

**Antes:**
```bash
# OIDC_POST_LOGOUT_REDIRECT_URI=__OIDC_POST_LOGOUT_REDIRECT_URI__
```

**Después (Desarrollo):**
```bash
OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:8080/login
```

**Después (Producción):**
```bash
OIDC_POST_LOGOUT_REDIRECT_URI=https://tu-frontend.com/login
```

---

## Archivo .env Completo - Configuración Recomendada

Sección de Ciudadanía Digital en `.env`:

```bash
# Configuración para la integración de autenticación con Ciudadanía Digital 3 demo
OIDC_ISSUER=https://proveedor.ciudadania.demo.agetic.gob.bo
OIDC_CLIENT_ID=p7wK6IAKYp6zUKtRgPiHq
OIDC_CLIENT_SECRET=-AxIUgTC4EXlbQXmvALPInU_COPfJbjsnRSrOSsoXTthAP7-GkofjLIqiTjH8Yx14MAmI3ZYkBFDlbzv3oc5nw
OIDC_SCOPE=openid profile fecha_nacimiento email celular
OIDC_REDIRECT_URI=http://localhost:3000/api/ciudadania-autorizar
OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:8080/login
SESSION_SECRET=8f3e7a2b9c4d1e6f0a5b8c7d9e2f1a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a
```

---

## Plan de Acción

### Paso 1: Actualizar archivo .env

1. Abrir `.env`
2. Descomentar y configurar las siguientes líneas (51-54):
   ```bash
   OIDC_SCOPE=openid profile fecha_nacimiento email celular
   OIDC_REDIRECT_URI=http://localhost:3000/api/ciudadania-autorizar
   OIDC_POST_LOGOUT_REDIRECT_URI=http://localhost:8080/login
   SESSION_SECRET=8f3e7a2b9c4d1e6f0a5b8c7d9e2f1a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a
   ```
3. Guardar el archivo

### Paso 2: Reiniciar el servidor

```bash
# Detener el servidor actual (Ctrl+C)
# Iniciar nuevamente
npm run start:dev
```

### Paso 3: Verificar configuración en Módulo Developer

Asegurarse de que en el Módulo Developer de Ciudadanía Digital esté configurado:

**Login Redirect URI:**
```
http://localhost:3000/api/ciudadania-autorizar
```

**Logout Redirect URI:**
```
http://localhost:8080/login
```

**Scopes habilitados:**
- ✅ openid
- ✅ profile
- ✅ fecha_nacimiento
- ✅ email
- ✅ celular

### Paso 4: Probar los endpoints

1. **Probar endpoint de estado:**
   ```bash
   curl -X GET 'http://localhost:3000/api/estado'
   ```
   ✅ Debe retornar 200 (no 500)

2. **Probar autenticación con Ciudadanía:**
   - Abrir en navegador: `http://localhost:3000/api/ciudadania-auth`
   - Debe redirigir a la página de login de Ciudadanía Digital
   - Después de autenticarse, debe redirigir de vuelta a `/api/ciudadania-autorizar`

3. **Probar logout:**
   ```bash
   curl -X GET 'http://localhost:3000/api/logout'
   ```

---

## Verificación Post-Fix

Después de aplicar las soluciones, el log del servidor debería mostrar:

```
✅ [2025-12-13 XX:XX:XX.XXX] [application] 🚀 felcn-base-backend v1.18.1-rc
✅ Proceso     : XXXX
✅ Servicio    : Activo
✅ URL (local) : http://localhost:3000
```

Y las peticiones deberían responder correctamente:
```
✅ GET /api/estado status=200
✅ GET /api/ciudadania-auth → Redirección 302
✅ GET /api/ciudadania-autorizar?code=XXX status=200
```

---

## Información Adicional

### Referencias en el código

**SESSION_SECRET usado en:**
- `src/main.ts:69` - Configuración de express-session

**OIDC_SCOPE usado en:**
- `src/core/authentication/strategies/oidc.strategy.ts:25`

**OIDC_REDIRECT_URI usado en:**
- `src/core/authentication/strategies/oidc.strategy.ts:24`

**OIDC_POST_LOGOUT_REDIRECT_URI usado en:**
- `src/core/authentication/controller/authentication.controller.ts:181`

### Documentación relacionada

- [APIs de Ciudadanía Digital](./apis-ciudadania-digital.md)
- [Flujo OIDC](./flujo-oidc-autenticacion-ciudadania-digital.mmd)
- [Documentación oficial](https://developer.ciudadaniadigital.bo/docs/empezar/registrar-mecanismo/autenticacion)

---

## Resumen de Cambios Necesarios

| Parámetro | Acción | Valor |
|-----------|--------|-------|
| `SESSION_SECRET` | Agregar | `8f3e7a2b9c4d1e6f0a5b8c7d9e2f1a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a` |
| `OIDC_SCOPE` | Agregar | `openid profile fecha_nacimiento email celular` |
| `OIDC_REDIRECT_URI` | Agregar | `http://localhost:3000/api/ciudadania-autorizar` |
| `OIDC_POST_LOGOUT_REDIRECT_URI` | Agregar | `http://localhost:8080/login` |

---

**Estado final esperado:** ✅ FUNCIONANDO

Una vez aplicados estos cambios, todos los endpoints de Ciudadanía Digital deberían funcionar correctamente.
