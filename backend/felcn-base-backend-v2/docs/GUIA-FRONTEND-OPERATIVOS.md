# GUÍA FRONTEND — MÓDULO OPERATIVOS

**Versión:** 3.0 — Estado real de implementación
**Fecha:** 2026-03-05
**Base URL:** `http://localhost:3000/api`

---

## ÍNDICE

1. [Modelo de datos](#1-modelo-de-datos)
2. [Cómo determinar NUEVO vs EDICIÓN](#2-cómo-determinar-nuevo-vs-edición)
3. [Estrategia de lookups](#3-estrategia-de-lookups)
4. [Tabla completa: API lookup → Combo del formulario](#4-tabla-completa-api-lookup--combo-del-formulario)
5. [Flujo completo NUEVO operativo — curl](#5-flujo-completo-nuevo-operativo--curl)
6. [Flujo completo EDICIÓN operativo — curl](#6-flujo-completo-edición-operativo--curl)
7. [Reglas de negocio y validaciones](#7-reglas-de-negocio-y-validaciones)
8. [Referencia de endpoints](#8-referencia-de-endpoints)

---

## 1. Modelo de datos

```
ASIGNACION (felcn_asignacion_caso)
  id_asignacion  ← este es el "casoId" en toda la API
  nombre_caso, numero_operativo, asignacion_caso, fiscal_asignado
  id_unidad (char 2), id_distrital, id_grupo
  fono_solicitud, fono_asignado, fono_fiscal, fecha_solicitud
  ↓ (1:N)
OPERATIVO (felcn_siii · public)
  id_operativo   ← este es el "{id}" en toda la API
  id_caso = id_asignacion
  ↓ (1:N)
  ├─ DROGA               (SEC1)
  ├─ SUSTANCIA_SOLIDA    (SEC2)
  ├─ SUSTANCIA_LIQUIDA   (SEC3)
  ├─ FABRICA             (SEC4)
  ├─ DETENIDO_AUXILIAR   (SEC5)
  ├─ ITEM_BIEN_SECUESTRADO (SEC6)
  │   └─ ITEM_BIEN_CARACTERISTICA (1:N)
  ├─ GALERIA             (SEC7)
  └─ LOGOTIPO            (SEC8)
```

---

## 2. Cómo determinar NUEVO vs EDICIÓN

FRM-OP-ING muestra **dos listas** que leen de `felcn_siii`. Ambas tienen el mismo contrato.
El punto de entrada al formulario es la **lista de no-aprobados** (GridView2). Cada fila entrega un `idCaso`.

```bash
# Lista 1 (GridView1) — todos los casos del usuario
GET /api/operativos/casos/usuario/{usuarioLogin}

# Lista 2 (GridView2) — solo casos sin número asignado (entrada al formulario)
GET /api/operativos/casos/no-aprobados/usuario/{usuarioLogin}

# Paso siguiente — verificar si ya existe operativo para ese caso
GET /api/operativos/caso/{idCaso}
```

| Resultado | Acción |
|---|---|
| Array vacío `[]` | **NUEVO** → ir a paso 3a |
| Array con elementos | **EDICIÓN** → `idOperativo = datos[0].id` → ir a paso 3b |

```bash
# Paso 3a (NUEVO) — cargar datos del caso para pre-rellenar SEC0
GET /api/operativos/nuevo/{idCaso}

# Paso 3b (EDICIÓN) — cargar resumen y estadísticas
GET /api/operativos/{idOperativo}/resumen
```

---

## 3. Estrategia de lookups

**Todos los lookups del formulario provienen de `felcn_siii` vía `/api/siii-lookups/`.**
No hay dependencia de otras bases de datos para los combos.

### Cuándo cargar

| Tipo | Cuándo | Ejemplo |
|---|---|---|
| **Estáticos** | Una sola vez al iniciar el módulo (cache) | tipos-droga, departamentos, unidades |
| **Dependientes** | Cuando el usuario selecciona el padre | distritales por unidad, estados-droga por tipo |

### Lookups estáticos — cargar en paralelo al abrir el módulo

```javascript
const [
  tiposRelevancia, tiposDenuncia, tiposPenal, tiposOperacion,
  departamentos, categoriasOperativo, planesOperaciones,
  tiposDroga, formasTransporte, paises,
  sustanciasSolidasDesc, sustanciasLiquidasDesc,
  tiposFabrica, bienes,
  unidades, estadosCiviles, tiposDocumento
] = await Promise.all([
  fetch('/api/siii-lookups/tipos-relevancia'),
  fetch('/api/siii-lookups/tipos-denuncia'),
  fetch('/api/siii-lookups/tipos-penal'),
  fetch('/api/siii-lookups/tipos-operacion'),
  fetch('/api/siii-lookups/departamentos'),
  fetch('/api/siii-lookups/categorias-operativo'),
  fetch('/api/siii-lookups/planes-operaciones'),
  fetch('/api/siii-lookups/tipos-droga'),
  fetch('/api/siii-lookups/formas-transporte'),
  fetch('/api/siii-lookups/paises'),
  fetch('/api/siii-lookups/sustancias-solidas-desc'),
  fetch('/api/siii-lookups/sustancias-liquidas-desc'),
  fetch('/api/siii-lookups/tipos-fabrica'),
  fetch('/api/siii-lookups/bienes'),
  fetch('/api/siii-lookups/unidades'),
  fetch('/api/siii-lookups/estados-civiles'),
  fetch('/api/siii-lookups/tipos-documento'),
])
```

### Lookups dependientes — cargar on-demand

```javascript
// Cuando usuario selecciona Unidad
GET /api/siii-lookups/distritales/unidad/{idUnidad}

// Cuando usuario selecciona Distrital
GET /api/siii-lookups/grupos/distrital/{idDistrital}

// Cuando usuario selecciona Departamento
GET /api/siii-lookups/provincias/departamento/{idDepartamento}

// Cuando usuario selecciona Provincia
GET /api/siii-lookups/localidades/provincia/{idProvincia}

// Cuando usuario selecciona Categoría Operativo
GET /api/operativos/catalogos/items-operativo/{idCategoriaOperativo}

// Cuando usuario selecciona Tipo Droga
GET /api/operativos/catalogos/estados-droga/{idTipoDroga}

// Cuando usuario selecciona Tipo Fábrica
GET /api/operativos/catalogos/fabrica-modelos/{idTipoFabrica}

// Cuando usuario selecciona Bien (cascada triple)
GET /api/operativos/catalogos/clases/{idBien}
GET /api/operativos/catalogos/tipos/{idCatalogoClase}
GET /api/operativos/catalogos/caracteristicas/{idCatalogoClase}
```

---

## 4. Tabla completa: API lookup → Combo del formulario

### SEC0 — Datos del caso (solo lectura, vienen de ASIGNACION)

| Campo formulario | Campo de `GET /operativos/nuevo/:casoId` | Nota |
|---|---|---|
| `txtnombrecaso` | `caso.nombreCaso` | Read-only |
| `txtnroop` | `caso.numeroOperativo` | Read-only |
| `txtsolicita` (nombre solicitante) | `caso.fiscalSolicitud` | Read-only — es nombre, NO fecha |
| `fonosolicita` | `caso.telefonoSolicitud` | Read-only |
| `txtasignadocaso` | `caso.asignadoCaso` | Read-only |
| `fonoasignado` | `caso.telefonoAsignado` | Read-only |
| `txtfiscalasignado` | `caso.fiscalAsignadoCaso` | Read-only |
| `fonofiscal` | `caso.telefonoFiscal` | Read-only |
| `cbounidad` (preselección) | `caso.abreviaturaUnidad` | Selecciona en combo |
| `cboDistrital` (preselección) | `caso.idDistrital` | Selecciona en combo |
| `cboGrupo` (preselección) | `caso.idGrupo` | Selecciona en combo |

> **IMPORTANTE:** Tras el primer `POST /operativos`, SEC0 completo queda inmutable.
> El frontend debe deshabilitar todos sus campos tras guardar con éxito.

### SEC0 — Combos de estructura (cascada)

| Combo ASP | API lookup | Dependencia | Nota |
|---|---|---|---|
| `cbounidad` | `GET /api/siii-lookups/unidades` | — | Preseleccionar con `caso.idUnidad` |
| `cboDistrital` | `GET /api/siii-lookups/distritales/unidad/:id` | → cbounidad | Preseleccionar con `caso.idDistrital` |
| `cboGrupo` | `GET /api/siii-lookups/grupos/distrital/:id` | → cboDistrital | Preseleccionar con `caso.idGrupo` |

### SEC1 — Datos del operativo

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cborelevancia` | `GET /api/siii-lookups/tipos-relevancia` | — |
| `cbotipodenuncia` | `GET /api/siii-lookups/tipos-denuncia` | — |
| `cbotipopenal` | `GET /api/siii-lookups/tipos-penal` | — |
| `cbodepartamento` | `GET /api/siii-lookups/departamentos` | — |
| `cboprovincia` | `GET /api/siii-lookups/provincias/departamento/:id` | → cbodepartamento |
| `cbomunicipio` | `GET /api/siii-lookups/localidades/provincia/:id` | → cboprovincia |
| `cbocategoria` (Categoría Operativo) | `GET /api/siii-lookups/categorias-operativo` | — |
| `cbosubcategoria` (Item Operativo) | `GET /api/operativos/catalogos/items-operativo/:id` | → cbocategoria |
| `cboplanoperaciones` | `GET /api/siii-lookups/planes-operaciones` | — |
| `cbotipoop` (Tipo Operación) | `GET /api/siii-lookups/tipos-operacion` | — |

### SEC2 — Drogas

| Combo ASP | API lookup | Dependencia | Nota |
|---|---|---|---|
| `cbotipodrogas` | `GET /api/siii-lookups/tipos-droga` | — | — |
| `cboestadodroga` | `GET /api/operativos/catalogos/estados-droga/:id` | → cbotipodrogas | — |
| `cboformatran` (Forma Transporte) | `GET /api/siii-lookups/formas-transporte` | — | — |
| `cboproceden` (País Procedencia) | `GET /api/siii-lookups/paises` | — | Default: id=70 (Bolivia) |
| `cbodestino` (País Destino) | `GET /api/siii-lookups/paises` | — | Misma lista |

### SEC3 — Sustancias Sólidas

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cbosussol` | `GET /api/siii-lookups/sustancias-solidas-desc` | — |

### SEC4 — Sustancias Líquidas

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cbosusliq` | `GET /api/siii-lookups/sustancias-liquidas-desc` | — |

### SEC5 — Fábricas / Pozas

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cbotipofl` (Tipo Fábrica) | `GET /api/siii-lookups/tipos-fabrica` | — |
| `cbocaracfl` (Modelo Fábrica) | `GET /api/operativos/catalogos/fabrica-modelos/:id` | → cbotipofl |

### SEC6 — Detenidos / Arrestados

| Combo ASP | API lookup | Dependencia | Nota |
|---|---|---|---|
| `CboNacionalidad` | `GET /api/siii-lookups/paises` | — | Default: id=70 (Bolivia) |
| Estado (Aprehendido/Arrestado) | Campo texto fijo | — | `"APREHENDIDO"` o `"ARRESTADO"` |
| Tipo documento | `GET /api/siii-lookups/tipos-documento` | — | — |
| Estado civil | `GET /api/siii-lookups/estados-civiles` | — | — |

### SEC7 — Bienes Secuestrados (cascada triple)

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cbobien` (Tipo Bien) | `GET /api/siii-lookups/bienes` | — |
| `cboclase` (Clase) | `GET /api/operativos/catalogos/clases/:idBien` | → cbobien |
| `cbotipo` (Tipo) | `GET /api/operativos/catalogos/tipos/:idCatalogoClase` | → cboclase |
| Características | `GET /api/operativos/catalogos/caracteristicas/:idCatalogoClase` | → cboclase |

---

## 5. Flujo completo NUEVO operativo — curl

```bash
BASE="http://localhost:3000/api"
CASO_ID=7   # idAsignacion de la lista de no-aprobados
```

### FASE 0 — Verificar y cargar datos iniciales

```bash
# 0.0 — Obtener lista de no-aprobados (GridView2 de FRM-OP-ING)
curl "$BASE/operativos/casos/no-aprobados/usuario/JPEREZ"
# Response: [{ "idCaso": "7", "unidadDescripcion": "INTELIGENCIA CRIMINAL",
#              "distritaleDescripcion": "COCHABAMBA", "grupoDescripcion": "GRUPO ALFA",
#              "numeroCaso": "", "numeroCasoPerDom": "", "numeroOperativo": "CB-IC-42/26",
#              "nombreCaso": "OPERACION ALBA", "asignadoCaso": "TTE. GARCIA",
#              "fiscalAsignadoCaso": "DR. QUISPE" }]
# → usar idCaso de la fila seleccionada

# 0.1 — Confirmar que es NUEVO (array vacío)
curl "$BASE/operativos/caso/$CASO_ID"
# → { "datos": [] }  ← NUEVO

# 0.2 — Cargar datos del caso (pre-rellena SEC0 read-only)
curl "$BASE/operativos/nuevo/$CASO_ID"
# Response:
# {
#   "datos": {
#     "caso": {
#       "id": "7",
#       "numeroCaso": "",
#       "numeroOperativo": "CB-IC-42/26",
#       "nombreCaso": "OPERACION ALBA",
#       "idDepartamento": "CB",
#       "abreviaturaUnidad": "IC",
#       "idDistrital": 1,
#       "idGrupo": 3,
#       "fiscalSolicitud": "JPEREZ",
#       "telefonoSolicitud": "72345678",
#       "asignadoCaso": "TTE. GARCIA MAMANI JUAN CARLOS",
#       "telefonoAsignado": "71234567",
#       "fiscalAsignadoCaso": "DR. QUISPE TICONA MARIO",
#       "telefonoFiscal": "70000001",
#       "codigoServicio": "ICIA-060726032026"
#     },
#     "operativo": null
#   }
# }
```

### FASE 1 — Cargar todos los lookups estáticos (en paralelo)

```bash
# Estructura organizacional
curl "$BASE/siii-lookups/unidades"
curl "$BASE/siii-lookups/distritales/unidad/3"       # idUnidad del caso
curl "$BASE/siii-lookups/grupos/distrital/5"          # idDistrital del caso

# SEC1 — Datos operativo
curl "$BASE/siii-lookups/tipos-relevancia"
curl "$BASE/siii-lookups/tipos-denuncia"
curl "$BASE/siii-lookups/tipos-penal"
curl "$BASE/siii-lookups/departamentos"
curl "$BASE/siii-lookups/categorias-operativo"
curl "$BASE/siii-lookups/planes-operaciones"
curl "$BASE/siii-lookups/tipos-operacion"

# SEC2 — Drogas
curl "$BASE/siii-lookups/tipos-droga"
curl "$BASE/siii-lookups/formas-transporte"
curl "$BASE/siii-lookups/paises"

# SEC3/4 — Sustancias
curl "$BASE/siii-lookups/sustancias-solidas-desc"
curl "$BASE/siii-lookups/sustancias-liquidas-desc"

# SEC5 — Fábricas
curl "$BASE/siii-lookups/tipos-fabrica"

# SEC6 — Detenidos
curl "$BASE/siii-lookups/tipos-documento"
curl "$BASE/siii-lookups/estados-civiles"

# SEC7 — Bienes
curl "$BASE/siii-lookups/bienes"
```

### FASE 2 — Lookups dependientes (cuando usuario selecciona)

```bash
# Usuario selecciona Departamento = 2 (Cochabamba)
curl "$BASE/siii-lookups/provincias/departamento/2"
# Usuario selecciona Provincia = 15
curl "$BASE/siii-lookups/localidades/provincia/15"

# Usuario selecciona Categoría Operativo = 3
curl "$BASE/operativos/catalogos/items-operativo/3"

# Usuario selecciona Tipo Droga = 1 (Cocaína)
curl "$BASE/operativos/catalogos/estados-droga/1"

# Usuario selecciona Tipo Fábrica = 2
curl "$BASE/operativos/catalogos/fabrica-modelos/2"

# Usuario selecciona Bien = 4 (Vehículo)
curl "$BASE/operativos/catalogos/clases/4"
# Usuario selecciona Clase = 10
curl "$BASE/operativos/catalogos/tipos/10"
curl "$BASE/operativos/catalogos/caracteristicas/10"
```

### FASE 3 — Guardar operativo (POST SEC0)

```bash
# 3.1 — Crear el operativo principal
curl -X POST "$BASE/operativos" \
  -H "Content-Type: application/json" \
  -d '{
    "idCaso": "7",
    "idTipoRelevancia": 2,
    "numeroOperativo": "OP-FELCN-2024-001",
    "idTipoDenuncia": 1,
    "idTipoPenal": 3,
    "fechaOperativo": "2024-03-15T10:00:00",
    "idDepartamento": 2,
    "idProvincia": 15,
    "idLocalidad": 87,
    "lugar": "ZONA NORTE KM 12 CARRETERA ANTIGUA",
    "idCategoriaOperativo": 3,
    "idItemOperativo": 8,
    "idUnidad": 5,
    "idDistrital": 5,
    "idGrupo": 12,
    "mando": "CMDTE. JUAN MAMANI QUISPE",
    "gradosX": 17, "minX": 23, "segX": 45.5,
    "gradosY": 66, "minY": 9,  "segY": 22.1,
    "idPlanOperacion": 1,
    "breveDetalle": "Intervención en vivienda con presencia de laboratorio clandestino",
    "descripcion": "Durante operación de inteligencia se detectó...",
    "idTipoOperacion": 2,
    "organizacion": "CARTEL LOCAL",
    "clanFamiliar": "FAMILIA MAMANI"
  }'
# Response: { "datos": { "id": "42", "numeroOperativo": "OP-FELCN-2024-001", ... } }

# Guardar idOperativo = 42
OP_ID=42

# ⚠️ Tras este POST: deshabilitar TODOS los campos de SEC0 en el frontend
```

### FASE 4 — Agregar sub-entidades

```bash
# === SEC2: DROGAS ===
# Cada droga requiere 2 fotos (prueba + pesaje) — subir por multipart
curl -X POST "$BASE/operativos/$OP_ID/drogas" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoDroga": 1,
    "idEstadoDroga": 3,
    "cantidadGramos": 1500.5,
    "cantidadUnidades": 0,
    "idFormaTransporte": 2,
    "idPaisProcedencia": 70,
    "idPaisDestino": 70,
    "observaciones": "Droga en estado sólido prensado"
  }'
# → { "datos": { "id": "101", ... } }

# Verificar peso total de drogas
curl "$BASE/operativos/$OP_ID/drogas/pesaje"

# === SEC3: SUSTANCIAS SÓLIDAS ===
# Cantidad = kg + (gramos/1000) — el frontend hace la conversión
curl -X POST "$BASE/operativos/$OP_ID/sustancias-solidas" \
  -H "Content-Type: application/json" \
  -d '{
    "idSustanciaSolidaDescripcion": 5,
    "cantidad": 2.750,
    "unidadMedida": "KG",
    "observaciones": "Acetona"
  }'

# === SEC4: SUSTANCIAS LÍQUIDAS ===
# Cantidad = litros + (ml/1000)
curl -X POST "$BASE/operativos/$OP_ID/sustancias-liquidas" \
  -H "Content-Type: application/json" \
  -d '{
    "idSustanciaLiquidaDescripcion": 3,
    "cantidad": 15.5,
    "unidadMedida": "LT",
    "observaciones": "Éter etílico"
  }'

# === SEC5: FÁBRICAS / LABORATORIOS ===
curl -X POST "$BASE/operativos/$OP_ID/fabricas" \
  -H "Content-Type: application/json" \
  -d '{
    "idFabricaModelo": 4,
    "cantidad": 1,
    "observaciones": "Laboratorio rudimentario con capacidad de 5 kg/día"
  }'

# === SEC6: DETENIDOS (estado: APREHENDIDO o ARRESTADO) ===
curl -X POST "$BASE/operativos/$OP_ID/detenidos" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCaso": "CASO-2024-007",
    "nombres": "CARLOS",
    "apellidoPaterno": "MAMANI",
    "apellidoMaterno": "QUISPE",
    "idPais": 70,
    "idTipoDocumento": 12,
    "numeroDocumento": "7654321",
    "esMasculino": true,
    "fechaNacimiento": "1985-06-15",
    "idEstadoCivil": 1,
    "serie": "LP",
    "seccion": "A",
    "direccion": "AV. HEROINAS N 123 ZONA CENTRAL",
    "observaciones": "Aprehendido en flagrancia",
    "estado": "APREHENDIDO"
  }'
# → { "datos": { "id": "55", ... } }
DET_ID=55

# Subir 3 fotos del detenido (requerido: frente + perfil-der + perfil-izq)
curl -X POST "$BASE/operativos/$OP_ID/detenidos/$DET_ID/fotos/frente" \
  -F "foto=@/ruta/foto_frente.jpg"

curl -X POST "$BASE/operativos/$OP_ID/detenidos/$DET_ID/fotos/perfil-derecho" \
  -F "foto=@/ruta/foto_perfil_der.jpg"

curl -X POST "$BASE/operativos/$OP_ID/detenidos/$DET_ID/fotos/perfil-izquierdo" \
  -F "foto=@/ruta/foto_perfil_izq.jpg"

# === SEC7: BIENES SECUESTRADOS ===
curl -X POST "$BASE/operativos/$OP_ID/bienes" \
  -H "Content-Type: application/json" \
  -d '{
    "idCatalogoTipo": 22,
    "cantidad": 1,
    "costoAproximado": 25000,
    "costoCuantificado": 0,
    "esInvestigacion": false,
    "observaciones": "Vehículo Toyota Hilux sin placa"
  }'
# → { "datos": { "id": "88", ... } }
BIEN_ID=88

# Agregar características al bien
curl -X POST "$BASE/operativos/$OP_ID/bienes/$BIEN_ID/caracteristicas" \
  -H "Content-Type: application/json" \
  -d '{"idCatalogoCaracteristica": 7, "descripcion": "BLANCO"}'

curl -X POST "$BASE/operativos/$OP_ID/bienes/$BIEN_ID/caracteristicas" \
  -H "Content-Type: application/json" \
  -d '{"idCatalogoCaracteristica": 8, "descripcion": "2022"}'

# === SEC8: GALERÍA FOTOGRÁFICA ===
curl -X POST "$BASE/operativos/$OP_ID/galeria" \
  -F "descripcion=Vista exterior del laboratorio" \
  -F "foto=@/ruta/foto_galeria.jpg"

# === SEC9: LOGOTIPOS ===
curl -X POST "$BASE/operativos/$OP_ID/logotipos" \
  -F "numeroCaso=CASO-2024-007" \
  -F "numeroOperativo=OP-FELCN-2024-001" \
  -F "fechaOperativo=2024-03-15T10:00:00" \
  -F "nombreCaso=OPERACIÓN ALFA" \
  -F "descripcion=Logotipo identificado en embalaje" \
  -F "imagen=IMAGEN_BASE64_AQUI" \
  -F "descripcionLogo=Marca cartel" \
  -F "idTipoDroga=1" \
  -F "idPaisOrigen=70" \
  -F "idPaisDestino=70" \
  -F "organizacion=CARTEL LOCAL" \
  -F "fotografia=@/ruta/logo.jpg"
```

---

## 6. Flujo completo EDICIÓN operativo — curl

```bash
BASE="http://localhost:3000/api"
CASO_ID=7
```

### FASE 0 — Verificar que es EDICIÓN y obtener idOperativo

```bash
# Verificar → array con datos = EDICIÓN
curl "$BASE/operativos/caso/$CASO_ID"
# Response:
# { "datos": [{ "id": "42", "numeroOperativo": "OP-FELCN-2024-001", ... }] }

OP_ID=42  # datos[0].id

# Cargar resumen para carga inicial rápida
curl "$BASE/operativos/$OP_ID/resumen"
# Response:
# {
#   "datos": {
#     "operativo": {
#       "id": "42",
#       "idCaso": "7",
#       "numeroOperativo": "OP-FELCN-2024-001",
#       "fechaOperativo": "2024-03-15T10:00:00",
#       "idDepartamento": 2, "idProvincia": 15, "idLocalidad": 87,
#       "lugar": "ZONA NORTE KM 12",
#       "idTipoRelevancia": 2,
#       "idTipoDenuncia": 1,
#       "idTipoPenal": 3,
#       "idCategoriaOperativo": 3,
#       "idItemOperativo": 8,
#       "descripcion": "Durante operación de inteligencia...",
#       "breveDetalle": "Intervención en vivienda..."
#     },
#     "estadisticas": {
#       "drogas": 1,
#       "sustanciasSolidas": 1,
#       "sustanciasLiquidas": 1,
#       "fabricas": 1,
#       "bienes": 1,
#       "detenidos": 1,
#       "galeria": 1,
#       "logotipos": 1
#     }
#   }
# }
```

### FASE 1 — Mismos lookups estáticos (ya en cache)

Los lookups son idénticos al flujo NUEVO. Si ya están en cache del módulo, no se vuelven a cargar.

```bash
# Solo cargar los dependientes según los valores del operativo
curl "$BASE/siii-lookups/provincias/departamento/2"      # idDepartamento del operativo
curl "$BASE/siii-lookups/localidades/provincia/15"        # idProvincia del operativo
curl "$BASE/operativos/catalogos/items-operativo/3"       # idCategoriaOperativo del operativo
curl "$BASE/siii-lookups/distritales/unidad/5"            # idUnidad del operativo
curl "$BASE/siii-lookups/grupos/distrital/5"              # idDistrital del operativo
```

### FASE 2 — Cargar secciones (lazy, por estadísticas)

```bash
# Usar estadísticas del resumen para priorizar qué cargar
# Solo cargar secciones con count > 0

# Si estadisticas.drogas > 0:
curl "$BASE/operativos/$OP_ID/drogas"
curl "$BASE/operativos/$OP_ID/drogas/pesaje"

# Si estadisticas.sustanciasSolidas > 0:
curl "$BASE/operativos/$OP_ID/sustancias-solidas"

# Si estadisticas.sustanciasLiquidas > 0:
curl "$BASE/operativos/$OP_ID/sustancias-liquidas"

# Si estadisticas.fabricas > 0:
curl "$BASE/operativos/$OP_ID/fabricas"

# Si estadisticas.detenidos > 0:
curl "$BASE/operativos/$OP_ID/detenidos"

# Si estadisticas.bienes > 0:
curl "$BASE/operativos/$OP_ID/bienes"
# Para cada bien:
curl "$BASE/operativos/$OP_ID/bienes/$BIEN_ID/caracteristicas"

# Si estadisticas.galeria > 0:
curl "$BASE/operativos/$OP_ID/galeria"

# Si estadisticas.logotipos > 0:
curl "$BASE/operativos/$OP_ID/logotipos"
```

### FASE 3 — Editar sub-entidades

```bash
# SEC0 está BLOQUEADO (el operativo ya existe — todos los campos disabled)

# Agregar nueva droga
curl -X POST "$BASE/operativos/$OP_ID/drogas" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoDroga": 2,
    "idEstadoDroga": 1,
    "cantidadGramos": 500,
    "idFormaTransporte": 1,
    "idPaisProcedencia": 70,
    "idPaisDestino": 49
  }'

# Eliminar droga
curl -X DELETE "$BASE/operativos/$OP_ID/drogas/101"

# Eliminar detenido
curl -X DELETE "$BASE/operativos/$OP_ID/detenidos/55"

# Eliminar bien y sus características se eliminan en cascada en BD
curl -X DELETE "$BASE/operativos/$OP_ID/bienes/88"

# Eliminar característica individual de un bien
curl -X DELETE "$BASE/operativos/$OP_ID/bienes/$BIEN_ID/caracteristicas/7"

# Eliminar foto de galería
curl -X DELETE "$BASE/operativos/$OP_ID/galeria/1"

# Ver foto de galería
curl "$BASE/operativos/$OP_ID/galeria/1/full"          # original
curl "$BASE/operativos/$OP_ID/galeria/1/thumbnail"      # miniatura
curl "$BASE/operativos/$OP_ID/galeria/1/medium"         # vista previa

# Ver fotos de detenido
curl "$BASE/operativos/$OP_ID/detenidos/$DET_ID/fotos/frente"
curl "$BASE/operativos/$OP_ID/detenidos/$DET_ID/fotos/perfil-derecho"
curl "$BASE/operativos/$OP_ID/detenidos/$DET_ID/fotos/perfil-izquierdo"

# Ver foto de bien
curl "$BASE/operativos/$OP_ID/bienes/$BIEN_ID/foto"

# Ver foto de logotipo
curl "$BASE/operativos/$OP_ID/logotipos/1/foto"
```

---

## 7. Reglas de negocio y validaciones

### SEC0 — Inmutabilidad

- **Todos** los campos de SEC0 quedan `disabled` en el frontend tras el primer `POST /operativos`.
- El backend no lo valida (confiar en el frontend por ahora).
- Campos inmutables: `numeroCaso`, `unidad`, `distrital`, `grupo`, `solicita`, `asignado`, `fiscal`, `tipoDenuncia`, `tipoPenal`, `fechaOperativo`, `departamento`, `provincia`, `municipio`, `lugar`, `categoria`, `mando`, `planOperaciones`, `tipoOperacion`, `clanFamiliar`, `organizacion`, coordenadas.

### Conversiones que hace el frontend

```javascript
// GPS: el frontend envía grados/min/seg, el backend calcula coordenada decimal
// (el backend hace: coordX = (grados + min/60 + seg/3600) * -1)

// Peso de drogas: el frontend convierte a gramos antes de enviar
const cantidadGramos =
  (toneladas || 0) * 1_000_000 +
  (kilos    || 0) * 1_000 +
  (gramos   || 0) +
  (miligramos || 0) / 1_000

// Sustancia sólida: el frontend envía en KG
const cantidadKg = (kilos || 0) + (gramos || 0) / 1_000

// Sustancia líquida: el frontend envía en LT
const cantidadLt = (litros || 0) + (ml || 0) / 1_000
```

### Defaults que aplica el frontend

```javascript
// Detenidos
apellidoMaterno = apellidoMaterno || '*'
apellidoEsposo  = apellidoEsposo  || '*'
serie           = serie           || ''
numeroDocumento = numeroDocumento || 'SN'

// País detenido: preseleccionar id=70 (Bolivia)
// País procedencia droga: preseleccionar id=70 (Bolivia)
```

### Imágenes

- **Galería:** `POST /operativos/:id/galeria` — campo `foto` (multipart)
- **Detenidos:** 3 fotos separadas por endpoint (frente, perfil-der, perfil-izq)
- **Bienes:** `POST /operativos/:id/bienes/:idBien/foto` — campo `foto` (multipart)
- **Logotipos:** `POST /operativos/:id/logotipos` — campo `fotografia` (multipart)
- Todas las fotos se recuperan como binario (`Content-Type: image/jpeg`)

---

## 8. Referencia de endpoints

### Formato de response estándar

```json
{ "finalizado": true, "mensaje": "...", "datos": {} }
{ "finalizado": false, "codigo": 404, "mensaje": "No encontrado" }
```

### Endpoints — Listas de Casos (fuente: `felcn_siii`)

| Método | Endpoint | Función ASP | Descripción |
|---|---|---|---|
| GET | `/operativos/casos/usuario/:usuario` | `muestraoperativos()` | Todos los casos del usuario |
| GET | `/operativos/casos/no-aprobados/usuario/:usuario` | `muestranoaprob()` | Sin número de caso (entrada a FRM-OP) |

> **Contrato de respuesta:** `{ idCaso, unidadDescripcion, distritaleDescripcion, grupoDescripcion, numeroCaso, numeroCasoPerDom, numeroOperativo, nombreCaso, asignadoCaso, fiscalAsignadoCaso }`

> **Nota:** Los endpoints `/api/asignaciones/usuario/:login` y `/api/asignaciones/usuario/:login/no-aprobados` quedan obsoletos — leían de `felcn_asignacion_caso` que no es la fuente correcta per ASP.

### Endpoints — Operativo principal

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/nuevo/:casoId` | Datos del caso para formulario nuevo |
| GET | `/operativos/caso/:idCaso` | Verificar si existe → NEW o EDIT |
| GET | `/operativos/:id/resumen` | Carga rápida: datos + estadísticas |
| GET | `/operativos/:id` | Operativo completo |
| POST | `/operativos` | Crear operativo (SEC0) |
| PATCH | `/operativos/:id` | Actualizar operativo |
| PATCH | `/operativos/:id/inactivar` | Marcar como revisado |

### Endpoints — Sub-entidades

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/:id/drogas` | Listar drogas |
| GET | `/operativos/:id/drogas/pesaje` | Resumen peso total |
| POST | `/operativos/:id/drogas` | Agregar droga |
| DELETE | `/operativos/:id/drogas/:idDroga` | Eliminar droga |
| GET | `/operativos/:id/sustancias-solidas` | Listar |
| POST | `/operativos/:id/sustancias-solidas` | Agregar |
| DELETE | `/operativos/:id/sustancias-solidas/:id` | Eliminar |
| GET | `/operativos/:id/sustancias-liquidas` | Listar |
| POST | `/operativos/:id/sustancias-liquidas` | Agregar |
| DELETE | `/operativos/:id/sustancias-liquidas/:id` | Eliminar |
| GET | `/operativos/:id/fabricas` | Listar |
| POST | `/operativos/:id/fabricas` | Agregar |
| DELETE | `/operativos/:id/fabricas/:id` | Eliminar |
| GET | `/operativos/:id/detenidos` | Listar |
| POST | `/operativos/:id/detenidos` | Agregar |
| DELETE | `/operativos/:id/detenidos/:id` | Eliminar |
| GET | `/operativos/:id/bienes` | Listar bienes |
| POST | `/operativos/:id/bienes` | Agregar bien |
| DELETE | `/operativos/:id/bienes/:id` | Eliminar bien |
| GET | `/operativos/:id/bienes/:idBien/caracteristicas` | Listar características |
| POST | `/operativos/:id/bienes/:idBien/caracteristicas` | Agregar característica |
| DELETE | `/operativos/:id/bienes/:idBien/caracteristicas/:id` | Eliminar |
| GET | `/operativos/:id/galeria` | Listar galería |
| POST | `/operativos/:id/galeria` | Subir foto (multipart: `foto`) |
| DELETE | `/operativos/:id/galeria/:id` | Eliminar foto |
| GET | `/operativos/:id/logotipos` | Listar |
| POST | `/operativos/:id/logotipos` | Subir (multipart: `fotografia`) |
| DELETE | `/operativos/:id/logotipos/:id` | Eliminar |

### Endpoints — Imágenes (respuesta binaria)

| Método | Endpoint |
|---|---|
| GET | `/operativos/:id/galeria/:idFoto/thumbnail` |
| GET | `/operativos/:id/galeria/:idFoto/medium` |
| GET | `/operativos/:id/galeria/:idFoto/full` |
| GET | `/operativos/:id/detenidos/:idDet/fotos/frente` |
| GET | `/operativos/:id/detenidos/:idDet/fotos/perfil-derecho` |
| GET | `/operativos/:id/detenidos/:idDet/fotos/perfil-izquierdo` |
| GET | `/operativos/:id/bienes/:idBien/foto` |
| GET | `/operativos/:id/logotipos/:idLogo/foto` |

### Endpoints — Catálogos dependientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/catalogos/estados-droga/:idTipoDroga` | Estados según tipo droga |
| GET | `/operativos/catalogos/fabrica-modelos/:idTipoFabrica` | Modelos según tipo fábrica |
| GET | `/operativos/catalogos/items-operativo/:idCategoria` | Items según categoría operativo |
| GET | `/operativos/catalogos/clases/:idBien` | Clases según bien |
| GET | `/operativos/catalogos/tipos/:idCatalogoClase` | Tipos según clase |
| GET | `/operativos/catalogos/caracteristicas/:idCatalogoClase` | Características según clase |

### Endpoints — Lookups estáticos `/siii-lookups/`

| Endpoint | Combo que alimenta |
|---|---|
| `GET /siii-lookups/tipos-relevancia` | cborelevancia |
| `GET /siii-lookups/tipos-denuncia` | cbotipodenuncia |
| `GET /siii-lookups/tipos-penal` | cbotipopenal |
| `GET /siii-lookups/tipos-operacion` | cbotipoop |
| `GET /siii-lookups/departamentos` | cbodepartamento |
| `GET /siii-lookups/provincias/departamento/:id` | cboprovincia |
| `GET /siii-lookups/localidades/provincia/:id` | cbomunicipio |
| `GET /siii-lookups/categorias-operativo` | cbocategoria |
| `GET /siii-lookups/planes-operaciones` | cboplanoperaciones |
| `GET /siii-lookups/unidades` | cbounidad |
| `GET /siii-lookups/distritales/unidad/:id` | cboDistrital |
| `GET /siii-lookups/grupos/distrital/:id` | cboGrupo |
| `GET /siii-lookups/tipos-droga` | cbotipodrogas |
| `GET /siii-lookups/formas-transporte` | cboformatran |
| `GET /siii-lookups/paises` | cboproceden, cbodestino, CboNacionalidad |
| `GET /siii-lookups/sustancias-solidas-desc` | cbosussol |
| `GET /siii-lookups/sustancias-liquidas-desc` | cbosusliq |
| `GET /siii-lookups/tipos-fabrica` | cbotipofl |
| `GET /siii-lookups/bienes` | cbobien |
| `GET /siii-lookups/tipos-documento` | Tipo documento detenido |
| `GET /siii-lookups/estados-civiles` | Estado civil detenido |

---

**Última actualización:** 2026-03-06
**Versión:** 3.1 — Corregido origen de datos: ambas listas de FRM-OP-ING leen de `felcn_siii`
