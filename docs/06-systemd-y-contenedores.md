# 06 — systemd y política de reinicio de contenedores

Quién se reinicia solo ante una falla, y quién no, en `servertest` hoy.

## 1. nginx (systemd, host)

```
systemctl show nginx -p Restart -p RestartUSec
Restart=no
RestartUSec=100ms
```

**Gap conocido**: si el proceso maestro de nginx muere por su cuenta (no por un reinicio del sistema operativo), systemd **no lo reinicia**. El sitio queda caído hasta que alguien lo note y ejecute `systemctl start nginx` manualmente. Corrección sugerida (pendiente de aplicar, requiere aprobación): agregar un drop-in

```ini
# /etc/systemd/system/nginx.service.d/override.conf
[Service]
Restart=on-failure
RestartSec=5
```

y `systemctl daemon-reload`.

## 2. Docker daemon (systemd, host)

El servicio `docker.service` de systemd sí tiene su política de reinicio estándar de Debian — no se detectó un gap aquí. Lo relevante es la política de **cada contenedor** (sección 3).

## 3. Contenedores de aplicación

Todos los definidos en `docker-compose.yml` raíz tienen `restart: unless-stopped`:

```yaml
restart: unless-stopped
```

Esto significa: si el proceso dentro del contenedor muere, Docker lo reinicia solo, **salvo que alguien lo haya detenido manualmente** (`docker stop`) — en ese caso no vuelve a levantarse solo hasta un `docker start` explícito o un reinicio del host. Confirmado en la práctica: cuando el host completo se reinició (incidente de julio 2026), los 6 contenedores principales volvieron a levantarse solos sin intervención.

## 4. Qué pasa si se cae el host completo

Orden de arranque en un boot: `docker.service` (systemd) → contenedores con `restart: unless-stopped` se levantan solos → nginx (systemd, `enabled`) se levanta solo. Ninguna app requiere intervención manual tras un reinicio limpio del SO — **el problema real no es este orden, es que nada se reinicia si el proceso individual de nginx muere sin que el SO se reinicie** (sección 1).

## 5. Recomendación para el servidor nuevo

**Revisado 29/08/2026 — este gap ya NO aplica a los servidores nuevos.** La decisión de arquitectura cambió: dev (`.23`), staging (`.24`) y producción futura corren nginx **dockerizado** (`nginx:1.26-alpine`, ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 4), no como servicio nativo de systemd — el contenedor ya tiene `restart: unless-stopped`, Docker lo reinicia solo si el proceso muere, sin necesitar ningún drop-in.

Este gap (`Restart=no`) sigue siendo real y sin corregir **solo en `servertest`** (sección 1), que mantiene nginx nativo hasta que se dé de baja. Ahí sí sigue pendiente aplicar el drop-in:

```ini
# /etc/systemd/system/nginx.service.d/override.conf
[Service]
Restart=on-failure
RestartSec=5
```

y `systemctl daemon-reload`.
