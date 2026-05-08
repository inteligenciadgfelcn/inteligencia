# Runbook — Sistema FELCN
## Guía completa de despliegue desde cero

**Proyecto:** Sistema de Inteligencia FELCN  
**Repositorio:** `git@github.com:inteligenciadgfelcn/inteligencia.git`  
**Rama de producción:** `main` | **Rama de desarrollo:** `develop`

---

## Requisitos previos del lector

- Acceso SSH al servidor como usuario con sudo
- Clave pública SSH propia para registrar en el servidor
- Acceso a los archivos `.env` con credenciales reales (ver [08-secretos.md](08-secretos.md))
- Dominio apuntado al servidor (ver cada entorno abajo)

---

## Entornos

| Entorno     | Dominio                      | Rama      |
|-------------|------------------------------|-----------|
| Desarrollo  | `desarrollo.felcn.gob.bo`    | `develop` |
| Producción  | `[dominio-produccion]`       | `main`    |

---

## Secuencia de instalación

Seguir los pasos en orden. Cada documento es autónomo y puede consultarse individualmente.

| # | Documento | Qué cubre | Tiempo estimado |
|---|-----------|-----------|-----------------|
| 1 | [01-servidor-base.md](01-servidor-base.md) | Debian 13 limpio, usuario, dependencias | 20 min |
| 2 | [02-acceso-ssh.md](02-acceso-ssh.md) | Claves SSH, hardening, deploy key GitHub | 15 min |
| 3 | [03-seguridad.md](03-seguridad.md) | UFW, Fail2ban, actualizaciones | 15 min |
| 4 | [04-postgresql.md](04-postgresql.md) | PostgreSQL, bases de datos, schemas, restore | 30 min |
| 5 | [05-proyecto.md](05-proyecto.md) | Clonar repo, rama, archivos de entorno | 10 min |
| 6 | [06-docker.md](06-docker.md) | Docker Compose, build, despliegue | 20 min |
| 7 | [07-nginx-ssl.md](07-nginx-ssl.md) | Nginx, virtual host, certificado SSL | 15 min |
| 8 | [08-secretos.md](08-secretos.md) | Gestión segura de credenciales | Leer antes de empezar |
| 9 | [09-verificacion.md](09-verificacion.md) | Checklist de validación final | 10 min |

---

## Arquitectura del sistema

```
Internet
    │
    ▼
[UFW: 80/443]
    │
[Nginx]
    ├── /              → localhost:3017 (base-frontend)
    ├── /felcn/api     → localhost:3015 (base-backend-v2)
    └── /felcn/auth/api → localhost:3016 (auth-backend)
         │
    [Docker felcn-network]
         ├── base-backend-v2  :3015
         ├── auth-backend     :3016
         └── base-frontend    :3017
              │
         [PostgreSQL]
         Solo accesible por red interna/privada
         NUNCA exponer 5432 a internet
```

---

## Puertos del sistema

| Puerto | Servicio | Acceso externo |
|--------|----------|----------------|
| 22 | SSH | Sí (restringir a IPs conocidas en producción) |
| 80 | HTTP | Sí (redirige a HTTPS) |
| 443 | HTTPS | Sí |
| 3015 | Backend v2 | NO — solo localhost |
| 3016 | Auth backend | NO — solo localhost |
| 3017 | Frontend | NO — solo localhost |
| 5432 | PostgreSQL | NO — nunca exponer |

---

## Templates disponibles

En `/docs/templates/` se encuentran los archivos de configuración con placeholders:

- `docker-compose.yml` — orquestación de contenedores
- `env-backend-v2.template` — variables del backend principal
- `env-auth-backend.template` — variables del servicio de auth
- `env-frontend.template` — variables del frontend

Los archivos reales `.env` y `docker-compose.yml` están en `.gitignore` y **nunca se versionan**.

---

## Scripts de base de datos

En `/docs/scripts/db/`:

- `01-crear-usuarios.sql` — usuario de aplicación PostgreSQL
- `02-crear-bases.sql` — creación de todas las bases de datos
- `03-crear-schemas.sql` — schemas por base de datos
- `restore.sh` — script para restaurar desde dumps

---

## Contacto y soporte

Ante dudas sobre este runbook, contactar al equipo DevOps responsable del proyecto.
