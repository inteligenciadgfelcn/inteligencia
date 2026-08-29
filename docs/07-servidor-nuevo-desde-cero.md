# 07 — Servidor nuevo desde cero (staging)

Procedimiento completo, con **comandos manuales literales**, para dejar funcionando el servidor nuevo destinado a **staging** (decisión del 21/08/2026: staging se sacó de `servertest`, va en un servidor separado — ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)). Está pensado para ejecutarse a mano (o pegando cada bloque en la terminal), **sin depender de ningún agente/sesión de Claude en ese servidor** — todo lo que hace falta corriendo ahí es lo que está escrito acá.

**Decisión de arquitectura para el servidor nuevo (21/08/2026): igual que `servertest`.**

- **PostgreSQL nativo** en el host (no en contenedor) — Fase 3.
- **nginx nativo** en el host (no en contenedor) — Fase 4.
- **Las aplicaciones (auth-backend, base-backend-v2, base-frontend) se levantan normal con Docker** — Fase 5.
- El servidor **debe ser headless** (sin sesión de escritorio — ver hallazgo de la sección 7, causó una caída total en `servertest`).

Como este servidor es dedicado a staging (no corre dev en paralelo), el compose de la app corre un solo ambiente, con las credenciales reales de Ciudadanía Digital (AGETIC) directamente en su `.env`.

## 0. Fase 0 — Instalación de Debian 13 (VM en Proxmox, sin entorno gráfico, particionado correcto)

Este servidor es una **VM en un Proxmox** (no bare metal) — la Fase 0 completa se hace desde la interfaz web de Proxmox (`https://<host-proxmox>:8006`), sin necesitar USB físico. Esto se hace **una sola vez**. Todo lo de acá abajo (Fase 1 en adelante) asume que ya existe un Debian 13 arrancado y accesible por SSH.

### Subir el ISO a Proxmox

1. Descargar el netinst de Debian 13 (trixie) — arquitectura `amd64` — desde `https://www.debian.org/distrib/`. Verificar el checksum (`SHA256SUMS`) antes de usarlo.
2. En Proxmox: **Datacenter → `<nodo>` → `<storage con contenido "ISO Image" habilitado, típicamente `local`>` → ISO Images → Upload**, y subir el archivo descargado. (Si nadie tiene acceso web a Proxmox desde donde está el ISO, también se puede subir por SFTP/`scp` directo a `/var/lib/vz/template/iso/` del nodo.)

### Crear la VM

**Datacenter → `<nodo>` → Create VM**, con estos valores (ajustar nombre/recursos/storage al caso real, el resto no cambiarlo sin una razón concreta):

| Sección | Valor | Motivo |
|---|---|---|
| General | Name: `staging-felcn` (o el nombre que corresponda) | Va a ser también el hostname |
| OS | ISO image: el netinst subido arriba. Type: `Linux`, Version: `6.x - 2.6 Kernel` (o `Debian` si el wizard de esa versión de Proxmox ya lo ofrece como opción directa) | |
| System | BIOS: `Default (SeaBIOS)` — no hace falta UEFI para este caso, simplifica el particionado (sin `/boot/efi`). **Qemu Agent: tildado** | El guest agent permite que Proxmox apague la VM de forma prolija y le reporte la IP — hay que instalarlo también adentro de la VM en la Fase 1 |
| Disks | Bus/Device: `VirtIO SCSI` (con SCSI Controller = `VirtIO SCSI single`), tamaño generoso (ver tabla de particiones abajo — sumar todo + margen, p. ej. 200 GB), Storage: el pool real, **Discard: tildado** si el storage soporta thin-provisioning (ZFS, LVM-thin) | VirtIO es el driver paravirtualizado, mucho más rápido que IDE/SATA emulado. `Discard` permite recuperar espacio del storage cuando se borran datos adentro de la VM |
| CPU | Type: `host` (a menos que la VM necesite migrar en vivo entre nodos con CPUs distintas — en ese caso usar un tipo genérico tipo `x86-64-v2-AES`) | Mejor performance, expone las features reales del CPU físico |
| Memory | Según los requisitos reales de la app (mínimo razonable: 4 GB, más si hay margen) | |
| Network | Model: `VirtIO (paravirtualized)`, Bridge: el `vmbrX` que corresponda a la red donde va a vivir este servidor | Igual que el disco, VirtIO es el driver rápido |

Confirmar y crear. **No arrancar todavía** si hace falta revisar algo del hardware asignado — se puede editar antes del primer boot.

### Arranque del instalador

Iniciar la VM (**Start**) y abrir la **Console** (noVNC, botón en la barra superior de la VM) — es la única forma de interactuar con el instalador, no hay puerto serie/USB físico en este caso. Elegir **"Install"** (la opción de texto, no "Graphical install") — coherente con que este servidor va a ser headless de punta a punta, no solo después de instalado.

### Pasos del instalador (en orden)

1. **Idioma**: English (o español, no afecta nada funcional — mantener consistencia con el resto del equipo).
2. **Ubicación**: Bolivia (u otra según corresponda) — define la zona horaria por defecto, se puede ajustar después con `timedatectl set-timezone America/La_Paz`.
3. **Teclado**: el layout físico real del teclado que se use para administrar (si es acceso solo por consola remota/SSH después, no importa mucho — poner `American English` es seguro).
4. **Hostname**: nombre corto y descriptivo del servidor (p. ej. `staging-felcn`). Evitar `localhost` o nombres genéricos.
5. **Dominio**: dejar vacío si no hay uno interno definido — el dominio público (`nginx`, certificados) se configura después en la Fase 4, no acá.
6. **Contraseña de root**: **dejar en blanco** — esto hace que el instalador cree automáticamente el primer usuario con permisos `sudo` en vez de una cuenta `root` separada con login directo (reduce superficie de ataque: nadie loguea como `root` por SSH). Alternativa aceptada: sí ponerle contraseña a `root` si la política del equipo lo requiere, pero **nunca reutilizar** esa contraseña en ningún otro lado.
7. **Usuario y contraseña**: crear el primer usuario administrador (nombre real de la persona, no un genérico tipo `admin`) con una contraseña fuerte real — este es el usuario que después se usa para todo el resto de esta guía vía `sudo`.
8. **Particionado — manual, no "guiado" (importante, ver detalle abajo)**.
9. **Selección de software (`tasksel`)**: desmarcar **todo** lo que sea entorno de escritorio. Dejar marcado únicamente:
   - `SSH server`
   - `standard system utilities`

   **No marcar** `Debian desktop environment`, `GNOME`, `print server`, ni ningún otro entorno gráfico — este es el paso exacto que causó la caída total de `servertest` el 29/07/2026 cuando se instaló con un entorno gráfico que después quedó con una sesión activa compitiendo con el rol de servidor.
10. **GRUB**: instalar en el disco principal (el instalador lo sugiere solo si detecta un único disco — confirmar que apunta al disco correcto si hay más de uno).
11. Reiniciar, sacar el medio de instalación, arrancar el sistema instalado.

### Particionado — esquema recomendado (manual, con LVM)

**No usar el particionado guiado "todo en una partición"** — en un servidor que corre Docker (imágenes/logs de contenedores crecen en `/var`) y Postgres nativo (datos de BD en `/var/lib/postgresql`), un log o una base de datos que crece sin control puede llenar `/` y tirar abajo todo el sistema, no solo el servicio responsable. Separar en particiones/volúmenes lógicos con LVM (permite agrandar después sin reinstalar):

| Punto de montaje | Tamaño sugerido | Motivo |
|---|---|---|
| `/boot` | 1 GB, ext4, **fuera de LVM** | GRUB necesita una partición simple, no LVM |
| `/boot/efi` | 512 MB, FAT32 (solo si el servidor bootea en modo UEFI) | Partición EFI estándar |
| `swap` | Igual a la RAM hasta 8 GB, o un tamaño fijo razonable (p. ej. 4 GB) si la RAM es mucha | Evitar que el sistema OOM-kill procesos ante picos de memoria |
| `/` (raíz) | 20–30 GB, ext4, dentro de LVM | Sistema base, paquetes — separado de los datos que realmente crecen |
| `/var` | 40–60 GB, ext4, dentro de LVM | Imágenes/logs de Docker (`/var/lib/docker`), logs del sistema |
| `/var/lib/postgresql` | 40–100 GB según el volumen de datos esperado, ext4, dentro de LVM | Datos de Postgres — aislado para que su crecimiento no afecte al resto, y para poder monitorear/alertar su uso de disco por separado |
| `/home` | 10–20 GB, ext4, dentro de LVM | Home de los usuarios desarrolladores (Fase 2) |

Dejar **espacio libre sin asignar dentro del volume group** (no ocupar el 100% del disco en la instalación) — permite extender cualquiera de estas particiones más adelante (`lvextend` + `resize2fs`) sin necesitar espacio nuevo de otro lado.

En el instalador: elegir **"Manual"** en el paso de particionado, crear la partición `/boot` (y `/boot/efi` si aplica) primero como partición primaria normal, después crear una partición grande para LVM ("physical volume for LVM") con el resto del disco, configurar el volume group, y dentro de él crear los volúmenes lógicos de la tabla de arriba.

### Verificación post-instalación

```bash
# Confirmar que arrancó en modo texto, sin entorno gráfico
systemctl get-default        # debe ser multi-user.target

# Confirmar el esquema de particiones
lsblk
df -h

# Confirmar acceso SSH desde otra máquina antes de dar por terminado este paso
ssh <usuario>@<ip-del-servidor>
```

### Guest Agent (obligatorio, específico de Proxmox)

Sin esto, Proxmox no puede apagar la VM de forma prolija (hace un hard-stop) ni mostrar su IP real en la interfaz:

```bash
sudo apt install -y qemu-guest-agent
sudo systemctl enable --now qemu-guest-agent
```

Confirmar desde Proxmox: la VM debería mostrar su IP en la pestaña **Summary** poco después de instalar el agente (puede requerir reiniciar la VM una vez si no aparece enseguida).

### Backups a nivel de VM (complementan, no reemplazan, el backup de Postgres)

Proxmox puede programar snapshots/backups de la VM completa (**Datacenter → Backup**, o `vzdump` manual) — es una capa adicional de seguridad (recupera la VM entera ante un desastre del hipervisor), pero **no reemplaza** el backup lógico de PostgreSQL de la Fase 3: un `vzdump` no permite restaurar una sola base de datos ni es tan liviano/frecuente como un `pg_dump`. Configurar ambos, no solo uno.

### Si más adelante hay que agrandar el disco

Crecer el disco es un paso en dos partes — agrandar el disco virtual en Proxmox **no** agranda solo la partición de adentro:

1. En Proxmox: VM → Hardware → seleccionar el disco → **Resize** (solo agranda, nunca achica).
2. Dentro de la VM: extender la partición LVM y el filesystem correspondiente (`growpart`, `pvresize`, `lvextend -r`, o el equivalente según cuál punto de montaje se esté agrandando).

Con esto completado, seguir con la Fase 1.

## 1. Fase 1 — Sistema base

> El checklist de mantenimiento continuo de todo lo que se configura en esta fase (firewall, SSH, headless, actualizaciones) vive en [12-requisitos-seguridad-infraestructura.md](./12-requisitos-seguridad-infraestructura.md) — no se duplica acá, revisarlo periódicamente después de la instalación, no solo el día de hoy.

Con Debian 13 ya instalado (Fase 0), sin entorno gráfico y con acceso SSH funcionando:

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
- Crear las bases reales con los scripts de cada backend — ver [03-base-de-datos.md](./03-base-de-datos.md) sección 6 ("Creación desde cero, Postgres nativo") y su advertencia sobre nombres desactualizados en `dbcreate.sql`. **Este servidor es staging: se restaura el dump con datos** (ver punto siguiente). Para producción el mecanismo es distinto (schema vacío + migraciones, sin restaurar datos de dev/staging) — ver [13-migración-y-restauración-bd.md](./13-migracion-y-restauracion-bd.md).
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
2. Hacer una prueba real end-to-end: solicitar un preregistro (`POST /usuarios/solicitudes-registro/acceso` — ver [10-formularios-y-apis.md](./10-formularios-y-apis.md) §4.3, reemplaza al viejo `POST /usuarios/crear-cuenta`) o crear un usuario desde el panel admin, y **confirmar que el correo llega**, no solo que el endpoint respondió 200/201 — revisar los logs de `auth-backend` en busca de `Falló al enviar el correo` si no llega.
3. Si falla: revisar reglas de firewall saliente, y si el proveedor SMTP bloquea la IP nueva del servidor por defecto (algunos requieren habilitar IPs explícitamente).
4. Mientras tanto (o como respaldo permanente si el SMTP no es confiable), el admin puede ver y copiar el link de activación/recuperación directamente desde el panel de usuarios sin depender del correo — ver [10-formularios-y-apis.md](./10-formularios-y-apis.md) §4.4.

## 10. Producción — ⚠️ PENDIENTE, servidor aún no aprovisionado (29/08/2026)

Todavía no existe servidor, IP ni dominio de producción — esta sección documenta **qué va a ser distinto de las Fases 0-9 de arriba** (pensadas para staging) el día que exista, no un procedimiento ya ejecutado.

Las Fases 0 (VM/SO), 1 (sistema base/firewall), 2 (git y usuarios — con la salvedad de abajo), 3 (Postgres) y 4 (nginx) se replican igual que en staging. Las diferencias son:

- **Fase 5/8 — código: NO se clona el repo con git.** Producción es el único ambiente donde no debe haber código fuente en el servidor (a diferencia de dev y staging, que sí lo tienen — ver convención en [02-entorno-docker-dev.md](./02-entorno-docker-dev.md) §7). En vez de `git clone` + `docker compose up -d --build`, producción **descarga imágenes ya construidas desde un Docker registry** y las corre directo (`docker compose up -d`, sin `--build`, con `image: <registry>/<imagen>:<tag>` en vez de `build:` en el compose — ver plantilla en [docs/templates/docker-compose.prod.yml](./templates/docker-compose.prod.yml)).
  - **⚠️ No existe ningún Docker registry configurado para este proyecto todavía** (ni uno propio self-hosted ni una cuenta en Docker Hub/GHCR/ECR confirmada en uso) — esto es un prerequisito real que falta resolver antes de poder desplegar producción así. Hasta que exista, la única alternativa (no ideal, solo para no bloquear un primer despliegue) sería construir la imagen en un ambiente de build separado y transferirla con `docker save`/`docker load`, pero el plan correcto es un registry.
  - Solo el `.env` de cada servicio y el `docker-compose.yml` final viajan a producción — nunca el código fuente ni el `.git/`.
- **Fase 3 — base de datos: se inicializa vacía, no se restaura el dump de staging.** Ver [13-migración-y-restauración-bd.md](./13-migracion-y-restauracion-bd.md) para el mecanismo completo (`migrations:run` + `seeds:run` desde cero) y la advertencia sobre el backup automatizado roto.
- **Fase 4 — nginx/dominio: sin definir.** Dominio público de producción, certificado TLS y `server_name` — todavía no hay un nombre ni servidor de producción asignado. La topología de dev/staging (`sunesis-dev.felcn.gob.bo` → `172.16.76.23`, `sunesis-staging.felcn.gob.bo` → `172.16.76.24`) ya está confirmada — ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1 — pero producción es un tercer servidor aparte, aún sin definir.
- **Ciudadanía Digital (AGETIC): credenciales de producción, no las de demo.** Ver la nota ya existente en la sección 9 de este documento — aplica igual acá, con mayor razón (producción no puede usar el ambiente demo de AGETIC).
- **Variables de entorno: todas rotadas, ninguna reutilizada de dev/staging** — ver [04-variables-de-entorno.md](./04-variables-de-entorno.md) §6.

No hay checklist de cierre para producción todavía (equivalente a la sección 9) — escribirlo cuando el servidor exista y se pueda verificar cada punto contra la realidad, siguiendo la misma disciplina de este documento (no dar nada por completo sin confirmarlo explícitamente).
