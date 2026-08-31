# ADR-0001 — Postgres, nginx y registry de imágenes dockerizados en servidores nuevos

**Estado:** Aceptado — verificado de punta a punta el 29/08/2026 (ver sección Verificación).

**Fecha:** 29/08/2026

## Contexto

Hasta esta decisión, `07-servidor-nuevo-desde-cero.md` documentaba que el servidor nuevo de staging (`sunesis-staging.felcn.gob.bo`, `.24`) iba a replicar exactamente el patrón de `servertest`/`desarrollo.felcn.gob.bo` (`.20`): PostgreSQL y nginx **instalados nativos en el host**, con solo las apps corriendo en Docker. Esa era una decisión explícita del 21/08/2026, tomada por continuidad con el servidor existente.

El usuario pidió revertir esa decisión para todos los servidores **nuevos** (dev `.23`, staging `.24`, producción futura): Postgres y nginx pasan a correr dockerizados, con sus propios scripts de configuración/inicio, más un registry de imágenes propio como único punto de transferencia entre servidores. La motivación explícita: que operar un servidor nuevo no requiera saber administrar Postgres o nginx a mano — solo migraciones de TypeORM para cambios de tabla, y editar un archivo de config + reload para un proxy reverso nuevo. `desarrollo.felcn.gob.bo` (`.20`) no se toca — sigue nativo hasta que se dé de baja (ver [../05-nginx-y-tls.md](../05-nginx-y-tls.md) §1).

## Decisión

1. **PostgreSQL dockerizado** (`postgres:17` — la versión real del servidor, no la 16 que decía la documentación anterior sin haberlo verificado). Init vía `docker-entrypoint-initdb.d` crea las 9 bases reales vacías; el schema completo llega restaurando un dump real (dev/staging) o corriendo migraciones sobre una base vacía (producción, mecanismo aún pendiente de decidir — ver "Fuera de alcance" abajo). Volumen nombrado independiente (`postgres_data`).
2. **nginx dockerizado** (`nginx:1.26-alpine`), config montada de solo lectura, sin la dependencia de `/srv/interop` (mTLS, `partner-locations.conf` — queda fuera de este trabajo). TLS vía un contenedor `certbot` sidecar en modo `certonly --webroot` (no el plugin `--nginx`, porque certbot corre en un contenedor aparte del de nginx), con volumen nombrado para los certificados. Renovación disparada por un timer de **systemd en el host**, no por un contenedor con `docker.sock` montado.
3. **Registry de imágenes**: Docker Registry OSS simple (`registry:2`), no Harbor — se descartó Harbor por ser un stack de varios componentes (core, jobservice, su propia BD y Redis) que agrega mantenimiento sin necesidad clara todavía; RBAC y escaneo de vulnerabilidades quedan fuera de alcance por ahora. Vive **solo en el servidor dev nuevo (`.23`)**, expuesto vía el nginx de ese mismo servidor con auth `htpasswd` (mismo patrón ya usado para `/docs/`). Staging y producción nunca construyen imágenes — solo hacen `pull`.
4. **Persistencia por servicio, con volúmenes nombrados independientes** (`postgres_data`, `certbot_certs`, `registry_data`): recrear, reiniciar o actualizar la imagen de un contenedor no toca el volumen de otro. Si Postgres o nginx mueren o se recrean, los datos siguen intactos.

## Alternativas consideradas

- **Mantener Postgres/nginx nativos** (statu quo, decisión del 21/08/2026): descartada — es justo lo que el usuario pidió revertir, porque exige que quien opere el servidor sepa administrar Postgres/nginx del sistema operativo, no solo Docker.
- **Harbor como registry**: descartada por ahora a favor de `registry:2` — menos piezas para mantener; se puede reconsiderar si en algún momento hace falta RBAC granular o escaneo de imágenes.
- **Renovación de TLS con un contenedor certbot + `docker.sock` montado** (deploy-hook automático dentro del propio contenedor): descartada — le da a un contenedor de renovación de certificados acceso de root efectivo al host vía el socket de Docker, superficie de ataque innecesaria dado el antecedente del incidente cryptominer de julio/2026 (RCE en `base-frontend`). Se prefirió un timer de systemd en el host, más una operación manual/auditable.

## Consecuencias

**Positivas:**
- Un servidor nuevo se levanta y opera sin necesitar administración nativa de Postgres/nginx — todo es `docker compose`.
- El registry es el único canal de imágenes hacia staging/producción: nunca corren `docker build` ni tienen el código fuente en disco, cumpliendo la regla existente de "código fuente solo en dev/staging".
- Al escribir/probar esta plantilla se corrigieron de paso varios hallazgos reales que estaban mal documentados o eran directamente bugs (ver "Hallazgos" en [../README.md](../README.md)): versión real de Postgres (17.11, no 16), dos nombres de base mal documentados, un bug de `add_header` en nginx, un bug de nombre de base en un script de backup, una variable de entorno muerta y 3 pipelines de CI/CD legados sin uso — todos corregidos o eliminados.

**Negativas / riesgos aceptados:**
- Un componente más para mantener por servidor (el propio motor de contenedores de Postgres/nginx), aunque a cambio de sacar la necesidad de parches de SO nativos para esos dos servicios.
- El registry sin Harbor no tiene escaneo de vulnerabilidades ni RBAC — aceptable mientras el único que empuja imágenes es el propio equipo de dev.

## Fuera de alcance (no resuelto por este ADR)

- **Mecanismo de inicialización de Postgres para producción "desde cero"** (migraciones TypeORM vs. backup+limpieza) — sigue sin decidir, ver memoria de proyecto `project_pendientes_bd_produccion_2026_08`. Dev/staging usan backup+restore manual mientras tanto.
- **`/srv/interop` (mTLS, `partner-locations.conf`)** — no se replica en los servidores nuevos; si hace falta, es una decisión y un documento aparte.
- **Emisión real de un certificado TLS** para `sunesis-dev.felcn.gob.bo`/`sunesis-staging.felcn.gob.bo` — no se pudo probar en esta ronda porque el DNS de esos dominios todavía no apunta a `.23`/`.24` (ver [../05-nginx-y-tls.md](../05-nginx-y-tls.md) §1). Se validó el mecanismo (`nginx -t`, proxy, rutas, rate-limit, headers) en HTTP plano contra contenedores reales, y el flujo de renovación con `certbot renew --staging`, pero no un `certonly` real contra Let's Encrypt producción. **Queda como el primer paso a confirmar en cuanto el DNS apunte al servidor real.**

## Verificación

Probado dos veces en `servertest`, sin tocar el stack en vivo (`desarrollo.felcn.gob.bo` siguió sirviendo tráfico real durante ambas pruebas):

1. **Prueba de mecanismo** (29/08/2026): Postgres — las 9 bases se crean correctamente, se restauró un dump real y `auth-backend` arrancó limpio contra él con queries reales funcionando; se mató y recreó el contenedor y los datos sobrevivieron por el volumen nombrado. Registry — roundtrip real build→push→pull→run con auth htpasswd, en un daemon Docker aislado. nginx — `nginx -t` válido, proxy/rutas/headers/rate-limit reales contra los contenedores de la app.
2. **Prueba de fidelidad de la documentación** (29/08/2026): se siguió `07-servidor-nuevo-desde-cero.md` (Fases 3/4/5b/6) y las plantillas (entonces en `docs/templates/`, movidas a `deploy/tools/` el 30/08/2026) **literalmente**, como lo haría alguien sin el contexto de esta conversación. Se encontraron y corrigieron 5 bugs reales de la documentación/plantillas (nombre de red inconsistente entre composes, archivos `.conf.template` nunca activados, archivos de certbot referenciados que el modo `webroot` no genera, variables de conexión a las otras 8 bases de `base-backend-v2` sin actualizar, falta de instrucción sobre el `.env` propio del compose). Ninguno requirió una decisión de diseño nueva — todos eran gaps mecánicos de la doc. Con las correcciones, el stack completo (registry, Postgres, nginx, 3 apps) levantó limpio siguiendo la documentación tal cual quedó escrita.

## Para implementar esto (handoff)

La documentación ejecutable — no este ADR — es la fuente de verdad paso a paso:

- **Qué seguir**: [../07-servidor-nuevo-desde-cero.md](../07-servidor-nuevo-desde-cero.md) Fases 3, 4, 5b y 6, en orden (la Fase 5 — instalar Docker — va antes de la 3 y la 4 en la ejecución real; el documento lo aclara explícitamente).
- **Qué copiar**: las carpetas `deploy/tools/postgres/`, `deploy/tools/nginx/`, `deploy/tools/registry/` y el archivo `deploy/staging/docker-compose.yml` (o `deploy/production/`), tal cual — ya están probadas, no hace falta reescribir nada desde cero.
- **Si algo de la doc no calza** con lo que realmente hace falta ejecutar en el servidor real (un comando que falla, una ruta que no existe, una variable que no aplica): es un bug de la documentación, no una señal para improvisar por fuera de ella. Corregirlo ahí mismo (el archivo `.md` bajo `docs/` o la plantilla bajo `deploy/`) para que quede capturado, con una nota de qué se probó y qué falló — mismo criterio que se usó para armar este ADR.
- **Qué NO asumir todavía**: que la emisión de TLS real funciona sin probarla (ver "Fuera de alcance"), y que el mecanismo de producción "desde cero" ya está decidido (no lo está).
- Este documento (el ADR) es el resumen de **por qué** se decidió así y **qué se descartó** — si en el futuro alguien propone volver a Postgres/nginx nativos, o cambiar a Harbor, este es el lugar para registrar esa reconsideración (ADR nuevo que referencie a este, no editar este archivo retroactivamente salvo para corregir un error de hecho).
