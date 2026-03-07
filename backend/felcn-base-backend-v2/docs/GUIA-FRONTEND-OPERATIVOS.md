# GUÍA FRONTEND — MÓDULO OPERATIVOS

**Versión:** 4.2 — Corrección campos `caso` y `numeroOperativo` ingresado por usuario
**Fecha:** 2026-03-07
**Base URL:** `http://localhost:3000/api`

---

## ÍNDICE

1. [Modelo de datos](#1-modelo-de-datos)
2. [Contrato del GET unificado](#2-contrato-del-get-unificado)
3. [Estrategia de lookups](#3-estrategia-de-lookups)
4. [Tabla completa: API lookup → Combo del formulario](#4-tabla-completa-api-lookup--combo-del-formulario)
5. [Flujo completo NUEVO operativo — curl](#5-flujo-completo-nuevo-operativo--curl)
6. [Flujo completo EDICIÓN operativo — curl](#6-flujo-completo-edición-operativo--curl)
7. [Reglas de negocio y validaciones](#7-reglas-de-negocio-y-validaciones)
8. [Referencia de endpoints](#8-referencia-de-endpoints)

---

## 1. Modelo de datos

```
ASIGNACION (felcn_siii · public)
  id_caso  ← clave de negocio usada en toda la API
  nombre_caso, numero_operativo, asignacion_caso, fiscal_asignado
  id_unidad (char 2), id_distrital, id_grupo
  fono_solicitud, fono_asignado, fono_fiscal, fecha_solicitud
  ↓ (1:1 en este sistema)
OPERATIVO (felcn_siii · public)
  id_operativo   ← ID interno (admin/debug únicamente)
  id_caso        ← FK a asignacion
  ↓ (1:N)
  ├─ DROGA
  ├─ SUSTANCIA_SOLIDA
  ├─ SUSTANCIA_LIQUIDA
  ├─ FABRICA
  ├─ DETENIDO_AUXILIAR
  ├─ ITEM_BIEN_SECUESTRADO
  │   └─ ITEM_BIEN_CARACTERISTICA (1:N)
  ├─ GALERIA
  └─ LOGOTIPO
```

> **Principio:** El frontend trabaja **siempre** con `idCaso`. El backend resuelve
> `idCaso → idOperativo` internamente. El frontend nunca necesita conocer `idOperativo`.

---

## 2. Contrato del GET unificado

```
GET /api/operativos/caso/:idCaso
```

La respuesta tiene **dos grupos** de datos con orígenes distintos:

### Grupo `caso` — datos de `asignacion` (siempre frescos, siempre presentes)

Provienen **siempre** de la tabla `asignacion` en tiempo real, sin importar si el
operativo existe o no. Son **de solo lectura** — nunca se envían en POST ni PATCH.
Sirven para pre-rellenar los campos de cabecera (referencia) del formulario.

**Campos que contiene `caso`:**

| Campo | Field ASP | Comportamiento en formulario |
|---|---|---|
| `idCaso` | (interno) | No se muestra; se usa en la URL |
| `numeroOperativo` | `txtnroop` | Read-only. Número de referencia del caso (≠ nro. de informe) |
| `nombreCaso` | `txtnombrecaso` | Read-only. Siempre visible |
| `fiscalSolicitud` | `txtsolicita` | Read-only |
| `telefonoSolicitud` | `fonosolicita` | Read-only |
| `asignadoCaso` | `txtasignadocaso` | Read-only |
| `telefonoAsignado` | `fonoasignado` | Read-only |
| `fiscalAsignadoCaso` | `txtfiscalasignado` | Read-only |
| `telefonoFiscal` | `fonofiscal` | Read-only |

> **Unidad / Distrital / Grupo** (`cbounidad`, `cboDistrital`, `cboGrupo`):
> Los combos se cargan **siempre** desde `felcn_siii` (vía `/api/siii-lookups/unidades` etc.).
> Para formulario **nuevo** no hay pre-selección — el usuario elige.
> Para **edición** se pre-seleccionan con `operativo.idUnidad`, `operativo.idDistrital`,
> `operativo.idGrupo` y luego se deshabilitan.
> `caso` no expone estos valores porque en `asignacion` solo existe `abreviaturaUnidad`
> (char), no los enteros FK del formulario de SIII.

### Grupo `operativo` — datos de la tabla `operativo`

Es `null` si el caso no tiene operativo aún (formulario nuevo).
Es el objeto completo de la entity si ya existe (formulario edición).
Estos datos se usan para pre-rellenar el formulario en edición.
El body de POST/PATCH corresponde 1:1 con los campos editables de este grupo (ver tabla más abajo).

### Response — cuando operativo NO existe (nuevo)

```json
{
  "finalizado": true,
  "datos": {
    "caso": {
      "idCaso": "7",
      "numeroOperativo": "CB-IC-42/26",
      "nombreCaso": "OPERACION ALBA",
      "fiscalSolicitud": "JPEREZ",
      "telefonoSolicitud": "72345678",
      "asignadoCaso": "TTE. GARCIA MAMANI JUAN CARLOS",
      "telefonoAsignado": "71234567",
      "fiscalAsignadoCaso": "DR. QUISPE TICONA MARIO",
      "telefonoFiscal": "70000001"
    },
    "operativo": null
  }
}
```

### Response — cuando operativo YA existe (edición)

```json
{
  "finalizado": true,
  "datos": {
    "caso": {
      "idCaso": "7",
      "numeroOperativo": "CB-IC-42/26",
      "nombreCaso": "OPERACION ALBA",
      "fiscalSolicitud": "JPEREZ",
      "telefonoSolicitud": "72345678",
      "asignadoCaso": "TTE. GARCIA MAMANI JUAN CARLOS",
      "telefonoAsignado": "71234567",
      "fiscalAsignadoCaso": "DR. QUISPE TICONA MARIO",
      "telefonoFiscal": "70000001"
    },
    "operativo": {
      "id": "42",
      "idCaso": "7",
      "numeroOperativo": "IC-042/2026",
      "idTipoRelevancia": 2,
      "idTipoDenuncia": 1,
      "idTipoPenal": 3,
      "fechaOperativo": "2024-03-15T10:00:00.000Z",
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
      "gradosX": 17,
      "minX": 23,
      "segX": 45.5,
      "coordX": -17.395972,
      "gradosY": 66,
      "minY": 9,
      "segY": 22.1,
      "coordY": -66.156139,
      "idPlanOperacion": 1,
      "breveDetalle": "Intervención en vivienda con laboratorio clandestino",
      "descripcion": "Durante operación de inteligencia se detectó...",
      "idTipoOperacion": 2,
      "organizacion": "CARTEL LOCAL",
      "clanFamiliar": "FAMILIA MAMANI",
      "esRevisado": false,
      "esPositivo": true,
      "esAprehendido": false,
      "esArrestado": false,
      "esIcia": true,
      "esParteDiario": false,
      "fechaHoraIngreso": "2024-03-15T14:22:00.000Z",
      "usuario": "SISTEMA"
    }
  }
}
```

### Lógica frontend

```javascript
const { caso, operativo } = response.datos

if (operativo === null) {
  // NUEVO: pre-rellenar cabecera (txtnombrecaso, txtnroop, etc.) con datos de caso.
  // Combos cbounidad/cboDistrital/cboGrupo sin pre-selección — el usuario elige.
  renderFormularioNuevo(caso)
} else {
  // EDICIÓN: pre-rellenar todo el formulario con datos de operativo.
  // Deshabilitar txtnroinf, cbounidad, cboDistrital, cboGrupo (inmutables).
  renderFormularioEdicion(caso, operativo)
  cargarSeccionesLazy(caso.idCaso)
}
```

### Campos del body POST/PATCH vs campos del GET `operativo`

El body de POST y PATCH es el **mismo DTO** (`OperativoDto`). La correspondencia
con el GET es:

| Campo en GET `operativo` | En POST/PATCH body | Field ASP | Nota |
|---|---|---|---|
| `id` | no | — | ID interno, generado por BD |
| `idCaso` | no | — | viene de la URL |
| `numeroOperativo` | **sí** | `txtnroinf` | Número de informe, ingresado por el usuario |
| `fechaOperativo` | **sí** | `txtfechaop` | el usuario lo elige |
| `idTipoRelevancia` | **sí** | `cborelevancia` | — |
| `idTipoDenuncia` | **sí** | `cbotipodenuncia` | opcional |
| `idTipoPenal` | **sí** | `cbotipopenal` | opcional |
| `idDepartamento` | **sí** | `cbodepartamento` | — |
| `idProvincia` | **sí** | `cboprovincia` | dependiente de departamento |
| `idLocalidad` | **sí** | `cbomunicipio` | dependiente de provincia |
| `lugar` | **sí** | `txtlugar` | — |
| `idCategoriaOperativo` | **sí** | `cbocategoria` | — |
| `idItemOperativo` | **sí** | `cbosubcategoria` | dependiente de categoría |
| `idUnidad` | **sí** | `cbounidad` | de `felcn_siii`; disabled tras guardar |
| `idDistrital` | **sí** | `cboDistrital` | dependiente de unidad; disabled tras guardar |
| `idGrupo` | **sí** | `cboGrupo` | dependiente de distrital; disabled tras guardar |
| `mando` | **sí** | `txtmando` | — |
| `gradosX`, `minX`, `segX` | **sí** | `txtgradosx`, `txtminx`, `txtsegx` | DMS — el backend calcula `coordX` |
| `gradosY`, `minY`, `segY` | **sí** | `txtgradosy`, `txtminy`, `txtsegy` | DMS — el backend calcula `coordY` |
| `coordX`, `coordY` | no | — | calculados por el backend, solo en GET |
| `idPlanOperacion` | **sí** | `cboplanoperaciones` | — |
| `breveDetalle` | **sí** | `txtbrevedetalle` | opcional |
| `descripcion` | **sí** | `txtdescripcion` | — |
| `idTipoOperacion` | **sí** | `cbotipoop` | — |
| `organizacion` | **sí** | `txtorganizacion` | — |
| `clanFamiliar` | **sí** | `txtclanfamiliar` | opcional |
| `esRevisado`, `esPositivo`, etc. | no | — | flags de sistema, defaults en backend |
| `fechaHoraIngreso`, `usuario` | no | — | gestionados por el backend |

---

## 3. Estrategia de lookups

**Todos los lookups del formulario provienen de `felcn_siii` vía `/api/siii-lookups/`.**

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

### SEC0 — Datos del caso (de `datos.caso`, solo lectura)

| Campo formulario | Campo de `datos.caso` | Nota |
|---|---|---|
| `txtnombrecaso` | `caso.nombreCaso` | Read-only |
| `txtnroop` | `caso.numeroOperativo` | Read-only (nro. de referencia del caso) |
| `txtsolicita` | `caso.fiscalSolicitud` | Read-only |
| `fonosolicita` | `caso.telefonoSolicitud` | Read-only |
| `txtasignadocaso` | `caso.asignadoCaso` | Read-only |
| `fonoasignado` | `caso.telefonoAsignado` | Read-only |
| `txtfiscalasignado` | `caso.fiscalAsignadoCaso` | Read-only |
| `fonofiscal` | `caso.telefonoFiscal` | Read-only |

### SEC0 — Campos ingresados por el usuario

| Campo formulario | Campo en body / `datos.operativo` | Nota |
|---|---|---|
| `txtnroinf` | `numeroOperativo` | Nro. de informe, el usuario lo escribe |
| `cbounidad` | `idUnidad` | Lista de `felcn_siii`; disabled tras guardar |
| `cboDistrital` | `idDistrital` | Dependiente de unidad; disabled tras guardar |
| `cboGrupo` | `idGrupo` | Dependiente de distrital; disabled tras guardar |

> **Nuevo:** combos de unidad/distrital/grupo sin pre-selección — el usuario elige.
> **Edición:** pre-seleccionar con `operativo.idUnidad`, `operativo.idDistrital`, `operativo.idGrupo` y deshabilitar.

> Tras el `POST /caso/:idCaso` exitoso: deshabilitar `txtnroinf`, `cbounidad`, `cboDistrital`, `cboGrupo`.

### SEC0 — Combos de estructura (cascada)

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cbounidad` | `GET /api/siii-lookups/unidades` | — |
| `cboDistrital` | `GET /api/siii-lookups/distritales/unidad/:id` | → cbounidad |
| `cboGrupo` | `GET /api/siii-lookups/grupos/distrital/:id` | → cboDistrital |

### SEC1 — Datos del operativo

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cborelevancia` | `GET /api/siii-lookups/tipos-relevancia` | — |
| `cbotipodenuncia` | `GET /api/siii-lookups/tipos-denuncia` | — |
| `cbotipopenal` | `GET /api/siii-lookups/tipos-penal` | — |
| `cbodepartamento` | `GET /api/siii-lookups/departamentos` | — |
| `cboprovincia` | `GET /api/siii-lookups/provincias/departamento/:id` | → cbodepartamento |
| `cbomunicipio` | `GET /api/siii-lookups/localidades/provincia/:id` | → cboprovincia |
| `cbocategoria` | `GET /api/siii-lookups/categorias-operativo` | — |
| `cbosubcategoria` | `GET /api/operativos/catalogos/items-operativo/:id` | → cbocategoria |
| `cboplanoperaciones` | `GET /api/siii-lookups/planes-operaciones` | — |
| `cbotipoop` | `GET /api/siii-lookups/tipos-operacion` | — |

### SEC2 — Drogas

| Combo ASP | API lookup | Dependencia | Nota |
|---|---|---|---|
| `cbotipodrogas` | `GET /api/siii-lookups/tipos-droga` | — | — |
| `cboestadodroga` | `GET /api/operativos/catalogos/estados-droga/:id` | → cbotipodrogas | — |
| `cboformatran` | `GET /api/siii-lookups/formas-transporte` | — | — |
| `cboproceden` | `GET /api/siii-lookups/paises` | — | Default: id=70 (Bolivia) |
| `cbodestino` | `GET /api/siii-lookups/paises` | — | Misma lista |

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
| `cbotipofl` | `GET /api/siii-lookups/tipos-fabrica` | — |
| `cbocaracfl` | `GET /api/operativos/catalogos/fabrica-modelos/:id` | → cbotipofl |

### SEC6 — Detenidos / Arrestados

| Combo ASP | API lookup | Dependencia | Nota |
|---|---|---|---|
| `CboNacionalidad` | `GET /api/siii-lookups/paises` | — | Default: id=70 (Bolivia) |
| Tipo documento | `GET /api/siii-lookups/tipos-documento` | — | — |
| Estado civil | `GET /api/siii-lookups/estados-civiles` | — | — |

### SEC7 — Bienes Secuestrados (cascada triple)

| Combo ASP | API lookup | Dependencia |
|---|---|---|
| `cbobien` | `GET /api/siii-lookups/bienes` | — |
| `cboclase` | `GET /api/operativos/catalogos/clases/:idBien` | → cbobien |
| `cbotipo` | `GET /api/operativos/catalogos/tipos/:idCatalogoClase` | → cboclase |
| Características | `GET /api/operativos/catalogos/caracteristicas/:idCatalogoClase` | → cboclase |

---

## 5. Flujo completo NUEVO operativo — curl

```bash
BASE="http://localhost:3000/api"
CASO_ID=7
```

### FASE 0 — Obtener lista y cargar datos del caso

```bash
# 0.1 — Lista de no-aprobados (entrada al formulario)
curl "$BASE/operativos/casos/no-aprobados/usuario/JPEREZ"
# → [{ "idCaso": "7", "nombreCaso": "OPERACION ALBA", "numeroOperativo": "CB-IC-42/26", ... }]

# 0.2 — GET unificado: operativo:null confirma que es NUEVO
curl "$BASE/operativos/caso/$CASO_ID"
# Response:
# {
#   "finalizado": true,
#   "datos": {
#     "caso": {
#       "idCaso": "7",
#       "numeroOperativo": "CB-IC-42/26",   ← txtnroop (referencia, read-only)
#       "nombreCaso": "OPERACION ALBA",
#       "fiscalSolicitud": "JPEREZ",
#       "telefonoSolicitud": "72345678",
#       "asignadoCaso": "TTE. GARCIA MAMANI JUAN CARLOS",
#       "telefonoAsignado": "71234567",
#       "fiscalAsignadoCaso": "DR. QUISPE TICONA MARIO",
#       "telefonoFiscal": "70000001"
#     },
#     "operativo": null   ← null = NUEVO
#   }
# }
```

### FASE 1 — Lookups estáticos (en paralelo con FASE 0)

```bash
curl "$BASE/siii-lookups/unidades"
curl "$BASE/siii-lookups/distritales/unidad/..."    # el usuario elige unidad primero
curl "$BASE/siii-lookups/grupos/distrital/..."      # el usuario elige distrital primero
curl "$BASE/siii-lookups/tipos-relevancia"
curl "$BASE/siii-lookups/tipos-denuncia"
curl "$BASE/siii-lookups/tipos-penal"
curl "$BASE/siii-lookups/departamentos"
curl "$BASE/siii-lookups/categorias-operativo"
curl "$BASE/siii-lookups/planes-operaciones"
curl "$BASE/siii-lookups/tipos-operacion"
curl "$BASE/siii-lookups/tipos-droga"
curl "$BASE/siii-lookups/formas-transporte"
curl "$BASE/siii-lookups/paises"
curl "$BASE/siii-lookups/sustancias-solidas-desc"
curl "$BASE/siii-lookups/sustancias-liquidas-desc"
curl "$BASE/siii-lookups/tipos-fabrica"
curl "$BASE/siii-lookups/tipos-documento"
curl "$BASE/siii-lookups/estados-civiles"
curl "$BASE/siii-lookups/bienes"
```

### FASE 2 — Lookups dependientes (on-demand al seleccionar)

```bash
curl "$BASE/siii-lookups/provincias/departamento/2"
curl "$BASE/siii-lookups/localidades/provincia/15"
curl "$BASE/operativos/catalogos/items-operativo/3"
curl "$BASE/operativos/catalogos/estados-droga/1"
curl "$BASE/operativos/catalogos/fabrica-modelos/2"
curl "$BASE/operativos/catalogos/clases/4"
curl "$BASE/operativos/catalogos/tipos/10"
curl "$BASE/operativos/catalogos/caracteristicas/10"
```

### FASE 3 — Crear el operativo

```bash
# numeroOperativo = txtnroinf (ingresado por el usuario, ≠ txtnroop del caso).
# gradosX/minX/segX van en el body — el backend calcula coordX/coordY.
curl -X POST "$BASE/operativos/caso/$CASO_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroOperativo": "IC-042/2026",
    "idTipoRelevancia": 2,
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
    "breveDetalle": "Intervención en vivienda con laboratorio clandestino",
    "descripcion": "Durante operación de inteligencia se detectó...",
    "idTipoOperacion": 2,
    "organizacion": "CARTEL LOCAL",
    "clanFamiliar": "FAMILIA MAMANI"
  }'
# Response 201: { "finalizado": true, "datos": { "id": "42", "idCaso": "7", ... } }
# Si 409: ya existe — usar PATCH.
# Tras 201: deshabilitar todos los campos de SEC0.
```

### FASE 4 — Agregar sub-entidades

```bash
# === DROGAS ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoDroga": 1, "idEstadoDroga": 3, "cantidadGramos": 1500.5,
    "cantidadUnidades": 0, "idFormaTransporte": 2,
    "idPaisProcedencia": 70, "idPaisDestino": 70,
    "observaciones": "Droga en estado sólido prensado"
  }'

curl "$BASE/operativos/caso/$CASO_ID/drogas/pesaje"

curl -X DELETE "$BASE/operativos/caso/$CASO_ID/drogas/101"

# === SUSTANCIAS SÓLIDAS ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/sustancias-solidas" \
  -H "Content-Type: application/json" \
  -d '{ "idSustanciaSolidaDescripcion": 5, "cantidad": 2.750, "unidadMedida": "KG", "observaciones": "Acetona" }'

# === SUSTANCIAS LÍQUIDAS ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/sustancias-liquidas" \
  -H "Content-Type: application/json" \
  -d '{ "idSustanciaLiquidaDescripcion": 3, "cantidad": 15.5, "unidadMedida": "LT", "observaciones": "Éter etílico" }'

# === FÁBRICAS ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/fabricas" \
  -H "Content-Type: application/json" \
  -d '{ "idFabricaModelo": 4, "cantidad": 1, "observaciones": "Laboratorio rudimentario" }'

# === DETENIDOS ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/detenidos" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCaso": "CASO-2024-007", "nombres": "CARLOS",
    "apellidoPaterno": "MAMANI", "apellidoMaterno": "QUISPE",
    "idPais": 70, "idTipoDocumento": 12, "numeroDocumento": "7654321",
    "esMasculino": true, "fechaNacimiento": "1985-06-15",
    "idEstadoCivil": 1, "serie": "LP", "seccion": "A",
    "direccion": "AV. HEROINAS N 123 ZONA CENTRAL",
    "observaciones": "Aprehendido en flagrancia", "estado": "APREHENDIDO"
  }'
# → 201: { "datos": { "id": "55", ... } }
DET_ID=55

curl -X POST "$BASE/operativos/caso/$CASO_ID/detenidos/$DET_ID/fotos/frente" \
  -F "foto=@/ruta/foto_frente.jpg"
curl -X POST "$BASE/operativos/caso/$CASO_ID/detenidos/$DET_ID/fotos/perfil-derecho" \
  -F "foto=@/ruta/foto_der.jpg"
curl -X POST "$BASE/operativos/caso/$CASO_ID/detenidos/$DET_ID/fotos/perfil-izquierdo" \
  -F "foto=@/ruta/foto_izq.jpg"

# === BIENES ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/bienes" \
  -H "Content-Type: application/json" \
  -d '{
    "idCatalogoTipo": 22, "cantidad": 1, "costoAproximado": 25000,
    "costoCuantificado": 0, "esInvestigacion": false,
    "observaciones": "Vehículo Toyota Hilux sin placa"
  }'
# → 201: { "datos": { "id": "88", ... } }
BIEN_ID=88

curl -X POST "$BASE/operativos/caso/$CASO_ID/bienes/$BIEN_ID/caracteristicas" \
  -H "Content-Type: application/json" \
  -d '{ "idCatalogoCaracteristica": 7, "descripcion": "BLANCO" }'

# === GALERÍA ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/galeria" \
  -F "descripcion=Vista exterior del laboratorio" \
  -F "foto=@/ruta/foto.jpg"

# === LOGOTIPOS ===
curl -X POST "$BASE/operativos/caso/$CASO_ID/logotipos" \
  -F "numeroCaso=CASO-2024-007" \
  -F "numeroOperativo=CB-IC-42/26" \
  -F "fechaOperativo=2024-03-15T10:00:00" \
  -F "nombreCaso=OPERACIÓN ALBA" \
  -F "descripcion=Logotipo en embalaje" \
  -F "imagen=IMAGEN_BASE64" \
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

### FASE 0 — Detectar edición y cargar datos en una llamada

```bash
curl "$BASE/operativos/casos/usuario/JPEREZ"
# → [..., { "idCaso": "7", "nombreCaso": "OPERACION ALBA", ... }]

curl "$BASE/operativos/caso/$CASO_ID"
# Response — operativo distinto de null confirma EDICIÓN:
# {
#   "finalizado": true,
#   "datos": {
#     "caso": {
#       "idCaso": "7",
#       "numeroOperativo": "CB-IC-42/26",   ← txtnroop (referencia, read-only)
#       "nombreCaso": "OPERACION ALBA",
#       "fiscalSolicitud": "JPEREZ",
#       "telefonoSolicitud": "72345678",
#       "asignadoCaso": "TTE. GARCIA MAMANI JUAN CARLOS",
#       "telefonoAsignado": "71234567",
#       "fiscalAsignadoCaso": "DR. QUISPE TICONA MARIO",
#       "telefonoFiscal": "70000001"
#     },
#     "operativo": {
#       "id": "42",
#       "idCaso": "7",
#       "numeroOperativo": "IC-042/2026",   ← txtnroinf (ingresado por usuario)
#       "idTipoRelevancia": 2,
#       "idTipoDenuncia": 1,
#       "idTipoPenal": 3,
#       "fechaOperativo": "2024-03-15T10:00:00.000Z",
#       "idDepartamento": 2,
#       "idProvincia": 15,
#       "idLocalidad": 87,
#       "lugar": "ZONA NORTE KM 12",
#       "idCategoriaOperativo": 3,
#       "idItemOperativo": 8,
#       "idUnidad": 5,
#       "idDistrital": 5,
#       "idGrupo": 12,
#       "mando": "CMDTE. JUAN MAMANI QUISPE",
#       "gradosX": 17, "minX": 23, "segX": 45.5, "coordX": -17.395972,
#       "gradosY": 66, "minY": 9,  "segY": 22.1,  "coordY": -66.156139,
#       "idPlanOperacion": 1,
#       "breveDetalle": "...",
#       "descripcion": "...",
#       "idTipoOperacion": 2,
#       "organizacion": "CARTEL LOCAL",
#       "clanFamiliar": "FAMILIA MAMANI",
#       "esRevisado": false,
#       "esPositivo": true,
#       "esIcia": true,
#       "fechaHoraIngreso": "2024-03-15T14:22:00.000Z",
#       "usuario": "SISTEMA"
#     }
#   }
# }
# Los combos del formulario se pre-rellenan con los valores de operativo.*
# (no de caso.* — pueden diferir si el usuario los cambió al crear)
```

### FASE 1 — Lookups estáticos (ya en cache) + dependientes según operativo

```bash
curl "$BASE/siii-lookups/provincias/departamento/2"    # operativo.idDepartamento
curl "$BASE/siii-lookups/localidades/provincia/15"     # operativo.idProvincia
curl "$BASE/operativos/catalogos/items-operativo/3"    # operativo.idCategoriaOperativo
curl "$BASE/siii-lookups/distritales/unidad/5"         # operativo.idUnidad
curl "$BASE/siii-lookups/grupos/distrital/5"           # operativo.idDistrital
```

### FASE 2 — Cargar secciones (lazy)

```bash
# GET de secciones siempre retorna [] si están vacías — no hay error.
# Cargar las que sean necesarias:

curl "$BASE/operativos/caso/$CASO_ID/drogas"
curl "$BASE/operativos/caso/$CASO_ID/drogas/pesaje"
curl "$BASE/operativos/caso/$CASO_ID/sustancias-solidas"
curl "$BASE/operativos/caso/$CASO_ID/sustancias-liquidas"
curl "$BASE/operativos/caso/$CASO_ID/fabricas"
curl "$BASE/operativos/caso/$CASO_ID/detenidos"
curl "$BASE/operativos/caso/$CASO_ID/bienes"
curl "$BASE/operativos/caso/$CASO_ID/bienes/$BIEN_ID/caracteristicas"
curl "$BASE/operativos/caso/$CASO_ID/galeria"
curl "$BASE/operativos/caso/$CASO_ID/logotipos"
```

### FASE 3 — Actualizar el operativo

```bash
# Mismo DTO que el POST — el backend resuelve idCaso → idOperativo.
curl -X PATCH "$BASE/operativos/caso/$CASO_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroOperativo": "IC-042/2026",
    "idTipoRelevancia": 2,
    "idTipoDenuncia": 1,
    "idTipoPenal": 3,
    "fechaOperativo": "2024-03-15T10:00:00",
    "idDepartamento": 2,
    "idProvincia": 15,
    "idLocalidad": 87,
    "lugar": "ZONA NORTE KM 12 — ACTUALIZADO",
    "idCategoriaOperativo": 3,
    "idItemOperativo": 8,
    "idUnidad": 5,
    "idDistrital": 5,
    "idGrupo": 12,
    "mando": "CMDTE. JUAN MAMANI QUISPE",
    "gradosX": 17, "minX": 23, "segX": 45.5,
    "gradosY": 66, "minY": 9,  "segY": 22.1,
    "idPlanOperacion": 1,
    "breveDetalle": "Actualización: segundo laboratorio encontrado",
    "descripcion": "Durante operación de inteligencia se detectó...",
    "idTipoOperacion": 2,
    "organizacion": "CARTEL LOCAL",
    "clanFamiliar": "FAMILIA MAMANI"
  }'
# Response 200. Si 404: no existe operativo — crear con POST primero.
```

### FASE 4 — Editar sub-entidades

```bash
# Agregar
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" -H "Content-Type: application/json" -d '{...}'

# Eliminar
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/drogas/101"
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/detenidos/55"
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/bienes/88"
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/bienes/$BIEN_ID/caracteristicas/7"
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/galeria/1"

# Ver fotos (respuesta binaria image/jpeg)
curl "$BASE/operativos/caso/$CASO_ID/galeria/1/full"
curl "$BASE/operativos/caso/$CASO_ID/galeria/1/thumbnail"
curl "$BASE/operativos/caso/$CASO_ID/galeria/1/medium"
curl "$BASE/operativos/caso/$CASO_ID/detenidos/$DET_ID/fotos/frente"
curl "$BASE/operativos/caso/$CASO_ID/detenidos/$DET_ID/fotos/perfil-derecho"
curl "$BASE/operativos/caso/$CASO_ID/detenidos/$DET_ID/fotos/perfil-izquierdo"
curl "$BASE/operativos/caso/$CASO_ID/bienes/$BIEN_ID/foto"
curl "$BASE/operativos/caso/$CASO_ID/logotipos/1/foto"
```

---

## 7. Reglas de negocio y validaciones

### Comportamiento por operación

| Operación | Condición | Respuesta |
|---|---|---|
| `GET /caso/:idCaso` | idCaso no existe en asignacion | `404 Not Found` |
| `GET /caso/:idCaso` | No hay operativo | `200` con `operativo: null` |
| `GET /caso/:idCaso` | Operativo existe | `200` con `operativo: {...}` |
| `POST /caso/:idCaso` | Operativo ya existe | `409 Conflict` — usar PATCH |
| `PATCH /caso/:idCaso` | No existe operativo | `404 Not Found` — crear con POST primero |
| `GET /caso/:idCaso/[seccion]` | No existe operativo | `200` con `[]` (no error) |
| `POST /caso/:idCaso/[seccion]` | No existe operativo | `404 Not Found` — crear operativo primero |
| `DELETE /caso/:idCaso/[seccion]/:id` | No existe operativo | `404 Not Found` |

### SEC0 — Inmutabilidad

- Campos `cbounidad`, `cboDistrital`, `cboGrupo` y `txtnroinf` quedan `disabled` tras el `POST /caso/:idCaso` exitoso (201).
- `txtnroop` (`caso.numeroOperativo`) es siempre read-only — es el nro. de referencia del caso, no se envía al backend.
- `txtnroinf` (`dto.numeroOperativo`) es editado por el usuario y **sí va en el body** de POST/PATCH.
- `coordX`/`coordY` son calculados por el backend desde `gradosX/minX/segX` — nunca en el body.

### Conversiones que hace el frontend

```javascript
// GPS: enviar grados/min/seg, el backend calcula: coordX = (g + m/60 + s/3600) * -1

// Peso de drogas: convertir a gramos
const cantidadGramos =
  (toneladas  || 0) * 1_000_000 +
  (kilos      || 0) * 1_000 +
  (gramos     || 0) +
  (miligramos || 0) / 1_000

// Sustancia sólida → KG
const cantidadKg = (kilos || 0) + (gramos || 0) / 1_000

// Sustancia líquida → LT
const cantidadLt = (litros || 0) + (ml || 0) / 1_000
```

### Defaults que aplica el frontend

```javascript
apellidoMaterno = apellidoMaterno || '*'
apellidoEsposo  = apellidoEsposo  || '*'
serie           = serie           || ''
numeroDocumento = numeroDocumento || 'SN'
// País: preseleccionar id=70 (Bolivia) en detenidos, procedencia y destino de droga
```

---

## 8. Referencia de endpoints

### Formato de response estándar

```json
{ "finalizado": true, "mensaje": "...", "datos": {} }
{ "finalizado": false, "codigo": 404, "mensaje": "No encontrado" }
```

### Endpoints — Listas de Casos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/casos/usuario/:usuario` | Todos los casos del usuario |
| GET | `/operativos/casos/no-aprobados/usuario/:usuario` | Sin número de caso |

### Endpoints — Operativo principal

| Método | Endpoint | Descripción | Errores |
|---|---|---|---|
| GET | `/operativos/caso/:idCaso` | Caso + operativo (`null` si nuevo) | 404 si idCaso inexistente |
| POST | `/operativos/caso/:idCaso` | Crear operativo | 409 si ya existe |
| PATCH | `/operativos/caso/:idCaso` | Actualizar operativo | 404 si no existe |

### Endpoints — Admin

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos` | Listar todos (admin) |
| GET | `/operativos/:id` | Por ID interno (debug) |
| PATCH | `/operativos/:id/inactivar` | Marcar como revisado (admin) |

### Endpoints — Sub-entidades (`/caso/:idCaso/...`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/caso/:idCaso/drogas` | Listar (`[]` si no hay operativo) |
| GET | `/operativos/caso/:idCaso/drogas/pesaje` | Resumen peso total |
| POST | `/operativos/caso/:idCaso/drogas` | Agregar |
| DELETE | `/operativos/caso/:idCaso/drogas/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/sustancias-solidas` | Listar |
| POST | `/operativos/caso/:idCaso/sustancias-solidas` | Agregar |
| DELETE | `/operativos/caso/:idCaso/sustancias-solidas/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/sustancias-liquidas` | Listar |
| POST | `/operativos/caso/:idCaso/sustancias-liquidas` | Agregar |
| DELETE | `/operativos/caso/:idCaso/sustancias-liquidas/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/fabricas` | Listar |
| POST | `/operativos/caso/:idCaso/fabricas` | Agregar |
| DELETE | `/operativos/caso/:idCaso/fabricas/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/detenidos` | Listar |
| POST | `/operativos/caso/:idCaso/detenidos` | Agregar |
| DELETE | `/operativos/caso/:idCaso/detenidos/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/bienes` | Listar |
| POST | `/operativos/caso/:idCaso/bienes` | Agregar |
| DELETE | `/operativos/caso/:idCaso/bienes/:idBien` | Eliminar |
| GET | `/operativos/caso/:idCaso/bienes/:idBien/caracteristicas` | Listar |
| POST | `/operativos/caso/:idCaso/bienes/:idBien/caracteristicas` | Agregar |
| DELETE | `/operativos/caso/:idCaso/bienes/:idBien/caracteristicas/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/galeria` | Listar |
| POST | `/operativos/caso/:idCaso/galeria` | Subir (multipart: `foto`) |
| DELETE | `/operativos/caso/:idCaso/galeria/:id` | Eliminar |
| GET | `/operativos/caso/:idCaso/logotipos` | Listar |
| POST | `/operativos/caso/:idCaso/logotipos` | Subir (multipart: `fotografia`) |
| DELETE | `/operativos/caso/:idCaso/logotipos/:id` | Eliminar |

### Endpoints — Imágenes (respuesta binaria `image/jpeg`)

| Método | Endpoint |
|---|---|
| GET | `/operativos/caso/:idCaso/galeria/:id/thumbnail` |
| GET | `/operativos/caso/:idCaso/galeria/:id/medium` |
| GET | `/operativos/caso/:idCaso/galeria/:id/full` |
| POST | `/operativos/caso/:idCaso/detenidos/:id/fotos/frente` |
| GET | `/operativos/caso/:idCaso/detenidos/:id/fotos/frente` |
| POST | `/operativos/caso/:idCaso/detenidos/:id/fotos/perfil-derecho` |
| GET | `/operativos/caso/:idCaso/detenidos/:id/fotos/perfil-derecho` |
| POST | `/operativos/caso/:idCaso/detenidos/:id/fotos/perfil-izquierdo` |
| GET | `/operativos/caso/:idCaso/detenidos/:id/fotos/perfil-izquierdo` |
| GET | `/operativos/caso/:idCaso/bienes/:idBien/foto` |
| GET | `/operativos/caso/:idCaso/logotipos/:id/foto` |

### Endpoints — Catálogos dependientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/catalogos/estados-droga/:idTipoDroga` | Estados por tipo |
| GET | `/operativos/catalogos/fabrica-modelos/:idTipoFabrica` | Modelos por tipo |
| GET | `/operativos/catalogos/items-operativo/:idCategoria` | Items por categoría |
| GET | `/operativos/catalogos/clases/:idBien` | Clases por bien |
| GET | `/operativos/catalogos/tipos/:idCatalogoClase` | Tipos por clase |
| GET | `/operativos/catalogos/caracteristicas/:idCatalogoClase` | Características por clase |

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

**Última actualización:** 2026-03-07
**Versión:** 4.1 — Eliminado `esNuevo` (usar `operativo === null`), eliminadas `estadisticas`, alineados campos GET/POST.
