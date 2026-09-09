# Recuperación — fix schema unidad/distrital/grupo (2026-07-30)

## Contexto

Antes de este cambio, 5 archivos de `src/application/sunesis/siii/` usaban SQL
crudo apuntando a `public.unidad` / `public.distrital` / `public.grupo` (tablas
locales de `felcn_siii`, desactualizadas — 36/76 distritales, 90/169 grupos
respecto al catálogo real) en vez de `auth_fdw.unidad` / `auth_fdw.distrital` /
`auth_fdw.grupo` (foreign tables vía FDW que sí reflejan el catálogo vivo de
`auth-backend`), que es lo que ya usan las entidades TypeORM (`Unidad`,
`Distrital`, `Grupo`, `Grado`).

Verificado con datos reales antes del cambio: de una muestra de `asignacion`,
solo 6/10 filas hacían match contra `public.distrital`/`public.grupo`; contra
`auth_fdw` hicieron match 10/10. El bug causaba descripciones NULL / filas
descartadas en reportes para IDs nuevos (> 36 en distrital, > 90 en grupo).

Commit HEAD antes del cambio: `ab01218d558ab7134b03fff23b9043c68a1643e5`
(rama `develop`).

## Qué contiene este backup

- `codigo/` — copia exacta (pre-cambio) de los 6 archivos tocados, con la
  misma ruta relativa al repo:
  - `src/application/sunesis/siii/asignacion/repository/asignacion-siii.repository.ts`
  - `src/application/sunesis/siii/investigacion/paralelo/repository/investigacion.repository.ts`
  - `src/application/sunesis/siii/reportes/cuadros/cuadros.repository.ts`
  - `src/application/sunesis/siii/reportes/cruzados/cruzados.repository.ts`
  - `src/application/sunesis/siii/seguimiento/asignaciones/repository/asignaciones-ingreso.repository.ts`
  - `src/application/sunesis/siii/reportes/cruzados/interfaces/consulta-avanzada-filtro.interface.ts`
- `felcn_siii_pre-fix-20260730-224212.sql.gz` — `pg_dump` completo de la base
  `felcn_siii` (1.6 MB, 114 tablas, verificado con `gzip -t` y muestra de
  contenido). Este cambio NO modifica la base de datos (solo SQL en código),
  así que este dump es una foto de referencia, no algo que se necesite
  restaurar por el cambio en sí — es por si algo sale mal al validar contra
  la BD real durante la migración.

## Cómo recuperar el código (rollback rápido)

**Opción A — si el cambio aún no se commiteó:**
```bash
cd /srv/inteligencia/backend/felcn-base-backend
git checkout -- src/application/sunesis/siii/asignacion/repository/asignacion-siii.repository.ts \
  src/application/sunesis/siii/investigacion/paralelo/repository/investigacion.repository.ts \
  src/application/sunesis/siii/reportes/cuadros/cuadros.repository.ts \
  src/application/sunesis/siii/reportes/cruzados/cruzados.repository.ts \
  src/application/sunesis/siii/seguimiento/asignaciones/repository/asignaciones-ingreso.repository.ts \
  src/application/sunesis/siii/reportes/cruzados/interfaces/consulta-avanzada-filtro.interface.ts
```

**Opción B — si ya se commiteó, usando este backup directamente (no depende de git):**
```bash
cd /srv/inteligencia/backend/felcn-base-backend
cp -r backups/2026-07-30-fix-schema-unidad-distrital-grupo/codigo/src/* src/
```

**Opción C — volver al commit exacto anterior:**
```bash
git checkout ab01218d558ab7134b03fff23b9043c68a1643e5 -- src/application/sunesis/siii/
```

## Cómo recuperar la base de datos (solo si hiciera falta)

```bash
cd /srv/inteligencia/backend/felcn-base-backend
export PGPASSWORD=$(grep '^DB_SIII_PASSWORD=' .env | cut -d= -f2-)

# ADVERTENCIA: esto reemplaza la base felcn_siii completa. No ejecutar sin
# confirmar con el equipo — perdería cualquier dato escrito después del
# 2026-07-30 22:42.
psql -h 172.18.0.1 -p 5432 -U postgres -c "DROP DATABASE IF EXISTS felcn_siii;"
psql -h 172.18.0.1 -p 5432 -U postgres -c "CREATE DATABASE felcn_siii ENCODING 'UTF-8';"
zcat backups/2026-07-30-fix-schema-unidad-distrital-grupo/felcn_siii_pre-fix-20260730-224212.sql.gz \
  | psql -h 172.18.0.1 -p 5432 -U postgres -d felcn_siii
```

## Qué cambia (referencia)

En los 5 repositorios: `public.unidad` → `auth_fdw.unidad`, `public.distrital`
→ `auth_fdw.distrital`, `public.grupo` → `auth_fdw.grupo`, y las condiciones
de join del lado de la tabla catálogo (`x.id_unidad`/`id_distrital`/`id_grupo`
como PK) pasan a `x.id` (PK genérica de las foreign tables). Las columnas FK
del lado de `asignacion`/`operativo`/`distrital`/`grupo` no cambian porque ya
coinciden con `auth_fdw`. En la interfaz solo se corrige un comentario de
`@ApiProperty`.
