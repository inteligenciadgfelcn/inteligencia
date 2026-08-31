# 05 — nginx y TLS

## 1. Dónde vive

nginx corre **instalado en el host** (paquete Debian `nginx` 1.26.3-3+deb13u5), no dockerizado, en `servertest`. Archivo de sitio: `/etc/nginx/sites-available/desarrollo.felcn.gob.bo` (symlink en `sites-enabled`).

**Revisado 29/08/2026 — los servidores nuevos ya NO replican este patrón.** `desarrollo.felcn.gob.bo` (`.20`, este documento) sigue con nginx nativo hasta que se dé de baja. Los servidores nuevos (`sunesis-dev.felcn.gob.bo`/.23, `sunesis-staging.felcn.gob.bo`/.24, producción futura) corren nginx **dockerizado** (`nginx:1.26-alpine`) — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 4 y las plantillas en [deploy/tools/nginx/](../deploy/tools/nginx/), probadas de punta a punta (`nginx -t` + proxy real contra los contenedores de la app) antes de documentarlas. La config dockerizada no incluye mTLS ni `partner-locations.conf` (`/srv/interop`, sección 2 de este documento) — queda fuera de ese trabajo.

**Hallazgo real encontrado al probar la versión dockerizada (no corregido acá, fuera de alcance):** un `add_header` dentro de una `location` resetea TODOS los `add_header` heredados del `server` block — comportamiento real de nginx, no un typo. La location `/_next/static/` de este archivo real (abajo, sección 4) tiene ese `add_header Cache-Control` sin volver a incluir `security-headers.conf`, así que esa ruta específica no lleva los headers de seguridad. La plantilla nueva para servidores dockerizados ya lo corrige; este archivo real de `servertest` no se toca (se va a dar de baja).

### Topología de nombres/IPs — confirmada por el usuario (29/08/2026)

Este servidor (el actual, `servertest`) sigue siendo `desarrollo.felcn.gob.bo` / `172.16.76.20` **de forma temporal**: es el servidor "dev" histórico, y se dará de baja (junto con esta IP) una vez que los servidores nuevos de abajo estén operativos. No hay que reutilizar `desarrollo.felcn.gob.bo` como nombre definitivo en ningún documento de instalación nueva.

Los nombres definitivos, cada uno para un **servidor físico/virtual distinto y todavía no aprovisionado**:

| Nombre | IP objetivo | Servidor | Estado |
|---|---|---|---|
| `desarrollo.felcn.gob.bo` | `172.16.76.20` (este host) | `servertest` actual | Vigente hoy — **a eliminar** cuando `sunesis-dev` esté operativo |
| `sunesis-dev.felcn.gob.bo` | `172.16.76.23` | servidor dev nuevo | ✅ **Aprovisionado y operativo (31/08/2026)** — nginx dockerizado, certificado Let's Encrypt real emitido, login real funcionando. Ver [docs/bitacora-sunesis-dev-23.md](./bitacora-sunesis-dev-23.md) para el detalle completo de la instalación real. |
| `sunesis-staging.felcn.gob.bo` | `172.16.76.24` | servidor staging nuevo | **Pendiente de aprovisionar** (staging ya se sacó de este host el 21/08/2026, pero el servidor `.24` con ese nombre aún no existe) |

**Hallazgo de la verificación técnica (29/08/2026, antes de esta confirmación):** hoy, resolviendo contra DNS público, `desarrollo.felcn.gob.bo`, `sunesis-dev.felcn.gob.bo` y `sunesis-staging.felcn.gob.bo` devuelven los tres la misma IP pública (`186.121.212.123`, NAT hacia este host `.20`). Esto es **esperado mientras `.23`/`.24` no existan** — no es un error de configuración, es simplemente que los registros DNS de `sunesis-dev`/`sunesis-staging` todavía no se actualizaron para apuntar a los servidores nuevos. Acción pendiente para quien administra DNS: al aprovisionar cada servidor nuevo, repuntar su nombre a la IP interna correspondiente (`.23`/`.24`) y, en su momento, dar de baja el registro de `desarrollo.felcn.gob.bo` junto con este host.

## 2. TLS

- Certificado Let's Encrypt para `desarrollo.felcn.gob.bo` y `www.desarrollo.felcn.gob.bo`.
- Renovación vía `certbot` 4.0.0 + plugin `python3-certbot-nginx`, con su propio timer de systemd (no un cron manual) — confirmar con `systemctl list-timers | grep certbot`.
- **mTLS opcional**: `ssl_verify_client optional` con `ssl_client_certificate` apuntando a `/srv/interop/deploy/certs/vault-ca-chain.crt` — esta CA la emite el Vault del proyecto `/srv/interop` (independiente de este repo). Esto es un hecho de configuración de este nginx, no documentación de ese otro proyecto.

## 3. Upstreams (backends que nginx conoce)

> Actualizado 21/08/2026: se sacaron los upstreams de staging (`backend_v2_staging`, `backend_auth_staging`, `frontend_staging`) y de `consulta_persona` — staging se sacó de este servidor por completo (ver [02-entorno-docker-dev.md](./02-entorno-docker-dev.md)) y `consulta-persona-api`/`consulta-persona-redis` quedaron sin referencia en la documentación (los contenedores se detuvieron, el código sigue en el repo). No existe (ni existió en este archivo real) ningún upstream para `fake-ciudadania-api` — confirmado sin uso, ver [00-arquitectura.md](./00-arquitectura.md).

```nginx
upstream hub_gateway        { server 127.0.0.1:8088; }   # proyecto /srv/interop
upstream backend_v2         { server 127.0.0.1:3015; }   # base-backend-v2 (dev)
upstream backend_auth       { server 127.0.0.1:3016; }   # auth-backend (dev)
upstream frontend           { server 127.0.0.1:3017; }   # base-frontend (dev)
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
| `/felcn/api/whatsapp`, `/dev/api/whatsapp` | `backend_auth` | webhook Meta Cloud API (WhatsApp) — ruta expuesta pero canal no operativo, ver [04-variables-de-entorno.md](./04-variables-de-entorno.md) |
| `/login/ciudadania` | `frontend` | callback OIDC Ciudadanía Digital real (AGETIC); `redirect_uri` registrado ante AGETIC apunta a la raíz de este dominio |
| `/socket.io/` | `backend_v2` | WebSockets, `proxy_read_timeout 86400`, sin buffering |
| `/_next/static/` | `frontend` | assets inmutables, sin rate limit, cache 1 año |

No hay ninguna ruta `/staging/*` ni `/ciudadania/`, `/interaction/`, `/dev/login/ciudadania` en el archivo real — si aparecen en una versión vieja de este documento (o en una copia local desactualizada), son incorrectas.

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
