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
  | SMTP — respaldo (28/08/2026) | `SMTP_BACKUP1_HOST/PORT/SECURE/USER/PASS/FROM`, `SMTP_BACKUP2_HOST/PORT/SECURE/USER/PASS/FROM` — 2 cuentas Gmail de respaldo; mensajeria.service.ts reintenta primario → respaldo-1 → respaldo-2 en orden, sin bloquear la respuesta al usuario (envío fire-and-forget). Ya están en `.env.sample`. | Los *_PASS sí (App Password de cada cuenta) |
| Ciudadanía Digital (OIDC) — **único login del sistema, real (AGETIC)** | `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `OIDC_SCOPE`, `OIDC_REDIRECT_URI`, `OIDC_POST_LOGOUT_REDIRECT_URI`, `SESSION_SECRET` | `OIDC_CLIENT_SECRET`, `SESSION_SECRET` sí |
| Storage / Logs | `STORAGE_NFS_PATH`, `LOG_*` | No |

**Variables documentadas antes pero sin ningún uso real en código** (verificado con grep sobre `src/`, agosto 2026) — no se usan, no eliminar sin confirmar primero que de verdad no hacen falta en ningún lado (migraciones, scripts) antes de sacarlas del `.env.sample`:

- `DB_SCHEMA_FELCN` — el schema `felcn_estructura` se referencia en otros lugares por su nombre literal, no a través de esta variable.
- `REFRESH_TOKEN_DOMAIN` — el resto de la config de la cookie de refresh token (`REFRESH_TOKEN_SECURE`, `REFRESH_TOKEN_PATH`) sí se usa.

**Hallazgo (29/08/2026): `IOP_SIN_URL`/`IOP_SIN_TOKEN` reaparecieron en el `.env` real** de `auth-backend` (no en `.env.sample`) pese a que el punto siguiente documenta que el código que las usaba se eliminó el 21/08/2026 — quedaron como valores huérfanos en el archivo real, sin ningún código que las lea hoy (confirmado con grep sobre `src/` el 29/08/2026). No son riesgo de seguridad por sí solas, pero conviene limpiarlas del `.env` real para no confundir a quien lo lea después.

**`IOP_SEGIP_*` e `IOP_SIN_*` ya no existen en este proyecto (21/08/2026)** — se eliminó el código (`src/core/external-services/iop/`, nunca tenía ningún controller que lo expusiera — quedaba instanciado por inyección de dependencias pero nada lo llamaba nunca) y las variables del `.env.sample`/`INSTALL.md`. `auth-backend` **no tiene ninguna interoperabilidad activa hoy**. Importante no confundir con `felcn-base-backend`: ese proyecto sí tiene una integración SIN real y en uso (`POST /interoperabilidad/sin/consulta-datos-contribuyente`, `GET /interoperabilidad/sin/verificar-comunicacion`, controller registrado y guardado con `JwtAuthGuard`) — ver sección 2. Son dos bases de código distintas; la limpieza acá no le pega a esa.

**OTP por WhatsApp — código presente pero no operativo.** El módulo (`src/core/external-services/mensajeria/whatsapp/`), el webhook y el campo `usuario.otp_canal` existen y están conectados a `otp.service.ts`, pero **no hay credenciales de Meta (WABA) configuradas** — no existe ninguna variable `WHATSAPP_*`/`META_*` en `.env.sample`. El canal por defecto es `EMAIL` (`OTP_CANAL_DEFAULT`, hardcodeado en `src/common/params/index.ts`, no es variable de entorno). No seleccionar WhatsApp como canal de OTP en ningún ambiente hasta que se complete ese trabajo (credenciales Meta, verificación de firma del webhook, endpoint para que el usuario elija canal, tests — pendiente de una propuesta anterior, ver `docs/keycloack/PROPUESTA-FASES-PENDIENTES.md` §OTP). nginx expone igual la ruta del webhook (`/felcn/api/whatsapp`) aunque el canal no esté en uso.

**Corrección importante (21/08/2026): dev también usa AGETIC real, no un simulador.** El `.env` real de dev ya tiene `OIDC_ISSUER=https://proveedor.ciudadania.demo.agetic.gob.bo` (el `.env.sample` apunta al endpoint de test `account-idetest.agcs.agetic.gob.bo`) — no hay ningún `fake-ciudadania-api` corriendo ni configurado (`FAKE_CIUDADANIA_INTERNAL_URL` no existe en ningún `.env` real ni en el `.env.sample`, y nginx confirma en su propio comentario que el callback OIDC de dev es "Ciudadanía Digital (real, AGETIC)"). El único login del sistema, en cualquier ambiente, es Ciudadanía Digital real — ver también sección 4 (`fake-ciudadania-api` está confirmado sin uso, pendiente de sacarlo del repo).

**Servidores nuevos dockerizados (dev `.23` / staging `.24` / producción): `DB_HOST=postgres`, `DB_DATABASE=felcn_auth`.** Distinto de `servertest`/.20, donde Postgres es nativo y la base real se llama `felcn_auth_v3` (nombre de trabajo). `felcn_auth` es el nombre oficial corregido (confirmado por el usuario 29/08/2026) — `postgres` es el nombre del servicio Docker en el mismo compose (ver [deploy/staging/docker-compose.yml](../deploy/staging/docker-compose.yml)), no una IP ni `host.docker.internal`. No cambiar esto en el `.env` de `servertest`.

Existe además `.env.staging` (no versionado) con sus propias credenciales de AGETIC para el ambiente de staging — **huérfano hoy**: staging se sacó por completo de este servidor el 21/08/2026 (nginx y contenedores, ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)) y se levanta en el servidor nuevo asignado para eso, siguiendo [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) como fuente de verdad. Evaluar si conviene rotar esas credenciales de AGETIC al pasarlas al servidor nuevo en vez de reutilizarlas tal cual.

## 2. `felcn-base-backend` (`.env.sample`)

| Bloque | Variables clave | Secreto |
|---|---|---|
| Despliegue | `NODE_ENV`, `PORT`, `PATH_SUBDOMAIN`, `REQUEST_TIMEOUT_IN_SECONDS` | No |
| Base de datos (conexión por defecto) | `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_USE_SSL`, `DB_VERIFY_SSL` | `DB_PASSWORD` sí |
| Multi-BD | `DB_AUTH_*`, `DB_ASIG_CASOS_*`, `DB_SII_*`, `DB_SIII_*`, `DB_LGI_*`, `DB_SOSPECHOSO_*`, `DB_PERSONAS_*`, `DB_VLS_*`, `DB_S2I_*` (agregado 31/08/2026 — faltaba por completo en `.env.sample` pese a que `database.module.ts` sí lo lee; sin este bloque el servicio no arranca) | los `*_PASSWORD` de cada bloque sí |
| Autenticación | `JWT_SECRET` (valida los JWT emitidos por `auth-backend`, no emite los suyos propios) | `JWT_SECRET` sí — **debe ser el mismo valor que en `auth-backend`**, si no coinciden los tokens dejan de validar |
| Interoperabilidad | `IOP_SIN_URL`, `IOP_SIN_TOKEN` — **real y en uso** (`interoperabilidad.controller.ts`, endpoints `sin/consulta-datos-contribuyente` y `sin/verificar-comunicacion`), a diferencia de la copia de este mismo par de variables que existía en `auth-backend` (eliminada, ver sección 1) | `IOP_SIN_TOKEN` sí |
| Auth interno | `AUTH_BACKEND_INTERNAL_URL` | No — URL interna docker (`http://auth-backend:4000`); este proyecto **no** maneja su propio login, delega todo a `auth-backend` (ver [00-arquitectura.md](./00-arquitectura.md)) |
| Lookups estáticos | `LOOKUP_GENERO`, `LOOKUP_ESTADO_SUJETO` | No |
| Reportes | `LOGO_REPORT` (base64) | No |
| Logs | `LOG_*` (mismo esquema que auth-backend) | No |

**Servidores nuevos dockerizados: mismo `DB_HOST=postgres` en todos los bloques** (`DB_HOST` por defecto y cada `DB_<NOMBRE>_HOST`) — todas las bases viven en el mismo contenedor de Postgres del compose, no hosts distintos.

**Variable muerta eliminada (29/08/2026): `DB_SCHEMA_PARAMETRICAS`.** Estaba en el `environment:` de `docker-compose.yml` (raíz, gitignored) pero sin ningún uso en `src/` (confirmado con grep) — se sacó del compose real y no se incluye en ninguna plantilla nueva. `DB_SCHEMA_USUARIOS` sí se usa (`auditoria-cambio.subscriber.ts`, `authorization.module.ts`) y se mantiene.

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

## 6. Variables de infraestructura (`.env` de compose, servidores nuevos dockerizados)

Distinto de las tablas de arriba (esas son el `.env`/`.env.sample` de cada proyecto) — estas viven en un `.env` propio, al lado del `docker-compose.yml` del servidor, que Compose lee automáticamente para resolver los `${...}` de [deploy/staging/docker-compose.yml](../deploy/staging/docker-compose.yml). Ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 6 para el contenido literal esperado de este archivo.

| Variable | Para qué | Secreto |
|---|---|---|
| `DB_PASSWORD` | Contraseña del superusuario `postgres` — la usa `POSTGRES_PASSWORD` del servicio `postgres` (init del contenedor) y quien corre migraciones a mano (`npm run migrations:run`, siempre con el superusuario, nunca con `felcn_app`) | Sí |
| `DB_APP_PASSWORD` | Contraseña del rol `felcn_app` (decisión del 30/08/2026, ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 3) — el que usan las apps en runtime, sin privilegios de DDL. Se inyecta como `DB_PASSWORD` dentro del `environment:` de cada servicio de app en el compose, pisando lo que traiga su propio `.env` | Sí |
| `TAG` | Tag de las 3 imágenes a desplegar (`registry.sunesis-dev.felcn.gob.bo/felcn-<imagen>:${TAG}`) — ver [14-registro-de-imagenes.md](./14-registro-de-imagenes.md) | No |
| `DOMINIO` | Dominio real de este servidor (o su IP, si todavía no hay DNS — ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1). Agregada 31/08/2026: antes el `environment:` de `base-frontend` tenía `<DOMINIO>` como texto literal sin reemplazar en el propio `docker-compose.yml`, y como `environment:` pisa `env_file:`, eso rompía el login en silencio (llamaba a `https://<DOMINIO>/auth/api/auth`, un host que no existe) aunque el `.env` del frontend tuviera la URL correcta. **Debe coincidir exactamente** con el `<DOMINIO>` usado al activar `deploy/tools/nginx/conf.d/app.conf.template` (Fase 4 de [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md)) — si no coinciden, nginx escucha en un nombre y el navegador llama a otro. | No |

Las credenciales del registry (usuario/contraseña de `htpasswd`) **no tienen nombre de variable de entorno** en ningún compose — se piden interactivo al correr `crear-htpasswd.sh` (ver [14-registro-de-imagenes.md](./14-registro-de-imagenes.md) §2) y quedan hasheadas en un archivo `htpasswd`, no en ningún `.env`.

## 7. Buenas prácticas para el servidor nuevo

- Ningún `.env` real (`.env`, `.env.staging`, `.env.backup-*`) debe llegar a git — confirmar `.gitignore` de cada proyecto antes de clonar en el servidor nuevo.
- Rotar `JWT_SECRET`, `SESSION_SECRET`, `OIDC_CLIENT_SECRET`, `NEXT_PUBLIC_CONSULTA_PERSONA_API_KEY` y todos los `*_TOKEN`/`*_PASSWORD` al pasar a un servidor nuevo o a producción — no reutilizar los valores de dev/staging.
- Este documento debe reflejar **todas** las variables que trae cada `.env.sample`/`.env.example` real, ni una menos — la auditoría de agosto 2026 (sección 1 y 2) encontró variables documentadas que nunca se usaron en código (copiadas de otro proyecto) y una variable crítica (`URL_FRONTEND`) que sí se usa pero no estaba documentada. Antes de dar por completo este documento para un servidor nuevo, volver a correr el chequeo: por cada variable del `.env.sample`, confirmar que aparece acá y que el código realmente la lee.

## 8. Checklist rápido: qué tiene que definir un devops en un servidor nuevo

Cinco archivos distintos, cada uno con su propia responsabilidad — ningún valor se comparte automáticamente entre ellos salvo donde se indica explícito (`environment:` del compose pisando `env_file:`):

| # | Archivo | Qué define | Dónde está documentado |
|---|---|---|---|
| 1 | `deploy/<entorno>/.env` | `DB_PASSWORD`, `DB_APP_PASSWORD` (generar con `openssl rand -base64 24`, ver el `.env.sample` de cada entorno), `DOMINIO`, y en staging/producción `TAG` | Sección 6 de este documento |
| 2 | `backend/felcn-auth-backend/.env` | Todo lo de la sección 1 — en particular `ADMIN_INITIAL_PASSWORD` (obligatoria, falla el seed sin esto), `JWT_SECRET`, `SESSION_SECRET`, `OIDC_*` (mismas credenciales demo que dev hasta que exista producción real), `SMTP_*` | Sección 1 |
| 3 | `backend/felcn-base-backend/.env` | Todo lo de la sección 2 — los 9 bloques `DB_<NOMBRE>_*` (uno por base de dominio, incluye `DB_S2I_*`), `JWT_SECRET` (**debe ser idéntico** al de `auth-backend`, si no los tokens no validan) | Sección 2 |
| 4 | `frontend/felcn-base-frontend/.env` | `NEXT_PUBLIC_*` — en la práctica, para `BASE_URL`/`AUTH_URL`/`SOCKET_URL`/`IMAGES_DOMAIN` este archivo queda pisado por la variable `DOMINIO` del punto 1 (ver la nota de `environment:` vs `env_file:` en la fila `DOMINIO` de la sección 6) — igual completarlo por las demás variables (`NEXT_PUBLIC_CIUDADANIA_URL`, `NEXT_PUBLIC_FIRMADOR_URL`, etc.) | Sección 3 |
| 5 | `deploy/tools/nginx/conf.d/<DOMINIO>.conf` (activado desde `app.conf.template`) | El `server_name`/`ssl_certificate` con el `<DOMINIO>` real — **debe ser el mismo string** que la variable `DOMINIO` del punto 1, letra por letra (mayúsculas/IP/puerto incluido) | [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 4 |

**Sin dominio real (solo IP, ej. un servidor de prueba)**: `DOMINIO` puede ser la IP literal (`172.16.76.22`) — funciona igual para los puntos 1, 4 y 5, pero el punto 2 (`OIDC_REDIRECT_URI`) casi seguro no funciona (AGETIC solo acepta el `redirect_uri` que tiene registrado para el dominio real de dev) y el punto 5 no puede emitir un certificado Let's Encrypt real (usar uno autofirmado, ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1). Probado de punta a punta el 30-31/08/2026 contra `172.16.76.22`.

## 9. ⚠️ Trampa real: `cp .env.sample .env` + pegar secretos no es suficiente

Confirmado real (31/08/2026, `sunesis-dev.felcn.gob.bo`): copiar el `.env.sample` y solo reemplazar las variables "obviamente secretas" (contraseñas, tokens) **deja otros valores por defecto sin corregir**, y ninguno de los tres backends avisa con un error claro cuando eso pasa:

- `DB_HOST=localhost` (en vez de `postgres`) → `ECONNREFUSED 127.0.0.1:5432` al correr migraciones — al menos este sí es un error visible.
- `DB_DATABASE=felcn_auth_v3` (en vez de `felcn_auth`) — no rompe nada visible en un servidor nuevo (la base simplemente no existe con ese nombre, TypeORM la crearía... no, en realidad falla también, pero con un mensaje menos obvio de "database does not exist").
- **`ADMIN_INITIAL_PASSWORD=__CONTRASENA_FUERTE__` — el más peligroso.** Es un placeholder de ejemplo, pero tiene longitud y variedad suficiente para pasar la validación `zxcvbn` sin ningún error. El seed lo acepta como si fuera la contraseña real elegida, y el usuario `ADMINISTRADOR` queda con una contraseña que cualquiera que haya visto el `.env.sample` del repo conoce — **sin ningún log, warning, ni fallo que lo delate**. Solo se descubre revisando el `.env` a mano después. Ver el procedimiento de corrección (actualizar el hash directo en la base, ya que el seed no se repite) en [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 8.

**Antes de levantar cualquier app, correr esta verificación** (falla si queda algún placeholder sin reemplazar):

```bash
grep -c "localhost\|_v3\|CONTRASENA_FUERTE\|PENDIENTE" backend/felcn-auth-backend/.env backend/felcn-base-backend/.env
```

Debe dar `0` en ambos (o `2` en `auth-backend` si `OIDC_CLIENT_ID`/`SECRET` están a propósito como `__PENDIENTE_SOLICITAR_A_AGETIC__` mientras se tramita el registro real).

### Plantilla completa de referencia — `backend/felcn-base-backend/.env`

El `.env.sample` de este proyecto no tiene los valores correctos por bloque (`DB_HOST`, nombres reales de base, `DB_USERNAME`) para un servidor dockerizado nuevo — hay que corregir los 9 bloques a mano. Plantilla ya corregida, lista para reemplazar `<DB_PASSWORD>`/`<DB_APP_PASSWORD>`/`<JWT_SECRET>` (el mismo de `auth-backend`):

```bash
NODE_ENV=production
PORT=3000

DB_HOST=postgres
DB_USERNAME=felcn_app
DB_PASSWORD=<DB_APP_PASSWORD>
DB_USE_SSL=false
DB_VERIFY_SSL=false

DB_AUTH_HOST=postgres
DB_AUTH_USERNAME=felcn_app
DB_AUTH_PASSWORD=<DB_APP_PASSWORD>
DB_AUTH_DATABASE=felcn_auth

DB_ASIG_CASOS_HOST=postgres
DB_ASIG_CASOS_USERNAME=postgres
DB_ASIG_CASOS_PASSWORD=<DB_PASSWORD>
DB_ASIG_CASOS_DATABASE=a_felcn_asignacion_caso

DB_SII_HOST=postgres
DB_SII_USERNAME=postgres
DB_SII_PASSWORD=<DB_PASSWORD>
DB_SII_DATABASE=a_felcn_sii

DB_SIII_HOST=postgres
DB_SIII_USERNAME=postgres
DB_SIII_PASSWORD=<DB_PASSWORD>
DB_SIII_DATABASE=felcn_siii

DB_LGI_HOST=postgres
DB_LGI_USERNAME=postgres
DB_LGI_PASSWORD=<DB_PASSWORD>
DB_LGI_DATABASE=a_felcn_lgi

DB_SOSPECHOSO_HOST=postgres
DB_SOSPECHOSO_USERNAME=postgres
DB_SOSPECHOSO_PASSWORD=<DB_PASSWORD>
DB_SOSPECHOSO_DATABASE=a_felcn_sospechoso

DB_PERSONAS_HOST=postgres
DB_PERSONAS_USERNAME=postgres
DB_PERSONAS_PASSWORD=<DB_PASSWORD>
DB_PERSONAS_DATABASE=felcn_personas

DB_VLS_HOST=postgres
DB_VLS_USERNAME=postgres
DB_VLS_PASSWORD=<DB_PASSWORD>
DB_VLS_DATABASE=felcn_vls

DB_S2I_HOST=postgres
DB_S2I_USERNAME=postgres
DB_S2I_PASSWORD=<DB_PASSWORD>
DB_S2I_DATABASE=felcn_s2i

JWT_SECRET=<JWT_SECRET>
AUTH_BACKEND_INTERNAL_URL=http://auth-backend:4000

LOG_SQL=true
LOG_ENABLED=true
LOG_LEVEL=info
LOG_CONSOLE=true
LOG_FILE_ENABLED=true
LOG_FILE_PATH=/tmp/logs/
LOG_FILE_SIZE=50M
LOG_FILE_INTERVAL=YM

LOOKUP_GENERO=1:Masculino,0:Femenino
LOOKUP_ESTADO_SUJETO=Principal Implicado,Aprehendido,Arrestado,LGI O Perdida de Dominio
```

Nota: `felcn_app` solo tiene permisos sobre `felcn_auth` (ver `01-crear-bases.sh`) — por eso los 8 bloques de bases de dominio usan `postgres` (superusuario) como `DB_<NOMBRE>_USERNAME`, no `felcn_app`. Los campos omitidos a propósito (`IOP_SIN_*`, `MSJ_*`, `OIDC_*`, `URL_FRONTEND`) están documentados como sin uso real en este proyecto — ver sección 2.
