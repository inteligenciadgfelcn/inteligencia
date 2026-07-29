# 02 — Entorno Docker (dev + staging)

Cómo levantar todo el stack de aplicación con Docker, tal como corre hoy en `servertest`. Esto **no incluye Postgres** (corre nativo en el host, ver [03-base-de-datos.md](./03-base-de-datos.md)) ni nginx (también nativo, ver [05-nginx-y-tls.md](./05-nginx-y-tls.md)) — ambos puntos cambian en el servidor nuevo, ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md).

## 1. Requisitos

- Docker Engine (servidor actual: 29.5.2) + Docker Compose v2/v5 (`docker compose`, no `docker-compose`).
- Postgres ya creado y accesible desde los contenedores — ver sección 3.

## 2. Archivo `docker-compose.yml` (raíz del repo)

Un solo archivo orquesta **dos ambientes en paralelo** (dev y staging) del mismo código, en la misma red `felcn-network`:

| Servicio (compose) | Container | Ambiente | Puerto host | env_file |
|---|---|---|---|---|
| `base-backend-v2` | `base-backend-v2` | dev | `3015:3000` | `backend/felcn-base-backend-v2/.env` |
| `base-auth` | `auth-backend` | dev | `127.0.0.1:3016:4000` | `backend/felcn-auth-backend/.env` |
| `base-frontend` | `base-frontend` | dev | `127.0.0.1:3017:3000` | `frontend/felcn-base-frontend/.env` |
| `base-backend-v2-staging` | `base-backend-v2-staging` | staging | `127.0.0.1:3025:3000` | mismo `.env` de dev (ver nota) |
| `base-auth-staging` | `auth-backend-staging` | staging | `127.0.0.1:3026:4000` | `backend/felcn-auth-backend/.env.staging` (credenciales **reales** de Ciudadanía Digital) |
| `base-frontend-staging` | `base-frontend-staging` | staging | `127.0.0.1:3027:3000` | `frontend/felcn-base-frontend/.env` |
| `consulta-persona-api` | `consulta-persona-api` | único | `127.0.0.1:3018:8000` | `backend/consulta-persona-api/.env` |
| `consulta-persona-redis` | `consulta-persona-redis` | único | interno | — |
| `fake-ciudadania-api` | `fake-ciudadania-api` | dev | `127.0.0.1:3019:3001` | `backend/fake-ciudadania-api/.env` |

> **Nota importante**: `base-backend-v2-staging` usa **el mismo `.env`** que dev (mismo archivo, comentario explícito en el compose: *"Misma BD que dev por ahora"*). Solo `auth-backend-staging` tiene su propio `.env.staging` con credenciales reales de AGETIC. Si se separan las bases de datos de staging en el futuro, este compose debe actualizarse.

Todos los servicios de Node exponen solo a `127.0.0.1` (excepto `base-backend-v2` dev, que escucha en todas las interfaces en `0.0.0.0:3015` — revisar si es intencional) porque nginx en el host es quien expone al público vía HTTPS.

Todos tienen `restart: unless-stopped` y `extra_hosts: host.docker.internal:host-gateway` para poder conectarse al Postgres nativo del host desde dentro del contenedor (usar `DB_HOST=host.docker.internal` en el `.env`, no `localhost`).

## 3. Antes de levantar: base de datos

Los contenedores **no crean la base de datos**. Antes de `docker compose up`:
1. Tener Postgres corriendo y accesible (nativo en el host, o un contenedor aparte si se sigue esa vía — ver [03-base-de-datos.md](./03-base-de-datos.md)).
2. Los `.env` de cada backend deben apuntar a `DB_HOST=host.docker.internal` (no `localhost`, que dentro del contenedor no resuelve al host).
3. Correr las migraciones/seeds la primera vez (puede hacerse dentro del contenedor con `docker exec` o nativamente antes de dockerizar — ver runbook en [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md)).

## 4. Levantar el stack

```bash
cd /srv/inteligencia

# Construir y levantar todo
docker compose up -d --build

# Solo reconstruir un servicio puntual
docker compose up -d --build base-backend-v2

# Ver logs
docker compose logs -f auth-backend

# Bajar todo
docker compose down
```

Al desplegar cambios de código en dev+staging, **reconstruir los 6 contenedores principales juntos** (no uno a la vez) para evitar que queden versiones mezcladas del mismo código sirviendo distinto ambiente.

## 5. Volúmenes

| Volumen | Contenido |
|---|---|
| `logs_data` | Logs de dev (`/tmp/logs` dentro de los contenedores dev) |
| `logs_data_staging` | Logs de staging |
| `consulta_persona_redis_data` | Datos de Redis de consulta-persona |
| `fake_jwk_keys` | Claves RSA generadas por `fake-ciudadania-api` para firmar tokens OIDC simulados — si se borra este volumen, los tokens firmados previamente dejan de validar |

## 6. Diferencia clave dev vs staging

- **Dev**: `auth-backend` usa `fake-ciudadania-api` como proveedor OIDC (sin credenciales reales).
- **Staging**: `auth-backend-staging` usa Ciudadanía Digital real (AGETIC demo) vía `.env.staging`. Por eso staging es el ambiente correcto para probar el flujo real de login antes de producción.
