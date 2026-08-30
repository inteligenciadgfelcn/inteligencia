# Análisis del módulo `/seguimientos`

Fecha: 2026-08-21

## 1. Ubicación en el sistema

| Componente | Ruta |
|---|---|
| Frontend (listado) | `frontend/felcn-base-frontend/src/app/seguimientos/page.tsx` |
| Frontend (detalle de un caso) | `frontend/felcn-base-frontend/src/app/seguimientos/[id]/page.tsx` → `FormSeguimiento.tsx` (tabs `casos` / `personas` / `bienes`) |
| Backend (controller) | `backend/felcn-base-backend/src/application/sunesis/siii/seguimiento/asignaciones/controller/asignaciones-ingreso.controller.ts` |
| Backend (service) | `.../asignaciones/service/asignaciones-ingreso.service.ts` |
| Backend (repository / SQL) | `.../asignaciones/repository/asignaciones-ingreso.repository.ts` |
| Base de datos | `felcn_siii` (tablas `asignacion`, `operativo`; vía FDW `auth_fdw.distrital` / `auth_fdw.grupo` / `auth_fdw.unidad` apuntando a `felcn_auth_v3`) |
| Origen legacy | `FRM-INF-ING.aspx.cs` (según comentario en el repository) |

## 2. Cómo se filtra la información

El listado principal de `/seguimientos` (tabs "Sin Registrar" y "Registrados") **filtra únicamente por `id_distrital`**, no por usuario ni por rol:

1. El frontend obtiene `idDistrital = usuario.grupo.distrital.id` del perfil del usuario autenticado (`AuthProvider`, dato que viene de `felcn-auth-backend`).
2. Ese valor se envía como query param a los 4 endpoints de `asignaciones-ingreso`.
3. El backend lo usa directo en `WHERE a.id_distrital = $1`, sin comparar contra el JWT.

**Hallazgo de seguridad:** el `JwtAuthGuard` solo valida que el token sea válido; no hay guard de autorización ni verificación de que el `idDistrital` recibido corresponda al del usuario del token. El JWT tampoco incluye `idDistrital`/`idGrupo`. En teoría, un usuario autenticado podría modificar el parámetro `idDistrital` en la request y consultar casos de otro distrital. Pendiente de mitigar.

## 3. Caso investigado: usuario JHENNY JIMENA sin seguimientos visibles

- Usuario `7080752` (JHENNY JIMENA LAURA LOPEZ, id=60 en `usuario.usuario`) pertenece al grupo **115 – "Sección Verificación y Seguimiento de Antecedentes"**, cuyo distrital es **51 – "División Información Antidrogas"** (unidad 22).
- En `felcn_siii.asignacion` **no existe ningún registro con `id_distrital = 51`**. Los únicos distritales con casos cargados son: 19 (La Paz, 6), 20 (Oruro, 5), 22 (Cochabamba, 1) y 54 (División Análisis Antidrogas, 6 — misma unidad 22, distrital hermano).
- **Causa raíz:** no es un bug de permisos ni un problema de su cuenta — no se han asignado/creado casos con `id_distrital = 51`. Como el filtro es estrictamente por distrital, cualquier usuario de ese distrital vería la lista vacía.
- **Pendiente de definir con negocio:** si a JHENNY JIMENA le corresponden casos de otro distrital (p. ej. el 54, misma unidad) habría que corregir su `id_grupo` en `usuario.usuario`; si le corresponden casos del distrital 51, hay que revisar por qué no se están generando registros de `asignacion` con ese distrital.

## 4. Tab "Sin Registrar"

Muestra casos de `felcn_siii.asignacion` que tienen un `operativo` vinculado pero **sin descripción cargada** (`operativo.descripcion` vacía/NULL), es decir, pendientes de completar el registro.

**Filtro SQL** (`asignaciones-ingreso.repository.ts:69`):
```sql
WHERE a.id_distrital = $1 AND COALESCE(o.descripcion, '') = ''
```

**Columnas desplegadas** (`TablaSinRegistrar.tsx`):

| Columna | Origen |
|---|---|
| Unidad | `auth_fdw.unidad.descripcion` |
| Distrital | `auth_fdw.distrital.descripcion` |
| Grupo | `auth_fdw.grupo.descripcion` |
| Nro. Caso | `asignacion.numero_caso` |
| Pérdida de Dominio | `asignacion.numero_caso_per_dom` |
| Nro. Operativo | `asignacion.numero_operativo` |
| Nombre Operativo | `asignacion.nombre_caso` |
| Fecha y Hora Op. | `operativo.fecha_operativo` (formato `es-BO`) |
| Asignado al Caso | `asignacion.asignado_caso` |
| Fiscal Asignado | `asignacion.fiscal_asignado_caso` |
| Acciones | Navega a `/seguimiento/{idCaso}` con tab `casos`, `personas` o `bienes` |

El tab "Registrados" usa la misma base pero exige `COALESCE(o.descripcion, '') != ''`, con filtros adicionales por número de caso, nombre o rango de fechas.

## 5. Tabla `detenido_auxiliar` (módulo Personas dentro del detalle de un caso)

- **Existe solo en `felcn_siii`.** No hay tabla con ese nombre exacto en ninguna otra base del sistema.
- **Homóloga legacy:** `a_felcn_lgi.detenidosaux` (mismo modelo, columnas abreviadas), del sistema jurídico anterior (LGI) que este módulo reemplaza. `a_felcn_lgi.arrestadosaux` es la contraparte de "arrestados" (aún no migrada a `felcn_siii`).
- **No relacionadas directamente:** `a_felcn_sii.detenido` y `a_felcn_sospechoso.detenido` pertenecen a otros subsistemas con modelos de datos propios.
- **Backend:** módulo `personas` (`backend/felcn-base-backend/src/application/sunesis/siii/seguimiento/personas/`), controller `GET /personas/operativo/:idOperativo` (solo lectura sobre `detenido_auxiliar`). Los `POST /personas/:idDetenido/situacion` y `POST /personas/:idDetenido/etapa-proceso` escriben en las tablas hijas `situacion` y `etapa_proceso` (FK a `detenido_auxiliar`), no en la tabla misma.
- **Relación:** `Operativo` (1) → `DetenidoAuxiliar` (N) → `Situacion` (N) / `EtapaProceso` (N).
- **Origen de los datos:** no hay flujo de la app que inserte filas nuevas en `detenido_auxiliar`; la única vía de escritura es el script manual `database/scripts/migrar-persona-a-detenido-auxiliar.sql`, que migra registros legacy desde `persona_auxiliar` filtrando por `numero_caso` (idempotente).
- **Estado actual en BD:** 1 solo registro (id 152, caso `CB-PD-1/26`, MAURICIO MENDEZ, migrado 2026-08-16), con historial de `situacion` y `etapa_proceso` ya cargado.
- **Origen funcional:** migración de la pantalla legacy `FRM-JUR-02.aspx.cs` ("situación jurídica de personas implicadas" en un operativo). El archivo fuente `.aspx.cs` de ese formulario **no está presente** en este repositorio — solo se referencia por nombre en comentarios de código como trazabilidad de la migración.

## 6. Pendientes / preguntas abiertas

- Confirmar con negocio a qué distrital debería pertenecer JHENNY JIMENA (¿51 o 54?) y corregir su asignación de grupo, o investigar por qué no se generan casos con `id_distrital=51`.
- Evaluar mitigar la falta de validación server-side de `idDistrital` contra el usuario del JWT en `asignaciones-ingreso` (control actualmente confiado del lado cliente).
- `arrestado_auxiliar` está documentada como entidad pendiente en `felcn_siii` (mencionada en README-FRM-OP.md) pero aún no se ha creado.
