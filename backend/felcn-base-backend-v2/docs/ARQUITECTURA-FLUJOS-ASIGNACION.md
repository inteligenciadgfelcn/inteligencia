# Arquitectura y Flujos — Asignación de Casos y Operativos

Documento de referencia para entender el origen de los datos en cada base de datos,
basado en el análisis de los formularios ASP.NET originales.

---

## Bases de Datos

| Constante NestJS | Base de Datos | Rol |
|---|---|---|
| `DB_ASIG_CASOS` | `felcn_asignacion_caso` | Gestión de servicios ICIA y registro inicial de casos |
| `DB_SIII` | `felcn_siii` | Registro completo de asignaciones y operativos |
| `DB_S2I` | `felcn_s2i` | Usuarios, grados, estructura organizacional |

---

## Flujo 1 — Creación de Servicio (ICIA-SERV-00)

El agente crea su turno de servicio antes de poder registrar casos.

| Paso | Acción | Query | DB |
|---|---|---|---|
| 1 | Cargar combo emergencia | `SELECT Users, Grados WHERE Uni_Id=22` | `felcn_s2i` |
| 2 | Generar código | `"ICIA-{dd_ing}{dd_sal}{MM}{yyyy}"` | — |
| 3 | Guardar servicio | `INSERT INTO servicio(codigo_servicio, usuario_login, usuario_ejecutor, fecha_hora_ingreso, fecha_hora_salida)` | `felcn_asignacion_caso` |

**API:** `POST /api/asignaciones/servicios`

---

## Flujo 2 — Registro de Asignación de Caso (ICIA-SERV-01)

El agente asigna un caso a un operativo. Este flujo hace **DUAL WRITE**: inserta en dos bases de datos simultáneamente.

### 2.1 Carga del formulario

| Acción | Query | DB |
|---|---|---|
| Verificar servicio activo | `Servicio.Verificaservicio(pase)` | `felcn_s2i` |
| Cargar departamentos | `SELECT DptoAv_Id, Descripcion FROM DEPARTAMENTOS` | `felcn_asignacion_caso` |
| Cargar unidades | `SELECT Uni_Abrev, Uni_Descripcion FROM UNIDADES` | `felcn_siii` |
| Listar casos del servicio | `SELECT Casos_Id, ... FROM ASIGNACION WHERE CodServicio=X` | `felcn_asignacion_caso` |

### 2.2 Cascada de combos

| Combo | Query | DB |
|---|---|---|
| Al elegir Unidad → Distritales | `SELECT Dis_Id, Dis_Descripcion FROM DISTRITALES INNER JOIN UNIDADES WHERE Uni_Abrev=X` | `felcn_siii` |
| Al elegir Distrital → Grupos | `SELECT Grp_Id, Descripcion FROM GRUPOS WHERE Dis_Id=X` | `felcn_siii` |
| Al elegir Grupo → Personas | `SELECT Users.Usuario, Grados.Abrev + NombreApp FROM Users WHERE Grp_Id=X` | `felcn_s2i` |
| Al elegir persona → Teléfono | `Servicio.Numerousuario(usuario)` | `felcn_s2i` |

### 2.3 Generación del número correlativo

```sql
-- DB: felcn_siii
SELECT COUNT(Casos_Id) FROM ASIGNACION
WHERE DptoAv_Id = 'CB' AND Uni_Abrev = 'IC' AND NroOperativo LIKE '%/26%'
-- Resultado: "CB-IC-{count+1}/26"
```

**API:** `GET /api/operativos/correlativo?dpto=CB&unidad=IC`

### 2.4 Guardado — Insert S2 en `felcn_asignacion_caso`

```sql
INSERT INTO ASIGNACION(
  DptoAv_Id, UnidAV_Id, Letras, NroCaso, NroOperativo, FechaOperativo,
  NombreCaso, AsigCaso, CodServicio, FiscalAsigCaso, fechahoraing, Usuario
) VALUES (
  dpto, unidad_codigo, 'PD', '', nrooperativo, fechaop,
  nombrecaso, asignado_nombre, codservicio, fiscal, now, pase_ejecutor
)
```

Campos notables: `NroCaso = ''` (no aprobado), `Letras = 'PD'`, `Usuario` = pase del **ejecutor**.

### 2.5 Guardado — Insert S3 en `felcn_siii`

```sql
INSERT INTO ASIGNACION(
  DptoAv_Id, Uni_Abrev, Dis_Id, Grp_Id, Letras, NroCaso, NroCasoPerDom,
  NroOperativo, CodServicio, IANUS, NombreCaso,
  FSolicitud, FonoS, AsigCaso, FonoA, FiscalAsigCaso, FonoF,
  Eta_Inv, Resultado, fechahoraing, Usuario
) VALUES (
  dpto, uni_abrev, dis_id, grp_id, '', '', '',
  nrooperativo, codservicio, '', nombrecaso,
  solicitante_nombre, fono_solicita,
  asignado_nombre, fono_asignado,
  fiscal, fono_fiscal,
  7, 1, now, solicitante_usuario
)
```

> **IMPORTANTE:** `FSolicitud` = **nombre del fiscal/persona solicitante** (VARCHAR 100), NO es una fecha.
> `Usuario` = pase del **solicitante** (diferente al Insert S2).

**API:** `POST /api/asignaciones/casos` (dual write en el servicio)

### 2.6 Eliminación — Dual Delete

```
deleteOperativos(id)   → DELETE ASIGNACION WHERE Casos_Id=X   [felcn_asignacion_caso]
deletesegcasos(nroop)  → DELETE ASIGNACION WHERE NroOperativo=X [felcn_siii]
```

---

## Flujo 3 — Lista de Casos No Aprobados (FRM-OP-ING)

El agente ve su lista de casos pendientes para iniciar o editar un operativo.

```sql
-- DB: felcn_siii
SELECT ASIGNACION.Casos_Id, UNIDADES.Uni_Descripcion, DISTRITALES.Dis_Descripcion,
       GRUPOS.Descripcion, NroCaso, NroOperativo, NombreCaso, AsigCaso, FiscalAsigCaso
FROM ASIGNACION
  INNER JOIN UNIDADES    ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev
  INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id
  INNER JOIN GRUPOS      ON ASIGNACION.Grp_Id = GRUPOS.Grp_Id
WHERE ASIGNACION.Usuario = '{pase}' AND RTRIM(ASIGNACION.NroCaso) = ''
ORDER BY Unidad, Distrital, Grupo
```

**API:** `GET /api/operativos/casos/no-aprobados/usuario/:usuario`
**DB:** `felcn_siii.public.asignacion`

---

## Flujo 4 — Nuevo / Editar Operativo (FRM-OP)

```
FRM-OP recibe: ?id={Casos_Id}

1. Cargar datos del caso (muestradatos):
   SELECT Casos_Id, NombreCaso, FSolicitud, FonoS, AsigCaso, FonoA,
          FiscalAsigCaso, FonoF, NroOperativo, NroCaso
   FROM ASIGNACION WHERE Casos_Id = X        → felcn_siii

2. Verificar si ya tiene operativo (idvalor):
   SELECT COUNT(Op_Id) FROM OPERATIVO
   WHERE Casos_Id = X AND Op_Revisado = 0   → felcn_siii
   → 0: muestra formulario VACÍO (NUEVO)
   → >0: carga operativo existente (EDITAR)

3. Cargar operativo existente (muestra_operativo):
   SELECT Op_Id, ..., Uni_Id, Dis_Id, Grp_Id, ...
   FROM OPERATIVO WHERE Casos_Id = X        → felcn_siii

4. Cargar todos los combos del formulario     → felcn_siii via /siii-lookups
```

**APIs:**
- `GET /api/operativos/nuevo/:casoId` → datos del caso desde `felcn_siii.asignacion`
- `GET /api/operativos/caso/:idCaso`  → operativos desde `felcn_siii.operativo`

---

## Diferencias entre las dos tablas ASIGNACION

| Campo ASP | `felcn_asignacion_caso` | `felcn_siii` |
|---|---|---|
| `Casos_Id` | `id_asignacion` (BIGINT) | `id_caso` (BIGINT) |
| `DptoAv_Id` | `id_departamento CHAR(2)` | `id_departamento_caso VARCHAR(2)` |
| `UnidAV_Id` / `Uni_Abrev` | `id_unidad CHAR(2)` (código interno) | `abreviatura_unidad VARCHAR(3)` |
| `Dis_Id` | ❌ NO existe | `id_distrital INTEGER` |
| `Grp_Id` | ❌ NO existe | `id_grupo INTEGER` |
| `Letras` | `codigo_letra = 'PD'` | `letras = ''` |
| `NroCaso` | `numero_caso = ''` | `numero_caso = ''` |
| `NroCasoPerDom` | ❌ NO | `numero_caso_per_dom` |
| `NroOperativo` | `numero_operativo` | `numero_operativo` |
| `FechaOperativo` | `fecha_operativo TIMESTAMP` | ❌ NO |
| `NombreCaso` | `nombre_caso` | `nombre_caso` |
| `FSolicitud` | ❌ NO | `fiscal_solicitud VARCHAR(100)` (**nombre**, no fecha) |
| `FonoS` | ❌ NO | `telefono_solicitud VARCHAR(15)` |
| `AsigCaso` | `asignacion_caso VARCHAR(70)` | `asignado_caso VARCHAR(100)` |
| `FonoA` | ❌ NO | `telefono_asignado VARCHAR(15)` |
| `FiscalAsigCaso` | `fiscal_asignado VARCHAR(70)` | `fiscal_asignado_caso VARCHAR(70)` |
| `FonoF` | ❌ NO | `telefono_fiscal VARCHAR(15)` |
| `CodServicio` | `codigo_servicio` | `codigo_servicio` |
| `IANUS` | ❌ NO | `ianus VARCHAR(15)` |
| `Eta_Inv` | ❌ NO | `id_etapa_investigacion INTEGER = 7` |
| `Resultado` | ❌ NO | `resultado BOOLEAN = true` |
| `fechahoraing` | `fecha_hora_registro` | `fecha_hora_ingreso` |
| `Usuario` | `usuario_login` (ejecutor) | `usuario` (solicitante) |

---

## Mapa completo: API REST → Query original → DB

| API REST | Función ASP | DB |
|---|---|---|
| `GET /api/operativos/casos/no-aprobados/usuario/:u` | `muestranoaprob()` | `felcn_siii` |
| `GET /api/operativos/nuevo/:casoId` | `muestradatos()` | `felcn_siii` |
| `GET /api/operativos/caso/:idCaso` | `idvalor()` + `muestra_operativo()` | `felcn_siii` |
| `GET /api/operativos/correlativo` | `nroregistro()` | `felcn_siii` |
| `GET /api/asignaciones/servicio/:codigo` | `MuestraOperativos()` | `felcn_asignacion_caso` |
| `POST /api/asignaciones/casos` | `insertacasosS2()` + `insertacasosS3()` | ambas |
| `DELETE /api/asignaciones/casos/:id` | `deleteOperativos()` + `deletesegcasos()` | ambas |
| `GET /api/siii-lookups/unidades` | `CboUnid()` | `felcn_siii` |
| `GET /api/siii-lookups/distritales/unidad/:id` | `cbounidad_SelectedIndexChanged()` | `felcn_siii` |
| `GET /api/siii-lookups/grupos/distrital/:id` | `cboDistrital_SelectedIndexChanged()` | `felcn_siii` |
| `GET /api/siii-lookups/departamentos` | `Cbodpto()` (para form operativo) | `felcn_siii` |
| `GET /api/siii-lookups/tipos-relevancia` | `CboRelevancia()` | `felcn_siii` |
| `GET /api/siii-lookups/tipos-denuncia` | `TipoDenuncia()` | `felcn_siii` |
| `GET /api/siii-lookups/tipos-penal` | `TipoPenal()` | `felcn_siii` |
| `GET /api/siii-lookups/categorias-operativo` | `Categoria()` | `felcn_siii` |
| `GET /api/siii-lookups/planes-operaciones` | `PlandeOperaciones()` | `felcn_siii` |
| `GET /api/siii-lookups/tipos-operacion` | `TipoOperativos()` | `felcn_siii` |
| `GET /api/siii-lookups/tipos-droga` | `TipoDrogas()` | `felcn_siii` |
| `GET /api/siii-lookups/formas-transporte` | `FormaTrans()` | `felcn_siii` |
| `GET /api/siii-lookups/paises` | `Pais_Detenido()` / `Procedencia_Droga()` | `felcn_siii` |
| `GET /api/siii-lookups/paises-destino` | `Destino_Droga()` | `felcn_siii` |
| `GET /api/siii-lookups/sustancias-solidas-desc` | `TipoSusSolidas()` | `felcn_siii` |
| `GET /api/siii-lookups/sustancias-liquidas-desc` | `TipoSusLiquidas()` | `felcn_siii` |
| `GET /api/siii-lookups/tipos-fabrica` | `Tipofabricas()` | `felcn_siii` |
| `GET /api/siii-lookups/bienes` | `Bienes()` | `felcn_siii` |
| `GET /api/operativos/catalogo/estados-droga/:id` | `EstadoDroga()` | `felcn_siii` |
| `GET /api/operativos/catalogo/fabrica-modelos/:id` | `FabricaModelos()` | `felcn_siii` |
| `GET /api/operativos/catalogo/items/:id` | `ItemOperativo()` | `felcn_siii` |
| `GET /api/operativos/catalogo/clases/:id` | `CatalogoClase()` | `felcn_siii` |
| `GET /api/operativos/catalogo/tipos/:id` | `CatalogoTipo()` | `felcn_siii` |
| `GET /api/operativos/catalogo/caracteristicas/:id` | `CatalogoCarac()` | `felcn_siii` |

---

## Simulación con cURL — Flujo completo paso a paso

> Base URL: `http://localhost:3000/api`
> Todos los endpoints están sin guard en desarrollo (`// TODO: Reactivar guards`).

---

### FLUJO 1 — Crear Servicio (ICIA-SERV-00)

El agente registra su turno de servicio. El código se genera en el frontend con la fórmula:
`"ICIA-{dd_ing}{dd_sal}{MM}{yyyy}"` (ej: `ICIA-060726032026`).

#### Paso 1.1 — Verificar si el usuario ya tiene servicio activo
```bash
curl -X GET "http://localhost:3000/api/servicios/verificar/PLOPEZ" \
  -H "Content-Type: application/json"
# Respuesta esperada: { tieneServicio: false }
```

#### Paso 1.2 — Crear el servicio
```bash
curl -X POST "http://localhost:3000/api/servicios" \
  -H "Content-Type: application/json" \
  -d '{
    "codigoServicio": "ICIA-060726032026",
    "usuarioLogin": "JPEREZ",
    "usuarioEjecutor": "PLOPEZ",
    "fechaHoraIngreso": "2026-03-06T07:00:00.000Z",
    "fechaHoraSalida": "2026-03-07T07:00:00.000Z"
  }'
# Respuesta esperada: 201 Created con el servicio creado
```

#### Paso 1.3 — Obtener servicio activo del usuario
```bash
curl -X GET "http://localhost:3000/api/servicios/activo/JPEREZ" \
  -H "Content-Type: application/json"
# Retorna el servicio activo con codigoServicio para usar en Flujo 2
```

---

### FLUJO 2 — Registrar Asignación de Caso (ICIA-SERV-01)

Dual write: INSERT en `felcn_asignacion_caso` (S2) y en `felcn_siii` (S3).

#### Paso 2.1 — Cargar departamentos (felcn_asignacion_caso)
```bash
curl -X GET "http://localhost:3000/api/asig-lookups/departamentos" \
  -H "Content-Type: application/json"
# Retorna: [{ id: "CB", descripcion: "COCHABAMBA" }, ...]
```

#### Paso 2.2 — Cargar unidades (felcn_siii)
```bash
curl -X GET "http://localhost:3000/api/siii-lookups/unidades" \
  -H "Content-Type: application/json"
# Retorna: [{ abreviatura: "IC", descripcion: "INTELIGENCIA CRIMINAL" }, ...]
```

#### Paso 2.3 — Cargar distritales por unidad elegida (felcn_siii)
```bash
curl -X GET "http://localhost:3000/api/siii-lookups/distritales/unidad/IC" \
  -H "Content-Type: application/json"
# Retorna: [{ id: 1, descripcion: "COCHABAMBA" }, ...]
```

#### Paso 2.4 — Cargar grupos por distrital elegido (felcn_siii)
```bash
curl -X GET "http://localhost:3000/api/siii-lookups/grupos/distrital/1" \
  -H "Content-Type: application/json"
# Retorna: [{ id: 3, descripcion: "GRUPO ALFA" }, ...]
```

#### Paso 2.5 — Generar número de operativo correlativo (felcn_siii)
```bash
curl -X GET "http://localhost:3000/api/operativos/correlativo?dpto=CB&unidad=IC" \
  -H "Content-Type: application/json"
# Retorna: { correlativo: 42, numeroOperativo: "CB-IC-42/26" }
```

> **Nota:** Si el endpoint `/api/operativos/correlativo` aún no está implementado, puede
> consultarse directamente en `felcn_siii` con:
> `SELECT COUNT(*) FROM asignacion WHERE id_departamento_caso='CB' AND abreviatura_unidad='IC' AND numero_operativo LIKE '%/26%'`

#### Paso 2.6 — Registro dual (Insert S2 + S3 simultáneo)

La API `POST /api/asignaciones` escribe en `felcn_asignacion_caso` (Insert S2).
El Insert S3 en `felcn_siii` se registra directamente vía SQL de prueba (ver abajo)
mientras no exista un endpoint unificado de dual write.

**Insert S2 — `felcn_asignacion_caso` (API REST):**
```bash
curl -X POST "http://localhost:3000/api/asignaciones" \
  -H "Content-Type: application/json" \
  -d '{
    "idDepartamento": "CB",
    "idUnidad": "IC",
    "codigoLetra": "PD",
    "numeroCaso": "",
    "numeroOperativo": "CB-IC-42/26",
    "fechaOperativo": "2026-03-06T08:30:00.000Z",
    "nombreCaso": "OPERACION ALBA",
    "asignacionCaso": "TTE. GARCIA MAMANI JUAN CARLOS",
    "codigoServicio": "ICIA-060726032026",
    "fiscalAsignado": "DR. QUISPE TICONA MARIO"
  }'
# usuarioLogin se toma del JWT (actualmente hardcoded "SISTEMA")
# Respuesta esperada: 201 Created con id_asignacion generado
```

**Insert S3 — `felcn_siii` (SQL directo para pruebas):**
```sql
-- ============================================================
-- PASO PREVIO: Sembrar datos de referencia en felcn_siii
-- (solo necesario una vez por ambiente de prueba)
-- ============================================================

-- 1. Departamentos (FK requerida por public.asignacion)
INSERT INTO public.departamento_caso (id_departamento_caso, descripcion)
VALUES
  ('LP', 'LA PAZ'),
  ('CB', 'COCHABAMBA'),
  ('SC', 'SANTA CRUZ'),
  ('OR', 'ORURO'),
  ('PT', 'POTOSI'),
  ('TJ', 'TARIJA'),
  ('CH', 'CHUQUISACA'),
  ('BE', 'BENI'),
  ('PD', 'PANDO')
ON CONFLICT (id_departamento_caso) DO NOTHING;

-- 2. Unidades (sin FK en asignacion, pero necesarias para lookups)
INSERT INTO public.unidad_caso (abreviatura_unidad, descripcion)
VALUES ('IC', 'INTELIGENCIA CRIMINAL')
ON CONFLICT (abreviatura_unidad) DO NOTHING;

-- 3. Distritales (sin FK en asignacion, pero necesarios para lookups)
INSERT INTO public.distrital (id_distrital, id_unidad, descripcion)
VALUES (1, 1, 'COCHABAMBA')
ON CONFLICT (id_distrital) DO NOTHING;

-- 4. Grupos (sin FK en asignacion, pero necesarios para lookups)
INSERT INTO public.grupo (id_grupo, id_distrital, descripcion)
VALUES (3, 1, 'GRUPO ALFA')
ON CONFLICT (id_grupo) DO NOTHING;

-- ============================================================
-- INSERT S3 — vinculado al S2 (id_asignacion=15, CB-IC-42/26)
-- Equivale a insertacasosS3() del ASP (CONEXSIII)
-- ============================================================
INSERT INTO public.asignacion (
  id_departamento_caso, abreviatura_unidad, id_distrital, id_grupo,
  letras, numero_caso, numero_caso_per_dom, numero_operativo,
  codigo_servicio, ianus, nombre_caso,
  fiscal_solicitud, telefono_solicitud,
  asignado_caso, telefono_asignado,
  fiscal_asignado_caso, telefono_fiscal,
  id_etapa_investigacion, resultado, fecha_hora_ingreso, usuario
) VALUES (
  'CB', 'IC', 1, 3,
  '', '', '', 'CB-IC-42/26',
  'ICIA-060726032026', '', 'OPERACION ALBA',
  'JPEREZ', '72345678',
  'TTE. GARCIA MAMANI JUAN CARLOS', '71234567',
  'DR. QUISPE TICONA MARIO', '70000001',
  7, true, '2026-03-06T04:25:55.651Z', 'JPEREZ'
);
-- Vínculo con S2: mismo numero_operativo='CB-IC-42/26' y codigo_servicio='ICIA-060726032026'
-- S2 en felcn_asignacion_caso: id_asignacion=15, usuario_login='SISTEMA', fecha_hora_registro=2026-03-06T04:25:55
-- fiscal_solicitud = nombre del solicitante (VARCHAR, NO es fecha)
-- usuario = pase del solicitante | usuario_login S2 = pase del ejecutor
```

---

### FLUJO 3 — Listar Casos No Aprobados (FRM-OP-ING)

El agente ve sus casos pendientes de ingreso de operativo.

```bash
curl -X GET "http://localhost:3000/api/operativos/casos/no-aprobados/usuario/JPEREZ" \
  -H "Content-Type: application/json"
# Lee de felcn_siii.public.asignacion WHERE usuario='JPEREZ' AND TRIM(numero_caso)=''
# Retorna lista de casos con id, numeroOperativo, nombreCaso, idDistrital, idGrupo, etc.
```

---

### FLUJO 4 — Nuevo / Editar Operativo (FRM-OP)

#### Paso 4.1 — Obtener datos del caso (muestradatos)
```bash
# Usar el id_caso obtenido en Flujo 3
curl -X GET "http://localhost:3000/api/operativos/nuevo/1" \
  -H "Content-Type: application/json"
# Lee de felcn_siii.public.asignacion WHERE id_caso=1
# Retorna: { caso: { numeroCaso, numeroOperativo, nombreCaso, fiscalSolicitud, ... }, operativo: null }
```

#### Paso 4.2 — Verificar si ya existe operativo (idvalor)
```bash
curl -X GET "http://localhost:3000/api/operativos/caso/1" \
  -H "Content-Type: application/json"
# Lee de felcn_siii.public.operativo WHERE id_caso=1
# 200 vacío → formulario NUEVO | con datos → formulario EDITAR
```

#### Paso 4.3 — Cargar lookups del formulario de operativo
```bash
# Tipos de relevancia
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-relevancia"

# Tipos de denuncia
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-denuncia"

# Tipos penal
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-penal"

# Categorías operativo
curl -X GET "http://localhost:3000/api/siii-lookups/categorias-operativo"

# Planes de operaciones
curl -X GET "http://localhost:3000/api/siii-lookups/planes-operaciones"

# Tipos de operación
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-operacion"

# Tipos de droga
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-droga"

# Formas de transporte
curl -X GET "http://localhost:3000/api/siii-lookups/formas-transporte"

# Departamentos (para origen de droga)
curl -X GET "http://localhost:3000/api/siii-lookups/departamentos"

# Países
curl -X GET "http://localhost:3000/api/siii-lookups/paises"
```

#### Paso 4.4 — Crear operativo nuevo
```bash
curl -X POST "http://localhost:3000/api/operativos" \
  -H "Content-Type: application/json" \
  -d '{
    "idCaso": "1",
    "idTipoOperacion": 1,
    "idCategoriaOperativo": 2,
    "idPlanOperaciones": 1,
    "idTipoRelevancia": 3,
    "idTipoDenuncia": 1,
    "idTipoPenal": 2,
    "idDepartamento": 3,
    "descripcion": "INTERVENCION EN ZONA NORTE",
    "fechaHoraInicio": "2026-03-06T08:00:00.000Z",
    "fechaHoraFin": "2026-03-06T16:00:00.000Z",
    "latitud": "-17.3895",
    "longitud": "-66.1568"
  }'
```

#### Paso 4.5 — Agregar droga al operativo (ejemplo)
```bash
# Primero obtener catálogos dependientes del tipo de droga
curl -X GET "http://localhost:3000/api/operativos/catalogo/estados-droga/1"

# Luego registrar la droga
curl -X POST "http://localhost:3000/api/operativos/1/drogas" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoDroga": 1,
    "idEstadoDroga": 2,
    "cantidad": 500.5,
    "unidad": "KG"
  }'
```

---

### Resumen de secuencia completa

```
1. POST   /api/servicios                              → Crear turno (ICIA-SERV-00)
2. GET    /api/asig-lookups/departamentos             → Combo departamentos
3. GET    /api/siii-lookups/unidades                  → Combo unidades
4. GET    /api/siii-lookups/distritales/unidad/:abrev → Cascade distrital
5. GET    /api/siii-lookups/grupos/distrital/:id      → Cascade grupo
6. GET    /api/operativos/correlativo?dpto=X&unidad=Y → Nro correlativo
7. POST   /api/asignaciones                           → Insert S2 (felcn_asignacion_caso)
         [SQL directo]                                → Insert S3 (felcn_siii)
8. GET    /api/operativos/casos/no-aprobados/usuario/:u → Lista casos pendientes
9. GET    /api/operativos/nuevo/:casoId               → Datos del caso para form
10. POST  /api/operativos                             → Crear operativo
11. POST  /api/operativos/:id/drogas                  → Agregar drogas
    POST  /api/operativos/:id/sustancias-solidas      → Agregar sustancias
    POST  /api/operativos/:id/bienes-secuestrados     → Agregar bienes
    ...
```
