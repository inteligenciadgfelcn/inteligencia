# 05 — Proyecto
## Clonar repositorio y configurar archivos de entorno

---

## 1. Clonar el repositorio

```bash
# Como usuario server
cd /srv

git clone git@github.com:inteligenciadgfelcn/inteligencia.git
cd inteligencia

# Verificar el clone
ls
# Esperado: backend/  frontend/  README.md  docs/  ...
```

### Seleccionar rama según entorno

```bash
# Desarrollo
git checkout develop

# Producción
git checkout main
```

### Verificar estructura de directorios esperada

```
/srv/inteligencia/
├── backend/
│   ├── felcn-auth-backend/
│   ├── felcn-base-backend-v2/
│   └── felcn-base-backend/        (legacy)
├── frontend/
│   └── felcn-base-frontend/
└── docs/
    ├── templates/
    └── scripts/db/
```

---

## 2. Configurar archivos de entorno (.env)

Los `.env` están en `.gitignore` — **nunca se versionan**. Cada servidor los crea localmente desde los templates.

Los archivos reales con credenciales están en `/opt/felcn/secrets/` (ver [08-secretos.md](08-secretos.md)).

### Copiar desde almacenamiento seguro

```bash
# Opción A: copiar desde /opt/felcn/secrets/
cp /opt/felcn/secrets/env-backend-v2     /srv/inteligencia/backend/felcn-base-backend-v2/.env
cp /opt/felcn/secrets/env-auth-backend   /srv/inteligencia/backend/felcn-auth-backend/.env
cp /opt/felcn/secrets/env-frontend       /srv/inteligencia/frontend/felcn-base-frontend/.env
```

### Crear manualmente desde los templates

Si es un entorno nuevo, partir de los templates en `docs/templates/` y completar los valores:

```bash
cp docs/templates/env-backend-v2.template  backend/felcn-base-backend-v2/.env
cp docs/templates/env-auth-backend.template backend/felcn-auth-backend/.env
cp docs/templates/env-frontend.template    frontend/felcn-base-frontend/.env

# Editar cada archivo y reemplazar los <PLACEHOLDERS>
vim backend/felcn-base-backend-v2/.env
vim backend/felcn-auth-backend/.env
vim frontend/felcn-base-frontend/.env
```

### Ajustes por entorno en los .env

| Variable | Desarrollo | Producción |
|----------|-----------|------------|
| `NODE_ENV` | `development` | `production` |
| `DB_HOST` | IP servidor externo o `localhost` | `localhost` o IP red privada |
| `REFRESH_TOKEN_SECURE` | `false` | `true` |
| `REFRESH_TOKEN_DOMAIN` | dominio de desarrollo | dominio de producción |
| `LOG_CONSOLE` | `true` | `false` |
| `LOG_SQL` | `true` | `false` |

### Variables del frontend por entorno

```bash
# Desarrollo — en frontend/.env
NEXT_PUBLIC_BASE_URL="https://desarrollo.felcn.gob.bo/felcn/api"
NEXT_PUBLIC_AUTH_URL="https://desarrollo.felcn.gob.bo/felcn/auth/api"
NEXT_PUBLIC_IMAGES_DOMAIN="desarrollo.felcn.gob.bo"
NEXT_PUBLIC_COOKIE_SECURE=false

# Producción — en frontend/.env
NEXT_PUBLIC_BASE_URL="https://[DOMINIO-PRODUCCION]/felcn/api"
NEXT_PUBLIC_AUTH_URL="https://[DOMINIO-PRODUCCION]/felcn/auth/api"
NEXT_PUBLIC_IMAGES_DOMAIN="[DOMINIO-PRODUCCION]"
NEXT_PUBLIC_COOKIE_SECURE=true
```

---

## 3. Crear docker-compose.yml

El `docker-compose.yml` también está en `.gitignore`. Copiarlo desde el template:

```bash
cp /srv/inteligencia/docs/templates/docker-compose.yml /srv/inteligencia/docker-compose.yml
```

> El template en `docs/templates/docker-compose.yml` está documentado y listo para usar sin modificaciones para este entorno. Para producción, revisar los puertos y el dominio.

---

## 4. Verificar permisos de los archivos sensibles

```bash
# Solo el usuario server debe poder leer los .env
chmod 600 /srv/inteligencia/backend/felcn-base-backend-v2/.env
chmod 600 /srv/inteligencia/backend/felcn-auth-backend/.env
chmod 600 /srv/inteligencia/frontend/felcn-base-frontend/.env
chmod 600 /srv/inteligencia/docker-compose.yml
```

---

## 5. Verificación final del paso 5

```bash
# Verificar que los 3 .env existen y no están vacíos
for f in \
  backend/felcn-base-backend-v2/.env \
  backend/felcn-auth-backend/.env \
  frontend/felcn-base-frontend/.env; do
  [ -s "/srv/inteligencia/$f" ] && echo "OK: $f" || echo "FALTA: $f"
done

# Verificar que docker-compose.yml existe
[ -f /srv/inteligencia/docker-compose.yml ] && echo "OK: docker-compose.yml" || echo "FALTA"

# Verificar que los dockerfiles existen en cada servicio
ls /srv/inteligencia/backend/felcn-base-backend-v2/dockerfile
ls /srv/inteligencia/backend/felcn-auth-backend/dockerfile
ls /srv/inteligencia/frontend/felcn-base-frontend/dockerfile
```

**Siguiente paso:** [06-docker.md](06-docker.md)
