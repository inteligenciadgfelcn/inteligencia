# 02 — Entorno Docker (dev)

Cómo levantar el stack de aplicación con Docker, tal como corre hoy en `servertest`. Esto **no incluye Postgres** (corre nativo en el host, ver [03-base-de-datos.md](./03-base-de-datos.md)) ni nginx (también nativo, ver [05-nginx-y-tls.md](./05-nginx-y-tls.md)) — ambos puntos cambian en el servidor nuevo, ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md).

> **Staging se sacó por completo de este servidor (21/08/2026)**: los 3 servicios de staging (`base-backend-v2-staging`, `base-auth-staging`, `base-frontend-staging`) se eliminaron del `docker-compose.yml`, sus contenedores se borraron, y sus bloques de nginx (`upstream` + `location`) también se sacaron del sitio real. Staging vive ahora en un servidor nuevo separado, ya asignado para eso — [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) es la fuente de verdad para levantarlo ahí, no acá. Este documento describe únicamente dev.

## 1. Requisitos

- Docker Engine (servidor actual: 29.5.2) + Docker Compose v2/v5 (`docker compose`, no `docker-compose`).
- Postgres ya creado y accesible desde los contenedores — ver sección 3.

## 2. Archivo `docker-compose.yml` (raíz del repo)

| Servicio (compose) | Container | Puerto host | env_file |
|---|---|---|---|
| `base-backend-v2` | `base-backend-v2` | `3015:3000` | `backend/felcn-base-backend-v2/.env` |
| `base-auth` | `auth-backend` | `127.0.0.1:3016:4000` | `backend/felcn-auth-backend/.env` |
| `base-frontend` | `base-frontend` | `127.0.0.1:3017:3000` | `frontend/felcn-base-frontend/.env` |

`fake-ciudadania-api` **no está en este compose** — confirmado sin uso (no hay ninguna variable que lo active en ningún `.env` real), pendiente de sacarlo también del repo. El login es contra Ciudadanía Digital real (AGETIC) — ver [00-arquitectura.md](./00-arquitectura.md) §4.

Todos los servicios de Node exponen solo a `127.0.0.1` (excepto `base-backend-v2`, que escucha en todas las interfaces en `0.0.0.0:3015` — revisar si es intencional) porque nginx en el host es quien expone al público vía HTTPS.

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

Al desplegar cambios de código, reconstruir los contenedores afectados juntos (no uno a la vez si dependen entre sí) para evitar versiones mezcladas del mismo código sirviendo distinto componente.

## 5. Volúmenes

| Volumen | Contenido |
|---|---|
| `logs_data` | Logs de dev (`/tmp/logs` dentro de los contenedores) |
| `storage_data` | Fotos de perfil de usuario (`/home/node/app/storage` en `auth-backend`) — agregado 28/08/2026 tras un 502 causado por `STORAGE_NFS_PATH` apuntando a una ruta inexistente/no escribible dentro del contenedor; el `dockerfile` de `auth-backend` crea y da permisos al directorio (`mkdir -p` + `chown node:node`) antes de montar este volumen encima |

## 6. Autenticación

El único proveedor de login es Ciudadanía Digital real (AGETIC) — ver [00-arquitectura.md](./00-arquitectura.md) §4 y [04-variables-de-entorno.md](./04-variables-de-entorno.md). No hay ambiente con proveedor simulado hoy.

## 7. Convenciones de nomenclatura y ramas — dev y staging

Aplica a **dev y staging únicamente**: son los dos únicos ambientes donde el código fuente vive en el servidor (`git clone` + `docker compose up -d --build`, construyendo la imagen ahí mismo). **Producción no clona el repo** — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) §8 y la nota correspondiente, pendiente de que exista un registry de imágenes.

| Concepto | Convención | Notas |
|---|---|---|
| Rama de integración | `develop` | Toda la app se actualiza mergeando a `develop` — nunca commitear directo ahí |
| Rama de feature/fix | prefijo obligatorio `fase1/` (p. ej. `fase1/autorregistro-preregistro`) | Confirmado con el historial real de commits/ramas de agosto 2026 (`git branch -a`). Flujo: crear rama `fase1/...` → commit → push → checkout `develop` → `git pull` → `merge --no-ff` → push → rebuild/redeploy del o los servicios afectados |
| Rama `main` | Existe en el remoto (`origin/main`, `HEAD` del repo apunta ahí) | Su rol respecto a `develop` no está formalizado en ningún documento — **a definir**: si `main` va a ser la rama que efectivamente se construye para producción (tag/release), documentarlo acá antes del primer despliegue a producción |
| Nombre de servidor / hostname | `servertest` (dev **actual**, IP interna `172.16.76.20`) — se dará de baja cuando `sunesis-dev` esté operativo | Ver tabla de topología confirmada en [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1 |
| Dominio público | `desarrollo.felcn.gob.bo` en este host (temporal); los definitivos son `sunesis-dev.felcn.gob.bo` (→ `172.16.76.23`, servidor nuevo, pendiente de aprovisionar) y `sunesis-staging.felcn.gob.bo` (→ `172.16.76.24`, servidor nuevo, pendiente de aprovisionar) | Ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1 — confirmado por el usuario 29/08/2026, DNS público todavía no repuntado |
| Nombre de contenedor vs. servicio de compose | El nombre del servicio en `docker-compose.yml` (p. ej. `base-auth`) no siempre coincide con `container_name` (p. ej. `auth-backend`) — ver tabla en §2 | Al correr `docker compose logs`/`exec`, cualquiera de los dos nombres funciona, pero para `docker ps`/`docker logs` directo hace falta el `container_name` |
