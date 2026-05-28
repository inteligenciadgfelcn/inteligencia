# Fake Ciudadanía Digital API

Simulador local del proveedor de identidad OIDC de [Ciudadanía Digital](https://ciudadaniadigital.gob.bo/) (AGETIC).
Permite desarrollar y probar el flujo de autenticación sin depender del servicio externo real.

> **IMPORTANTE:** Este servicio es exclusivamente para desarrollo/testing. No debe desplegarse en producción ni en el mismo servidor que el auth-backend de producción.

---

## Arquitectura esperada

```
┌──────────────────────────────┐        ┌──────────────────────────────────┐
│   Servidor A (aplicación)    │        │   Servidor B (fake externo)      │
│                              │        │                                  │
│  felcn-auth-backend :3000    │◄──────►│  fake-ciudadania-api :3001       │
│  (o el puerto configurado)   │  HTTP  │  FAKE_ISSUER=http://<IP-B>:3001  │
│                              │        │                                  │
│  OIDC_ISSUER=http://<IP-B>:3001      │                                  │
└──────────────────────────────┘        └──────────────────────────────────┘
         ▲
         │ Browser redirect
         │
   Usuario (navegador)
```

El fake debe estar en un servidor/contenedor **separado** para simular fielmente que es un servicio externo (como lo sería el real de AGETIC). El auth-backend lo referencia por URL, igual que haría con el real.

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development
PORT=3001

# Base de datos — misma instancia PostgreSQL que el auth-backend
DB_HOST=<IP o hostname del servidor de BD>
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<contraseña>
DB_DATABASE=felcn_auth_v3
DB_USE_SSL=false

# Schema dedicado para el fake (se crea automáticamente con migration:run)
DB_SCHEMA_FAKE=fake_ciudadania

# IMPORTANTE: esta URL debe ser accesible tanto desde auth-backend como desde el
# navegador del usuario (es la URL del ISSUER OIDC).
# Debe coincidir EXACTAMENTE con OIDC_ISSUER en el auth-backend.
FAKE_ISSUER=http://<IP-servidor-B>:3001

# Credenciales del cliente OIDC — deben coincidir con OIDC_CLIENT_ID y
# OIDC_CLIENT_SECRET en el auth-backend.
OIDC_CLIENT_ID=fake-ciudadania-client
OIDC_CLIENT_SECRET=fake-ciudadania-secret

# SMTP para envío de OTP. En desarrollo se puede deshabilitar (el OTP
# se imprime en los logs del contenedor).
SMTP_ENABLED=false
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=usuario@example.com
# SMTP_PASS=contraseña
# SMTP_FROM=noreply@example.com

# Orígenes CORS permitidos (URL del auth-backend y del frontend)
ALLOWED_ORIGINS=http://<IP-servidor-A>:3000,http://<IP-frontend>:8080
```

---

## Despliegue con Docker (servidor separado)

### 1. Clonar solo el directorio necesario

```bash
# En el servidor B, clonar el repositorio completo o copiar solo el directorio
git clone <repo-url>
cd inteligencia/backend/fake-ciudadania-api
```

### 2. Preparar el `.env`

```bash
cp .env.example .env   # si existe, o crear manualmente según la sección anterior
nano .env              # ajustar IP, contraseñas, FAKE_ISSUER
```

### 3. Levantar con docker-compose

El `docker-compose.yml` incluido conecta al PostgreSQL del host anfitrión via `host.docker.internal`.
Ajustar `DB_HOST` si el PostgreSQL está en otro servidor:

```bash
docker-compose up -d --build
```

Verificar que el servicio responde:

```bash
curl http://localhost:3001/.well-known/openid-configuration
```

### 4. Ejecutar migraciones y seed

```bash
# Crear schema y tablas
docker exec -it fake-ciudadania-api npm run migration:run

# Insertar usuarios de prueba (CI: 1234567, 7654321, 9999999 — password: Password1!)
docker exec -it fake-ciudadania-api npm run migration:seed
```

---

## Despliegue sin Docker (Node.js directo)

```bash
cd backend/fake-ciudadania-api
cp .env.example .env    # ajustar variables
npm install
npm run build

# Crear schema y seed
npm run migration:run
npm run migration:seed

# Iniciar
npm start
```

Para mantenerlo corriendo en segundo plano:

```bash
# Con pm2
npm install -g pm2
pm2 start dist/main.js --name fake-ciudadania-api
pm2 save
pm2 startup
```

---

## Configurar auth-backend para apuntar al fake

En `backend/felcn-auth-backend/.env`, ajustar las siguientes variables:

```env
# URL del fake en el servidor B (accesible desde auth-backend Y desde el navegador)
OIDC_ISSUER=http://<IP-servidor-B>:3001

# Credenciales que coincidan con el fake
OIDC_CLIENT_ID=fake-ciudadania-client
OIDC_CLIENT_SECRET=fake-ciudadania-secret

# Scopes que provee el fake
OIDC_SCOPE=openid profile email fecha_nacimiento celular

# URL a la que Ciudadanía redirige tras autenticarse (debe ser accesible por el browser)
OIDC_REDIRECT_URI=http://<IP-servidor-A>:3000/api/ciudadania-autorizar

# URL a la que redirige tras logout
OIDC_POST_LOGOUT_REDIRECT_URI=http://<IP-frontend>:8080/

# Habilitar URL interna para que auth-backend pueda llamar al fake
# (usar IP interna si el browser usa una IP pública diferente)
# FAKE_CIUDADANIA_INTERNAL_URL=http://<IP-interna-servidor-B>:3001
```

> La variable `FAKE_CIUDADANIA_INTERNAL_URL` permite que auth-backend use una URL interna
> (red privada) para los llamados server-to-server al fake, mientras el navegador usa la
> URL pública. Descomentar solo si es necesario.

---

## Endpoints expuestos

| Endpoint | Descripción |
|---|---|
| `GET /.well-known/openid-configuration` | Discovery OIDC |
| `GET /jwks` | Claves públicas RSA para verificar tokens |
| `GET /auth` | Inicio del flujo — redirige a `/interaction/:uid` |
| `GET /interaction/:uid` | Página login (formulario CI + contraseña) |
| `POST /interaction/:uid/login` | Procesa credenciales, envía OTP al correo |
| `GET /interaction/:uid/otp` | Página de ingreso de OTP |
| `POST /interaction/:uid/validate` | Valida OTP, genera `code` y redirige a `redirect_uri` |
| `POST /token` | Intercambia `code` por `access_token` + `id_token` |
| `GET /me` | Userinfo — devuelve datos del ciudadano autenticado |
| `GET /session/end` | Logout |

---

## Usuarios de prueba (seed)

| CI | Contraseña | Email |
|---|---|---|
| `1234567` | `Password1!` | `ciudadano1@test.com` |
| `7654321` | `Password1!` | `ciudadano2@test.com` |
| `9999999` | `Password1!` | `ciudadano3@test.com` |

---

## OTP en desarrollo

Con `SMTP_ENABLED=false`, el OTP de 6 dígitos se imprime en los logs:

```bash
docker logs -f fake-ciudadania-api
# [OTP] CI: 1234567 — código: 482910
```

---

## Persistencia de claves RSA

Las claves RSA (par público/privado para firmar JWTs) se generan al primer inicio y se
persisten en el volumen Docker `fake_jwk_keys`. Esto evita que al reiniciar el contenedor
los tokens emitidos anteriormente sean inválidos (`JWSSignatureVerificationFailed`).

En despliegue sin Docker, las claves se guardan en el directorio `data/` (configurable
con `KEY_DATA_DIR`).

---

## Eliminar el fake (cuando se migre al real)

1. Detener y eliminar el contenedor:
   ```bash
   docker-compose down -v   # -v elimina también el volumen de claves
   ```
2. Borrar el schema de la BD:
   ```sql
   DROP SCHEMA fake_ciudadania CASCADE;
   ```
3. Eliminar el directorio `backend/fake-ciudadania-api/`.
4. Actualizar variables de entorno en auth-backend (ver `docs/autenticacion/ciudadania-digital-migracion.md`).
