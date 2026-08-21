# 01 — Entorno local sin Docker

Instrucciones para que un developer nuevo levante el proyecto **nativamente** (sin contenedores) en su máquina. Para el modo con Docker ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md).

> Nota: los `INSTALL.md` dentro de `felcn-auth-backend` y `felcn-base-backend-v2` referencian un clon separado desde `gitlab.felcn.gob.bo` — eso quedó desactualizado. **Hoy todo vive en un único monorepo**: `git@github.com:inteligenciadgfelcn/inteligencia.git`. Clonar una sola vez y trabajar en las subcarpetas.

## 1. Requisitos

| Herramienta | Versión recomendada | Notas |
|---|---|---|
| Node.js | ^20 (los `INSTALL.md` piden ^20; el servidor actual corre v22 — verificar compatibilidad antes de fijar versión definitiva en un `.nvmrc`) | `nvm install 20` |
| npm | ^10 | `npm install -g npm@10` |
| PostgreSQL | ^16 (servidor actual tiene cliente 17.10) | Ver [03-base-de-datos.md](./03-base-de-datos.md) |
| PM2 | ^5.3 | Solo necesario para correr en modo producción sin Docker: `npm install -g pm2@5.3` |

## 2. Clonar el repo

```bash
git clone git@github.com:inteligenciadgfelcn/inteligencia.git
cd inteligencia
git checkout develop
```

Estructura relevante:
```
inteligencia/
├── backend/
│   ├── felcn-auth-backend/       # NestJS, puerto 4000
│   ├── felcn-base-backend-v2/    # NestJS, puerto 3000
│   ├── consulta-persona-api/     # FastAPI, puerto 8000
│   └── fake-ciudadania-api/      # NestJS, puerto 3001 (OIDC simulado, solo dev)
├── frontend/
│   └── felcn-base-frontend/      # Next.js, puerto 8080 en local / 3000 en docker
└── docker-compose.yml            # orquestación de todo lo anterior
```

## 3. Levantar cada proyecto

El orden importa: `auth-backend` y `base-backend-v2` dependen de Postgres ya creado (paso 3.1); `frontend` depende de que los dos backends estén arriba; `fake-ciudadania-api` debe estar arriba **antes** de levantar `auth-backend` en modo dev (el OIDC simulado).

### 3.1. Base de datos

Crear las bases de datos y schemas antes de instalar cualquier proyecto — ver [03-base-de-datos.md](./03-base-de-datos.md) completo. Resumen rápido para desarrollo local:

```bash
cd backend/felcn-auth-backend
npm install
cp .env.sample .env        # ajustar credenciales de Postgres si no son postgres/postgres
npm run db:create          # bash database/scripts/dbcreate_docker.sh — requiere Postgres accesible
npm run setup              # migrations:clean + schema:drop + migrations:generate + migrations:run + seeds:run
```

`npm run setup` es destructivo (hace `schema:drop`) — solo correrlo en una base de datos nueva o que se pueda perder. Para el runbook de reset controlado ver [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).

### 3.2. `felcn-auth-backend` (puerto 4000)

```bash
cd backend/felcn-auth-backend
npm install               # si no se hizo en 3.1
cp .env.sample .env        # si no se hizo
npm run dev                 # start:dev con logs SQL/consola (equivalente a start:dev + LOG_SQL=true)
```

Variables clave a revisar en `.env` antes de arrancar: `DB_DATABASE=felcn_auth_v3`, `JWT_SECRET` (usar cualquier valor en dev), `SMTP_ENABLED=false` si no hay cuenta SMTP configurada (los correos se imprimen en logs), y el bloque `OIDC_*` — en dev debe apuntar a `fake-ciudadania-api` (ver 3.5). Tabla completa de variables en [04-variables-de-entorno.md](./04-variables-de-entorno.md).

### 3.3. `felcn-base-backend-v2` (puerto 3000)

```bash
cd backend/felcn-base-backend-v2
npm install
cp .env.sample .env
npm run db:create          # crea sus bases adicionales (felcn_siii, felcn_lgi, etc.)
npm run setup
npm run dev
```

Este proyecto usa **múltiples conexiones de base de datos** (`DB_AUTH_*`, `DB_SIII_*`, `DB_LGI_*`, etc. — ver [03-base-de-datos.md](./03-base-de-datos.md)), no solo una. También necesita `AUTH_BACKEND_INTERNAL_URL` apuntando al auth-backend (`http://localhost:4000` en local sin Docker).

### 3.4. `felcn-base-frontend` (puerto 8080 en local)

```bash
cd frontend/felcn-base-frontend
npm install
cp .env.sample .env         # revisar NEXT_PUBLIC_BASE_URL / NEXT_PUBLIC_AUTH_URL apuntando a localhost
npm run dev                  # next dev -p 8080
```

### 3.5. `fake-ciudadania-api` (puerto 3001) — solo desarrollo

> **Confirmado sin uso en `servertest` (21/08/2026)**: en el servidor real, dev ya corre contra Ciudadanía Digital real (AGETIC) — `fake-ciudadania-api` no está desplegado ahí, ver [00-arquitectura.md](./00-arquitectura.md) §4. Esta sección sigue siendo válida como opción para levantar el proyecto en una laptop sin credenciales de AGETIC, pero no es lo que corre hoy en `servertest`. El código de `auth-backend` que se conecta a este servicio (`FAKE_CIUDADANIA_INTERNAL_URL` en `usuario.service.ts`) sigue existiendo, pendiente de decidir si se elimina.

Simula el proveedor OIDC de Ciudadanía Digital para no depender de credenciales reales de AGETIC en local.

```bash
cd backend/fake-ciudadania-api
npm install
cp .env.example .env
npm run dev
```

Debe correr **antes** de que un usuario intente loguearse vía `auth-backend` en modo dev. Los OTP se imprimen en logs si `SMTP_ENABLED=false`.

### 3.6. `consulta-persona-api` (puerto 8000) — Python/FastAPI

Este es el único proyecto no-Node del backend. Requiere Python 3.11+, `pip install -r requirements.txt`, y conecta a una base de datos (host configurado en `.env.example`) y a Redis (usar `docker run redis:7-alpine` o instalar nativo).

```bash
cd backend/consulta-persona-api
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## 4. Verificación rápida

| Servicio | URL de salud |
|---|---|
| auth-backend | `http://localhost:4000/api/estado` |
| base-backend-v2 | `http://localhost:3000/api/estado` |
| frontend | `http://localhost:8080/login` |
| fake-ciudadania-api | `http://localhost:3001/.well-known/openid-configuration` |
| consulta-persona-api | `http://localhost:8000/docs` (Swagger de FastAPI) |

## 5. Comandos útiles (aplican a ambos backends NestJS)

```bash
npm run lint              # sintaxis
npm run test              # unitarias
npm run test:e2e          # integración
npm run seeds:create database/seeds/nombreDescriptivo   # nueva migración/seed
npm run seeds:run         # correr migraciones pendientes
npm run db:diagram        # regenera docs/ERD.png (requiere typeorm-uml)
```
