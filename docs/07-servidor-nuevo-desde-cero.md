# 07 — Servidor nuevo desde cero

Cómo se construyó `servertest` realmente (fuente: `/home/server/devops-agent/CHANGELOG.md`, el kit de administración en `/home/server/devops-agent/`), y qué cambia para el servidor nuevo: **nginx y PostgreSQL se dockerizan** (hoy corren nativos), y el servidor **debe ser headless** (sin sesión de escritorio — ver hallazgo de la sección 7).

## 0. Contexto: ya existe un toolkit de administración

`servertest` no se armó a mano — se usó un agente de Claude Code dedicado en `/home/server/devops-agent/` con comandos (`/setup-server`, `/deploy`, `/backup`, `/nginx-manage`, `/docker-manage`, `/audit`, `/user-manage`) y scripts reales en `scripts/{security,nginx,db,users,monitoring}/`. **Para el servidor nuevo, lo más eficiente es adaptar ese mismo toolkit**, no reescribir todo desde cero. Este documento describe las fases tal como están definidas en `.claude/commands/setup-server.md`, señalando qué cambia.

## 1. Fase 1 — Sistema base

- Debian 13 (trixie) — **instalación mínima/headless, sin entorno de escritorio**. El servidor actual terminó con una sesión GNOME + Firefox activa en la consola física que no está en ningún script de este toolkit — fue una caída del sistema completa el 29 de julio de 2026 rastreada hasta un cuelgue del driver gráfico (i915) de esa sesión no planeada. **No instalar tareas de escritorio (`tasksel` "Debian desktop environment") al particionar el servidor nuevo.**
- `apt update && apt upgrade`, paquetes esenciales.
- UFW: `default deny incoming`, `default allow outgoing`, permitir 22/tcp, 80/tcp, 443/tcp. Script: `scripts/security/setup-security-phase1.sh`.
  - **Verificar en el servidor nuevo, no asumir**: en `servertest` UFW está instalado (`dpkg -l | grep ufw`) pero conviene confirmar con `sudo ufw status verbose` que las reglas siguen activas — no se pudo verificar el ruleset en vivo al escribir este documento por falta de acceso `sudo` interactivo.
- Fail2ban: jail para sshd (maxretry=3, bantime=24h), nginx-http-auth, nginx-limit-req.
- SSH: el script original aplicó un hardening (`PermitRootLogin no`, `PasswordAuthentication no`) vía `/etc/ssh/sshd_config.d/99-hardening.conf`. **Ese archivo ya no existe en `servertest` hoy** — se revirtió en algún momento después de mayo 2026, y el `CLAUDE.md` del devops-agent tiene ahora una regla ABSOLUTA: *"NUNCA deshabilitar PasswordAuthentication en SSH"*. Decisión ya tomada para este proyecto: **mantener password auth habilitado**. Aplicar esa misma política en el servidor nuevo (no repetir el hardening que luego hubo que revertir).

## 2. Fase 2 — Git y usuarios

- Instalar `git`.
- Crear grupo `developers`, workspaces en `/home/dev-*/repos/`.
- Script `scripts/users/crear-dev.sh` para altas de desarrolladores.
- Clave SSH dedicada para el repo (no la clave personal del admin): en `servertest` se usó `~/.ssh/unodc_eitnermontero_ed25519` registrada contra la org `inteligenciadgfelcn` en GitHub. Repetir el patrón: clave dedicada por servidor, no reutilizar claves de laptop.

## 3. Fase 3 — Base de datos: PostgreSQL **dockerizado** (cambia respecto a hoy)

Hoy Postgres corre nativo. Para el servidor nuevo se dockeriza, con estas condiciones no negociables:

- **Volumen nombrado persistente** (`postgres_data:/var/lib/postgresql/data`), nunca anónimo — para que sobreviva a un `docker compose down` accidental.
- `scram-sha-256` como método de auth (no `trust`, no `md5`).
- Backup automatizado **desde el primer día**, apuntando fuera del volumen del contenedor (bind mount a `/opt/backups/postgres/` en el host, o un servicio sidecar de `pg_dump` programado). Este punto es crítico: en `servertest` el backup automatizado diario **lleva roto desde el 1 de mayo de 2026** por un problema de permisos en su propio archivo de log (`set -euo pipefail` corta el script en la primera línea) — ver [03-base-de-datos.md](./03-base-de-datos.md) sección 9.2. Para el servidor nuevo: correr el script de backup manualmente una vez después de instalarlo y confirmar que el archivo de dump se generó, no confiar en que el cron "corrió sin error" en el log.
- Si se dockeriza, la conexión desde los backends deja de ser `DB_HOST=localhost` — pasa a ser el nombre del servicio en la red de Docker (o `host.docker.internal` si Postgres queda fuera del compose de la app). Definir esto explícitamente en los `.env` del servidor nuevo, no copiar los `.env` de `servertest` tal cual.
- Restaurar los `.sql`/`.dump` de las bases reales (`felcn_auth_v3`, `felcn_siii`, `felcn_lgi`, etc. — ver [03-base-de-datos.md](./03-base-de-datos.md)) o partir de cero con el runbook de [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).

## 4. Fase 4 — nginx **dockerizado** (cambia respecto a hoy)

Hoy nginx corre nativo (`Restart=no` en systemd, ver [06-systemd-y-contenedores.md](./06-systemd-y-contenedores.md)). Para el servidor nuevo se dockeriza:

- `restart: unless-stopped` en el compose — elimina de raíz el gap de `Restart=no` de systemd, no hace falta el drop-in.
- **Certificados en volumen montado, no dentro de la imagen** (`./certbot/conf:/etc/letsencrypt`), para que sobrevivan a un rebuild de la imagen.
- **Certbot como contenedor sidecar** con el mismo volumen de certificados, corriendo el ciclo estándar de `certbot renew` (cron dentro del contenedor o un `docker run` periódico desde el host) — replica lo que hoy hace `certbot.timer` de systemd pero dentro de Docker.
- El archivo de sitio real de `servertest` (`/etc/nginx/sites-available/desarrollo.felcn.gob.bo`) incluye `/etc/nginx/snippets/security-headers.conf` y **un `include` a `/srv/interop/deploy/nginx/partner-locations.conf`** (mTLS y rutas de partners de un proyecto externo) — si el servidor nuevo también sirve tráfico de ese proyecto, esa dependencia de archivo debe existir en el mismo path o el `nginx -t` va a fallar. Si el servidor nuevo NO sirve ese tráfico, quitar ese `include` del site en vez de dejarlo apuntando a un archivo inexistente.
- Rate limiting (zonas `general`, `login`) y headers de seguridad se mantienen igual, solo cambia que ahora viven en la config montada al contenedor en vez de `/etc/nginx/` del host.

## 5. Fase 5 — Docker

Igual que hoy: Docker CE + plugin Compose, usuario de la app en el grupo `docker`, límites de logging (`max-size`, `max-file`) configurados en `/etc/docker/daemon.json` para que los logs de contenedor no llenen el disco (no confirmado si `servertest` tiene esto configurado — verificar y replicar si existe).

## 6. Fase 6 — Estructura de producción

- `/opt/docker-production/` (o el path que se decida) con el `docker-compose.yml` real, `logs/`, `reports/`.
- `/opt/backups/` con retención (30 días en el script actual).
- Cron de backups — **probarlo de verdad tras instalarlo** (ver advertencia de la Fase 3).
- `CHANGELOG.md` de infraestructura — replicar la práctica de `servertest`: cada cambio de infraestructura relevante queda registrado ahí, es lo que permitió reconstruir esta misma guía con datos reales en vez de genéricos.

## 7. Checklist de arranque headless (hallazgo del incidente de julio 2026)

Antes de dar por terminado el servidor nuevo, confirmar explícitamente:

```bash
systemctl get-default        # debe ser multi-user.target, NO graphical.target
loginctl list-sessions        # no debería haber sesiones de tipo "user" con GUI activa en seat0
```

Si el servidor nuevo se instaló desde una imagen/ISO con entorno de escritorio por defecto, deshabilitarlo:

```bash
sudo systemctl set-default multi-user.target
```

## 8. Clonar y desplegar la app

Una vez completadas las fases 1-6:

```bash
git clone git@github.com:inteligenciadgfelcn/inteligencia.git /srv/inteligencia
cd /srv/inteligencia
# .env por proyecto — ver 04-variables-de-entorno.md — con secretos rotados, no copiados de servertest
docker compose up -d --build
```

Y seguir el runbook de bootstrap de datos: [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).
