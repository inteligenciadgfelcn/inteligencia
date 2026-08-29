# 04 — Variables de entorno

Tabla consolidada por proyecto. El detalle completo de cada variable está en el `.env.sample`/`.env.example` de cada carpeta — aquí se resume qué bloques existen y qué es secreto.

## 1. `felcn-auth-backend` (`.env.sample`)

| Bloque | Variables clave | Secreto |
|---|---|---|
| Despliegue | `NODE_ENV`, `PORT`, `PATH_SUBDOMAIN` (prefijo de rutas, default `api`), `REQUEST_TIMEOUT_IN_SECONDS` (default 30) | No |
| Base de datos | `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE=felcn_auth_v3`, `DB_USE_SSL`, `DB_VERIFY_SSL`, `DB_SCHEMA`, `DB_SCHEMA_USUARIO`, `DB_SCHEMA_PARAMETRO` | `DB_PASSWORD` sí |
| Seed inicial | `ADMIN_INITIAL_PASSWORD` | Sí — obligatoria para `seeds:run`, nunca commitear con valor real. Ver [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md) |
| Autenticación | `JWT_SECRET`, `JWT_EXPIRES_IN` (real en dev: `15m`), `REFRESH_TOKEN_NAME` (`jid`), `REFRESH_TOKEN_EXPIRES_IN` (real en dev: `3600000` ms = 60 min), `REFRESH_TOKEN_ROTATE_IN`, `REFRESH_TOKEN_SECURE`, `REFRESH_TOKEN_PATH` | `JWT_SECRET` sí |
| **`URL_FRONTEND`** | URL pública del frontend (con barra final, p. ej. `https://desarrollo.felcn.gob.bo/`). **Crítica**: de acá se arman los links de los correos de activación, recuperación y desbloqueo de cuenta (ver [10-formularios-y-apis.md](./10-formularios-y-apis.md) §4.3/4.4). Si queda mal seteada (o sin barra final más un basePath, como pasaba con `/staging/`), los links de los correos apuntan a la URL equivocada y el usuario no puede activar ni recuperar su cuenta. **Verificar explícitamente después de cada despliegue nuevo**, no asumir que quedó bien solo porque el resto del `.env` es correcto. | No |
| SMTP | `SMTP_ENABLED`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | `SMTP_PASS` sí (App Password de Gmail) |
  | SMTP — respaldo (28/08/2026) | `SMTP_BACKUP1_HOST/PORT/SECURE/USER/PASS/FROM`, `SMTP_BACKUP2_HOST/PORT/SECURE/USER/PASS/FROM` — 2 cuentas Gmail de respaldo; mensajeria.service.ts reintenta primario → respaldo-1 → respaldo-2 en orden, sin bloquear la respuesta al usuario (envío fire-and-forget). **Faltan en .env.sample** — agregar antes de dar este documento por completo. | Los *_PASS sí (App Password de cada cuenta) |
| Ciudadanía Digital (OIDC) — **único login del sistema, real (AGETIC)** | `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_SCOPE`, `OIDC_REDIRECT_URI`, `OIDC_POST_LOGOUT_REDIRECT_URI`, `SESSION_SECRET` | `OIDC_CLIENT_SECRET`, `SESSION_SECRET` sí |
| Storage / Logs | `STORAGE_NFS_PATH`, `LOG_*` | No |

**Variables documentadas antes pero sin ningún uso real en código** (verificado con grep sobre `src/`, agosto 2026) — no se usan, no eliminar sin confirmar primero que de verdad no hacen falta en ningún lado (migraciones, scripts) antes de sacarlas del `.env.sample`:

- `DB_SCHEMA_FELCN` — el schema `felcn_estructura` se referencia en otros lugares por su nombre literal, no a través de esta variable.
- `REFRESH_TOKEN_DOMAIN` — el resto de la config de la cookie de refresh token (`REFRESH_TOKEN_SECURE`, `REFRESH_TOKEN_PATH`) sí se usa.

**Hallazgo (29/08/2026): `IOP_SIN_URL`/`IOP_SIN_TOKEN` reaparecieron en el `.env` real** de `auth-backend` (no en `.env.sample`) pese a que el punto siguiente documenta que el código que las usaba se eliminó el 21/08/2026 — quedaron como valores huérfanos en el archivo real, sin ningún código que las lea hoy (confirmado con grep sobre `src/` el 29/08/2026). No son riesgo de seguridad por sí solas, pero conviene limpiarlas del `.env` real para no confundir a quien lo lea después.

**`IOP_SEGIP_*` e `IOP_SIN_*` ya no existen en este proyecto (21/08/2026)** — se eliminó el código (`src/core/external-services/iop/`, nunca tenía ningún controller que lo expusiera — quedaba instanciado por inyección de dependencias pero nada lo llamaba nunca) y las variables del `.env.sample`/`INSTALL.md`. `auth-backend` **no tiene ninguna interoperabilidad activa hoy**. Importante no confundir con `felcn-base-backend-v2`: ese proyecto sí tiene una integración SIN real y en uso (`POST /interoperabilidad/sin/consulta-datos-contribuyente`, `GET /interoperabilidad/sin/verificar-comunicacion`, controller registrado y guardado con `JwtAuthGuard`) — ver sección 2. Son dos bases de código distintas; la limpieza acá no le pega a esa.

**OTP por WhatsApp — código presente pero no operativo.** El módulo (`src/core/external-services/mensajeria/whatsapp/`), el webhook y el campo `usuario.otp_canal` existen y están conectados a `otp.service.ts`, pero **no hay credenciales de Meta (WABA) configuradas** — no existe ninguna variable `WHATSAPP_*`/`META_*` en `.env.sample`. El canal por defecto es `EMAIL` (`OTP_CANAL_DEFAULT`, hardcodeado en `src/common/params/index.ts`, no es variable de entorno). No seleccionar WhatsApp como canal de OTP en ningún ambiente hasta que se complete ese trabajo (credenciales Meta, verificación de firma del webhook, endpoint para que el usuario elija canal, tests — pendiente de una propuesta anterior, ver `docs/keycloack/PROPUESTA-FASES-PENDIENTES.md` §OTP). nginx expone igual la ruta del webhook (`/felcn/api/whatsapp`) aunque el canal no esté en uso.

**Corrección importante (21/08/2026): dev también usa AGETIC real, no un simulador.** El `.env` real de dev ya tiene `OIDC_ISSUER=https://proveedor.ciudadania.demo.agetic.gob.bo` (el `.env.sample` apunta al endpoint de test `account-idetest.agcs.agetic.gob.bo`) — no hay ningún `fake-ciudadania-api` corriendo ni configurado (`FAKE_CIUDADANIA_INTERNAL_URL` no existe en ningún `.env` real ni en el `.env.sample`, y nginx confirma en su propio comentario que el callback OIDC de dev es "Ciudadanía Digital (real, AGETIC)"). El único login del sistema, en cualquier ambiente, es Ciudadanía Digital real — ver también sección 4 (`fake-ciudadania-api` está confirmado sin uso, pendiente de sacarlo del repo).

Existe además `.env.staging` (no versionado) con sus propias credenciales de AGETIC para el ambiente de staging — **huérfano hoy**: staging se sacó por completo de este servidor el 21/08/2026 (nginx y contenedores, ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)) y se levanta en el servidor nuevo asignado para eso, siguiendo [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) como fuente de verdad. Evaluar si conviene rotar esas credenciales de AGETIC al pasarlas al servidor nuevo en vez de reutilizarlas tal cual.

## 2. `felcn-base-backend-v2` (`.env.sample`)

| Bloque | Variables clave | Secreto |
|---|---|---|
| Despliegue | `NODE_ENV`, `PORT`, `PATH_SUBDOMAIN`, `REQUEST_TIMEOUT_IN_SECONDS` | No |
| Base de datos (conexión por defecto) | `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_USE_SSL`, `DB_VERIFY_SSL` | `DB_PASSWORD` sí |
| Multi-BD | `DB_AUTH_*`, `DB_ASIG_CASOS_*`, `DB_SII_*`, `DB_SIII_*`, `DB_LGI_*`, `DB_SOSPECHOSO_*`, `DB_PERSONAS_*`, `DB_VLS_*` | los `*_PASSWORD` de cada bloque sí |
| Autenticación | `JWT_SECRET` (valida los JWT emitidos por `auth-backend`, no emite los suyos propios) | `JWT_SECRET` sí — **debe ser el mismo valor que en `auth-backend`**, si no coinciden los tokens dejan de validar |
| Interoperabilidad | `IOP_SIN_URL`, `IOP_SIN_TOKEN` — **real y en uso** (`interoperabilidad.controller.ts`, endpoints `sin/consulta-datos-contribuyente` y `sin/verificar-comunicacion`), a diferencia de la copia de este mismo par de variables que existía en `auth-backend` (eliminada, ver sección 1) | `IOP_SIN_TOKEN` sí |
| Auth interno | `AUTH_BACKEND_INTERNAL_URL` | No — URL interna docker (`http://auth-backend:4000`); este proyecto **no** maneja su propio login, delega todo a `auth-backend` (ver [00-arquitectura.md](./00-arquitectura.md)) |
| Lookups estáticos | `LOOKUP_GENERO`, `LOOKUP_ESTADO_SUJETO` | No |
| Reportes | `LOGO_REPORT` (base64) | No |
| Logs | `LOG_*` (mismo esquema que auth-backend) | No |

**Variables documentadas antes pero sin ningún uso real en código** (verificado con grep sobre `src/`, agosto 2026) — copiadas en algún momento del `.env.sample` de auth-backend, no eliminar del archivo sin confirmar primero que ningún script fuera de `src/` las necesite:

- **`MSJ_URL`/`MSJ_TOKEN`** ("Mensajería Alertín") — no existe ningún archivo de servicio de mensajería/Alertín en este proyecto (`grep -ri alertin src/` no encuentra nada). La versión anterior de este documento decía que sí se usaban — era incorrecto.
- `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_SCOPE`, `OIDC_REDIRECT_URI`, `OIDC_POST_LOGOUT_REDIRECT_URI`, `OIDC_POST_FAILED_REDIRECT_URI`, `SESSION_SECRET` — sin uso, consistente con que este proyecto delega el login a `auth-backend`.
- `REFRESH_TOKEN_NAME`, `REFRESH_TOKEN_ROTATE_IN`, `REFRESH_TOKEN_DOMAIN`, `REFRESH_TOKEN_REVISIONS` — mismo motivo.
- `URL_FRONTEND`, `STORAGE_NFS_PATH` — sin uso detectado.

## 3. `felcn-base-frontend` (`.env.sample`)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_AUTH_URL`, `NEXT_PUBLIC_SOCKET_URL` | URLs públicas de los backends — cambian entre dev/staging (ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)) |
| `NEXT_PUBLIC_CIUDADANIA_URL`, `NEXT_PUBLIC_FIRMADOR_URL`, `NEXT_PUBLIC_NOMINATIM_URL` | Servicios externos de terceros (AGETIC / OpenStreetMap) |
| `NEXT_PUBLIC_CONSULTA_PERSONA_URL`, `NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY` | Ver hallazgo de seguridad abajo (sección 5) |
| `NEXT_PUBLIC_COOKIE_SECURE` | Debe ser `true` en cualquier ambiente servido por HTTPS |

Todo lo que empieza con `NEXT_PUBLIC_` termina embebido en el bundle de JavaScript que llega al navegador — **nunca poner ahí un secreto real**, solo URLs y claves pensadas para ser públicas.

**Bug corregido (28/08/2026): `NEXT_PUBLIC_PATH=""` en `docker-compose.yml`.** En la sintaxis de lista (`environment: - NEXT_PUBLIC_PATH=""`), Docker Compose toma las comillas como parte literal del valor — el contenedor terminaba con la variable seteada al string de 2 caracteres `""`, no vacío. Esto rompía `Constantes.loginPath` (`frontend/src/config/Constantes.ts`), generando redirects a `/""/login` en vez de `/login` cuando `cerrarSesion()`/errores 401 usaban `window.location.href`. **Corregido**: la línea ahora es `- NEXT_PUBLIC_PATH=` (sin comillas). Si se usa la forma de mapa (`NEXT_PUBLIC_PATH: ""` bajo `args:` de un `build:`), ese formato sí interpreta las comillas correctamente — el bug era específico de la lista `environment:`. **Verificar este mismo patrón en cualquier otra variable con valor vacío** definida como lista en `docker-compose.yml` antes de un despliegue nuevo.

## 4. `fake-ciudadania-api` — confirmado sin uso (21/08/2026), pendiente de sacar del repo

Existe como directorio (`backend/fake-ciudadania-api/`, trackeado en git) pero **no está desplegado en ningún lado**: no aparece en `docker-compose.yml`, no tiene ninguna ruta en el nginx real, y `FAKE_CIUDADANIA_INTERNAL_URL` (la variable que `auth-backend` necesitaría para usarlo) no existe ni en el `.env` real ni en el `.env.sample`. El login, en dev y en cualquier otro ambiente, ya es contra Ciudadanía Digital real (AGETIC) — ver sección 1. Queda pendiente eliminar el directorio del repo y el bloque muerto que todavía lo referencia en `usuario.service.ts` (`darDeAltaEnFakeCiudadania`, la variable `fakeCiudadaniaUrl`) — no se tocó en esta pasada, solo se corrigió la documentación que lo daba por activo.

## 5. Hallazgo de seguridad: clave de API real commiteada en `.env.sample` — parcialmente resuelto

`frontend/felcn-base-frontend/.env.sample` traía, hasta el commit `e7f811e0`, el valor real de `NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY` en texto plano — el mismo valor exacto configurado como `API_KEY_UNLIMITED` en el `.env` real de `consulta-persona-api`, no un placeholder. Al ser `NEXT_PUBLIC_*` también quedaba expuesta en el bundle JS servido al navegador.

**Ya corregido en el archivo actual**: se reemplazó por un placeholder (`__CONSULTA_PERSONA_API_KEY__`), commiteado y pusheado a `develop`.

**Pendiente, requiere decisión del equipo**: el valor real sigue en el historial de git (commits anteriores) y la clave sigue activa tal cual en `consulta-persona-api` — reemplazar el archivo no la invalida. Para cerrar esto de verdad hace falta (a) rotar la clave real en `consulta-persona-api` y en cualquier lugar que la consuma, y (b) decidir si vale la pena purgarla del historial de git (operación destructiva, requiere `git filter-repo`/BFG + force-push + coordinar con todo el equipo, ya que reescribe commits que otros ya tienen clonados) o si alcanza con que ya no sea válida tras la rotación. También evaluar si `consulta-persona-api` debería aceptar autenticación por sesión/JWT del usuario en vez de una API key estática compartida con el frontend público.

## 6. Buenas prácticas para el servidor nuevo

- Ningún `.env` real (`.env`, `.env.staging`, `.env.backup-*`) debe llegar a git — confirmar `.gitignore` de cada proyecto antes de clonar en el servidor nuevo.
- Rotar `JWT_SECRET`, `SESSION_SECRET`, `OIDC_CLIENT_SECRET`, `NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY` y todos los `*_TOKEN`/`*_PASSWORD` al pasar a un servidor nuevo o a producción — no reutilizar los valores de dev/staging.
- Este documento debe reflejar **todas** las variables que trae cada `.env.sample`/`.env.example` real, ni una menos — la auditoría de agosto 2026 (sección 1 y 2) encontró variables documentadas que nunca se usaron en código (copiadas de otro proyecto) y una variable crítica (`URL_FRONTEND`) que sí se usa pero no estaba documentada. Antes de dar por completo este documento para un servidor nuevo, volver a correr el chequeo: por cada variable del `.env.sample`, confirmar que aparece acá y que el código realmente la lee.
