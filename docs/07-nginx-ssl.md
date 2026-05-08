# 07 — Nginx y SSL
## Virtual host, proxy reverso y certificado HTTPS

---

## Arquitectura de rutas

```
https://desarrollo.felcn.gob.bo/              → localhost:3017 (frontend)
https://desarrollo.felcn.gob.bo/felcn/api     → localhost:3015 (backend-v2)
https://desarrollo.felcn.gob.bo/felcn/auth/api → localhost:3016 (auth-backend)
```

> Reemplazar `desarrollo.felcn.gob.bo` por el dominio real de cada entorno.

---

## Prerequisito: dominio apuntando al servidor

Antes de configurar Nginx y solicitar el certificado SSL, verificar que el DNS ya apunta al servidor:

```bash
# Desde cualquier terminal
dig desarrollo.felcn.gob.bo +short
# Debe devolver la IP pública del servidor

# O desde el servidor
curl -s https://api.ipify.org
# Comparar con la IP del dominio
```

> Si el DNS no está propagado, el certificado de Let's Encrypt fallará.

---

## 1. Crear el virtual host

```bash
# Backup del default
cp /etc/nginx/sites-available/default \
   /etc/nginx/sites-available/default.bak.$(date +%Y%m%d)

# Crear virtual host del proyecto
cat > /etc/nginx/sites-available/felcn <<'EOF'
# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name desarrollo.felcn.gob.bo;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS principal
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name desarrollo.felcn.gob.bo;

    # Certificados SSL (certbot los completará)
    ssl_certificate     /etc/letsencrypt/live/desarrollo.felcn.gob.bo/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/desarrollo.felcn.gob.bo/privkey.pem;

    # Snippets de seguridad
    include /etc/nginx/snippets/ssl-hardening.conf;
    include /etc/nginx/snippets/security-headers.conf;

    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit 30;

    # Bloquear archivos ocultos
    location ~ /\. {
        deny all;
        return 404;
    }

    # ── Backend principal API ─────────────────────────────────
    location /felcn/api/ {
        proxy_pass http://127.0.0.1:3015/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;

        # Rate limiting más estricto en la API
        limit_req zone=general burst=30 nodelay;
    }

    # ── Auth API ──────────────────────────────────────────────
    location /felcn/auth/api/ {
        proxy_pass http://127.0.0.1:3016/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;

        # Login limitado a 1 req/s
        limit_req zone=login burst=5 nodelay;
    }

    # ── Frontend Next.js ──────────────────────────────────────
    location / {
        proxy_pass http://127.0.0.1:3017;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Health check interno (sin logs)
    location /health {
        access_log off;
        proxy_pass http://127.0.0.1:3017/health;
    }
}
EOF

# Activar el sitio
ln -sf /etc/nginx/sites-available/felcn /etc/nginx/sites-enabled/felcn

# Deshabilitar el default genérico
rm -f /etc/nginx/sites-enabled/default
```

---

## 2. Obtener certificado SSL con Certbot

```bash
# Crear directorio para el challenge de Let's Encrypt
mkdir -p /var/www/certbot

# Primero probar con --dry-run para verificar que el DNS está bien
certbot certonly --webroot \
  -w /var/www/certbot \
  -d desarrollo.felcn.gob.bo \
  --email [EMAIL-ADMIN] \
  --agree-tos \
  --no-eff-email \
  --dry-run

# Si el dry-run pasa, ejecutar sin --dry-run
certbot certonly --webroot \
  -w /var/www/certbot \
  -d desarrollo.felcn.gob.bo \
  --email [EMAIL-ADMIN] \
  --agree-tos \
  --no-eff-email
```

> **Límite de Let's Encrypt:** 5 certificados por dominio por semana. No ejecutar repetidamente si falla — investigar la causa primero.

---

## 3. Verificar y recargar Nginx

```bash
nginx -t && systemctl reload nginx
```

### Verificar HTTPS

```bash
# Respuesta HTTP → debe redirigir a HTTPS
curl -I http://desarrollo.felcn.gob.bo

# Verificar certificado
curl -vI https://desarrollo.felcn.gob.bo 2>&1 | grep -E "subject|expire|SSL"

# Verificar los 3 backends a través de Nginx
curl -sf https://desarrollo.felcn.gob.bo/felcn/api/health
curl -sf https://desarrollo.felcn.gob.bo/felcn/auth/api/health
curl -sf https://desarrollo.felcn.gob.bo/
```

---

## 4. Renovación automática del certificado

Certbot instala un timer systemd que renueva automáticamente:

```bash
# Verificar que el timer está activo
systemctl status certbot.timer

# Probar renovación manual (sin ejecutar realmente)
certbot renew --dry-run
```

Los certificados de Let's Encrypt vencen cada 90 días. Se renuevan automáticamente cuando quedan menos de 30 días.

---

## 5. Resguardo del certificado

El certificado y la clave privada están en:

```
/etc/letsencrypt/live/desarrollo.felcn.gob.bo/
├── fullchain.pem   ← Certificado + cadena (público)
├── privkey.pem     ← Clave privada (NUNCA compartir)
├── cert.pem        ← Solo el certificado
└── chain.pem       ← Solo la cadena intermedia
```

```bash
# Backup del directorio completo de letsencrypt
tar -czf /opt/backups/letsencrypt_$(date +%Y%m%d).tar.gz \
  /etc/letsencrypt/

# Este backup contiene claves privadas — protegerlo igual que los .env
chmod 600 /opt/backups/letsencrypt_*.tar.gz
```

> En producción, incluir `/etc/letsencrypt/` en el backup automático del servidor.

---

## 6. Adaptación para producción

Al cambiar de entorno, los únicos cambios son el dominio:

```bash
# En el virtual host /etc/nginx/sites-available/felcn
# Reemplazar todas las ocurrencias del dominio:
sed -i 's/desarrollo\.felcn\.gob\.bo/[DOMINIO-PRODUCCION]/g' \
  /etc/nginx/sites-available/felcn

# Solicitar nuevo certificado para el dominio de producción
certbot certonly --webroot \
  -w /var/www/certbot \
  -d [DOMINIO-PRODUCCION] \
  --email [EMAIL-ADMIN] \
  --agree-tos --no-eff-email

nginx -t && systemctl reload nginx
```

---

## 7. Verificación final del paso 7

```bash
# Nginx corriendo
systemctl is-active nginx

# Certificado válido
certbot certificates

# Los 3 servicios accesibles por HTTPS
curl -sf https://desarrollo.felcn.gob.bo/ > /dev/null && echo "OK: frontend"
curl -sf https://desarrollo.felcn.gob.bo/felcn/api/health && echo "OK: backend-v2"
curl -sf https://desarrollo.felcn.gob.bo/felcn/auth/api/health && echo "OK: auth"
```

**Siguiente paso:** [08-secretos.md](08-secretos.md)
