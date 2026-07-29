# 05 — nginx y TLS

## 1. Dónde vive

nginx corre **instalado en el host** (paquete Debian `nginx` 1.26.3-3+deb13u5), no dockerizado, en `servertest`. Archivo de sitio: `/etc/nginx/sites-available/desarrollo.felcn.gob.bo` (symlink en `sites-enabled`). Esto cambia para el servidor nuevo — nginx se dockeriza, ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md).

## 2. TLS

- Certificado Let's Encrypt para `desarrollo.felcn.gob.bo` y `www.desarrollo.felcn.gob.bo`.
- Renovación vía `certbot` 4.0.0 + plugin `python3-certbot-nginx`, con su propio timer de systemd (no un cron manual) — confirmar con `systemctl list-timers | grep certbot`.
- **mTLS opcional**: `ssl_verify_client optional` con `ssl_client_certificate` apuntando a `/srv/interop/deploy/certs/vault-ca-chain.crt` — esta CA la emite el Vault del proyecto `/srv/interop` (independiente de este repo). Esto es un hecho de configuración de este nginx, no documentación de ese otro proyecto.

## 3. Upstreams (backends que nginx conoce)

```nginx
upstream hub_gateway        { server 127.0.0.1:8088; }   # proyecto /srv/interop
upstream backend_v2         { server 127.0.0.1:3015; }   # base-backend-v2 (dev)
upstream backend_auth       { server 127.0.0.1:3016; }   # auth-backend (dev)
upstream frontend           { server 127.0.0.1:3017; }   # base-frontend (dev)
upstream consulta_persona   { server 127.0.0.1:3018; }
upstream fake_ciudadania    { server 127.0.0.1:3019; }
upstream backend_v2_staging { server 127.0.0.1:3025; }
upstream backend_auth_staging { server 127.0.0.1:3026; }
upstream frontend_staging   { server 127.0.0.1:3027; }
```

Todos con `keepalive` configurado.

## 4. Rutas principales

| Ruta | Destino | Notas |
|---|---|---|
| `/` (raíz exacta) | `301 → /login/` | Next.js tiene un bug conocido devolviendo `200` vacío en la raíz con basePath |
| `/` (resto) | `frontend` (dev) | catch-all |
| `/api` | `backend_v2` | API principal dev |
| `/dev/api` | `backend_v2` | alias legado, mismo destino que `/api` |
| `/dev/auth/api` | `backend_auth` | auth dev |
| `/pandora-api` | `backend_auth` (rewrite a `/api`) | callbacks de PANDORA — url fija externa, no cambiar sin coordinar con PANDORA |
| `/felcn/api/whatsapp`, `/dev/api/whatsapp` | `backend_auth` | webhook Meta Cloud API (WhatsApp) |
| `/login/ciudadania` | `301 → /staging/login/ciudadania` | callback OIDC real (AGETIC) |
| `/dev/login/ciudadania` | `frontend` (rewrite) | callback OIDC fake (dev) |
| `/ciudadania/`, `/interaction/` | `fake_ciudadania` | solo dev |
| `/persona/` | `consulta_persona` | rate-limited |
| `/socket.io/` | `backend_v2` | WebSockets, `proxy_read_timeout 86400`, sin buffering |
| `/_next/static/` | `frontend` | assets inmutables, sin rate limit, cache 1 año |
| `/staging`, `/staging/` | `301 → /staging/login/` | mismo bug de Next.js que la raíz dev |
| `/staging/api` | `backend_v2_staging` | |
| `/staging/auth/api` | `backend_auth_staging` | |
| `/staging` (resto) | `frontend_staging` | |

## 5. Rate limiting

Zonas `general` y `login` (definidas fuera del bloque `server`, no capturadas en este extracto — revisar `http {}` de `nginx.conf` o un snippet incluido). Aplicadas con `limit_req`/`limit_conn` en rutas de API y en `/dev/auth/api` (zona `login`, más estricta).

## 6. Seguridad

- `include /etc/nginx/snippets/security-headers.conf` — headers de seguridad centralizados.
- Bloqueo de archivos ocultos: `location ~ /\. { deny all; return 404; }`.
- `include /srv/interop/deploy/nginx/partner-locations.conf` — rutas para partners externos definidas por el proyecto `/srv/interop`. **Esta es una dependencia técnica real de este nginx** (si ese archivo no existe o cambia, este nginx puede fallar a recargar) aunque no se documenta el contenido de ese proyecto aquí.

## 7. Health check

```
location = /health { return 200 "OK\n"; }
```

## 8. Gap conocido: `Restart=no`

El `nginx.service` de systemd tiene `Restart=no` — si el proceso maestro de nginx muere solo (no por caída del sistema), **no se reinicia automáticamente**. Ver [06-systemd-y-contenedores.md](./06-systemd-y-contenedores.md).

## 9. Comandos útiles

```bash
sudo nginx -t                          # valida sintaxis antes de recargar
sudo systemctl reload nginx            # recarga sin cortar conexiones activas
sudo journalctl -u nginx --no-pager    # logs del servicio
sudo tail -f /var/log/nginx/error.log  # errores en vivo (requiere grupo adm o sudo)
sudo tail -f /var/log/nginx/access.log
```
