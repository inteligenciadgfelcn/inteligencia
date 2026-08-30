# 14 — Registro de imágenes (Docker Registry)

Cómo viajan las imágenes de la aplicación entre servidores: se buildean **una sola vez**, en dev, y de ahí en adelante staging y producción solo las descargan — nunca clonan el código fuente ni corren `docker build`. Esto es lo que garantiza que lo que corre en cada ambiente es exactamente el mismo artefacto, no una reconstrucción distinta por servidor.

## 1. Qué es y dónde vive

**Docker Registry OSS simple (`registry:2`), no Harbor** — decisión del 29/08/2026: se priorizó el mínimo mantenimiento sobre features como RBAC o escaneo de vulnerabilidades (Trivy), que Harbor sí trae pero que implican correr varios contenedores más (core, jobservice, su propia base de datos y Redis).

Corre **solo en el servidor dev nuevo** (`sunesis-dev.felcn.gob.bo`, `.23`) — es el único servidor donde se buildea código. Staging (`.24`) y producción nunca lo levantan, solo hacen `pull` contra él. Archivos en [docs/templates/registry/](./templates/registry/), probados de punta a punta antes de documentar esto (build real → push → pull desde un punto separado, con auth, sin tocar el stack real de `servertest`).

## 2. Levantarlo (una sola vez, en `.23`)

```bash
cd docs/templates/registry
bash crear-htpasswd.sh <usuario>   # pide la contraseña por teclado, no queda en el historial
docker compose -f docker-compose.registry.yml up -d
```

Se expone vía la instancia de nginx dockerizada de ese mismo servidor (ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 4), con TLS + la credencial `htpasswd` de arriba — plantilla en `docs/templates/nginx/conf.d/registry.conf.template`, dominio propuesto `registry.sunesis-dev.felcn.gob.bo` (**nuevo registro DNS a coordinar** con quien administra DNS, misma IP `.23`). El contenedor `registry` en sí **no publica ningún puerto al host** — solo es alcanzable a través de nginx, nunca directo.

Para agregar más usuarios más adelante, correr `crear-htpasswd.sh <usuario>` de nuevo (agrega, no reemplaza) y reiniciar el contenedor `registry` para que tome el archivo actualizado.

## 3. Build y push (desde cualquier máquina, no solo desde `.23`)

```bash
docker login registry.sunesis-dev.felcn.gob.bo   # una sola vez, credenciales quedan en ~/.docker/config.json
bash docs/templates/registry/build-and-push.sh [tag]
```

**No hace falta estar parado en el servidor dev** — esto corre igual desde la laptop de cualquier developer, siempre que tenga: Docker instalado, el repo clonado (`git clone` + la rama correspondiente) y red hacia `registry.sunesis-dev.felcn.gob.bo`. `.23` es simplemente el lugar más cómodo para hacerlo (ya tiene el código y Docker), no un requisito técnico. Las credenciales del `docker login` son las mismas de `crear-htpasswd.sh` (§2).

Sin argumento, `tag` es el short SHA del commit actual (`git rev-parse --short HEAD`) — así cada imagen queda trazable al commit exacto que la generó. El script buildea y pushea las 3 imágenes (`felcn-auth-backend`, `felcn-base-backend-v2`, `felcn-base-frontend`) parado en la raíz del repo.

## 4. Prueba de humo (opcional, antes de ir a un servidor real)

Para confirmar que el push de arriba realmente llegó al registry, sin necesitar un servidor de staging/producción ya armado: bajar la imagen recién subida y correrla suelta, con otro nombre, en la misma máquina desde la que se hizo el build.

```bash
docker pull registry.sunesis-dev.felcn.gob.bo/felcn-auth-backend:<tag>
docker run --rm --name auth-backend-smoketest -p 14000:4000 registry.sunesis-dev.felcn.gob.bo/felcn-auth-backend:<tag>
# Ctrl+C para pararlo, después:
docker rm -f auth-backend-smoketest 2>/dev/null
```

Esto **no es un despliegue real** — el contenedor no tiene la red `felcn-network`, no ve a Postgres ni al resto de las apps, va a arrancar y probablemente fallar al conectar a la base (eso es esperable). Lo único que confirma es que la imagen se subió bien y se puede volver a bajar — el roundtrip completo del registry. El despliegue real, con todas las dependencias, es la sección siguiente.

## 5. Pull y deploy (staging, producción)

```bash
bash docs/templates/registry/pull-and-deploy.sh <tag>
```

Corre en el servidor destino, parado junto a su `docker-compose.yml` (basado en [docs/templates/docker-compose.prod.yml](./templates/docker-compose.prod.yml), que ya referencia `registry.sunesis-dev.felcn.gob.bo/felcn-<imagen>:${TAG}` en vez de `build:`). El script exporta `TAG` y corre `docker compose pull` + `docker compose up -d` — nunca `--build`, nunca clona el repo.

## 6. TLS — límite honesto de lo probado hasta ahora

El roundtrip build→push→pull se probó de punta a punta el 29/08/2026, pero **contra un registry y un daemon Docker aislados** (un `docker:dind` privilegiado, separado del Docker real de `servertest`) para no tener que tocar la configuración TLS/`insecure-registries` del daemon del host compartido. La auth `htpasswd` se probó igual (401 sin credenciales, 200 con las correctas).

Lo que **no** se probó todavía: la emisión real de un certificado Let's Encrypt para `registry.sunesis-dev.felcn.gob.bo`, porque ese dominio no existe en DNS aún (apunta a `.23`, que no está aprovisionado) — sin eso, `docker login`/`push`/`pull` reales contra el dominio público van a fallar hasta que el certificado exista. Confirmar esto de verdad en cuanto el servidor `.23` y su DNS estén listos, antes de dar la Fase 5b de [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) por terminada.

## 7. Fuera de alcance

- `/srv/interop` (mTLS, `partner-locations.conf`) — no tiene relación con el registry, no se toca acá.
- CI/CD automatizado (push automático desde un pipeline) — hoy es 100% manual vía los scripts de arriba. Los `.gitlab-ci.yml`/`.gitlab/k8s-*.yml` legados de AGETIC que existían en los 3 proyectos se eliminaron (29/08/2026, confirmado sin push a ningún registry ni uso activo) — no son la base de nada de esto.
