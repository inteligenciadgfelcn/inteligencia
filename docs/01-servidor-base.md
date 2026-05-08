# 01 — Servidor Base
## Preparación de Debian 13 desde cero

---

## Requisitos del servidor

| Recurso | Mínimo | Recomendado producción |
|---------|--------|------------------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB | 100 GB SSD |
| OS | Debian 13 (Trixie) | Debian 13 (Trixie) |
| Acceso | SSH root o sudo | SSH con clave pública |

---

## 1. Actualización inicial del sistema

Conectarse como root o con sudo tras la instalación limpia:

```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git vim ufw fail2ban \
  ca-certificates gnupg lsb-release apt-transport-https \
  htop net-tools jq sudo
```

---

## 2. Crear usuario administrador

```bash
# Crear el usuario principal (reemplazar 'server' con el nombre elegido)
adduser server

# Agregar al grupo sudo
usermod -aG sudo server

# Verificar
id server
# output esperado: uid=1000(server) gid=1000(server) groups=1000(server),27(sudo)
```

> **En producción:** Usar un nombre de usuario no obvio. Evitar `admin`, `root`, `ubuntu`, `debian`.

---

## 3. Instalar Docker CE

```bash
# Agregar repositorio oficial de Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg \
  -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# Verificar
docker --version
docker compose version
```

```bash
# Agregar el usuario al grupo docker (evita usar sudo en cada comando docker)
usermod -aG docker server

# Habilitar Docker al inicio
systemctl enable docker
systemctl start docker
```

> **Importante:** Cerrar y reabrir sesión SSH para que el grupo `docker` sea efectivo.

---

## 4. Instalar PostgreSQL 17

```bash
# Agregar repositorio oficial de PostgreSQL
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg

echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
  > /etc/apt/sources.list.d/pgdg.list

apt-get update
apt-get install -y postgresql-17 postgresql-client-17

# Habilitar y arrancar
systemctl enable postgresql
systemctl start postgresql

# Verificar
pg_isready -h localhost
# output esperado: localhost:5432 - aceptando conexiones
```

---

## 5. Instalar Nginx y Certbot

```bash
apt-get install -y nginx certbot python3-certbot-nginx

systemctl enable nginx
systemctl start nginx

# Verificar
nginx -t
curl -sf http://localhost | head -5
```

---

## 6. Crear estructura de directorios del proyecto

```bash
# Directorio del proyecto (estándar FHS para servicios)
mkdir -p /srv/inteligencia

# Directorio de backups
mkdir -p /opt/backups/postgres

# Directorio de secretos (fuera del repo, permisos restringidos)
mkdir -p /opt/felcn/secrets
chmod 700 /opt/felcn/secrets
chown server:server /opt/felcn/secrets

# Dar permisos al usuario sobre el directorio del proyecto
chown -R server:server /srv/inteligencia
```

---

## 7. Verificación final del paso 1

```bash
# Todos deben mostrar "active"
systemctl is-active docker nginx postgresql
```

Resultado esperado:
```
active
active
active
```

**Siguiente paso:** [02-acceso-ssh.md](02-acceso-ssh.md)
