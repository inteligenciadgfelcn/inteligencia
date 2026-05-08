# 03 — Seguridad del Servidor
## UFW, Fail2ban, actualizaciones automáticas

---

## 1. UFW — Firewall

```bash
# Resetear a estado limpio
ufw --force reset

# Política base: bloquear todo lo entrante, permitir todo lo saliente
ufw default deny incoming
ufw default allow outgoing

# Abrir solo los puertos necesarios
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Habilitar
ufw --force enable

# Verificar
ufw status verbose
```

> **En producción:**
> - El puerto 22 debería restringirse a IPs conocidas:
>   `ufw allow from [IP-OFICINA] to any port 22`
> - Si se usa VPN, el SSH puede quedar solo accesible por VPN y el 22 cerrado al exterior.
> - **Nunca abrir el puerto 5432 (PostgreSQL) al exterior.**
> - **Nunca abrir los puertos 3015, 3016, 3017 (Docker) al exterior.**

### Reglas esperadas en este entorno

```
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

---

## 2. Fail2ban — Protección contra fuerza bruta

```bash
apt-get install -y fail2ban

cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime  = 24h
findtime = 10m
maxretry = 3
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

systemctl enable fail2ban
systemctl restart fail2ban

# Verificar
fail2ban-client status
fail2ban-client status sshd
```

---

## 3. Actualizaciones de seguridad automáticas

```bash
apt-get install -y unattended-upgrades

# Configurar actualizaciones automáticas de seguridad únicamente
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Packages "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

systemctl enable unattended-upgrades
```

> **Nota:** `Automatic-Reboot "false"` — el kernel no se reinicia automáticamente. Programar una ventana de mantenimiento mensual para reinicios de kernel si `needrestart` lo indica.

---

## 4. Configuración de seguridad de Nginx

### Snippets de seguridad

```bash
mkdir -p /etc/nginx/snippets

# Headers de seguridad HTTP
cat > /etc/nginx/snippets/security-headers.conf <<'EOF'
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
EOF

# SSL hardening (se aplica cuando certbot instale el certificado)
cat > /etc/nginx/snippets/ssl-hardening.conf <<'EOF'
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
EOF
```

### nginx.conf principal

```bash
# Backup del original
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak.$(date +%Y%m%d)

cat > /etc/nginx/nginx.conf <<'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log warn;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 10M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent"';
    access_log /var/log/nginx/access.log main;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

nginx -t && systemctl reload nginx
```

---

## 5. Verificación final del paso 3

```bash
# UFW activo con reglas correctas
ufw status

# Fail2ban corriendo
fail2ban-client status

# Nginx sin errores de configuración
nginx -t
```

**Siguiente paso:** [04-postgresql.md](04-postgresql.md)
