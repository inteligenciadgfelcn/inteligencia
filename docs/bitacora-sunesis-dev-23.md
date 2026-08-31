# Bitácora — `sunesis-dev.felcn.gob.bo` (172.16.76.23), 31/08/2026

Registro real y completo de la instalación del servidor dev definitivo, hecha a mano por un devops del equipo (no por un agente) siguiendo `docs/07-servidor-nuevo-desde-cero.md`, grabada en video en 4 partes. Este documento es la secuencia **final correcta** — no reproduce los pasos en falso ni las correcciones que salieron durante la grabación, esos quedan documentados como hallazgos en el propio `docs/07` y `docs/14-registro-de-imagenes.md`.

Servidor: VM Proxmox, Debian 13 (trixie), usuario `jquispe` con `sudo`, puerto SSH 22. Dominio: `sunesis-dev.felcn.gob.bo` → `172.16.76.23` (DNS real).

## Video 1 — Preparación del servidor

```bash
apt update && DEBIAN_FRONTEND=noninteractive apt upgrade -y

apt install -y ufw
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

apt install -y fail2ban
# jail.local con ignoreip ampliado a la IP de gestión real (identificada con
# `ss -tnp | grep :22` en la conexión ya activa, ya que $SSH_CLIENT no se
# hereda al entrar con `sudo su`) — evita el auto-bloqueo real que pasó en
# la prueba del servidor 172.16.76.22.
systemctl enable fail2ban
systemctl restart fail2ban

tee /etc/ssh/sshd_config.d/99-hardening.conf > /dev/null <<'EOF'
PermitRootLogin no
PubkeyAuthentication yes
MaxAuthTries 3
X11Forwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60
EOF
sshd -t && systemctl reload ssh

systemctl set-default multi-user.target   # venía en graphical.target, sin GUI instalada

apt install -y git

# Docker CE desde el repo oficial (no el docker.io de Debian)
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker jquispe

tee /etc/docker/daemon.json > /dev/null <<'EOF'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
EOF
systemctl restart docker
```

## Video 2 — Base de datos

```bash
mkdir -p /srv && chown jquispe:jquispe /srv
git clone -b develop https://<usuario>@github.com/inteligenciadgfelcn/inteligencia.git /srv/inteligencia
cd /srv/inteligencia

cp deploy/development/.env.sample deploy/development/.env
cp backend/felcn-auth-backend/.env.sample backend/felcn-auth-backend/.env
cp backend/felcn-base-backend/.env.sample backend/felcn-base-backend/.env
cp frontend/felcn-base-frontend/.env.sample frontend/felcn-base-frontend/.env
# Editar los 3 primeros con los secretos + DB_HOST/DB_DATABASE/DB_USERNAME reales
# (ver docs/04-variables-de-entorno.md §8/§9 — el .env.sample NO trae los
# valores correctos por defecto, hay que corregirlos a mano)

cd deploy/development
docker compose up -d postgres
docker exec postgres psql -U postgres -c "\l"          # confirmar las 9 bases
docker exec postgres psql -U postgres -c "\du felcn_app"  # sin atributos de superusuario

# Backup fresco transferido desde servertest (scp directo, red interna)
mkdir -p /tmp/restore-23
scp -r <usuario>@172.16.76.20:/srv/inteligencia/backups/20260831-servidor-dev-23/*.sql.gz /tmp/restore-23/
cd /srv/inteligencia
for db in a_felcn_asignacion_caso a_felcn_lgi a_felcn_sii a_felcn_sospechoso felcn_personas felcn_s2i felcn_siii felcn_vls; do
  bash deploy/tools/postgres/pg-restore.sh /tmp/restore-23/$db.sql.gz $db
done
rm -rf /tmp/restore-23

# Migraciones y seeds — imagen intermedia de build, no la final (no trae ts-node/database/)
docker build --target build -t auth-backend-migrate:tmp backend/felcn-auth-backend
DB_PW=$(grep ^DB_PASSWORD= deploy/development/.env | cut -d= -f2-)
docker run --rm --network felcn-network \
  --env-file backend/felcn-auth-backend/.env \
  -e DB_HOST=postgres -e DB_USERNAME=postgres -e DB_PASSWORD="$DB_PW" \
  -w /home/node/app auth-backend-migrate:tmp npm run migrations:run
docker run --rm --network felcn-network \
  --env-file backend/felcn-auth-backend/.env \
  -e DB_HOST=postgres -e DB_USERNAME=postgres -e DB_PASSWORD="$DB_PW" \
  -w /home/node/app auth-backend-migrate:tmp npm run seeds:run
```

## Video 3 — nginx + TLS real

```bash
cd /srv/inteligencia/deploy/development
docker compose up -d --build base-auth base-backend-v2 base-frontend

# Config temporal SOLO HTTP, para el challenge ACME (nginx no arranca si el
# bloque HTTPS referencia un certificado que todavía no existe)
cd /srv/inteligencia/deploy/tools/nginx/conf.d
tee sunesis-dev.felcn.gob.bo.conf > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name sunesis-dev.felcn.gob.bo;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 "ok\n"; }
}
EOF

cd /srv/inteligencia/deploy/development
docker compose up -d nginx
docker compose exec nginx nginx -t

docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d sunesis-dev.felcn.gob.bo

# Activar la config completa (HTTP+HTTPS) ahora que el certificado existe
cd /srv/inteligencia/deploy/tools/nginx/conf.d
sed 's/<DOMINIO>/sunesis-dev.felcn.gob.bo/g' app.conf.template > sunesis-dev.felcn.gob.bo.conf
cd /srv/inteligencia/deploy/development
docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

Login real verificado en `https://sunesis-dev.felcn.gob.bo/login/`, usuario `ADMINISTRADOR`.

## Video 4 — Docker Registry + UI

```bash
cd /srv/inteligencia/deploy/tools/registry
read -s -p "Contraseña del registry: " REGPASS; echo
printf '%s' "$REGPASS" | docker run --rm -i httpd:alpine htpasswd -Bni deploy-admin > htpasswd

docker compose -f docker-compose.registry.yml up -d   # registry + registry-ui

# Integrar el registry al nginx ya activo (por path, sin subdominio nuevo)
python3 - <<'PYEOF'
path = "/srv/inteligencia/deploy/tools/nginx/conf.d/sunesis-dev.felcn.gob.bo.conf"
with open(path) as f: content = f.read()
marker = "    location = /health {"
insert = """    location /v2/ {
        client_max_body_size 0;
        chunked_transfer_encoding on;
        proxy_pass         http://registry:5000/v2/;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 900s;
    }

"""
content = content.replace(marker, insert + marker)
with open(path, "w") as f: f.write(content)
PYEOF
cd /srv/inteligencia/deploy/development
docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload

# Push desde el mismo servidor que hostea el registry -> hairpin NAT, fix real:
echo "127.0.0.1 sunesis-dev.felcn.gob.bo" | tee -a /etc/hosts

docker login sunesis-dev.felcn.gob.bo -u deploy-admin
cd /srv/inteligencia
REGISTRY_HOST=sunesis-dev.felcn.gob.bo bash deploy/tools/registry/build-and-push.sh 1.0.0

# Prueba real de pull (borrar local + volver a bajar)
docker rmi sunesis-dev.felcn.gob.bo/felcn-auth-backend:1.0.0 sunesis-dev.felcn.gob.bo/felcn-base-backend:1.0.0 sunesis-dev.felcn.gob.bo/felcn-base-frontend:1.0.0
docker pull sunesis-dev.felcn.gob.bo/felcn-auth-backend:1.0.0
docker pull sunesis-dev.felcn.gob.bo/felcn-base-backend:1.0.0
docker pull sunesis-dev.felcn.gob.bo/felcn-base-frontend:1.0.0

# UI con HTTPS real en puerto dedicado (no HTTP plano, no sub-path)
# — ver docs/07-servidor-nuevo-desde-cero.md Fase 5b para el server block completo —
ufw allow from 172.16.76.0/24 to any port 8081 proto tcp comment 'Registry UI - solo red interna FELCN'
```

## Cierre — estado final confirmado

| Ítem | Estado |
|---|---|
| Sistema base (UFW/fail2ban/SSH/headless) | ✅ |
| Git + Docker Engine | ✅ |
| Postgres (9 bases, `felcn_app` sin superusuario) | ✅ |
| Backup real probado (`pg-backup.sh`) | ✅ |
| Migraciones + seeds `felcn_auth` | ✅ (con corrección de contraseña admin — ver hallazgo en `docs/07` Fase 8) |
| nginx + Let's Encrypt real | ✅ |
| Login real (usuario/contraseña) | ✅ |
| Registry + UI, ciclo build→push→pull | ✅ |
| SMTP | ✅ credenciales reales, conectividad confirmada — sin envío de prueba real todavía |
| AGETIC/OIDC | ⚠️ pendiente solicitar registro del `redirect_uri` real ante AGETIC |

## Hallazgos reales que salieron de esta instalación (detalle completo en `docs/07` y `docs/14`)

1. `<DOMINIO>` como texto literal en el `environment:` del compose rompía el login en silencio (`environment:` pisa `env_file:`) — corregido a `${DOMINIO:?falta DOMINIO}`.
2. nginx no re-resuelve la IP de un upstream recreado — recrear cualquier app container requiere `nginx -s reload` después, no solo en el arranque inicial.
3. `.env.sample` con placeholders que pasan silenciosamente como valores reales (`ADMIN_INITIAL_PASSWORD=__CONTRASENA_FUERTE__`) — el hallazgo de seguridad más importante de esta sesión.
4. `backend/felcn-base-backend/.env.sample` no trae los valores correctos (`DB_HOST`, nombres de base, usuario) para un servidor dockerizado — plantilla completa corregida en `docs/04-variables-de-entorno.md` §9.
5. Emitir un certificado Let's Encrypt real requiere una config nginx intermedia (solo HTTP) antes de la completa — la completa referencia un certificado que todavía no existe.
6. "Hairpin NAT" al pushear al registry desde el mismo servidor que lo hostea — fix con una entrada en `/etc/hosts`.
7. La UI del registry necesita su propio puerto con HTTPS real (no HTTP plano, no sub-path) — y debe restringirse a la red interna, no exponerse a todo internet.
8. Las imágenes locales de dev (`docker compose up -d --build`) y las imágenes del registry (`build-and-push.sh`) son artefactos completamente separados — actualizar uno no actualiza el otro.
