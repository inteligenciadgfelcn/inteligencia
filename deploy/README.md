# `deploy/` — todo lo ejecutable para levantar un entorno

Esta carpeta es la fuente de verdad **operativa**: compose files, scripts, configs. La narrativa (por qué se decidió así, qué se probó, qué queda pendiente) vive en [`docs/`](../docs/) — en particular [`docs/07-servidor-nuevo-desde-cero.md`](../docs/07-servidor-nuevo-desde-cero.md) y el [ADR-0001](../docs/adr/0001-postgres-nginx-registry-dockerizados.md). Este documento no repite esa narrativa, solo te dice **qué correr y en qué orden**.

## Estructura

```
deploy/
├── tools/           # Transversal a los 3 entornos: Postgres, nginx, registry, MkDocs
├── development/      # Laptop de cualquier developer, o el servidor compartido .23
├── staging/          # sunesis-staging.felcn.gob.bo (.24)
└── production/       # Futuro — servidor y dominio todavía no existen
```

`desarrollo.felcn.gob.bo` (`.20`, `servertest`) **no usa nada de esta carpeta** — sigue con Postgres/nginx nativos hasta que se dé de baja (ver `docs/05-nginx-y-tls.md` §1). Todo lo de acá es la convención para servidores **nuevos**.

## 1. Developer levantando su entorno local

**Prerequisitos**: Docker + Docker Compose, git. Nada más — no hace falta Node, Postgres ni nginx instalados en tu máquina, todo corre en contenedores.

**Tecnologías que vas a levantar**: NestJS (2 backends), Next.js (frontend), PostgreSQL 17, nginx.

```bash
git clone git@github.com:inteligenciadgfelcn/inteligencia.git
cd inteligencia

# .env de cada proyecto — copiar de .env.sample y completar (ver docs/04-variables-de-entorno.md)
cp backend/felcn-auth-backend/.env.sample backend/felcn-auth-backend/.env
cp backend/felcn-base-backend/.env.sample backend/felcn-base-backend/.env
cp frontend/felcn-base-frontend/.env.sample frontend/felcn-base-frontend/.env

# .env del compose (distinto de los de arriba — contraseñas de Postgres)
cd deploy/development
cp .env.sample .env   # completar DB_PASSWORD y DB_APP_PASSWORD

docker compose up -d --build
```

Con eso arriba: Postgres vacío + `felcn_app` creados automáticamente (ver `deploy/tools/postgres/01-crear-bases.sh`). Falta poblar el schema — elegí uno:

- **Desde cero** (sin datos, solo catálogos base): `cd backend/felcn-auth-backend && npm run migrations:run && npm run seeds:run` (usando `DB_USERNAME=postgres`, el superusuario — ver `docs/13-migracion-y-restauracion-bd.md`).
- **Con un dump real**: `bash deploy/tools/postgres/pg-restore.sh <archivo.sql.gz> felcn_auth`.

Login inicial: el admin que crean los seeds, o el que traiga el dump restaurado.

## 2. Devops/developer configurando un servidor nuevo

La guía completa, paso a paso, es [`docs/07-servidor-nuevo-desde-cero.md`](../docs/07-servidor-nuevo-desde-cero.md) — acá solo el mapa de qué carpeta corresponde a qué:

| Servidor | Carpeta de `deploy/` | Además corre |
|---|---|---|
| `sunesis-dev.felcn.gob.bo` (`.23`) | `deploy/development/` | `deploy/tools/registry/` (el registry de imágenes — único servidor que lo tiene) |
| `sunesis-staging.felcn.gob.bo` (`.24`) | `deploy/staging/` | — |
| Producción (futuro) | `deploy/production/` | — |

Todos los servidores (incluido `.23`) montan `deploy/tools/postgres/` y `deploy/tools/nginx/` dentro de su propio compose (rutas relativas `./postgres/`, `./nginx/` — por eso el compose de cada entorno vive al lado, no dentro de `tools/`).

**Build vs. pull**: `development` construye las imágenes desde el código fuente (`build:`) — es el único lugar donde se corre `docker build`. `staging` y `production` **nunca** clonan el repo ni construyen nada — solo hacen `docker compose pull` de las imágenes que `development`/`.23` subió al registry (`deploy/tools/registry/pull-and-deploy.sh`). Ver `docs/14-registro-de-imagenes.md` para el flujo completo de imágenes.

## 3. `deploy/tools/` — qué tiene cada carpeta

| Carpeta | Para qué |
|---|---|
| `postgres/` | `01-crear-bases.sh` (init automático del contenedor: crea las 9 bases + el rol `felcn_app`), `pg-backup.sh`/`pg-restore.sh` (backup/restore manual contra el contenedor) |
| `nginx/` | Config dockerizada completa (`nginx.conf`, `conf.d/*.template`, `snippets/`) + `certbot-renew.sh` (renovación de TLS, corre en el host vía systemd timer, no dentro de un contenedor) |
| `registry/` | `docker-compose.registry.yml` (el registry en sí, solo en `.23`), `build-and-push.sh` (build+push, corre desde cualquier máquina con Docker), `pull-and-deploy.sh` (pull+deploy, corre en staging/producción), `crear-htpasswd.sh` (credenciales del registry) |
| `mkdocs/` | Genera el sitio de documentación (`docs/` → `site/`) sin depender de una instalación local de mkdocs — `bash deploy/tools/mkdocs/build.sh` desde cualquier lado |

## Variables de entorno — dónde va cada una

- **`.env` de cada proyecto** (`backend/*/​.env`, `frontend/*/​.env`) — configuración de la app en sí (JWT, SMTP, OIDC, etc.). Ver `docs/04-variables-de-entorno.md` §1-3.
- **`.env` del compose** (`deploy/<entorno>/.env`, al lado de cada `docker-compose.yml`) — solo `DB_PASSWORD`, `DB_APP_PASSWORD` (y `TAG` en staging/producción). Ver `docs/04-variables-de-entorno.md` §6.
- **Nunca reutilizar contraseñas entre entornos** — cada `deploy/<entorno>/.env` lleva sus propios secretos, generados para ese entorno.
