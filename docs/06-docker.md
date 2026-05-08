# 06 — Docker Compose
## Build, despliegue y gestión de contenedores

---

## Servicios del sistema

| Contenedor | Imagen | Puerto interno | Puerto externo | Descripción |
|-----------|--------|---------------|----------------|-------------|
| `base-backend-v2` | `./backend/felcn-base-backend-v2` | 3000 | 3015 | API principal |
| `auth-backend` | `./backend/felcn-auth-backend` | 3000 | 3016 | Autenticación |
| `base-frontend` | `./frontend/felcn-base-frontend` | 3000 | 3017 | Next.js frontend |

> Los puertos externos (3015, 3016, 3017) son accesibles solo desde localhost. Nginx los expone públicamente. Ver [07-nginx-ssl.md](07-nginx-ssl.md).

---

## 1. Primer despliegue (build completo)

```bash
cd /srv/inteligencia

# Build y levantamiento de todos los servicios
docker compose up -d --build

# Seguir los logs durante el arranque
docker compose logs -f
```

El primer build puede tardar **10-20 minutos** descargando dependencias de Node.js.

---

## 2. Verificar que los servicios están corriendo

```bash
docker compose ps
```

Resultado esperado:
```
NAME              IMAGE                   STATUS    PORTS
base-backend-v2   inteligencia-base-...   Up        0.0.0.0:3015->3000/tcp
auth-backend      inteligencia-base-...   Up        0.0.0.0:3016->3000/tcp
base-frontend     inteligencia-base-...   Up        0.0.0.0:3017->3000/tcp
```

### Health checks manuales

```bash
# Backend v2
curl -sf http://localhost:3015/api/health && echo "OK backend-v2"

# Auth backend
curl -sf http://localhost:3016/api/health && echo "OK auth"

# Frontend (Next.js puede tardar más en arrancar)
curl -sf http://localhost:3017 | head -5
```

---

## 3. Comandos de operación cotidiana

```bash
# Ver estado
docker compose ps

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f base-backend-v2
docker compose logs -f auth-backend
docker compose logs -f base-frontend

# Reiniciar un servicio sin rebuild
docker compose restart base-backend-v2

# Detener todo (sin eliminar datos)
docker compose stop

# Detener y eliminar contenedores (los volúmenes persisten)
docker compose down
```

---

## 4. Actualizar código (nuevo deploy)

```bash
cd /srv/inteligencia

# Obtener últimos cambios
git pull origin develop    # o 'main' en producción

# Rebuild solo los servicios con cambios
docker compose up -d --build

# Si un servicio no actualizó, forzar rebuild
docker compose up -d --build --force-recreate base-backend-v2
```

---

## 5. Persistencia de datos

El volumen `logs_data` persiste los logs de la aplicación:

```bash
# Ver volúmenes creados
docker volume ls | grep inteligencia

# Inspeccionar el volumen de logs
docker volume inspect inteligencia_logs_data
```

Los logs de aplicación están en `/tmp/logs/` dentro de los contenedores,
montados en el volumen `logs_data`. Se pueden consultar directamente:

```bash
docker compose exec base-backend-v2 ls /tmp/logs/
```

---

## 6. Resolución de problemas comunes

### Contenedor no arranca — error de .env

```bash
# Ver el error específico
docker compose logs base-backend-v2 | tail -30

# Verificar que el .env existe y tiene las variables requeridas
cat backend/felcn-base-backend-v2/.env | grep DB_HOST
```

### Puerto ya en uso

```bash
# Ver qué ocupa el puerto
ss -tlnp | grep 3015

# Si hay un contenedor anterior huérfano
docker ps -a | grep 3015
docker rm -f [CONTAINER_ID]
```

### Rebuild limpio desde cero

```bash
# Bajar todo, eliminar imágenes y volver a construir
docker compose down
docker image rm $(docker images | grep inteligencia | awk '{print $3}') 2>/dev/null || true
docker compose up -d --build
```

### Contenedor se reinicia en loop (CrashLoopBackOff)

```bash
docker compose logs --tail 50 [servicio]
# Buscar el error en las últimas líneas antes del reinicio
```

---

## 7. Auto-arranque en reinicio del servidor

El campo `restart: unless-stopped` en el docker-compose.yml asegura que los contenedores arranquen automáticamente con el sistema, a menos que se hayan detenido manualmente.

Verificar que Docker inicia con el sistema:

```bash
systemctl is-enabled docker
# Resultado esperado: enabled
```

---

## 8. Verificación final del paso 6

```bash
# Los 3 contenedores deben estar "Up"
docker compose -f /srv/inteligencia/docker-compose.yml ps

# Los 3 puertos deben responder
curl -sf http://localhost:3015/api/health && echo "OK: backend-v2"
curl -sf http://localhost:3016/api/health && echo "OK: auth-backend"
curl -sf http://localhost:3017 > /dev/null && echo "OK: frontend"
```

**Siguiente paso:** [07-nginx-ssl.md](07-nginx-ssl.md)
