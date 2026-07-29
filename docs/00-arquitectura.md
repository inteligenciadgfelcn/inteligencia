# 00 — Arquitectura consolidada

> Este documento es el mapa general del proyecto `inteligencia`. Cada backend/frontend tiene su propia documentación de arquitectura interna (ver "Documentación por proyecto" al final); aquí solo se consolida cómo encajan entre sí, qué puertos usan y por dónde entra el tráfico.

## 1. Componentes del sistema

| Componente | Tipo | Repo/carpeta | Puerto interno | Puerto host (dev) | Puerto host (staging) |
|---|---|---|---|---|---|
| `base-frontend` | Next.js | `frontend/felcn-base-frontend` | 3000 | 3017 | 3027 (`base-frontend-staging`) |
| `base-backend-v2` | NestJS | `backend/felcn-base-backend-v2` | 3000 | 3015 | 3025 (`base-backend-v2-staging`) |
| `auth-backend` | NestJS | `backend/felcn-auth-backend` | 4000 | 3016 (127.0.0.1) | 3026 (`auth-backend-staging`, 127.0.0.1) |
| `consulta-persona-api` | FastAPI | `backend/consulta-persona-api` | 8000 | 3018 (127.0.0.1) | — |
| `consulta-persona-redis` | Redis | (imagen `redis:7-alpine`) | 6379 | — (solo red interna) | — |
| `fake-ciudadania-api` | NestJS | `backend/fake-ciudadania-api` | 3001 | 3019 (127.0.0.1) | — |

Todos corren como contenedores Docker (`docker-compose.yml` en la raíz del repo, ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)) con `restart: unless-stopped`, en la red bridge `felcn-network`.

`felcn-fase2-backend` existe en `backend/` pero no está en el `docker-compose.yml` raíz activo — verificar su estado antes de incluirlo en cualquier despliegue.

## 2. Entrada de tráfico (nginx)

nginx corre **en el host**, no dockerizado (paquete `nginx` 1.26.3 de Debian 13), como único punto de entrada HTTPS para el dominio `desarrollo.felcn.gob.bo` (certificado Let's Encrypt, renovado vía `certbot` + plugin `python3-certbot-nginx`). Ver detalle completo en [05-nginx-y-tls.md](./05-nginx-y-tls.md).

Enrutamiento a alto nivel (dev vive en la raíz del dominio, staging bajo `/staging`):

```
https://desarrollo.felcn.gob.bo/
├── /                         → base-frontend (dev)          :3017
├── /api                      → base-backend-v2 (dev)         :3015
├── /dev/auth/api             → auth-backend (dev)            :3016
├── /pandora-api              → auth-backend (callback PANDORA) :3016
├── /felcn/api/whatsapp       → auth-backend (webhook Meta)   :3016
├── /persona/                 → consulta-persona-api          :3018
├── /ciudadania/, /interaction/ → fake-ciudadania-api (dev)    :3019
├── /socket.io/               → base-backend-v2 (websockets)  :3015
├── /staging/                 → base-frontend-staging          :3027
├── /staging/api              → base-backend-v2-staging        :3025
└── /staging/auth/api         → auth-backend-staging           :3026
```

nginx también tiene un `upstream hub_gateway` (`127.0.0.1:8088`) para el stack de interoperabilidad (proyecto **`/srv/interop`, independiente de este repo — su documentación se hace por separado**). Esto solo se menciona aquí porque es un hecho de la configuración de este nginx, no como documentación de ese otro proyecto.

## 3. Persistencia

Cada backend NestJS se conecta a Postgres vía TypeORM. Las bases de datos reales en uso (ver [03-base-de-datos.md](./03-base-de-datos.md) para el detalle completo):

| Base de datos | Usada por |
|---|---|
| `felcn_auth_v3` | `auth-backend` (principal) y `base-backend-v2` (conexión `DB_AUTH_*`, solo lectura de usuarios) y `fake-ciudadania-api` (schema propio `fake_ciudadania`) |
| `felcn_siii`, `felcn_lgi` | `base-backend-v2` |
| `a_felcn_asignacion_caso`, `a_felcn_sii`, `a_felcn_sospechoso`, `felcn_personas`, `felcn_vls` | `base-backend-v2` (conexiones adicionales por dominio) |
| `bolivia_hub` (host externo `72.60.156.246`) | `consulta-persona-api` (no es una BD local del servidor) |

Actualmente Postgres corre **nativo en el host** (no dockerizado) para las bases del dominio `felcn_*`. Esto cambia para el servidor nuevo — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md).

## 4. Flujo de autenticación (resumen)

- **Dev**: `auth-backend` usa `fake-ciudadania-api` como OpenID Provider simulado (`OIDC_ISSUER=http://localhost:3001` vía `fake-ciudadania-api`) para no depender de credenciales reales de AGETIC.
- **Staging**: `auth-backend-staging` usa el proveedor real de Ciudadanía Digital (AGETIC demo), con `.env.staging` propio.
- El frontend nunca habla directo con el proveedor OIDC: el flujo pasa por `auth-backend`.

## 5. Documentación por proyecto (no duplicada aquí)

Cada proyecto ya mantiene su propia documentación interna — este documento consolidado no la reemplaza:

- `backend/felcn-base-backend-v2/docs/arquitectura.md` — estructura de directorios y diagrama ERD del proyecto.
- `backend/felcn-auth-backend/docs/arquitectura.md` — ídem para auth-backend.
- `backend/felcn-base-backend-v2/docs/openapi.yaml`, `backend/felcn-auth-backend/docs/openapi.yaml` — especificación de API (Swagger).

> Nota: `backend/felcn-base-backend-v2/docs/ARQUITECTURA_SERVICIOS.md` es una **propuesta de migración legacy** (SUNESIS .aspx → microservicios .NET) y no describe el sistema actual (NestJS/Postgres) — no usarlo como referencia de arquitectura vigente.

## 6. Incidentes conocidos que afectan la arquitectura operativa

- El servidor actual (`servertest`) tuvo caídas totales recurrentes (jul. 2026) causadas por una sesión de escritorio GNOME activa en la consola física compitiendo con el rol de servidor — no relacionado a la arquitectura de la app, pero condiciona el diseño del servidor nuevo (debe ser headless). Ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md).
