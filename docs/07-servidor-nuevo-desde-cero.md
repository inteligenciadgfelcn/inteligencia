# 07 — Servidor nuevo desde cero (staging)

Procedimiento completo, con **comandos manuales literales**, para dejar funcionando el servidor nuevo destinado a **staging** (decisión del 21/08/2026: staging se sacó de `servertest`, va en un servidor separado — ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)). Está pensado para ejecutarse a mano (o pegando cada bloque en la terminal), **sin depender de ningún agente/sesión de Claude en ese servidor** — todo lo que hace falta corriendo ahí es lo que está escrito acá.

**Decisión de arquitectura para el servidor nuevo (21/08/2026): igual que `servertest`.**

- **PostgreSQL nativo** en el host (no en contenedor) — Fase 3.
- **nginx nativo** en el host (no en contenedor) — Fase 4.
- **Las aplicaciones (auth-backend, base-backend-v2, base-frontend) se levantan normal con Docker** — Fase 5.
- El servidor **debe ser headless** (sin sesión de escritorio — ver hallazgo de la sección 7, causó una caída total en `servertest`).

Como este servidor es dedicado a staging (no corre dev en paralelo), el compose de la app corre un solo ambiente, con las credenciales reales de Ciudadanía Digital (AGETIC) directamente en su `.env`.

## 1. Fase 1 — Sistema base

- Debian 13 (trixie) — **instalación mínima/headless, sin entorno de escritorio**. `servertest` tuvo una caída total (29/07/2026) por una sesión GNOME + Firefox activa en la consola física compitiendo con el rol de servidor. **No instalar tareas de escritorio (`tasksel` "Debian desktop environment") al particionar el servidor nuevo.**

```bash
# Actualizar el sistema
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y
```

### UFW (firewall)

```bash
sudo apt install -y ufw
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw --force enable
sudo ufw status verbose   # confirmar que las 3 reglas quedaron activas
```

### Fail2ban

```bash
sudo apt install -y fail2ban
sudo tee /etc/fail2ban/jail.local > /dev/null <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend  = systemd
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 24h

[nginx-http-auth]
enabled  = true
filter   = nginx-http-auth
port     = http,https
logpath  = /var/log/nginx/error.log

[nginx-limit-req]
enabled  = true
filter   = nginx-limit-req
port     = http,https
logpath  = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
sudo fail2ban-client status   # debe listar sshd, nginx-http-auth, nginx-limit-req
```

### SSH

**Decisión ya tomada para este proyecto (no repetirla distinto): mantener `PasswordAuthentication` habilitado.** En `servertest` se probó deshabilitarlo (`PasswordAuthentication no`) y tuvo que revertirse — no volver a intentarlo acá. Sí conviene lo demás del hardening:

```bash
sudo tee /etc/ssh/sshd_config.d/99-hardening.conf > /dev/null <<'EOF'
# Hardening SSH — mantiene PasswordAuthentication habilitado a propósito
PermitRootLogin no
PubkeyAuthentication yes
MaxAuthTries 3
X11Forwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60
EOF

sudo sshd -t                    # valida sintaxis antes de recargar
sudo systemctl reload ssh
```

## 2. Fase 2 — Git y usuarios

```bash
sudo apt install -y git

# Grupo para desarrolladores
sudo groupadd developers 2>/dev/null || true
```

### Alta de un usuario desarrollador (repetir por cada persona)

```bash
USERNAME=dev-nombre   # cambiar

sudo useradd -m -s /bin/bash -G developers "$USERNAME"
sudo usermod -aG docker "$USERNAME"   # después de la Fase 5, cuando exista el grupo docker
sudo -u "$USERNAME" mkdir -p /home/$USERNAME/repos
sudo -u "$USERNAME" mkdir -p /home/$USERNAME/.ssh
sudo chmod 700 /home/$USERNAME/.ssh

# Agregar su clave pública SSH
echo '<clave-publica-del-desarrollador>' | sudo -u "$USERNAME" tee -a /home/$USERNAME/.ssh/authorized_keys
sudo chmod 600 /home/$USERNAME/.ssh/authorized_keys

# Contraseña temporal, forzar cambio en el primer login
TEMP_PASS=$(openssl rand -base64 12)
echo "$USERNAME:$TEMP_PASS" | sudo chpasswd
sudo passwd --expire "$USERNAME"
echo "Contraseña temporal de $USERNAME: $TEMP_PASS"
```

### Clave SSH dedicada para clonar el repo (no la clave personal del admin)

```bash
ssh-keygen -t ed25519 -C "<nombre-servidor>-deploy" -f ~/.ssh/<nombre-servidor>_ed25519
cat ~/.ssh/<nombre-servidor>_ed25519.pub   # registrar esta clave pública en la org de GitHub (inteligenciadgfelcn) como Deploy Key del repo
```

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

- Site en `/etc/nginx/sites-available/<el dominio o IP que se le asigne a este servidor>` con symlink en `sites-enabled` (mismo patrón que `desarrollo.felcn.gob.bo` en `servertest` — ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) para la estructura real de referencia: upstreams a los puertos de cada backend, `location`s con `limit_req`/`limit_conn`, `include /etc/nginx/snippets/security-headers.conf`).
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
- El callback OIDC (`location = /login/ciudadania` en el site, ver [05-nginx-y-tls.md](./05-nginx-y-tls.md)) apunta al frontend igual que en dev — **por ahora este servidor usa la misma configuración de AGETIC (demo) que dev, sin cambios**. Ver la nota completa sobre esto en el checklist (sección 9, ítem de AGETIC): recién va a hacer falta tocar `redirect_uri`/credenciales el día que llegue AGETIC de producción.

## 5. Fase 5 — Docker (solo para las aplicaciones)

```bash
# Instalar Docker CE + plugin Compose (repositorio oficial de Docker)
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Usuario de la app en el grupo docker (así puede correr docker compose sin sudo)
sudo usermod -aG docker "$USER"
```

Límites de logging para que los logs de contenedor no llenen el disco:

```bash
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
sudo systemctl restart docker
```

Docker acá **solo levanta las apps** (`base-auth`, `base-frontend`, `base-backend-v2` — el mismo `docker-compose.yml` de la raíz del repo, ya sin los servicios de staging que tenía antes, ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)). Postgres y nginx quedan fuera de Docker (Fases 3 y 4).

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
- [ ] **Contenedores**: todos arriba (`base-auth`, `base-frontend`, `base-backend-v2`) y sin reinicios en loop (`docker ps`, revisar `Status`/`RESTARTING`), logs de arranque sin errores (`docker compose logs --tail 50 <servicio>`), puertos expuestos solo donde corresponde (`127.0.0.1` para lo que no debe ser público — comparar contra [00-arquitectura.md](./00-arquitectura.md)).
- [ ] **nginx** (nativo): `sudo nginx -t` sin errores, `systemctl status nginx` activo con el drop-in de `Restart=on-failure` aplicado (Fase 4), rate limiting y headers de seguridad activos, sin ningún `include` colgando de `/srv/interop/...` (ese proyecto no corre acá).
- [ ] **Certificados**: Let's Encrypt emitido para el dominio de este servidor y renovando solo (`certbot renew --dry-run`, `systemctl list-timers | grep certbot`).
- [ ] **SMTP**: ver verificación explícita abajo — sin esto, todo el ciclo de altas de usuario queda roto en silencio.
- [ ] **Backup**: cron probado de verdad, dump generado y confirmado (sección 3).
- [ ] **Ciudadanía Digital (AGETIC)**: el único proveedor de login del sistema — no hay simulador (`fake-ciudadania-api` está confirmado sin uso, ver [00-arquitectura.md](./00-arquitectura.md)). **Por ahora este servidor usa exactamente la misma configuración OIDC que dev** (ambiente demo de AGETIC, `OIDC_ISSUER=https://proveedor.ciudadania.demo.agetic.gob.bo`, mismas credenciales) — no hay que registrar nada nuevo ni tocar `OIDC_REDIRECT_URI` para levantar este servidor. **Esto cambia el día que AGETIC/FELCN entregue las credenciales de producción**: ahí sí va a hacer falta una configuración distinta (`OIDC_ISSUER`, `OIDC_CLIENT_ID`/`SECRET` y `OIDC_REDIRECT_URI` propios, registrados en la plataforma [Ciudadanía Digital Developer](https://developer.ciudadaniadigital.bo/) para el dominio real de producción) — dejar esto anotado como el próximo paso pendiente, no algo a resolver ahora. Ver `INSTALL.md` de `auth-backend` para el detalle completo de las variables `OIDC_*`.

### Verificación de SMTP (hallazgo real, agosto 2026)

En `servertest` el SMTP estuvo caído (`connect EHOSTUNREACH <ip>:587`) sin que nada lo hiciera evidente hasta que se probó un envío real: la app creaba la cuenta y respondía éxito igual, pero el correo de activación nunca salía — el usuario quedaba con la cuenta creada y sin forma de entrar. Antes de dar por funcional el servidor nuevo:

1. Confirmar conectividad de red saliente al host/puerto SMTP configurado (`SMTP_HOST`/`SMTP_PORT` del `.env` de `auth-backend`) desde donde corre el contenedor — un firewall saliente bloqueando 587/465 es indistinguible de "está todo bien" hasta que se prueba.
2. Hacer una prueba real end-to-end: crear un usuario de prueba (`POST /usuarios/crear-cuenta` o desde el panel admin) y **confirmar que el correo llega**, no solo que el endpoint respondió 200/201 — revisar los logs de `auth-backend` en busca de `Falló al enviar el correo` si no llega.
3. Si falla: revisar reglas de firewall saliente, y si el proveedor SMTP bloquea la IP nueva del servidor por defecto (algunos requieren habilitar IPs explícitamente).
4. Mientras tanto (o como respaldo permanente si el SMTP no es confiable), el admin puede ver y copiar el link de activación/recuperación directamente desde el panel de usuarios sin depender del correo — ver [10-formularios-y-apis.md](./10-formularios-y-apis.md) §4.4.
