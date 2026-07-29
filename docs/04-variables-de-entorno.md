# 04 — Variables de entorno

Tabla consolidada por proyecto. El detalle completo de cada variable está en el `.env.sample`/`.env.example` de cada carpeta — aquí se resume qué bloques existen y qué es secreto.

## 1. `felcn-auth-backend` (`.env.sample`)

| Bloque | Variables clave | Secreto |
|---|---|---|
| Despliegue | `NODE_ENV`, `PORT` | No |
| Base de datos | `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE=felcn_auth_v3`, `DB_SCHEMA_*` | `DB_PASSWORD` sí |
| Autenticación | `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_*` | `JWT_SECRET` sí |
| SMTP | `SMTP_ENABLED`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | `SMTP_PASS` sí (App Password de Gmail) |
| Interoperabilidad | `IOP_SEGIP_URL`, `IOP_SEGIP_TOKEN`, `IOP_SIN_URL`, `IOP_SIN_TOKEN` | los `*_TOKEN` sí |
| Ciudadanía Digital (OIDC) | `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_SCOPE`, `OIDC_REDIRECT_URI`, `SESSION_SECRET` | `OIDC_CLIENT_SECRET`, `SESSION_SECRET` sí |
| Storage / Logs | `STORAGE_NFS_PATH`, `LOG_*` | No |

Existe además `.env.staging` (no versionado) con credenciales **reales** de Ciudadanía Digital AGETIC para el ambiente staging — nunca copiar sus valores a dev.

## 2. `felcn-base-backend-v2` (`.env.sample`)

Mismo esquema que auth-backend más:

| Bloque | Variables clave | Secreto |
|---|---|---|
| Multi-BD | `DB_AUTH_*`, `DB_ASIG_CASOS_*`, `DB_SII_*`, `DB_SIII_*`, `DB_LGI_*`, `DB_SOSPECHOSO_*`, `DB_PERSONAS_*`, `DB_VLS_*` | los `*_PASSWORD` de cada bloque sí |
| Mensajería (Alertín) | `MSJ_URL`, `MSJ_TOKEN` | `MSJ_TOKEN` sí — **el `.env.sample` real trae un JWT de demo con expiración embebida (`exp` en el propio token), no un placeholder** |
| Auth interno | `AUTH_BACKEND_INTERNAL_URL` | No — URL interna docker (`http://auth-backend:4000`) |
| Lookups estáticos | `LOOKUP_GENERO`, `LOOKUP_ESTADO_SUJETO` | No |
| Reportes | `LOGO_REPORT` (base64) | No |

## 3. `felcn-base-frontend` (`.env.sample`)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_AUTH_URL`, `NEXT_PUBLIC_SOCKET_URL` | URLs públicas de los backends — cambian entre dev/staging (ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)) |
| `NEXT_PUBLIC_CIUDADANIA_URL`, `NEXT_PUBLIC_FIRMADOR_URL`, `NEXT_PUBLIC_NOMINATIM_URL` | Servicios externos de terceros (AGETIC / OpenStreetMap) |
| `NEXT_PUBLIC_CONSULTA_PERSONA_URL`, `NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY` | Ver hallazgo de seguridad abajo (sección 6) |
| `NEXT_PUBLIC_COOKIE_SECURE` | Debe ser `true` en cualquier ambiente servido por HTTPS |

Todo lo que empieza con `NEXT_PUBLIC_` termina embebido en el bundle de JavaScript que llega al navegador — **nunca poner ahí un secreto real**, solo URLs y claves pensadas para ser públicas.

## 4. `consulta-persona-api` (`.env.example`, Python/FastAPI)

| Bloque | Variables clave | Secreto |
|---|---|---|
| Base de datos | `APP_USER_DB`, `APP_HOST_DB` (externo, `bolivia_hub`), `APP_PASSWORD_DB` | sí |
| Redis | `REDIS_HOST`, `REDIS_PASSWORD` | sí si se setea |
| API | `API_KEY` (placeholder `cambia_esta_clave_segura` en el `.example`) | sí |

## 5. `fake-ciudadania-api` (`.env.example`) — solo desarrollo

| Variable | Nota |
|---|---|
| `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` | Deben coincidir exactamente con los mismos valores en el `.env` de `auth-backend` (dev) |
| `FAKE_ISSUER` | Debe ser accesible tanto desde el backend como desde el navegador del usuario |
| `KEY_DATA_DIR` | Claves RSA autogeneradas — si se borran, invalida tokens ya firmados |

## 6. 🚨 Hallazgo de seguridad: clave de API real commiteada en `.env.sample`

`frontend/felcn-base-frontend/.env.sample` (archivo **versionado en git**, historial hasta al menos el commit `e7f811e0`) trae:

```
NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY="persona_unlimited_felcn_2026"
```

Este no es un placeholder: es el mismo valor exacto configurado hoy como `API_KEY_UNLIMITED` en el `.env` real de `consulta-persona-api`. Es decir, hay **una clave de API real y activa, en texto plano, en un archivo versionado en git** — visible para cualquiera con acceso al repo (y, al estar en `NEXT_PUBLIC_*`, también visible en el bundle JS servido al navegador de cualquier usuario final).

Acción recomendada (no aplicada todavía, requiere decisión del equipo): rotar esta clave, reemplazar el valor en `.env.sample` por un placeholder genérico, y evaluar si `consulta-persona-api` debería aceptar autenticación por sesión/JWT del usuario en vez de una API key estática compartida con el frontend público.

## 7. Buenas prácticas para el servidor nuevo

- Ningún `.env` real (`.env`, `.env.staging`, `.env.backup-*`) debe llegar a git — confirmar `.gitignore` de cada proyecto antes de clonar en el servidor nuevo.
- Rotar `JWT_SECRET`, `SESSION_SECRET`, `OIDC_CLIENT_SECRET`, `NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY` y todos los `*_TOKEN`/`*_PASSWORD` al pasar a un servidor nuevo o a producción — no reutilizar los valores de dev/staging.
