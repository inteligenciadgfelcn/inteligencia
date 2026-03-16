# Fase 1 — Migración felcn_s2i.sql e Infraestructura Base

> **Estado:** Completada
> **Rama:** `feat/backend/fase1/apis-parametricas`
> **Fecha:** 2026-02-27

---

## Contexto

Se integró la estructura de base de datos definida en `database/scripts/felcn_s2i.sql` al proyecto NestJS existente. El objetivo fue incorporar la jerarquía organizacional FELCN (Grados, Unidades, Distritales, Grupos) sin romper la arquitectura actual de autenticación/autorización basada en Casbin + JWT.

---

## Decisiones de diseño

### Schema separado `felcn_estructura`

Las tablas organizacionales se crearon en un schema PostgreSQL dedicado para mantener separación de responsabilidades:

| Schema | Contenido |
|---|---|
| `usuarios` | usuarios, personas, roles, módulos, casbin_rule, sesiones, auditoria |
| `parametricas` | parámetros del sistema |
| `felcn_estructura` | grados, unidades, distritales, grupos |

Variable de entorno nueva: `DB_SCHEMA_FELCN=felcn_estructura`

### Mapeo felcn_s2i.sql → Proyecto

| Tabla felcn | Implementación en proyecto |
|---|---|
| `grado` | Entity `Grado` → `felcn_estructura.grados` |
| `unidad` | Entity `Unidad` → `felcn_estructura.unidades` |
| `distrital` | Entity `Distrital` → `felcn_estructura.distritales` |
| `grupo` | Entity `Grupo` → `felcn_estructura.grupos` |
| `menu` / `menu_hijo` | Ya cubierto por entity `Modulo` (jerárquico con `idModulo` padre) |
| `formulario` (rol→url) | Cubierto por políticas Casbin (`v0=rol, v1=url, v2=accion`) |
| `activacion_usuario` | Campo `codigoActivacion` en `Usuario` (ya existía) |
| `auditoria_cambio` | Entity `AuditoriaCambio` → `usuarios.auditoria_cambio` |
| `fn_validar_usuario` | Lógica en `AuthenticationService` (ya existía) |

### Extensión de la entidad Usuario

Se agregaron los siguientes campos a `usuarios.usuarios`:

```typescript
nombreApp          VARCHAR(200)   // grado + nombre para mostrar en UI
telefonoCelular    VARCHAR(20)    // teléfono personal
telefonoCorporativo VARCHAR(20)   // teléfono institucional
idGrado            INTEGER FK     // → felcn_estructura.grados
idGrupoOrganizacional INTEGER FK  // → felcn_estructura.grupos
```

> **Nota:** Se usó `idGrupoOrganizacional` (no `idGrupo`) para no colisionar con el concepto de grupo de roles ya existente en la entidad.

---

## Archivos creados

### Módulo `estructura` (`src/core/estructura/`)

```
estructura/
├── constant/index.ts                  ← estados por entidad
├── entity/
│   ├── grado.entity.ts
│   ├── unidad.entity.ts
│   ├── distrital.entity.ts
│   └── grupo.entity.ts
├── dto/
│   ├── grado.dto.ts
│   ├── unidad.dto.ts
│   ├── distrital.dto.ts
│   └── grupo.dto.ts
├── repository/
│   ├── grado.repository.ts
│   ├── unidad.repository.ts
│   ├── distrital.repository.ts
│   └── grupo.repository.ts
├── service/
│   ├── grado.service.ts
│   ├── unidad.service.ts
│   ├── distrital.service.ts
│   └── grupo.service.ts
├── controller/
│   ├── grado.controller.ts
│   ├── unidad.controller.ts
│   ├── distrital.controller.ts
│   └── grupo.controller.ts
└── estructura.module.ts
```

### Módulo `auditoria` (`src/core/auditoria/`)

```
auditoria/
├── constant/index.ts                  ← enums MetodoAutenticacion, AccionAuditoria, MotivoFalloLogin
├── entity/
│   ├── bitacora-login.entity.ts       ← registro de intentos de login
│   └── auditoria-cambio.entity.ts     ← cambios en tablas críticas
├── repository/
│   ├── bitacora-login.repository.ts
│   └── auditoria-cambio.repository.ts
├── service/
│   └── auditoria.service.ts           ← exportado para uso en AuthenticationService
├── controller/
│   └── auditoria.controller.ts
└── auditoria.module.ts
```

### Migrations (`database/migrations/`)

| Archivo | Descripción |
|---|---|
| `1709000001000-CreateFelcnEstructura.ts` | Schema `felcn_estructura` + tablas grados/unidades/distritales/grupos |
| `1709000002000-ExtendUsuarioFelcn.ts` | Nuevos campos en `usuarios.usuarios` + FKs |
| `1709000003000-CreateAuditoria.ts` | Tablas `bitacora_login` y `auditoria_cambio` en schema `usuarios` |

### Seeds (`database/seeds/`)

| Archivo | Descripción |
|---|---|
| `1709000001-grados.ts` | 12 grados militares/policiales de la jerarquía policial boliviana |

---

## Endpoints nuevos

### Estructura organizacional

```
GET    /api/estructura/grados/listado          ← activos, para selects
GET    /api/estructura/grados                  ← todos, paginado
POST   /api/estructura/grados
PATCH  /api/estructura/grados/:id
PATCH  /api/estructura/grados/:id/activacion
PATCH  /api/estructura/grados/:id/inactivacion

GET    /api/estructura/unidades/listado
GET    /api/estructura/unidades
POST   /api/estructura/unidades
PATCH  /api/estructura/unidades/:id
PATCH  /api/estructura/unidades/:id/activacion|inactivacion

GET    /api/estructura/distritales/listado?idUnidad=1
GET    /api/estructura/distritales
POST   /api/estructura/distritales
PATCH  /api/estructura/distritales/:id
PATCH  /api/estructura/distritales/:id/activacion|inactivacion

GET    /api/estructura/grupos/listado?idDistrital=1
GET    /api/estructura/grupos
POST   /api/estructura/grupos
PATCH  /api/estructura/grupos/:id
PATCH  /api/estructura/grupos/:id/activacion|inactivacion
```

### Auditoría (solo ADMINISTRADOR)

```
GET  /api/auditoria/login
GET  /api/auditoria/login/usuario/:idUsuario?limite=20
GET  /api/auditoria/cambios?tabla=usuarios
```

---

## Pasos para ejecutar la Fase 1

```bash
# 1. Agregar variable al .env
echo "DB_SCHEMA_FELCN=felcn_estructura" >> .env

# 2. Ejecutar migrations
npm run migrations:run

# 3. Ejecutar seed de grados
npm run seeds:run

# 4. Registrar políticas Casbin para los nuevos endpoints
# (agregar en el seed de casbin o via API /api/autorizacion/politicas)
```

---

## Políticas Casbin necesarias (Fase 1)

Agregar al seed `insert-casbin-rules.ts` o via API:

```typescript
// Estructura - backend
{ ptype: 'p', v0: 'ADMINISTRADOR', v1: '/api/estructura/*', v2: '(GET|POST|PATCH)', v3: 'backend' }
{ ptype: 'p', v0: 'TECNICO',       v1: '/api/estructura/*/listado', v2: 'GET', v3: 'backend' }

// Auditoría - solo ADMINISTRADOR
{ ptype: 'p', v0: 'ADMINISTRADOR', v1: '/api/auditoria/*', v2: 'GET', v3: 'backend' }
```

---

## Pendiente de integración (Fase 2+)

- Integrar `AuditoriaService.registrarLogin()` en `AuthenticationService` para poblar `bitacora_login` automáticamente en cada intento de login.
- Agregar `AuditoriaService.registrarCambio()` en operaciones críticas (crear/modificar usuario, cambiar contraseña).
