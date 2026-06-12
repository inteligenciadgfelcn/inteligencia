# Propuesta de Infraestructura
## Sistema Nacional de Inteligencia FELCN — Fase 1

**Versión:** 1.1  
**Fecha:** 2026-06-11  
**Referencia TDR:** Producto 1, 2 y 3 — BOLEU1 / UNODC

---

## 1. Contexto y alcance de esta propuesta

El TDR establece explícitamente los siguientes requerimientos de infraestructura:

- **Configuración e instalación en el Servidor de Aplicaciones y Bases de Datos** *(TDR §Producto 2, medidas de seguridad técnicas)*
- **Versionado del código con Git y del producto en Docker Hub** *(desarrollo/producción)* *(TDR §Alcance)*
- **Configuración de CI/CD** *(Integración continua, entrega continua y despliegue continuo)* *(TDR §Alcance)*
- **Sistema validado para Windows y Linux** *(TDR §Producto 3)*
- **Entrega de versión funcional en entorno de pruebas** *(TDR §Producto 2)*
- **Implementación definitiva en entorno operativo** *(TDR §Producto 3)*

Esta propuesta cubre exactamente esos requerimientos organizados en **tres entornos: DEV, Staging y Producción**.

---

## 2. Arquitectura base

### DEV y Staging — 1 servidor por entorno

```
Internet / Red Institucional
        │
        ▼
   [UFW Firewall]
    puerto 80/443
        │
      [Nginx]        ← Proxy inverso + SSL (Let's Encrypt)
        │
   ┌────┴──────────────────────────┐
   │     Red Docker interna        │
   │  ┌─────────────────────────┐  │
   │  │  base-frontend          │  │  ← Next.js / Vue.js  :3017
   │  │  base-backend-v2        │  │  ← NestJS API        :3015
   │  │  auth-backend           │  │  ← Auth + JWT        :3016
   │  └─────────────────────────┘  │
   └───────────────────────────────┘
        │
   [PostgreSQL]
   Solo accesible por localhost
   Puerto 5432 NUNCA expuesto a internet
```

### Producción — 2 servidores (App separado de BD)

En producción se recomienda separar el servidor de aplicaciones del servidor de base de datos. Al ser servidores virtuales, cada uno puede expandirse en almacenamiento o recursos de forma independiente sin afectar al otro.

```
Internet / Red Institucional
        │
        ▼
   ┌────────────────────────────┐         ┌──────────────────────────┐
   │      srv-prod-app          │         │      srv-prod-db          │
   │                            │         │                           │
   │  [UFW: 80/443]             │         │  [UFW: 5432 solo red priv]│
   │  [Nginx + SSL]             │ Red     │                           │
   │  [Docker Compose]          │◄───────►│  [PostgreSQL 16]          │
   │   ├── base-frontend        │ privada │  Solo accesible desde     │
   │   ├── base-backend-v2      │         │  srv-prod-app             │
   │   └── auth-backend         │         │                           │
   └────────────────────────────┘         └──────────────────────────┘
```

**Trabajo técnico adicional de esta separación:** mínimo y puntual — editar `pg_hba.conf` para aceptar conexiones desde la IP privada del servidor de aplicaciones, ajustar el firewall para abrir el 5432 solo entre ambos servidores, y cambiar `DB_HOST=localhost` por la IP privada en los archivos `.env`. No implica cambios en el código de la aplicación.

---

## 3. Tres entornos

### 3.1 Resumen general

| Atributo             | DEV                          | Staging                      | Producción                   |
|----------------------|------------------------------|------------------------------|------------------------------|
| **Propósito**        | Desarrollo activo, pruebas   | Pre-producción, validación   | Operación institucional      |
| **Rama Git**         | `develop`                    | `release/*` o `staging`      | `main`                       |
| **Dominio**          | `desarrollo.felcn.gob.bo`    | `staging.felcn.gob.bo`       | `[dominio-produccion]`       |
| **Imágenes Docker**  | `:dev-latest` o `:dev-HASH`  | `:staging-HASH`              | `:v1.x.x` (tag semver)       |
| **Docker Hub**       | Rama `develop`               | Rama `staging`               | Tag de versión               |
| **Base de datos**    | `*_dev` (schemas separados)  | `*_staging`                  | `*_prod`                     |
| **SSL**              | Let's Encrypt                | Let's Encrypt                | Certificado institucional    |
| **Acceso**           | Equipo de desarrollo         | QA + cliente (FELCN/UNODC)   | Usuarios finales FELCN       |
| **Datos**            | Datos ficticios / sanitizados| Dump sanitizado de producción| Datos reales                 |
| **Servidores**       | 1                            | 1                            | 2 (app + bd separados)       |

---

### 3.2 Entorno DEV

**Función:** Plataforma de integración continua donde cada `push` a `develop` despliega automáticamente.

**Especificaciones del servidor:**

| Componente   | Mínimo         | Recomendado    |
|--------------|----------------|----------------|
| CPU          | 2 vCPU         | 4 vCPU         |
| RAM          | 4 GB           | 8 GB           |
| Disco OS     | 30 GB SSD      | 50 GB SSD      |
| Disco datos  | 50 GB SSD      | 100 GB SSD     |
| SO           | Debian 12/13   | Debian 13      |
| Red          | 100 Mbps       | 1 Gbps         |

**Stack instalado:**
- Nginx + Certbot (Let's Encrypt)
- Docker Engine + Docker Compose
- PostgreSQL 16 (local)
- Git, UFW, Fail2ban

**Política de despliegue:**
- CI/CD ejecuta `docker compose pull && docker compose up -d` automáticamente en cada merge a `develop`
- Las imágenes se etiquetan `:dev-{HASH_CORTO}`
- Los logs se conservan 7 días

---

### 3.3 Entorno Staging

**Función:** Espejo de producción. Aquí se valida cada entregable antes de presentarlo a FELCN/UNODC para aprobación de los Productos 1, 2 y 3.

**Especificaciones del servidor:**

| Componente   | Mínimo         | Recomendado    |
|--------------|----------------|----------------|
| CPU          | 2 vCPU         | 4 vCPU         |
| RAM          | 4 GB           | 8 GB           |
| Disco OS     | 30 GB SSD      | 50 GB SSD      |
| Disco datos  | 50 GB SSD      | 100 GB SSD     |
| SO           | Debian 12/13   | Debian 13      |
| Red          | 100 Mbps       | 1 Gbps         |

**Stack instalado:** Idéntico a DEV.

**Política de despliegue:**
- El despliegue es **manual y controlado**: solo el líder técnico promueve una versión a staging
- Las imágenes se etiquetan `:staging-{HASH}`
- Los datos son un dump sanitizado de producción (sin datos sensibles reales)
- Staging permanece congelado durante el período de revisión de cada Producto (10 días hábiles según TDR)

---

### 3.4 Entorno Producción

**Función:** Entorno operativo institucional de la FELCN. Se activa en la entrega del Producto 3 (día 150+).

#### Servidor de aplicaciones (`srv-prod-app`)

| Componente   | Mínimo         | Recomendado    |
|--------------|----------------|----------------|
| CPU          | 4 vCPU         | 8 vCPU         |
| RAM          | 8 GB           | 16 GB          |
| Disco OS     | 50 GB SSD      | 100 GB SSD     |
| SO           | Debian 12/13   | Debian 13      |
| Red          | 1 Gbps         | 1 Gbps         |

**Stack:** Nginx + Docker Compose (base-frontend, base-backend-v2, auth-backend). Sin PostgreSQL local.

#### Servidor de base de datos (`srv-prod-db`)

| Componente   | Mínimo         | Recomendado    |
|--------------|----------------|----------------|
| CPU          | 2 vCPU         | 4 vCPU         |
| RAM          | 4 GB           | 8 GB           |
| Disco OS     | 30 GB SSD      | 50 GB SSD      |
| Disco datos  | 200 GB SSD     | 500 GB SSD     |
| SO           | Debian 12/13   | Debian 13      |
| Red          | 1 Gbps         | 1 Gbps         |

**Stack:** Solo PostgreSQL 16. Sin Docker ni Nginx. El disco de datos puede expandirse de forma independiente conforme crezca la base de datos.

**Política de despliegue:**
- El despliegue es **manual con ventana de mantenimiento** (fuera de horario operativo)
- Las imágenes se etiquetan con versión semántica `:v1.0.0`, `:v1.1.0`, etc.
- Requiere aprobación documentada (QA note + conformidad del dueño de producto, según TDR §Alcance)
- Se mantiene la imagen previa disponible para rollback inmediato (`docker compose up -d` con tag anterior)

---

## 4. Versionado Docker Hub

Según el TDR, el código se versiona en Git y el producto en Docker Hub:

```
Docker Hub: felcn/[servicio]
  ├── :dev-abc1234       ← Build automático de develop
  ├── :staging-def5678   ← Promovido para validación
  ├── :v1.0.0            ← Producción Producto 1 (día 90)
  ├── :v1.1.0            ← Producción Producto 2 (día 150)
  └── :v1.2.0            ← Producción Producto 3 (día 200)
```

Los servicios versionados son:
- `felcn/base-backend-v2`
- `felcn/auth-backend`
- `felcn/base-frontend`

---

## 5. Pipeline CI/CD

El TDR exige configuración de CI/CD. Se implementa con **GitHub Actions** (repositorio ya en GitHub):

```
Push a develop
    │
    ├── [CI] Build y test unitarios
    ├── [CI] Build imagen Docker
    ├── [CI] Push a Docker Hub (:dev-HASH)
    └── [CD] Deploy automático a DEV
            │
            └── Merge a staging (manual)
                    │
                    ├── [CI] Build imagen
                    ├── [CI] Push a Docker Hub (:staging-HASH)
                    └── [CD] Deploy a Staging (manual)
                            │
                            └── Aprobación FELCN/UNODC
                                    │
                                    └── Tag v1.x.x
                                            │
                                            └── [CD] Deploy a Producción (manual)
```

**Archivo de configuración:** `.github/workflows/ci-cd.yml` en el repositorio.

---

## 6. Gestión de secretos por entorno

Cada entorno tiene su propio set de archivos `.env` almacenados en el servidor correspondiente bajo `/opt/felcn/secrets/` (fuera del repositorio Git, nunca versionados):

| Archivo          | Contenido                                               |
|------------------|---------------------------------------------------------|
| `.env.backend`   | DB connection string, JWT secret, API keys              |
| `.env.auth`      | AGETIC/Ciudadanía Digital credentials                   |
| `.env.frontend`  | URLs públicas del entorno                               |

Los valores difieren entre DEV (credenciales de prueba), Staging (credenciales de sandbox) y Producción (credenciales reales institucionales).

---

## 7. Resumen de servidores requeridos por el TDR

| # | Servidor           | Entorno    | Rol                                          |
|---|--------------------|------------|----------------------------------------------|
| 1 | `srv-dev`          | DEV        | App + BD en un servidor (Docker + PostgreSQL)|
| 2 | `srv-staging`      | Staging    | App + BD en un servidor (Docker + PostgreSQL)|
| 3 | `srv-prod-app`     | Producción | Aplicaciones (Nginx + Docker Compose)        |
| 4 | `srv-prod-db`      | Producción | Base de datos (PostgreSQL — dedicado)        |

**Total: 4 servidores Linux.**

---

---

# SECCIÓN ADICIONAL — Consideraciones fuera del TDR

> **AVISO IMPORTANTE:** Los elementos de esta sección **NO están contemplados en el TDR vigente (BOLEU1)**. Se presentan como recomendaciones técnicas para que la FELCN y UNODC evalúen su incorporación en una fase posterior o en una addenda al contrato. Implementarlas sin acuerdo previo comprometería tareas fuera del alcance contratado.

---

## A. Backups de base de datos

El TDR contempla la configuración e instalación de la base de datos y medidas de seguridad para la protección de la información, pero **no incluye explícitamente la configuración de rutinas de backup operativas**, lo que es responsabilidad de la División de Tecnología y Telemática de la FELCN tras la entrega.

**Configuración mínima recomendada para `srv-prod-db`:**

```bash
# Cron diario — /etc/cron.d/pg-backup
0 2 * * * postgres pg_dump -Fc [base] > /opt/backups/pg_$(date +%Y%m%d).dump
# Retención recomendada: 90 días en Producción
find /opt/backups/ -name "pg_*.dump" -mtime +90 -delete
```

Los dumps deben almacenarse en un volumen separado del disco del sistema operativo, o transferirse a almacenamiento externo.

---

## B. Balanceador de carga y API Gateway

**Por qué es necesario (futuro):** Si la carga de usuarios en producción supera la capacidad de un solo servidor de aplicaciones, se necesitaría escalar horizontalmente.

**Propuesta:**
- **Nginx** o **Traefik** como balanceador (L7) frente a múltiples instancias del backend
- **Kong** como gateway centralizado para gestionar rate limiting, autenticación y rutas hacia los microservicios

**Cuándo considerarlo:** Cuando el número de usuarios concurrentes supere los ~200 o el tiempo de respuesta promedio supere los 2 segundos en carga normal.

**Impacto en TDR:** No está contemplado. El TDR habla de microservicios pero no de alta disponibilidad horizontal. Introducirlo requeriría rediseño del despliegue.

---

## C. Resumen de infraestructura ampliada (recomendada post-TDR)

| # | Servidor              | Rol                                          | En TDR |
|---|-----------------------|----------------------------------------------|--------|
| 1 | `srv-dev`             | DEV: App + BD                                | ✅ Sí  |
| 2 | `srv-staging`         | Staging: App + BD                            | ✅ Sí  |
| 3 | `srv-prod-app`        | Producción: Aplicaciones                     | ✅ Sí  |
| 4 | `srv-prod-db`         | Producción: Base de datos dedicada           | ✅ Sí  |
| 5 | `srv-balanceador`     | Load balancer / API Gateway (escala futura)  | ❌ No  |

El servidor 5 es una recomendación para que la FELCN incorpore en su plan de sostenibilidad operativa tras la entrega del Producto 3.

---

*Documento generado como parte de la consultoría BOLEU1 — UNODC / DGFELCN.*  
*Versión 1.1 — sujeta a revisión por parte de la División de Tecnología y Telemática de la FELCN.*
