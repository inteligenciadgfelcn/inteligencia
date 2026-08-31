# 14 — Registro de imágenes (Docker Registry)

Cómo viajan las imágenes de la aplicación entre servidores: se buildean **una sola vez**, en dev, y de ahí en adelante staging y producción solo las descargan — nunca clonan el código fuente ni corren `docker build`. Esto es lo que garantiza que lo que corre en cada ambiente es exactamente el mismo artefacto, no una reconstrucción distinta por servidor.

## 0. ⚠️ No confundir con las imágenes locales del dev

**Hallazgo real (31/08/2026, `sunesis-dev.felcn.gob.bo`), fácil de confundir:** este documento describe un mecanismo **completamente separado** de las imágenes que corren en el propio servidor dev. `docker compose up -d --build` (ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 8) construye imágenes locales (`development-base-auth`, etc.) que sirven la app de ese mismo servidor — **build-and-push.sh no las toca, ni al revés**. Correr `build-and-push.sh` y ver "Build y push completos" no actualiza lo que corre en `.23`; para eso hace falta el `docker compose up -d --build` de siempre, aparte. Son dos artefactos de build distintos desde el mismo código fuente: uno para el dev local, otro para que otros ambientes lo bajen.

## 1. Qué es y dónde vive

**Docker Registry OSS simple (`registry:2`), no Harbor** — decisión del 29/08/2026: se priorizó el mínimo mantenimiento sobre features como RBAC o escaneo de vulnerabilidades (Trivy), que Harbor sí trae pero que implican correr varios contenedores más (core, jobservice, su propia base de datos y Redis).

Corre **solo en el servidor dev nuevo** (`sunesis-dev.felcn.gob.bo`, `.23`) — es el único servidor donde se buildea código. Staging (`.24`) y producción nunca lo levantan, solo hacen `pull` contra él. Archivos en [deploy/tools/registry/](../deploy/tools/registry/), **probados de punta a punta de verdad contra el servidor real** (31/08/2026): build → push → borrado local → pull, con las 3 imágenes reales, dominio y TLS reales.

## 2. Levantarlo (una sola vez, en `.23`)

```bash
cd deploy/tools/registry
bash crear-htpasswd.sh <usuario>   # pide la contraseña por teclado, no queda en el historial
docker compose -f docker-compose.registry.yml up -d
```

### Exponerlo por HTTPS — dos formas, elegir según si conseguir DNS nuevo es fácil o no

**Opción por defecto (recomendada, la que se usó en la práctica en `.23`): por path (`/v2/`), sin subdominio nuevo.** Conseguir un registro DNS nuevo (`registry.<dominio>`) es un trámite externo con quien administra DNS, no algo que se resuelve desde el servidor — la alternativa lo evita del todo. Se agrega un `location /v2/` al server block **que ya está activo** para el dominio principal, reutilizando su mismo certificado:

```nginx
# Insertar dentro del <dominio>.conf ya activo (antes de `location = /health {`):
location /v2/ {
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
```
```bash
docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload
```

Es la única opción posible si el servidor todavía no tiene dominio (solo IP) — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 0, variante servidor de prueba.

**Opción alternativa: subdominio propio** (`registry.sunesis-dev.felcn.gob.bo`, plantilla `deploy/tools/nginx/conf.d/registry.conf.template`) — requiere el nuevo registro DNS, y su propio certificado Let's Encrypt (mismo flujo de la Fase 4 de `07-servidor-nuevo-desde-cero.md`). Más prolija si conseguir el subdominio no es una fricción real.

Para agregar más usuarios más adelante, correr `crear-htpasswd.sh <usuario>` de nuevo (agrega, no reemplaza) y reiniciar el contenedor `registry` para que tome el archivo actualizado.

### UI para navegar repos/tags (opcional)

`registry:2` no trae ninguna interfaz web propia. `joxit/docker-registry-ui` la agrega, pero sirve sus assets con rutas absolutas — **no soporta ir integrada como sub-path** del dominio principal. La solución real y probada es un puerto dedicado con HTTPS propio (reutilizando el mismo certificado), no HTTP plano ni un path — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 5b para la config completa. Restringir el acceso a la red interna (`ufw allow from <red-interna> to any port 8081`) — es una herramienta de administración, no necesita estar abierta a todo internet.

## 3. Build y push (desde cualquier máquina, no solo desde `.23`)

```bash
docker login <dominio-o-ip-del-registry> -u <usuario>
REGISTRY_HOST=<dominio-o-ip> bash deploy/tools/registry/build-and-push.sh <tag>
```

**No hace falta estar parado en el servidor dev** — esto corre igual desde la laptop de cualquier developer, siempre que tenga: Docker instalado, el repo clonado (`git clone` + la rama correspondiente) y red hacia el registry. `.23` es simplemente el lugar más cómodo para hacerlo (ya tiene el código y Docker), no un requisito técnico. Las credenciales del `docker login` son las mismas de `crear-htpasswd.sh` (§2).

**Versionado: usar tags semánticos reales** (`1.0.0`, `1.0.1`, ...) — decisión del 31/08/2026, reemplaza el short-SHA por defecto del script (`git rev-parse --short HEAD`), más legible para saber qué versión corre en cada ambiente sin tener que cruzar contra el historial de git.

### ⚠️ "Hairpin NAT" al pushear desde el mismo servidor que hostea el registry

**Hallazgo real (31/08/2026, `sunesis-dev.felcn.gob.bo`):** si el `build-and-push.sh` corre en el mismo servidor que aloja el registry, apuntando a su propio dominio público, el tráfico sale a internet y vuelve a entrar por la misma IP — con imágenes grandes (`felcn-base-backend`, que incluye Chromium para Puppeteer, ~1.8GB) esto puede producir `TLS handshake timeout` intermitente en algunos blobs, más frecuente cuantas más capas haya que revisar. Las imágenes más chicas (`auth-backend`, `frontend`) tienen menos blobs y no siempre pegan en el hueco, lo que hace que el error parezca aleatorio si no se sabe qué buscar.

**Fix:** hacer que el servidor se resuelva a sí mismo directo, sin salir a internet:

```bash
echo "127.0.0.1 <dominio>" | sudo tee -a /etc/hosts
```

Esto solo afecta cómo *ese servidor* se ve a sí mismo — no cambia nada para usuarios/servidores reales entrando desde afuera, que siguen resolviendo por DNS público normal. Si el `docker login` se hizo *antes* de este fix y falló en silencio por el mismo motivo, hay que repetirlo después de agregar la entrada a `/etc/hosts` (un intento de push fallará con `no basic auth credentials` si el login nunca llegó a completarse de verdad).

## 4. Prueba de humo (opcional, antes de ir a un servidor real)

Para confirmar que el push de arriba realmente llegó al registry, sin necesitar un servidor de staging/producción ya armado: bajar la imagen recién subida y correrla suelta, con otro nombre, en la misma máquina desde la que se hizo el build.

```bash
docker pull <dominio-o-ip>/felcn-auth-backend:<tag>
docker run --rm --name auth-backend-smoketest -p 14000:4000 <dominio-o-ip>/felcn-auth-backend:<tag>
# Ctrl+C para pararlo, después:
docker rm -f auth-backend-smoketest 2>/dev/null
```

Esto **no es un despliegue real** — el contenedor no tiene la red `felcn-network`, no ve a Postgres ni al resto de las apps, va a arrancar y probablemente fallar al conectar a la base (eso es esperable). Lo único que confirma es que la imagen se subió bien y se puede volver a bajar.

**Prueba real y completa, ya confirmada (31/08/2026):** borrar las 3 imágenes locales y volver a bajarlas del registry, verificando que Docker haga una descarga real (`Pull complete` por capa) en vez de `Image is up to date`:

```bash
docker rmi <dominio-o-ip>/felcn-auth-backend:<tag> <dominio-o-ip>/felcn-base-backend:<tag> <dominio-o-ip>/felcn-base-frontend:<tag>
docker images | grep <dominio-o-ip>   # debe devolver vacío

docker pull <dominio-o-ip>/felcn-auth-backend:<tag>
docker pull <dominio-o-ip>/felcn-base-backend:<tag>
docker pull <dominio-o-ip>/felcn-base-frontend:<tag>
```

## 5. Pull y deploy (staging, producción)

```bash
bash deploy/tools/registry/pull-and-deploy.sh <tag>
```

Corre en el servidor destino, parado junto a su `docker-compose.yml` (basado en [deploy/staging/docker-compose.yml](../deploy/staging/docker-compose.yml) o [deploy/production/docker-compose.yml](../deploy/production/docker-compose.yml) según el servidor, que ya referencian `<registry>/felcn-<imagen>:${TAG}` en vez de `build:`). El script exporta `TAG` y corre `docker compose pull` + `docker compose up -d` — nunca `--build`, nunca clona el repo.

## 6. TLS — confirmado real de punta a punta

Probado real el 31/08/2026 contra `sunesis-dev.felcn.gob.bo` (dominio y DNS reales, no un registry aislado de prueba): certificado Let's Encrypt real, `docker login`/`push`/`pull` funcionando sin ninguna configuración de "registry inseguro" en el Docker daemon — a diferencia de un servidor solo por IP (certificado autofirmado), donde sí hace falta agregar el dominio/IP a `insecure-registries` en `/etc/docker/daemon.json` y reiniciar el daemon (ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md), variante de servidor de prueba).

## 7. Fuera de alcance

- `/srv/interop` (mTLS, `partner-locations.conf`) — no tiene relación con el registry, no se toca acá.
- CI/CD automatizado (push automático desde un pipeline) — hoy es 100% manual vía los scripts de arriba. Los `.gitlab-ci.yml`/`.gitlab/k8s-*.yml` legados de AGETIC que existían en los 3 proyectos se eliminaron (29/08/2026, confirmado sin push a ningún registry ni uso activo) — no son la base de nada de esto.
