# 07 — Servidor nuevo desde cero (staging)

Procedimiento completo, con **comandos manuales literales**, para dejar funcionando el servidor nuevo destinado a **staging** (decisión del 21/08/2026: staging se sacó de `servertest`, va en un servidor separado — ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)). Está pensado para ejecutarse a mano (o pegando cada bloque en la terminal), **sin depender de ningún agente/sesión de Claude en ese servidor** — todo lo que hace falta corriendo ahí es lo que está escrito acá.

**Decisión de arquitectura para el servidor nuevo (revisada 29/08/2026): todo dockerizado, ya NO igual que `servertest`.**

`servertest`/`desarrollo.felcn.gob.bo` (.20) tiene Postgres y nginx nativos en el host — ese patrón queda **solo para ese servidor, que se va a dar de baja** (ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1). Para cualquier servidor nuevo (`sunesis-dev.felcn.gob.bo`/.23, `sunesis-staging.felcn.gob.bo`/.24, producción cuando exista) la decisión cambió: **Postgres, nginx y el registry de imágenes también corren en Docker**, para que operar estos servidores no requiera saber administrar Postgres/nginx a mano — solo migraciones de TypeORM para cambios de tabla, y editar un archivo de config + `nginx -s reload` para nginx. Diseño probado de punta a punta en `servertest` (sin tocar el stack real) antes de documentarlo acá: build+push+pull real contra un registry de prueba, restore real de un dump dentro del contenedor de Postgres, `docker kill`+recrear el contenedor de Postgres con los datos intactos (volumen nombrado), y `nginx -t` + proxy real contra los contenedores de la app.

- **PostgreSQL dockerizado** (`postgres:17` — la versión real del servidor, no 16, ver hallazgo en [03-base-de-datos.md](./03-base-de-datos.md) §1) — Fase 3.
- **nginx dockerizado** (`nginx:1.26-alpine`) — Fase 4.
- **Registry de imágenes dockerizado, SOLO en el servidor dev (.23)** — Fase 5b.
- **Las aplicaciones (auth-backend, base-backend-v2, base-frontend) se levantan con Docker, igual que antes** — Fase 5.
- El servidor **debe ser headless** (sin sesión de escritorio — ver hallazgo de la sección 7, causó una caída total en `servertest`).
- **Fuera de alcance de esta revisión**: mTLS y `partner-locations.conf` (`/srv/interop`) — específico de `servertest`, no se replica acá; se define aparte si algún día hace falta.

Como este servidor es dedicado a un solo ambiente (no corre dev y staging en paralelo, a diferencia de `servertest` históricamente), el compose de la app corre un solo ambiente, con las credenciales reales de Ciudadanía Digital (AGETIC) directamente en su `.env`.

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

**No usar el particionado guiado "todo en una partición"** — en un servidor que corre Docker (imágenes/logs de contenedores, y ahora también los datos de Postgres vía volumen nombrado, todo bajo `/var/lib/docker`), un log o una base de datos que crece sin control puede llenar `/` y tirar abajo todo el sistema, no solo el servicio responsable. Separar en particiones/volúmenes lógicos con LVM (permite agrandar después sin reinstalar):

| Punto de montaje | Tamaño sugerido | Motivo |
|---|---|---|
| `/boot` | 1 GB, ext4, **fuera de LVM** | GRUB necesita una partición simple, no LVM |
| `/boot/efi` | 512 MB, FAT32 (solo si el servidor bootea en modo UEFI) | Partición EFI estándar |
| `swap` | Igual a la RAM hasta 8 GB, o un tamaño fijo razonable (p. ej. 4 GB) si la RAM es mucha | Evitar que el sistema OOM-kill procesos ante picos de memoria |
| `/` (raíz) | 20–30 GB, ext4, dentro de LVM | Sistema base, paquetes — separado de los datos que realmente crecen |
| `/var` | 20–30 GB, ext4, dentro de LVM | Logs del sistema — separado de `/var/lib/docker` (fila siguiente) |
| `/var/lib/docker` | 60–150 GB según el volumen de datos esperado, ext4, dentro de LVM | **Revisado 29/08/2026**: con Postgres, nginx y (en `.23`) el registry dockerizados, acá vive todo lo que antes se aislaba en `/var/lib/postgresql` — imágenes, logs de contenedores, y los datos reales de Postgres (volumen nombrado `postgres_data`) y del registry (`registry_data`). Aislado para que su crecimiento no tire abajo el resto del sistema, y para poder monitorear/alertar su uso de disco por separado. |
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

## 3. Fase 3 — Base de datos: PostgreSQL **dockerizado**

Ya no se instala en el host — corre como contenedor, definido en el mismo `docker-compose.yml` de este servidor (junto a las apps y nginx, ver plantilla [deploy/staging/docker-compose.yml](../deploy/staging/docker-compose.yml)). Init real, ya probado, en [deploy/tools/postgres/](../deploy/tools/postgres/):

**Antes de correr `docker compose up postgres`**, esto es lo que hay que saber sobre cómo queda configurado, sin tener que leer el YAML para inferirlo: no publica **ningún puerto** al host — solo lo alcanzan las apps de este mismo compose, por nombre de servicio (`postgres`), dentro de la red `felcn-network` (tipo `bridge`, definida una sola vez con `name: felcn-network` fijo en `docker-compose.prod.yml`, ver la nota 7 de ese archivo). Los datos viven en el volumen nombrado `postgres_data` — no uno anónimo, así sobrevive a un `docker compose down` sin `-v`. Ninguna de estas tres cosas (puerto, red, disco) necesita configuración manual aparte: ya vienen así en la plantilla.

- **`01-crear-bases.sh`** se monta en `docker-entrypoint-initdb.d/` — al primer arranque del contenedor crea las 9 bases reales vacías (`felcn_auth` — nombre **corregido**, antes `felcn_auth_v3`, ver [04-variables-de-entorno.md](./04-variables-de-entorno.md) — más las 8 de `base-backend-v2`), propiedad del rol `postgres` (superusuario, el único que corre migraciones/DDL). En la misma pasada crea `felcn_app` — un **rol de aplicación sin privilegios de superusuario ni DDL** (decisión del 30/08/2026, reemplaza la versión anterior que usaba `postgres` para todo) — con permisos de `SELECT`/`INSERT`/`UPDATE`/`DELETE` sobre las tablas de `felcn_auth` vía `ALTER DEFAULT PRIVILEGES FOR ROLE postgres`, así cada tabla nueva que una migración cree hereda el permiso automático. Es el rol que usan las apps en runtime (`DB_USERNAME=felcn_app` en el `environment:` de cada servicio, ver `docker-compose.prod.yml`) — probado de punta a punta: `felcn_app` no puede `CREATE TABLE` (permission denied confirmado), y sí puede loguearse y hacer CRUD real vía la API. No crea schemas ni tablas de negocio: eso lo pone la restauración del dump real (punto siguiente) — sí crea los 4 schemas vacíos de `felcn_auth` (`proyecto`, `usuario`, `parametro`, `felcn_estructura`), necesarios para que exista algo donde restaurar u otorgar permisos.
- **`scram-sha-256` ya viene por defecto** en la imagen oficial `postgres:17` para conexiones por red (verificado: `host all all all scram-sha-256` en el `pg_hba.conf` generado, sin config extra) — no hay que tocar nada para esto, a diferencia de una instalación nativa.
- **Este servidor es staging: se restaura el dump con datos** usando [deploy/tools/postgres/pg-restore.sh](../deploy/tools/postgres/pg-restore.sh) contra el contenedor (no contra un Postgres nativo) — ver [13-migración-y-restauración-bd.md](./13-migracion-y-restauracion-bd.md) para el procedimiento completo. Para producción el mecanismo es distinto (schema vacío + migraciones, sin restaurar datos de dev/staging) — mismo documento.
  - **Dump ya generado (21/08/2026)** de las 8 bases reales: `backups/20260821-staging-migracion/` (fuera de git — `/backups/` está en `.gitignore`, contiene datos reales; copiar al servidor nuevo por un canal seguro). Trae su propio `README.md` con los comandos de restauración exactos (adaptar a la versión dockerizada de arriba).
- **Persistencia**: volumen nombrado `postgres_data` — recrear o actualizar la imagen del contenedor nunca borra los datos (probado: `docker kill`+recrear el contenedor y las bases/schemas restaurados seguían intactos). Solo un `docker compose down -v` explícito los borraría.
- Las apps (Fase 5, mismo compose) llegan a Postgres por `DB_HOST=postgres` (nombre del servicio Docker, misma red `felcn-network`) — ya no hace falta `host.docker.internal` ni `extra_hosts`, Postgres está en la misma red interna, no en el host.
- Backup automatizado **desde el primer día**, con [deploy/tools/postgres/pg-backup.sh](../deploy/tools/postgres/pg-backup.sh) (`docker exec` + `pg_dump` directo, ya no hace falta copiar el script adentro del contenedor como en la versión nativa) por cron, volcando a un directorio del host fuera de cualquier volumen Docker (p. ej. `/opt/backups/postgres/`). Este punto es crítico: en `servertest` el backup automatizado diario **lleva roto desde el 1 de mayo de 2026** por un problema de permisos en su propio archivo de log (`set -euo pipefail` corta el script en la primera línea) — ver [03-base-de-datos.md](./03-base-de-datos.md) sección 9.2. Para el servidor nuevo: correr el script de backup manualmente una vez después de instalarlo y **confirmar que el archivo de dump se generó**, no confiar en que el cron "corrió sin error" en el log — el mismo tipo de fallo silencioso que rompió el de `servertest`.

## 4. Fase 4 — nginx **dockerizado**

Ya no se instala en el host — corre como contenedor (`nginx:1.26-alpine`), mismo `docker-compose.yml`. Config real, ya probada (`nginx -t` + proxy real contra los contenedores de la app), en [deploy/tools/nginx/](../deploy/tools/nginx/):

- **`nginx.conf`** — copia 1:1 de la config principal real de `servertest` (rate-limit zones, gzip, `server_tokens off`), solo con `user nginx;` en vez de `user www-data;` (la imagen oficial trae su propio usuario).
- **`conf.d/app.conf.template`** — un server block HTTPS por dominio (copiar y reemplazar `<DOMINIO>` por `sunesis-dev.felcn.gob.bo` / `sunesis-staging.felcn.gob.bo`). A diferencia de `desarrollo.felcn.gob.bo`, este servidor es UN solo ambiente — no hay upstreams `_staging` compartiendo archivo. Los upstreams apuntan al nombre del servicio Docker (`base-backend-v2`, `auth-backend`, `base-frontend`), no a `127.0.0.1:puerto` — las apps ya no publican sus puertos al host en absoluto.
- **NO incluye** mTLS ni `partner-locations.conf` (`/srv/interop`) — queda fuera de este trabajo. **NO incluye** `/persona/` ni `/docs/` — específicos de `servertest`.
- **Hallazgo real corregido en la plantilla**: un `add_header` dentro de una `location` resetea TODOS los `add_header` heredados del `server` (comportamiento real de nginx) — las locations `/health` y `/_next/static/` re-incluyen `security-headers.conf` explícitamente por esto. El nginx real de `servertest` tiene este mismo bug sin corregir en `/_next/static/` (no se toca, ver [05-nginx-y-tls.md](./05-nginx-y-tls.md)).
- **TLS**: volumen nombrado `certbot_certs` (nunca certificados horneados en la imagen, cumple el requisito de [12-requisitos-seguridad-infraestructura.md](./12-requisitos-seguridad-infraestructura.md) §4) + `certbot_webroot` compartido con el contenedor `certbot` del mismo compose (`location /.well-known/acme-challenge/` en el server HTTP de la plantilla). Primera emisión:
  ```bash
  docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d <dominio>
  ```
- **Renovación**: timer de systemd **en el host** (no un cron dentro de un contenedor con `docker.sock` montado — evitar darle a un contenedor acceso al socket de Docker, riesgo de seguridad innecesario, ver antecedente del incidente cryptominer de julio/2026) ejecutando [deploy/tools/nginx/certbot-renew.sh](../deploy/tools/nginx/certbot-renew.sh) (`docker compose run --rm certbot renew` + `docker compose exec nginx nginx -s reload`). Configurar el timer con el mismo patrón que el `certbot.timer` nativo ya documentado.
- **⚠️ Limitación real de esta revisión**: la emisión real de un certificado no se pudo probar todavía porque el DNS de `sunesis-dev.felcn.gob.bo` aún no apunta a `.23` (ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1) — se validó `nginx -t` y el proxy/rutas/rate-limit/headers en HTTP plano contra los contenedores reales de la app, pero no el challenge HTTP-01 real. Probarlo de verdad en cuanto el DNS apunte acá, antes de dar la Fase 4 por terminada.
- **Restart**: el gap `Restart=no` de nginx documentado para `servertest` ([06-systemd-y-contenedores.md](./06-systemd-y-contenedores.md)) **no aplica acá** — nginx corre como contenedor con `restart: unless-stopped`, Docker lo reinicia solo si el proceso muere.
- El callback OIDC (`location = /login/ciudadania` en la plantilla) apunta al frontend igual que en dev — **por ahora este servidor usa la misma configuración de AGETIC (demo) que dev, sin cambios**. Ver la nota completa sobre esto en el checklist (sección 9, ítem de AGETIC): recién va a hacer falta tocar `redirect_uri`/credenciales el día que llegue AGETIC de producción.

## 5. Fase 5 — Docker (motor — necesario ANTES de las Fases 3/4 de arriba)

**Nota de orden real de ejecución (revisado 29/08/2026):** este documento mantiene la numeración histórica de fases (Postgres = Fase 3, nginx = Fase 4, referenciadas así desde otros documentos), pero como ahora ambos corren dockerizados, el **orden real en que se ejecutan los comandos** es: Fase 0 → 1 → 2 → **esta Fase 5 (instalar Docker)** → Fase 3 (levantar el contenedor de Postgres) → Fase 4 (levantar nginx) → Fase 5b (registry, solo `.23`) → Fase 6 en adelante. No se puede levantar el contenedor de Postgres de la Fase 3 sin haber instalado Docker acá primero.

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

Con Docker instalado, seguir con la Fase 3 (Postgres) y la Fase 4 (nginx) de arriba — ambas, junto con las apps, terminan en el mismo `docker-compose.yml` de este servidor (ver plantilla [deploy/staging/docker-compose.yml](../deploy/staging/docker-compose.yml)). En el servidor dev (`.23`) además corre el compose aparte del registry (Fase 5b, siguiente).

## 5b. Fase 5b — Registry de imágenes (SOLO servidor dev, `.23`)

**Solo en `sunesis-dev.felcn.gob.bo` (.23)** — staging y producción nunca corren esto, solo hacen `pull` (Fase 8 de este documento y [14-registro-de-imagenes.md](./14-registro-de-imagenes.md)). Decisión del 29/08/2026: Docker Registry OSS simple (`registry:2`), no Harbor — RBAC/scaneo de vulnerabilidades quedan fuera de alcance por ahora, se prioriza el mínimo mantenimiento. Archivos en [deploy/tools/registry/](../deploy/tools/registry/), probados de punta a punta (build real → push → pull desde otro punto, con auth htpasswd) contra un registry de prueba antes de documentar esto:

**Requisito de red — probado y confirmado (29/08/2026)**: `docker-compose.registry.yml` se conecta a `felcn-network` como red **externa** (`external: true`) — tiene que existir ya, con ese nombre literal, antes de levantar el registry. En `.23` corren dos `docker-compose.yml` distintos (el de las apps de dev normal, más este de acá) — sin fijar `name: felcn-network` en el compose "dueño" de la red (ya corregido en [deploy/development/docker-compose.yml](../deploy/development/docker-compose.yml), el que corre en `.23`), Docker antepone el nombre del directorio (ej. `dev_felcn-network`) y este compose falla con `network felcn-network declared as external, but could not be found`.

```bash
cd deploy/tools/registry
bash crear-htpasswd.sh <usuario>          # pide la contraseña interactivo, no la deja en el historial
docker compose -f docker-compose.registry.yml up -d
```

- Expuesto vía nginx (mismo contenedor de la Fase 4) con TLS + auth `htpasswd` — ver `deploy/tools/nginx/conf.d/registry.conf.template`, dominio propuesto `registry.sunesis-dev.felcn.gob.bo` (**nuevo registro DNS a coordinar**, misma IP `.23`). El registry en sí no publica ningún puerto al host.
- Build y push desde acá: `bash deploy/tools/registry/build-and-push.sh [tag]` (requiere `docker login registry.sunesis-dev.felcn.gob.bo` una vez antes).

## 6. Fase 6 — Estructura de producción

- `/opt/docker-production/` (o el path que se decida) con el `docker-compose.yml` real, `logs/`, `reports/`. **Estructura exacta que espera la plantilla dockerizada**: copiar `deploy/staging/docker-compose.yml` (o `deploy/production/docker-compose.yml` si es el servidor de producción) acá como `docker-compose.yml`, y junto a él (mismo directorio) las carpetas `postgres/` y `nginx/` completas de `deploy/tools/` (sin el prefijo `tools/`, los `volumes:` del compose las referencian como `./postgres/...` y `./nginx/...`) — más los `.env` de cada servicio (`felcn-auth-backend.env`, `felcn-base-backend.env`, `felcn-base-frontend.env`).
- **Renombrar los `.conf.template` de `nginx/conf.d/`** después de reemplazar `<DOMINIO>` (Fase 4): `nginx.conf` solo incluye `conf.d/*.conf`, no `*.conf.template` — un `app.conf.template` copiado tal cual queda invisible para nginx (arranca sin ningún server block, sin avisar del error). Confirmado probando esto literal (29/08/2026): `cp app.conf.template sunesis-dev.felcn.gob.bo.conf` (con el `<DOMINIO>` ya reemplazado) es el paso que faltaba explicitar.
- **Un `.env` propio para el `docker-compose.yml`** (a nivel de compose, distinto de los 3 `.env` de cada servicio de arriba), con este contenido literal (ver [04-variables-de-entorno.md](./04-variables-de-entorno.md) §6 para el detalle de cada variable):
  ```
  DB_PASSWORD=<contraseña real del superusuario postgres>
  DB_APP_PASSWORD=<contraseña real del rol felcn_app>
  TAG=<tag de la imagen a desplegar>
  ```
  Compose lo lee automáticamente si se llama `.env` y vive al lado del `docker-compose.yml`. Sin esto, `docker compose up` falla directo con `required variable DB_PASSWORD is missing a value` (o `DB_APP_PASSWORD`/`TAG`, según cuál falte).
- **Orden real de arranque (confirmado probando la plantilla de punta a punta, 29/08/2026)**: `postgres` → restaurar el dump ([13-migracion-y-restauracion-bd.md](./13-migracion-y-restauracion-bd.md)) → recién ahí las 3 apps → `nginx` al final. nginx resuelve sus upstreams una sola vez al arrancar (no reintenta si el nombre no existe todavía) — si se levanta todo junto con `docker compose up -d` antes de que las apps existan, nginx puede fallar con `host not found in upstream` y quedar en loop de reinicio hasta que las apps ya estén arriba. En el día a día esto no afecta actualizar una sola app (nginx no se reinicia para eso), solo importa en el arranque inicial del servidor.
  ```bash
  docker compose up -d postgres
  bash deploy/tools/postgres/pg-restore.sh <dump.sql.gz> felcn_auth   # y el resto de las 8 bases si aplica
  docker compose up -d base-backend-v2 base-auth base-frontend
  docker compose up -d nginx
  ```
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

Una vez completadas las fases 1-5b (Postgres, nginx y — si es `.23` — el registry ya arriba):

```bash
git clone git@github.com:inteligenciadgfelcn/inteligencia.git /srv/inteligencia
cd /srv/inteligencia
# .env por proyecto — ver 04-variables-de-entorno.md — con secretos rotados, no copiados de servertest.
# Como este servidor ES el ambiente de staging (no corre dev en paralelo), las credenciales reales
# de AGETIC van directo en backend/felcn-auth-backend/.env — no hace falta un .env.staging aparte
# acá. DB_HOST=postgres, DB_DATABASE=felcn_auth (Postgres dockerizado, mismo compose, ver Fase 3).
docker compose up -d --build
```

Staging sigue el mismo criterio que dev (código fuente en el servidor, build local) — ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md). Producción es la excepción: nunca clona el repo ni buildea, solo hace `pull` de las imágenes ya construidas en dev — ver sección 10 y [14-registro-de-imagenes.md](./14-registro-de-imagenes.md).

`fake-ciudadania-api` no está en este compose — confirmado sin uso, este servidor usa AGETIC real (ver [00-arquitectura.md](./00-arquitectura.md) §4).

Y seguir el runbook de bootstrap de datos: [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).

## 9. Checklist obligatorio antes de dar el servidor por terminado

No dar el servidor nuevo por completo solo porque `docker compose up -d --build` no tiró error — varios de estos puntos fallan en silencio (la app responde 200 igual). Verificar explícitamente cada uno:

- [ ] **Base de datos** (Postgres dockerizado, `postgres:17`): `docker compose ps postgres` activo y sin reinicios en loop, `scram-sha-256` confirmado (`docker exec postgres cat /var/lib/postgresql/data/pg_hba.conf | grep scram`), conexión real confirmada desde cada backend vía `DB_HOST=postgres` (no solo que `psql` funcione dentro del contenedor), bases reales restauradas o runbook de bootstrap corrido (sección 3, [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md)), volumen `postgres_data` confirmado como named volume (no anónimo) para que sobreviva a un `docker compose down` sin `-v`. Confirmar también que las apps arrancaron con `felcn_app` (`DB_USERNAME=felcn_app` en su `environment:`, no `postgres`) — un `\du felcn_app` dentro del contenedor debe mostrarlo sin ningún atributo de superusuario.
- [ ] **Seguridad**: `sudo ufw status verbose` con las reglas esperadas activas, fail2ban con los jails de sshd/nginx corriendo (`fail2ban-client status`), SSH con `PasswordAuthentication` habilitado a propósito — no repetir el hardening que hubo que revertir en `servertest` (sección 1).
- [ ] **Docker**: `docker.service` habilitado en systemd (`systemctl is-enabled docker`), límites de logging configurados en `/etc/docker/daemon.json`, **todos** los servicios del compose con `restart: unless-stopped` (ahora incluye Postgres y nginx, no solo las apps).
- [ ] **Imágenes**: en dev/staging, build hecho con el código que realmente se quiere desplegar — el build context toma el disco tal cual está (incluye cambios sin commitear), no `git HEAD`; confirmar `git status` limpio antes de un build. En producción, el tag desplegado (`pull-and-deploy.sh <tag>`) corresponde al build real que se probó en dev — ver [14-registro-de-imagenes.md](./14-registro-de-imagenes.md).
- [ ] **Contenedores**: todos arriba (`base-auth`, `base-frontend`, `base-backend-v2`, `postgres`, `nginx`) y sin reinicios en loop (`docker ps`, revisar `Status`/`RESTARTING`), logs de arranque sin errores (`docker compose logs --tail 50 <servicio>`), ningún puerto de Postgres publicado al host (solo alcanzable por nombre de servicio en `felcn-network`).
- [ ] **nginx** (dockerizado): `docker compose exec nginx nginx -t` sin errores, contenedor activo con `restart: unless-stopped` (ya no depende de un drop-in de systemd, ver [06-systemd-y-contenedores.md](./06-systemd-y-contenedores.md)), rate limiting y headers de seguridad activos, sin ningún `include` colgando de `/srv/interop/...` (ese proyecto no corre acá).
- [ ] **Certificados**: Let's Encrypt emitido para el dominio de este servidor y renovando solo (`docker compose run --rm certbot renew --dry-run`, timer de systemd del host listado en `systemctl list-timers`).
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

- **Fase 5/8 — código: NO se clona el repo con git.** Producción es el único ambiente donde no debe haber código fuente en el servidor (a diferencia de dev y staging, que sí lo tienen — ver convención en [02-entorno-docker-dev.md](./02-entorno-docker-dev.md) §7). En vez de `git clone` + `docker compose up -d --build`, producción **descarga imágenes ya construidas desde el registry propio** (Fase 5b, servidor dev `.23`) y las corre directo con [deploy/tools/registry/pull-and-deploy.sh](../deploy/tools/registry/pull-and-deploy.sh) (`docker compose pull` + `docker compose up -d`, sin `--build`, con `image: registry.sunesis-dev.felcn.gob.bo/felcn-<imagen>:${TAG}` en vez de `build:` — ver plantilla en [deploy/production/docker-compose.yml](../deploy/production/docker-compose.yml)). El registry **ya existe** (29/08/2026, Docker Registry OSS simple en `.23`) — este prerequisito quedó resuelto, ver [14-registro-de-imagenes.md](./14-registro-de-imagenes.md) para el flujo completo.
  - Solo el `.env` de cada servicio y el `docker-compose.yml` final viajan a producción — nunca el código fuente ni el `.git/`.
- **Fase 3 — base de datos: se inicializa vacía, no se restaura el dump de staging.** Ver [13-migración-y-restauración-bd.md](./13-migracion-y-restauracion-bd.md) para el mecanismo completo (`migrations:run` + `seeds:run` desde cero) y la advertencia sobre el backup automatizado roto.
- **Fase 4 — nginx/dominio: sin definir.** Dominio público de producción, certificado TLS y `server_name` — todavía no hay un nombre ni servidor de producción asignado. La topología de dev/staging (`sunesis-dev.felcn.gob.bo` → `172.16.76.23`, `sunesis-staging.felcn.gob.bo` → `172.16.76.24`) ya está confirmada — ver [05-nginx-y-tls.md](./05-nginx-y-tls.md) §1 — pero producción es un tercer servidor aparte, aún sin definir.
- **Ciudadanía Digital (AGETIC): credenciales de producción, no las de demo.** Ver la nota ya existente en la sección 9 de este documento — aplica igual acá, con mayor razón (producción no puede usar el ambiente demo de AGETIC).
- **Variables de entorno: todas rotadas, ninguna reutilizada de dev/staging** — ver [04-variables-de-entorno.md](./04-variables-de-entorno.md) §6.

No hay checklist de cierre para producción todavía (equivalente a la sección 9) — escribirlo cuando el servidor exista y se pueda verificar cada punto contra la realidad, siguiendo la misma disciplina de este documento (no dar nada por completo sin confirmarlo explícitamente).
