# APIs de Ciudadanía Digital - Guía de Testing

Este documento describe todas las APIs del Proveedor de Ciudadanía Digital que se consumen en el Backend Base, junto con ejemplos de CURLs para testing.

## Configuración Actual

Según el archivo `.env`, el proyecto está configurado para usar:

```bash
OIDC_ISSUER=https://proveedor.ciudadania.demo.agetic.gob.bo
OIDC_CLIENT_ID=p7wK6IAKYp6zUKtRgPiHq
OIDC_CLIENT_SECRET=-AxIUgTC4EXlbQXmvALPInU_COPfJbjsnRSrOSsoXTthAP7-GkofjLIqiTjH8Yx14MAmI3ZYkBFDlbzv3oc5nw
```

---

## 1. APIs del Proveedor de Ciudadanía Digital (OIDC)

### 1.1. Discovery Endpoint (OpenID Configuration)

Obtiene la configuración completa del proveedor OIDC, incluyendo todos los endpoints disponibles.

**Endpoint:**
```
GET https://proveedor.ciudadania.demo.agetic.gob.bo/.well-known/openid-configuration
```

**CURL:**
```bash
curl -X GET 'https://proveedor.ciudadania.demo.agetic.gob.bo/.well-known/openid-configuration' \
  -H 'Accept: application/json'
```

**Uso en el código:** src/core/authentication/oidc.client.ts:22
```typescript
const issuer = await Issuer.discover(oidcIssuer)
```

---

### 1.2. Authorization Endpoint

Inicia el flujo de autenticación OAuth 2.0 / OIDC. Redirige al usuario a la página de login de Ciudadanía Digital.

**Endpoint:**
```
GET https://proveedor.ciudadania.demo.agetic.gob.bo/auth
```

**Parámetros requeridos:**
- `response_type`: code
- `client_id`: ID del cliente registrado
- `redirect_uri`: URI de redirección registrada
- `scope`: Alcances solicitados (ej: openid profile email)
- `state`: Valor aleatorio para prevenir CSRF

**CURL de ejemplo:**
```bash
curl -X GET 'https://proveedor.ciudadania.demo.agetic.gob.bo/auth?response_type=code&client_id=p7wK6IAKYp6zUKtRgPiHq&redirect_uri=http://localhost:3000/api/ciudadania-autorizar&scope=openid%20profile%20email%20celular%20fecha_nacimiento&state=random_state_value' \
  -H 'Accept: text/html' \
  -L
```

**Scopes disponibles:**
- `openid` - Requerido para OIDC
- `profile` - Información del perfil (documento_identidad, nombre)
- `email` - Correo electrónico
- `celular` - Número de teléfono
- `fecha_nacimiento` - Fecha de nacimiento
- `offline_access` - Refresh token

**Uso en el código:**
- El guard `OidcAuthGuard` en src/core/authentication/guards/oidc-auth.guard.ts maneja automáticamente la redirección
- Controller: src/core/authentication/controller/authentication.controller.ts:89

---

### 1.3. Token Endpoint

Intercambia el código de autorización por tokens de acceso (access_token, id_token, refresh_token).

**Endpoint:**
```
POST https://proveedor.ciudadania.demo.agetic.gob.bo/token
```

**Parámetros requeridos:**
- `grant_type`: authorization_code
- `code`: Código de autorización recibido
- `redirect_uri`: Misma URI usada en authorization
- `client_id`: ID del cliente
- `client_secret`: Secret del cliente

**CURL:**
```bash
curl -X POST 'https://proveedor.ciudadania.demo.agetic.gob.bo/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Authorization: Basic cDd3SzZJQUtZcDZ6VUt0UmdQaUhxOi1BeElVZ1RDNEVYbGJRWG12QUxQSW5VX0NPUGZKYmpzblJTck9Tc29YVHRoQVA3LUdrb2ZqTElxaVRqSDhZeDE0TUFtSTNaWWtCRkRsYnp2M29jNW53' \
  -d 'grant_type=authorization_code' \
  -d 'code=CODIGO_DE_AUTORIZACION_AQUI' \
  -d 'redirect_uri=http://localhost:3000/api/ciudadania-autorizar'
```

**Nota sobre Authorization Header:**
El header Authorization debe contener `Basic base64(client_id:client_secret)`

**Para generar el header:**
```bash
echo -n "p7wK6IAKYp6zUKtRgPiHq:-AxIUgTC4EXlbQXmvALPInU_COPfJbjsnRSrOSsoXTthAP7-GkofjLIqiTjH8Yx14MAmI3ZYkBFDlbzv3oc5nw" | base64
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "openid profile email celular fecha_nacimiento"
}
```

**Uso en el código:**
- La librería `openid-client` maneja automáticamente este intercambio
- Strategy: src/core/authentication/strategies/oidc.strategy.ts

---

### 1.4. UserInfo Endpoint

Obtiene la información del usuario autenticado usando el access_token.

**Endpoint:**
```
GET https://proveedor.ciudadania.demo.agetic.gob.bo/me
```

**CURL:**
```bash
curl -X GET 'https://proveedor.ciudadania.demo.agetic.gob.bo/me' \
  -H 'Authorization: Bearer ACCESS_TOKEN_AQUI' \
  -H 'Accept: application/json'
```

**Respuesta esperada:**
```json
{
  "sub": "uuid-del-ciudadano",
  "profile": {
    "documento_identidad": {
      "tipo_documento": "CI",
      "numero_documento": "1234567",
      "complemento": "1A"
    },
    "nombre": {
      "nombres": "Juan Carlos",
      "primer_apellido": "Pérez",
      "segundo_apellido": "García"
    }
  },
  "fecha_nacimiento": "15/05/1990",
  "email": "juan.perez@example.com",
  "celular": "70123456"
}
```

**Uso en el código:** src/core/authentication/strategies/oidc.strategy.ts:37
```typescript
const userinfo: UserinfoResponse<userInfoType> = await this.client.userinfo(tokenset)
```

**Campos validados:**
- `profile.documento_identidad` (línea 39-44)
- `fecha_nacimiento` (línea 46-50)
- `email` (línea 52-56)
- `celular` (línea 58-62)
- `sub` (línea 64-68)

---

### 1.5. JWKS Endpoint

Obtiene las claves públicas para verificar la firma de los tokens JWT.

**Endpoint:**
```
GET https://proveedor.ciudadania.demo.agetic.gob.bo/jwks
```

**CURL:**
```bash
curl -X GET 'https://proveedor.ciudadania.demo.agetic.gob.bo/jwks' \
  -H 'Accept: application/json'
```

**Respuesta esperada:**
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "key-id",
      "alg": "PS256",
      "n": "modulus...",
      "e": "AQAB"
    }
  ]
}
```

**Uso:** La librería `openid-client` usa automáticamente este endpoint para verificar tokens.

---

### 1.6. End Session Endpoint (Logout)

Cierra la sesión del usuario en el Proveedor de Ciudadanía Digital.

**Endpoint:**
```
GET https://proveedor.ciudadania.demo.agetic.gob.bo/session/end
```

**Parámetros opcionales:**
- `id_token_hint`: ID token del usuario para identificar la sesión
- `post_logout_redirect_uri`: URI de redirección después del logout

**CURL:**
```bash
curl -X GET 'https://proveedor.ciudadania.demo.agetic.gob.bo/session/end?id_token_hint=ID_TOKEN_AQUI&post_logout_redirect_uri=http://localhost:8080/login' \
  -H 'Accept: text/html' \
  -L
```

**Uso en el código:** src/core/authentication/controller/authentication.controller.ts:151-190
```typescript
const issuer = await Issuer.discover(this.configService.get('OIDC_ISSUER') || '')
const urlEndSession = issuer.metadata.end_session_endpoint
```

---

### 1.7. Token Introspection Endpoint

Verifica si un token es válido y obtiene información sobre él.

**Endpoint:**
```
POST https://proveedor.ciudadania.demo.agetic.gob.bo/token/introspection
```

**CURL:**
```bash
curl -X POST 'https://proveedor.ciudadania.demo.agetic.gob.bo/token/introspection' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Authorization: Basic cDd3SzZJQUtZcDZ6VUt0UmdQaUhxOi1BeElVZ1RDNEVYbGJRWG12QUxQSW5VX0NPUGZKYmpzblJTck9Tc29YVHRoQVA3LUdrb2ZqTElxaVRqSDhZeDE0TUFtSTNaWWtCRkRsYnp2M29jNW53' \
  -d 'token=ACCESS_TOKEN_O_REFRESH_TOKEN_AQUI'
```

**Respuesta esperada (token activo):**
```json
{
  "active": true,
  "scope": "openid profile email",
  "client_id": "p7wK6IAKYp6zUKtRgPiHq",
  "token_type": "Bearer",
  "exp": 1234567890,
  "sub": "uuid-del-ciudadano"
}
```

---

### 1.8. Token Revocation Endpoint

Revoca un access_token o refresh_token.

**Endpoint:**
```
POST https://proveedor.ciudadania.demo.agetic.gob.bo/token/revocation
```

**CURL:**
```bash
curl -X POST 'https://proveedor.ciudadania.demo.agetic.gob.bo/token/revocation' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Authorization: Basic cDd3SzZJQUtZcDZ6VUt0UmdQaUhxOi1BeElVZ1RDNEVYbGJRWG12QUxQSW5VX0NPUGZKYmpzblJTck9Tc29YVHRoQVA3LUdrb2ZqTElxaVRqSDhZeDE0TUFtSTNaWWtCRkRsYnp2M29jNW53' \
  -d 'token=TOKEN_A_REVOCAR_AQUI' \
  -d 'token_type_hint=access_token'
```

---

## 2. APIs del Backend Base

### 2.1. Iniciar Autenticación con Ciudadanía Digital

Inicia el flujo de autenticación OIDC, redirigiendo al usuario al Proveedor de Ciudadanía Digital.

**Endpoint:**
```
GET http://localhost:3000/api/ciudadania-auth
```

**CURL:**
```bash
curl -X GET 'http://localhost:3000/api/ciudadania-auth' \
  -H 'Accept: text/html' \
  -L
```

**Comportamiento:**
- Redirige automáticamente al endpoint de autorización de Ciudadanía Digital
- El guard `OidcAuthGuard` maneja la construcción de la URL con todos los parámetros

**Controller:** src/core/authentication/controller/authentication.controller.ts:87-92

---

### 2.2. Callback de Autorización

Recibe el código de autorización después de que el usuario se autentique en Ciudadanía Digital.

**Endpoint:**
```
GET http://localhost:3000/api/ciudadania-autorizar?code=CODIGO_AUTORIZACION
```

**CURL:**
```bash
curl -X GET 'http://localhost:3000/api/ciudadania-autorizar?code=CODIGO_DE_AUTORIZACION_AQUI' \
  -H 'Accept: application/json' \
  -c cookies.txt
```

**Parámetros:**
- `code`: Código de autorización devuelto por Ciudadanía Digital

**Respuesta exitosa:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Además establece cookie:**
- `jid`: Refresh token (HttpOnly cookie)

**Proceso interno:**
1. Intercambia el código por tokens con Ciudadanía Digital
2. Obtiene información del usuario (userinfo)
3. Valida o crea el usuario en la base de datos local
4. Genera access_token y refresh_token propios
5. Retorna el access_token al cliente

**Controller:** src/core/authentication/controller/authentication.controller.ts:94-126

---

### 2.3. Logout

Cierra la sesión del usuario tanto en el backend como en Ciudadanía Digital.

**Endpoint:**
```
GET http://localhost:3000/api/logout
```

**CURL:**
```bash
curl -X GET 'http://localhost:3000/api/logout' \
  -H 'Authorization: Bearer ACCESS_TOKEN_AQUI' \
  -H 'Accept: application/json' \
  -b 'jid=REFRESH_TOKEN_ID'
```

**Respuesta:**
```json
{
  "url": "https://proveedor.ciudadania.demo.agetic.gob.bo/session/end?post_logout_redirect_uri=...&id_token_hint=..."
}
```

**Comportamiento:**
1. Elimina el refresh_token de la base de datos
2. Destruye la sesión
3. Limpia las cookies
4. Retorna la URL del endpoint de logout de Ciudadanía Digital

**Controller:** src/core/authentication/controller/authentication.controller.ts:128-191

---

## 3. Flujo Completo de Autenticación

### 3.1. Flujo visual

Ver diagrama en: docs/autenticacion/flujo-oidc-autenticacion-ciudadania-digital.mmd

### 3.2. Flujo paso a paso

1. **Usuario hace clic en "Iniciar sesión con Ciudadanía Digital"**
   ```bash
   GET http://localhost:3000/api/ciudadania-auth
   ```

2. **Backend redirige a Ciudadanía Digital**
   ```
   https://proveedor.ciudadania.demo.agetic.gob.bo/auth?
     response_type=code&
     client_id=p7wK6IAKYp6zUKtRgPiHq&
     redirect_uri=http://localhost:3000/api/ciudadania-autorizar&
     scope=openid profile email celular fecha_nacimiento
   ```

3. **Usuario se autentica en Ciudadanía Digital y autoriza**

4. **Ciudadanía Digital redirige al callback con código**
   ```
   http://localhost:3000/api/ciudadania-autorizar?code=ABC123...
   ```

5. **Backend intercambia código por tokens**
   ```bash
   POST https://proveedor.ciudadania.demo.agetic.gob.bo/token
   ```

6. **Backend obtiene información del usuario**
   ```bash
   GET https://proveedor.ciudadania.demo.agetic.gob.bo/me
   ```

7. **Backend valida o crea usuario en BD local**

8. **Backend genera sus propios tokens JWT**

9. **Backend retorna access_token al frontend**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

---

## 4. Testing Manual

### 4.1. Prerequisitos

1. Tener el backend corriendo:
   ```bash
   npm run start:dev
   ```

2. Variables de entorno configuradas en `.env`

### 4.2. Test completo del flujo

1. **Probar Discovery:**
   ```bash
   curl -X GET 'https://proveedor.ciudadania.demo.agetic.gob.bo/.well-known/openid-configuration' | jq
   ```

2. **Iniciar autenticación (en navegador):**
   ```
   http://localhost:3000/api/ciudadania-auth
   ```

3. **Después de autenticarse, verificar la respuesta del callback**

4. **Usar el access_token recibido para hacer llamadas autenticadas:**
   ```bash
   curl -X GET 'http://localhost:3000/api/usuario/perfil' \
     -H 'Authorization: Bearer ACCESS_TOKEN_AQUI'
   ```

5. **Probar logout:**
   ```bash
   curl -X GET 'http://localhost:3000/api/logout' \
     -H 'Authorization: Bearer ACCESS_TOKEN_AQUI'
   ```

---

## 5. Configuraciones Importantes

### 5.1. Timeout del cliente OIDC

En src/core/authentication/oidc.client.ts:6
```typescript
custom.setHttpOptionsDefaults({ timeout: 10000 }) // 10 segundos
```

### 5.2. Scopes configurados

Según la estrategia OIDC, se solicitan los siguientes scopes:
- `openid` - Requerido para OIDC
- `profile` - Documento de identidad y nombre
- `fecha_nacimiento` - Fecha de nacimiento
- `email` - Correo electrónico
- `celular` - Número de teléfono

### 5.3. Grant Types soportados

- `authorization_code` - Flujo principal de autenticación
- `refresh_token` - Para renovar tokens
- `client_credentials` - Para autenticación backend-to-backend

---

## 6. Recursos Adicionales

- **Documentación oficial:** https://developer.ciudadaniadigital.bo/docs/empezar/registrar-mecanismo/autenticacion
- **OpenID Connect Spec:** https://openid.net/specs/openid-connect-core-1_0.html
- **OAuth 2.0 Spec:** https://tools.ietf.org/html/rfc6749
- **Biblioteca usada:** https://github.com/panva/node-openid-client

---

## 7. Troubleshooting

### Error: "Error de conexión con ciudadanía"

Verificar:
- Conexión a internet
- URL del OIDC_ISSUER correcta
- Timeout del cliente (aumentar si es necesario)

### Error: "No devolvió el campo X"

El proveedor de Ciudadanía Digital no está devolviendo todos los campos requeridos. Verificar:
- Los scopes configurados en el mecanismo
- La configuración del cliente en el módulo Developer

### Error de autenticación

Verificar:
- CLIENT_ID y CLIENT_SECRET correctos
- REDIRECT_URI registrada en el módulo Developer
- REDIRECT_URI en código coincide con la registrada

---

**Última actualización:** 2025-12-13
