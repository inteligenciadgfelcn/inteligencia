# 07 — Servidor nuevo desde cero (staging)

Cómo se construyó `servertest` realmente (fuente: `/home/server/devops-agent/CHANGELOG.md`, el kit de administración en `/home/server/devops-agent/`), y cómo replicar el mismo patrón en el servidor nuevo destinado a **staging** (decisión del 21/08/2026: staging se sacó de `servertest`, va en un servidor separado — ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)).

**Decisión de arquitectura para el servidor nuevo (21/08/2026): igual que `servertest`, no la versión dockerizada que planteaba una revisión anterior de este documento.**

- **PostgreSQL nativo** en el host (no en contenedor) — Fase 3.
- **nginx nativo** en el host (no en contenedor) — Fase 4.
- **Las aplicaciones (auth-backend, base-backend-v2, base-frontend, consulta-persona-api) se levantan normal con Docker**, igual que hoy en `servertest` — Fase 5.
- El servidor **debe ser headless** (sin sesión de escritorio — ver hallazgo de la sección 7, causó una caída total en `servertest`).

Como este servidor es dedicado a staging (no corre dev en paralelo), **no hace falta el patrón de un solo `docker-compose.yml` con dos ambientes** que tiene `servertest` hoy — acá el compose de la app corre un solo ambiente, con las credenciales reales de Ciudadanía Digital (AGETIC) directamente en su `.env` (lo que en `servertest` es `.env.staging`).

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

## 3. Fase 3 — Base de datos: PostgreSQL **nativo** (mismo patrón que `servertest`)

Igual que hoy: Postgres se instala en el host, no en contenedor.

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '<password fuerte>';"
```

- `scram-sha-256` como método de auth (no `trust`, no `md5`) — editar `password_encryption = scram-sha-256` en `postgresql.conf` y `local all postgres scram-sha-256` (o `md5` como mínimo aceptable) en `pg_hba.conf`, antes de crear usuarios/bases.
- Crear las bases reales con los scripts de cada backend — ver [03-base-de-datos.md](./03-base-de-datos.md) sección 6 ("Creación desde cero, Postgres nativo") y su advertencia sobre nombres desactualizados en `dbcreate.sql`. Restaurar los `.sql`/`.dump` de las bases reales (`felcn_auth_v3`, `felcn_siii`, `felcn_lgi`, etc.) o partir de cero con el runbook de [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).
  - **Dump ya generado (21/08/2026)** de las 8 bases reales, listo para restaurar: `backups/20260821-staging-migracion/` (fuera de git — `/backups/` está en `.gitignore`, contiene datos reales; copiar al servidor nuevo por un canal seguro). Trae su propio `README.md` con los comandos de restauración exactos.
- Las aplicaciones corren en Docker (Fase 5) y necesitan llegar a este Postgres nativo del host: usar `DB_HOST=host.docker.internal` en los `.env` (no `localhost`, que dentro de un contenedor no resuelve al host) — cada servicio del compose ya trae `extra_hosts: host.docker.internal:host-gateway` para esto, igual que en `servertest`.
- Backup automatizado **desde el primer día**, con `pg_dump` nativo por cron apuntando a un directorio fuera de cualquier volumen Docker (p. ej. `/opt/backups/postgres/`). Este punto es crítico: en `servertest` el backup automatizado diario **lleva roto desde el 1 de mayo de 2026** por un problema de permisos en su propio archivo de log (`set -euo pipefail` corta el script en la primera línea) — ver [03-base-de-datos.md](./03-base-de-datos.md) sección 9.2. Para el servidor nuevo: correr el script de backup manualmente una vez después de instalarlo y **confirmar que el archivo de dump se generó**, no confiar en que el cron "corrió sin error" en el log — el mismo tipo de fallo silencioso que rompió el de `servertest`.

## 4. Fase 4 — nginx **nativo** (mismo patrón que `servertest`)

Igual que hoy: nginx se instala en el host, no en contenedor.

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

- Site en `/etc/nginx/sites-available/<dominio-staging>` con symlink en `sites-enabled` (mismo patrón que `desarrollo.felcn.gob.bo` en `servertest` — ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) para la estructura real de referencia: upstreams a los puertos de cada backend, `location`s con `limit_req`/`limit_conn`, `include /etc/nginx/snippets/security-headers.conf`).
- Certificado Let's Encrypt con `certbot --nginx` — queda con su propio timer de systemd (`certbot.timer`), no un cron manual. Confirmar con `systemctl list-timers | grep certbot`.
- **Este servidor no sirve tráfico del proyecto `/srv/interop`** (eso es específico de `servertest`) — no copiar el `include` a `partner-locations.conf` ni el bloque de mTLS (`ssl_client_certificate`) salvo que se decida explícitamente correr ese proyecto acá también.
- **Gap conocido a replicar con cuidado, no a repetir sin más**: en `servertest`, `nginx.service` tiene `Restart=no` — si el proceso maestro muere solo, systemd no lo reinicia (ver [06-systemd-y-contenedores.md](./06-systemd-y-contenedores.md)). Para el servidor nuevo, agregar el drop-in que en `servertest` sigue pendiente:
  ```ini
  # /etc/systemd/system/nginx.service.d/override.conf
  [Service]
  Restart=on-failure
  RestartSec=5
  ```
  y `systemctl daemon-reload`.
- Como este servidor es de staging con AGETIC real (no un simulador — ver [00-arquitectura.md](./00-arquitectura.md) §4), el `redirect_uri` del callback OIDC (`location = /login/ciudadania` en el site, ver [05-nginx-y-tls.md](./05-nginx-y-tls.md)) tiene que coincidir exactamente con el que se registre en AGETIC para el dominio de este servidor — ver el ítem de AGETIC en el checklist (sección 9).

## 5. Fase 5 — Docker (solo para las aplicaciones)

Igual que hoy: Docker CE + plugin Compose, usuario de la app en el grupo `docker`, límites de logging (`max-size`, `max-file`) configurados en `/etc/docker/daemon.json` para que los logs de contenedor no llenen el disco (no confirmado si `servertest` tiene esto configurado — verificar y replicar si existe).

Docker acá **solo levanta las apps** (`base-auth`, `base-frontend`, `base-backend-v2`, `consulta-persona-api`, `consulta-persona-redis` — el mismo `docker-compose.yml` de la raíz del repo, ya sin los servicios de staging que tenía antes, ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)). Postgres y nginx quedan fuera de Docker (Fases 3 y 4).

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

Una vez completadas las fases 1-6 (Postgres y nginx nativos ya arriba y configurados):

```bash
git clone git@github.com:inteligenciadgfelcn/inteligencia.git /srv/inteligencia
cd /srv/inteligencia
# .env por proyecto — ver 04-variables-de-entorno.md — con secretos rotados, no copiados de servertest.
# Como este servidor ES el ambiente de staging (no corre dev en paralelo), las credenciales reales
# de AGETIC van directo en backend/felcn-auth-backend/.env — no hace falta un .env.staging aparte
# acá. DB_HOST=host.docker.internal (Postgres nativo del host, ver Fase 3).
docker compose up -d --build
```

`fake-ciudadania-api` no está en este compose — confirmado sin uso, este servidor usa AGETIC real (ver [00-arquitectura.md](./00-arquitectura.md) §4).

Y seguir el runbook de bootstrap de datos: [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).

## 9. Checklist obligatorio antes de dar el servidor por terminado

No dar el servidor nuevo por completo solo porque `docker compose up -d --build` no tiró error — varios de estos puntos fallan en silencio (la app responde 200 igual). Verificar explícitamente cada uno:

- [ ] **Base de datos** (Postgres nativo): `systemctl status postgresql` activo, `scram-sha-256` confirmado en `pg_hba.conf` (no `trust`/`md5`), conexión real confirmada desde cada backend en Docker vía `host.docker.internal` (no solo que `psql` local funcione), bases reales restauradas o runbook de bootstrap corrido (sección 3, [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md)).
- [ ] **Seguridad**: `sudo ufw status verbose` con las reglas esperadas activas, fail2ban con los jails de sshd/nginx corriendo (`fail2ban-client status`), SSH con `PasswordAuthentication` habilitado a propósito — no repetir el hardening que hubo que revertir en `servertest` (sección 1).
- [ ] **Docker**: `docker.service` habilitado en systemd (`systemctl is-enabled docker`), límites de logging configurados en `/etc/docker/daemon.json`, todos los servicios del compose con `restart: unless-stopped` (solo las apps — Postgres y nginx quedan fuera de Docker, Fases 3 y 4).
- [ ] **Imágenes**: build hecho con el código que realmente se quiere desplegar — el build context toma el disco tal cual está (incluye cambios sin commitear), no `git HEAD`; confirmar `git status` limpio antes de un build de producción.
- [ ] **Contenedores**: todos arriba (`base-auth`, `base-frontend`, `base-backend-v2`, `consulta-persona-api`, `consulta-persona-redis`) y sin reinicios en loop (`docker ps`, revisar `Status`/`RESTARTING`), logs de arranque sin errores (`docker compose logs --tail 50 <servicio>`), puertos expuestos solo donde corresponde (`127.0.0.1` para lo que no debe ser público — comparar contra [00-arquitectura.md](./00-arquitectura.md)).
- [ ] **nginx** (nativo): `sudo nginx -t` sin errores, `systemctl status nginx` activo con el drop-in de `Restart=on-failure` aplicado (Fase 4), rate limiting y headers de seguridad activos, sin ningún `include` colgando de `/srv/interop/...` (ese proyecto no corre acá).
- [ ] **Certificados**: Let's Encrypt emitido para el dominio de este servidor y renovando solo (`certbot renew --dry-run`, `systemctl list-timers | grep certbot`).
- [ ] **SMTP**: ver verificación explícita abajo — sin esto, todo el ciclo de altas de usuario queda roto en silencio.
- [ ] **Backup**: cron probado de verdad, dump generado y confirmado (sección 3).
- [ ] **Ciudadanía Digital (AGETIC)**: el único proveedor de login del sistema — no hay simulador (`fake-ciudadania-api` está confirmado sin uso, ver [00-arquitectura.md](./00-arquitectura.md)). El `redirect_uri` (`OIDC_REDIRECT_URI`) es específico de dominio: **hay que registrarlo de nuevo ante AGETIC en la plataforma [Ciudadanía Digital Developer](https://developer.ciudadaniadigital.bo/)** para el dominio del servidor nuevo — el que ya está registrado para `desarrollo.felcn.gob.bo` no sirve acá. Sin este paso, el login falla en el primer intento con un error del lado de AGETIC, no del lado de la app. Ver `INSTALL.md` de `auth-backend` para el detalle completo de las variables `OIDC_*`.

### Verificación de SMTP (hallazgo real, agosto 2026)

En `servertest` el SMTP estuvo caído (`connect EHOSTUNREACH <ip>:587`) sin que nada lo hiciera evidente hasta que se probó un envío real: la app creaba la cuenta y respondía éxito igual, pero el correo de activación nunca salía — el usuario quedaba con la cuenta creada y sin forma de entrar. Antes de dar por funcional el servidor nuevo:

1. Confirmar conectividad de red saliente al host/puerto SMTP configurado (`SMTP_HOST`/`SMTP_PORT` del `.env` de `auth-backend`) desde donde corre el contenedor — un firewall saliente bloqueando 587/465 es indistinguible de "está todo bien" hasta que se prueba.
2. Hacer una prueba real end-to-end: crear un usuario de prueba (`POST /usuarios/crear-cuenta` o desde el panel admin) y **confirmar que el correo llega**, no solo que el endpoint respondió 200/201 — revisar los logs de `auth-backend` en busca de `Falló al enviar el correo` si no llega.
3. Si falla: revisar reglas de firewall saliente, y si el proveedor SMTP bloquea la IP nueva del servidor por defecto (algunos requieren habilitar IPs explícitamente).
4. Mientras tanto (o como respaldo permanente si el SMTP no es confiable), el admin puede ver y copiar el link de activación/recuperación directamente desde el panel de usuarios sin depender del correo — ver [10-formularios-y-apis.md](./10-formularios-y-apis.md) §4.4.
