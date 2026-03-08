# GUÍA FRONTEND — MÓDULO OPERATIVOS

**Versión:** 4.5 — Sección 10: curls flujo completo Servicio → Asignación → Operativo para pruebas
**Fecha:** 2026-03-08
**Base URL:** `http://localhost:3000/api`

---

## ÍNDICE

1. [Modelo de datos](#1-modelo-de-datos)
2. [Contrato del GET unificado](#2-contrato-del-get-unificado)
3. [Estrategia de lookups](#3-estrategia-de-lookups)
4. [Tabla completa: API lookup → Combo del formulario](#4-tabla-completa-api-lookup--combo-del-formulario)
5. [Flujo completo NUEVO operativo — curl](#5-flujo-completo-nuevo-operativo--curl)
6. [Flujo completo EDICIÓN operativo — curl](#6-flujo-completo-edición-operativo--curl)
7. [Flujo DROGAS: CRUD + imágenes vía URL](#7-flujo-drogas-crud--imágenes-vía-url)
8. [Reglas de negocio y validaciones](#8-reglas-de-negocio-y-validaciones)
9. [Referencia de endpoints](#9-referencia-de-endpoints)
10. [Flujo de prueba: Servicio → Asignación → Operativo (curls completos)](#10-flujo-de-prueba-servicio--asignación--operativo-curls-completos)

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
      "coordX": -17.395972,
      "coordY": -66.156139,
      "idPlanOperacion": 1,
      "breveDetalle": "Intervención en vivienda con laboratorio clandestino",
      "descripcion": "Durante operación de inteligencia se detectó...",
      "idTipoOperacion": 2,
      "organizacion": "CARTEL LOCAL",
      "clanFamiliar": "FAMILIA MAMANI",
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
| `coordX` | **sí** | `txtcoordenadax` | Latitud decimal negativa (ej. `-17.395972`) |
| `coordY` | **sí** | `txtcoordenaday` | Longitud decimal negativa (ej. `-66.156139`) |
| `idPlanOperacion` | **sí** | `cboplanoperaciones` | — |
| `breveDetalle` | **sí** | `txtbrevedetalle` | opcional |
| `descripcion` | **sí** | `txtdescripcion` | — |
| `idTipoOperacion` | **sí** | `cbotipoop` | — |
| `organizacion` | **sí** | `txtorganizacion` | — |
| `clanFamiliar` | **sí** | `txtclanfamiliar` | opcional |
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
# coordX/coordY en decimal negativo (latitud/longitud).
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
    "coordX": -17.395972,
    "coordY": -66.156139,
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
# POST es multipart/form-data — incluye las dos fotos opcionales
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" \
  -F "idTipoDroga=1" \
  -F "idEstadoDroga=3" \
  -F "cantidadGramos=1500.5" \
  -F "cantidadUnidades=0" \
  -F "idFormaTransporte=2" \
  -F "idPaisProcedencia=70" \
  -F "idPaisDestino=70" \
  -F "observaciones=Droga en estado sólido prensado" \
  -F "pruebaCampo=@/ruta/foto_prueba.jpg" \
  -F "pesaje=@/ruta/foto_pesaje.jpg"
# → 201: { "datos": { "id": "101", ... } }
DROGA_ID=101

curl "$BASE/operativos/caso/$CASO_ID/drogas/pesaje"   # resumen total

# Ver fotos de la droga (al expandir fila)
curl "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/fotos/prueba-campo"
curl "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/fotos/pesaje"

# Logotipos de la droga (al expandir fila)
curl "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos"

# Crear logotipo desde la modal
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos" \
  -F "imagen=CALI-01" \
  -F "descripcionLogo=Marca cartel en embalaje" \
  -F "organizacion=CARTEL CALI" \
  -F "blanco=Mercado europeo" \
  -F "observacion=Encontrado en bolsas negras" \
  -F "fotografia=@/ruta/logo.jpg"

curl -X DELETE "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID"

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

# === LOGOTIPOS (nuevo flujo — desde la modal de una droga específica) ===
# El backend resuelve idTipoDroga, idPaisOrigen, idPaisDestino desde la droga.
# Ver sección 7 para flujo completo.
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos" \
  -F "imagen=CALI-01" \
  -F "descripcionLogo=Marca cartel en embalaje" \
  -F "organizacion=CARTEL LOCAL" \
  -F "blanco=Mercado europeo" \
  -F "observacion=Encontrado en bolsas negras" \
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
#       "coordX": -17.395972,
#       "coordY": -66.156139,
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
    "coordX": -17.395972,
    "coordY": -66.156139,
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

## 7. DROGAS — CRUD + imágenes vía URL

### 7.1 Estructura visual

```
┌──────────────────────────────────────────────────────────────┐
│  DROGAS, PSICOTROPICOS Y ESTUPEFACIENTES                     │
│                                                              │
│  Tipo droga [combo] Estado [combo]  Cantidad Tn[ ] Kg[ ]    │
│                                              g [ ] Mg[ ]    │
│  Forma transporte [combo]  Procedencia [combo]  Destino [combo]│
│  Foto Prueba Campo [file]   Foto Pesaje [file]               │
│  [Guardar droga]                                             │
│                                                              │
│  ┌──────┬──────────┬──────┬────────┬──────────┬────────────┐ │
│  │  #   │ Tipo     │ Cant │ Origen │  Fotos   │  Acciones  │ │
│  ├──────┼──────────┼──────┼────────┼──────────┼────────────┤ │
│  │  1   │ Cocaína  │2500g │ Chile  │ [PC][PS] │    [🗑]    │ │
│  │  2   │Marihuana │ 500g │ Perú   │  [PC]    │    [🗑]    │ │
│  └──────┴──────────┴──────┴────────┴──────────┴────────────┘ │
│                                                              │
│  LOGOTIPOS                                                   │
│  ┌──────┬──────────┬────────────┬───────────┬─────────────┐  │
│  │  #   │ Código   │ Descrip.   │   Foto    │  Acciones   │  │
│  ├──────┼──────────┼────────────┼───────────┼─────────────┤  │
│  │  1   │ CALI-01  │ Marca...   │  [img]    │    [🗑]     │  │
│  └──────┴──────────┴────────────┴───────────┴─────────────┘  │
│  [+ Nuevo logotipo]                                          │
└──────────────────────────────────────────────────────────────┘
```

> `[PC]` = botón/thumbnail Prueba de Campo · `[PS]` = Pesaje.
> Se renderizan solo si `urlFotoPruebaCampo` / `urlFotoPesaje` no es `null`.

---

### 7.2 Mecanismo de carga de la grilla de drogas

La grilla se alimenta de `GET /caso/:idCaso/drogas`. Este endpoint devuelve
metadatos de cada droga **más los campos de imagen** (`tiene*` + `url*`).
Los buffers binarios **nunca se incluyen** en el JSON.

#### Cuándo cargar la grilla

| Momento | Acción |
|---|---|
| Al abrir el formulario con `operativo !== null` | `GET /caso/:idCaso/drogas` |
| Tras guardar una nueva droga (POST 201) | Refrescar: `GET /caso/:idCaso/drogas` |
| Tras eliminar una droga (DELETE 200) | Refrescar: `GET /caso/:idCaso/drogas` |
| Al abrir formulario nuevo (`operativo === null`) | No cargar — la grilla estará vacía |

#### Estructura de cada elemento en la lista

```json
{
  "id": "101",
  "idOperativo": "42",
  "idTipoDroga": 1,
  "idEstadoDroga": 3,
  "cantidadGramos": 1500.5,
  "cantidadUnidades": 0,
  "idFormaTransporte": 2,
  "idPaisProcedencia": 70,
  "idPaisDestino": 70,
  "observaciones": "Droga en estado sólido prensado",
  "fechaHoraIngreso": "2024-03-15T14:22:00.000Z",
  "usuario": "SISTEMA",
  "urlFotoPruebaCampo": "/api/operativos/caso/7/drogas/101/fotos/prueba-campo",
  "urlFotoPesaje": null
}
```

> `url*` es `null` si no hay imagen guardada. Usar para habilitar/deshabilitar
> el botón de visualización en la grilla sin hacer una petición extra.
>
> Los campos `idTipoDroga`, `idEstadoDroga`, etc. son IDs numéricos. El frontend
> los resuelve contra los lookups estáticos (ver sección 3) para mostrar texto.

#### Curl

```bash
BASE="http://localhost:3000/api"
CASO_ID=7

curl "$BASE/operativos/caso/$CASO_ID/drogas"
# → {
#     "finalizado": true,
#     "datos": [
#       {
#         "id": "101", "idTipoDroga": 1, "cantidadGramos": 1500.5,
#         "urlFotoPruebaCampo": "/api/operativos/caso/7/drogas/101/fotos/prueba-campo",
#         "urlFotoPesaje": null
#       }
#     ]
#   }
# Si el operativo no existe aún → datos: []  (no es error)
```

---

### 7.3 CRUD drogas

#### CREATE — POST multipart/form-data

##### Por qué multipart y no JSON

El formulario de alta envía **datos + 2 archivos de imagen** en una sola petición.
`Content-Type: application/json` no puede transportar binarios. La alternativa
correcta es `multipart/form-data`, donde cada campo (texto o archivo) va en una
parte separada del body.

##### Cómo construye el frontend el multipart

```javascript
// El usuario completa el form y selecciona los archivos
const formData = new FormData()

// Campos de texto — mismos nombres que el DTO
formData.append('idTipoDroga',      '1')
formData.append('idEstadoDroga',    '3')
formData.append('cantidadGramos',   '1500.5')  // ya convertido a gramos (ver sección 8)
formData.append('cantidadUnidades', '0')
formData.append('idFormaTransporte','2')
formData.append('idPaisProcedencia','70')
formData.append('idPaisDestino',    '70')
formData.append('observaciones',    'Droga en estado sólido prensado')

// Archivos — nombres exactos que espera NestJS en FileFieldsInterceptor
const filePrueba = document.querySelector('#inputPruebaCampo').files[0]
const filePesaje = document.querySelector('#inputPesaje').files[0]
if (filePrueba) formData.append('pruebaCampo', filePrueba)  // campo opcional
if (filePesaje) formData.append('pesaje',      filePesaje)  // campo opcional

// Enviar — NO poner Content-Type manualmente; el browser lo genera con el boundary
const res = await fetch(`/api/operativos/caso/${idCaso}/drogas`, {
  method: 'POST',
  body: formData,
  // headers: NO agregar Content-Type — fetch lo pone solo con el boundary correcto
})
const { datos } = await res.json()
// datos.urlFotoPruebaCampo → URL si se subió la foto, null si no
```

##### Cómo lo recibe NestJS

El controller usa `FileFieldsInterceptor` que registra dos campos de archivo:

```
pruebaCampo  → guardado en droga.foto_prueba_campo (bytea en PostgreSQL)
pesaje       → guardado en droga.foto_pesaje        (bytea en PostgreSQL)
```

Los campos de texto llegan en `@Body()` como strings que NestJS valida con el DTO.
Los archivos llegan en `@UploadedFiles()` como objetos `Multer.File` con `.buffer`.
Ambos son **opcionales**: si el usuario no adjunta una imagen, el campo queda `null`.

##### Curl equivalente

```bash
# -F "campo=valor"         → campo de texto en multipart
# -F "campo=@/ruta/foto"   → archivo binario en multipart

curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" \
  -F "idTipoDroga=1" \
  -F "idEstadoDroga=3" \
  -F "cantidadGramos=1500.5" \
  -F "cantidadUnidades=0" \
  -F "idFormaTransporte=2" \
  -F "idPaisProcedencia=70" \
  -F "idPaisDestino=70" \
  -F "observaciones=Droga en estado sólido prensado" \
  -F "pruebaCampo=@/home/user/fotos/prueba_campo.jpg;type=image/jpeg" \
  -F "pesaje=@/home/user/fotos/pesaje.jpg;type=image/jpeg"

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "id": "101",
#     "idOperativo": "42",
#     "idTipoDroga": 1,
#     "cantidadGramos": 1500.5,
#     "urlFotoPruebaCampo": "/api/operativos/caso/7/drogas/101/fotos/prueba-campo",
#     "urlFotoPesaje": "/api/operativos/caso/7/drogas/101/fotos/pesaje",
#     "fechaHoraIngreso": "2024-03-15T14:22:00.000Z"
#   }
# }
DROGA_ID=101

# Sin imágenes (también válido):
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" \
  -F "idTipoDroga=1" \
  -F "idEstadoDroga=3" \
  -F "cantidadGramos=500" \
  -F "cantidadUnidades=0" \
  -F "idFormaTransporte=2" \
  -F "idPaisProcedencia=70" \
  -F "idPaisDestino=70"
# → urlFotoPruebaCampo: null, urlFotoPesaje: null
```

#### READ — GET lista (grilla)

```bash
curl "$BASE/operativos/caso/$CASO_ID/drogas"
# → 200 con array enriquecido (ver sección 7.2)
```

#### DELETE con cascade

Al eliminar una droga, el backend borra **en orden**:

```
1. DELETE logotipos WHERE id_droga = :idDroga   ← todos los logos de esa droga
2. DELETE droga WHERE id_droga = :idDroga
```

Esto garantiza integridad sin depender de constraints de BD. El frontend
simplemente llama al DELETE y refresca la grilla.

```bash
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID"
# → 200: { "finalizado": true }
# Después: refrescar GET /caso/:idCaso/drogas
```

> **No existe PATCH para drogas**: coherente con el formulario original.
> Si el usuario necesita corregir un registro, lo elimina y lo vuelve a crear.

---

### 7.4 Cómo mostrar imágenes con autenticación (patrón Blob URL)

Las imágenes viven en endpoints protegidos por JWT (`Authorization: Bearer ...`).
El browser **no puede enviar headers personalizados** cuando usa `<img src="...">`.
La solución es usar `fetch` + `URL.createObjectURL()`:

```javascript
/**
 * Carga una imagen protegida por JWT y la asigna a un elemento <img>.
 * @param {string} url    - URL relativa del endpoint de imagen
 * @param {string} token  - JWT del usuario autenticado
 * @param {HTMLImageElement} imgEl - Elemento <img> donde mostrar la foto
 */
async function cargarImagenProtegida(url, token, imgEl) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return  // sin imagen — dejar placeholder

  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  imgEl.src = blobUrl

  // Liberar memoria cuando el elemento se destruya
  imgEl.addEventListener('load', () => URL.revokeObjectURL(blobUrl), { once: true })
}

// Uso:
const token = localStorage.getItem('jwt')

// Para una droga con urlFotoPruebaCampo !== null:
await cargarImagenProtegida(droga.urlFotoPruebaCampo, token,
  document.querySelector(`#img-pc-${droga.id}`))

await cargarImagenProtegida(droga.urlFotoPesaje, token,
  document.querySelector(`#img-ps-${droga.id}`))
```

> **Importante:** Solo llamar `cargarImagenProtegida` si el campo `tiene*`
> correspondiente es `true`. Evita peticiones innecesarias a endpoints que
> devolverían un buffer vacío.

```javascript
// Patrón correcto al renderizar una fila de droga:
function renderFilaDroga(droga) {
  // ...render datos de texto...

  if (droga.urlFotoPruebaCampo) {
    cargarImagenProtegida(droga.urlFotoPruebaCampo, token, document.querySelector(`#img-pc-${droga.id}`))
  }
  if (droga.urlFotoPesaje) {
    cargarImagenProtegida(droga.urlFotoPesaje, token, document.querySelector(`#img-ps-${droga.id}`))
  }
}
```

> **Nota durante desarrollo (guards desactivados):** Si los guards JWT están
> comentados (`// TODO: Reactivar guards para producción`), se puede usar
> `<img src="...url...">` directamente sin Blob URL. Al activar los guards
> en producción se requiere el patrón `fetch + createObjectURL` de arriba.

---

### 7.5 CRUD logotipos

#### Estructura de la respuesta `GET /caso/:idCaso/logotipos`

Al igual que drogas, la lista de logotipos incluye campos `tiene*` + `url*`:

```json
{
  "id": "5",
  "idOperativo": "42",
  "idDroga": "101",
  "imagen": "CALI-01",
  "descripcionLogo": "Marca utilizada por el cartel...",
  "organizacion": "CARTEL CALI",
  "idTipoDroga": 1,
  "idPaisOrigen": 70,
  "idPaisDestino": 70,
  "blanco": "Mercado europeo",
  "observacion": "Logotipo encontrado en embalaje...",
  "fechaHoraIngreso": "2024-03-15T14:30:00.000Z",
  "urlFotografia": "/api/operativos/caso/7/logotipos/5/foto"
}
```

```bash
curl "$BASE/operativos/caso/$CASO_ID/logotipos"
# → { "finalizado": true, "datos": [ {...}, {...} ] }
# Si no hay logotipos → datos: []
```

#### CREATE — POST logotipo

El backend resuelve automáticamente `idTipoDroga`, `idPaisOrigen`, `idPaisDestino`
desde la droga asociada — el frontend **no los envía**.

```bash
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos" \
  -F "imagen=CALI-01" \
  -F "descripcionLogo=Marca utilizada por el cartel para identificar cargamentos" \
  -F "organizacion=CARTEL CALI" \
  -F "blanco=Mercado europeo" \
  -F "observacion=Logotipo encontrado en embalaje de plástico negro" \
  -F "fotografia=@/home/user/fotos/logo_cali.jpg;type=image/jpeg"

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "id": "5",
#     "idDroga": "101",
#     "idOperativo": "42",
#     "imagen": "CALI-01",
#     "descripcionLogo": "Marca utilizada...",
#     "organizacion": "CARTEL CALI",
#     "idTipoDroga": 1,
#     "idPaisOrigen": 70,
#     "idPaisDestino": 70,
#     "urlFotografia": "/api/operativos/caso/7/logotipos/5/foto",
#     "fechaHoraIngreso": "2024-03-15T14:30:00.000Z"
#   }
# }
LOGO_ID=5
```

**FormData en el frontend:**

```javascript
async function guardarLogotipo(idCaso, idDroga, datos, archivoFoto) {
  const body = new FormData()
  body.append('imagen',        datos.imagen)
  body.append('descripcionLogo', datos.descripcionLogo)
  body.append('organizacion',  datos.organizacion)
  if (datos.blanco)      body.append('blanco',      datos.blanco)
  if (datos.observacion) body.append('observacion', datos.observacion)
  if (datos.enlace)      body.append('enlace',      datos.enlace)
  if (archivoFoto)       body.append('fotografia',  archivoFoto)  // File object

  const res = await fetch(`/api/operativos/caso/${idCaso}/drogas/${idDroga}/logotipos`, {
    method: 'POST',
    body,  // NO poner Content-Type — fetch lo genera con el boundary correcto
  })
  if (res.ok) {
    cerrarModal()
    await refrescarLogotipos(idCaso)
  }
}
```

#### DELETE — eliminar un logotipo

```bash
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/logotipos/$LOGO_ID"
# → 200: { "finalizado": true }
```

> **No existe PATCH para logotipos**: si el usuario necesita corregir un logo,
> lo elimina y lo vuelve a crear.

#### Resumen CRUD logotipos

| Operación | Método | Endpoint | Body |
|---|---|---|---|
| Crear (desde droga) | POST | `/caso/:idCaso/drogas/:idDroga/logotipos` | multipart: campos + `fotografia` |
| Listar todos del caso | GET | `/caso/:idCaso/logotipos` | — |
| Listar por droga (futuro) | GET | `/caso/:idCaso/drogas/:idDroga/logotipos` | — |
| Ver foto | GET | `/caso/:idCaso/logotipos/:id/foto` | — (binario) |
| Eliminar | DELETE | `/caso/:idCaso/logotipos/:id` | — |

---

### 7.6 Pseudocódigo frontend completo

```javascript
const TOKEN = localStorage.getItem('jwt')

// ─── Función helper: imagen con auth ─────────────────────────────────────
async function cargarImagenProtegida(url, imgEl) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!res.ok) return
  const blobUrl = URL.createObjectURL(await res.blob())
  imgEl.src = blobUrl
  imgEl.addEventListener('load', () => URL.revokeObjectURL(blobUrl), { once: true })
}

// ─── Inicialización — carga grilla drogas y logotipos ────────────────────
async function inicializarSeccionDrogas(idCaso) {
  const [drogas, logotipos] = await Promise.all([
    fetch(`/api/operativos/caso/${idCaso}/drogas`).then(r => r.json()).then(r => r.datos),
    fetch(`/api/operativos/caso/${idCaso}/logotipos`).then(r => r.json()).then(r => r.datos),
  ])
  renderGrillaDrogas(drogas)
  renderGrillaLogotipos(logotipos)
}

// ─── Render grilla — muestra thumbnails de fotos ─────────────────────────
function renderGrillaDrogas(drogas) {
  drogas.forEach(droga => {
    // ...render fila de texto (tipo, cantidad, etc.)...

    if (droga.urlFotoPruebaCampo) {
      const imgPC = document.querySelector(`#img-pc-${droga.id}`)
      cargarImagenProtegida(droga.urlFotoPruebaCampo, imgPC)
    }
    if (droga.urlFotoPesaje) {
      const imgPS = document.querySelector(`#img-ps-${droga.id}`)
      cargarImagenProtegida(droga.urlFotoPesaje, imgPS)
    }
  })
}

function renderGrillaLogotipos(logotipos) {
  logotipos.forEach(logo => {
    // ...render fila de texto (código, descripción, etc.)...

    if (logo.urlFotografia) {
      const imgLogo = document.querySelector(`#img-logo-${logo.id}`)
      cargarImagenProtegida(logo.urlFotografia, imgLogo)
    }
  })
}

// ─── Guardar droga ────────────────────────────────────────────────────────
async function guardarDroga(idCaso, formValues, archivos) {
  const body = new FormData()
  Object.entries(formValues).forEach(([k, v]) => body.append(k, v))
  if (archivos.pruebaCampo) body.append('pruebaCampo', archivos.pruebaCampo)
  if (archivos.pesaje)      body.append('pesaje',      archivos.pesaje)

  const res = await fetch(`/api/operativos/caso/${idCaso}/drogas`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body,
  })
  if (res.ok) await inicializarSeccionDrogas(idCaso)
}

// ─── Eliminar droga (cascade automático en backend) ──────────────────────
async function eliminarDroga(idCaso, idDroga) {
  if (!confirm('¿Eliminar esta droga y todos sus logotipos?')) return
  await fetch(`/api/operativos/caso/${idCaso}/drogas/${idDroga}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  await inicializarSeccionDrogas(idCaso)
}

// ─── Guardar logotipo ─────────────────────────────────────────────────────
async function guardarLogotipo(idCaso, idDroga, datos, archivoFoto) {
  const body = new FormData()
  body.append('imagen',          datos.imagen)
  body.append('descripcionLogo', datos.descripcionLogo)
  body.append('organizacion',    datos.organizacion)
  if (datos.blanco)      body.append('blanco',      datos.blanco)
  if (datos.observacion) body.append('observacion', datos.observacion)
  if (datos.enlace)      body.append('enlace',      datos.enlace)
  if (archivoFoto)       body.append('fotografia',  archivoFoto)

  const res = await fetch(
    `/api/operativos/caso/${idCaso}/drogas/${idDroga}/logotipos`,
    { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body }
  )
  if (res.ok) {
    cerrarModal()
    await inicializarSeccionDrogas(idCaso)
  }
}

// ─── Eliminar logotipo ────────────────────────────────────────────────────
async function eliminarLogotipo(idCaso, idLogotipo) {
  await fetch(`/api/operativos/caso/${idCaso}/logotipos/${idLogotipo}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  await inicializarSeccionDrogas(idCaso)
}
```

---

## 8. Reglas de negocio y validaciones

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
- `coordX`/`coordY` van en el body — el frontend ya los entrega en decimal.

### Conversiones que hace el frontend

```javascript
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

## 9. Referencia de endpoints

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

### Endpoints — Sub-entidades (`/caso/:idCaso/...`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/operativos/caso/:idCaso/drogas` | Listar — alimenta la grilla (`[]` si no hay operativo) |
| GET | `/operativos/caso/:idCaso/drogas/pesaje` | Resumen peso total |
| POST | `/operativos/caso/:idCaso/drogas` | Crear (**multipart**: datos + `pruebaCampo?` + `pesaje?`) |
| DELETE | `/operativos/caso/:idCaso/drogas/:id` | Eliminar **en cascada** (borra sus logotipos primero) |
| GET | `/operativos/caso/:idCaso/drogas/:idDroga/fotos/prueba-campo` | Foto prueba de campo (binaria — usar como `<img src>`) |
| GET | `/operativos/caso/:idCaso/drogas/:idDroga/fotos/pesaje` | Foto cuantificación/pesaje (binaria — usar como `<img src>`) |
| GET | `/operativos/caso/:idCaso/drogas/:idDroga/logotipos` | Listar logos de esa droga (panel expandido) |
| POST | `/operativos/caso/:idCaso/drogas/:idDroga/logotipos` | Crear logo para droga (**multipart** + `fotografia?`) |
| GET | `/operativos/caso/:idCaso/logotipos/:id/foto` | Foto de un logotipo (binaria — usar como `<img src>`) |
| DELETE | `/operativos/caso/:idCaso/logotipos/:id` | Eliminar logotipo |
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
| GET | `/operativos/caso/:idCaso/drogas/:idDroga/fotos/prueba-campo` |
| GET | `/operativos/caso/:idCaso/drogas/:idDroga/fotos/pesaje` |
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

## 10. Flujo de prueba: Servicio → Asignación → Operativo (curls completos)

Esta sección contiene los curls para simular el flujo completo de alta desde cero.
Ejecutarlos **en orden**. Los IDs retornados en cada paso se usan en el siguiente.

```
BASE="http://localhost:3000/api"
```

---

### PASO 0 — Verificar lookups (opcional, para obtener IDs válidos)

```bash
BASE="http://localhost:3000/api"

# Lookups módulo Asig-Casos (felcn_asignacion_caso)
curl "$BASE/asig-lookups/departamentos"   # → id, descripcion (ej: "01" = La Paz)
curl "$BASE/asig-lookups/unidades"        # → id, descripcion
curl "$BASE/asig-lookups/letras"          # → codigo (ej: "PD", "RP", "IC")

# Lookups módulo SIII (felcn_siii — requiere migración ejecutada)
curl "$BASE/siii-lookups/tipos-relevancia"
curl "$BASE/siii-lookups/tipos-operacion"
curl "$BASE/siii-lookups/categorias-operativo"
curl "$BASE/siii-lookups/planes-operaciones"
curl "$BASE/siii-lookups/departamentos"

# Lookups dependientes de selección anterior:
curl "$BASE/siii-lookups/provincias/departamento/1"    # provincias de departamento 1
curl "$BASE/siii-lookups/localidades/provincia/1"      # localidades de provincia 1
curl "$BASE/siii-lookups/unidades"                     # unidades organizacionales
curl "$BASE/siii-lookups/distritales/unidad/1"         # distritales de unidad 1
curl "$BASE/siii-lookups/grupos/distrital/1"           # grupos de distrital 1

# Lookups de drogas
curl "$BASE/siii-lookups/tipos-droga"
curl "$BASE/siii-lookups/formas-transporte"
curl "$BASE/operativos/catalogos/estados-droga/1"      # estados para tipo_droga=1
```

> **Nota `siii-lookups` error 500:** Si el schema `parametricas` no existe en la BD,
> ejecutar primero `npm run migration:run`. Verificar con:
> `SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'parametricas';`

---

### PASO 1 — Crear Servicio (`felcn_asignacion_caso.servicio`)

```bash
BASE="http://localhost:3000/api"

curl -X POST "$BASE/servicios" \
  -H 'Content-Type: application/json' \
  -d '{
    "codigoServicio": "SERV-001-2026",
    "usuarioLogin": "JPEREZ",
    "usuarioEjecutor": "JPEREZ",
    "fechaHoraIngreso": "2026-03-08T08:00:00Z",
    "fechaHoraSalida": "2026-03-08T20:00:00Z"
  }'

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "codigoServicio": "SERV-001-2026",
#     "usuarioLogin": "JPEREZ",
#     "usuarioEjecutor": "JPEREZ",
#     "fechaHoraIngreso": "2026-03-08T08:00:00.000Z",
#     "fechaHoraSalida": "2026-03-08T20:00:00.000Z"
#   }
# }

# Verificar servicio creado:
curl "$BASE/servicios/SERV-001-2026"
```

---

### PASO 2 — Crear Asignación/Caso (`felcn_asignacion_caso.asignacion`)

```bash
curl -X POST "$BASE/asignaciones" \
  -H 'Content-Type: application/json' \
  -d '{
    "idDepartamento": "01",
    "idUnidad": "01",
    "codigoLetra": "IC",
    "numeroCaso": "CASO-042-2026",
    "numeroOperativo": "OP-042-2026",
    "fechaOperativo": "2026-03-08T10:00:00Z",
    "nombreCaso": "Operacion Zona Sur",
    "asignacionCaso": "Investigacion trafico de sustancias controladas zona sur",
    "codigoServicio": "SERV-001-2026",
    "fiscalAsignado": "LIC. MARIA QUISPE FLORES"
  }'

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "id": "3",           ← GUARDAR ESTE ID (idCaso para todos los siguientes pasos)
#     "idDepartamento": "01",
#     "idUnidad": "01",
#     "codigoLetra": "IC",
#     "numeroCaso": "CASO-042-2026",
#     "numeroOperativo": "OP-042-2026",
#     "nombreCaso": "Operacion Zona Sur",
#     "asignacionCaso": "Investigacion...",
#     "codigoServicio": "SERV-001-2026",
#     "fiscalAsignado": "LIC. MARIA QUISPE FLORES"
#   }
# }

CASO_ID=3   # ← el id retornado arriba

# Verificar asignación:
curl "$BASE/asignaciones/$CASO_ID"

# Listar casos del usuario:
curl "$BASE/operativos/casos/usuario/JPEREZ"
```

---

### PASO 3 — Verificar estado antes de crear operativo

```bash
# Retorna: { caso: {...}, operativo: null }  ← operativo null = formulario nuevo
curl "$BASE/operativos/caso/$CASO_ID"
```

---

### PASO 4 — Crear Operativo (`felcn_siii.public.operativo`)

> **Coordenadas:** Solo `coordX` (latitud decimal) y `coordY` (longitud decimal).
> En Bolivia son negativas. El frontend convierte desde DMS si el usuario lo ingresa
> manualmente: `decimal = grados + minutos/60 + segundos/3600` (negativo en Bolivia).

```bash
curl -X POST "$BASE/operativos/caso/$CASO_ID" \
  -H 'Content-Type: application/json' \
  -d '{
    "numeroOperativo": "IC-042/2026",
    "idTipoRelevancia": 1,
    "idTipoDenuncia": 1,
    "idTipoPenal": 1,
    "fechaOperativo": "2026-03-08T14:30:00Z",
    "idDepartamento": 1,
    "idProvincia": 1,
    "idLocalidad": 1,
    "lugar": "Zona Sur, Av. Circunvalacion Km 3",
    "idCategoriaOperativo": 1,
    "idItemOperativo": 1,
    "idUnidad": 1,
    "idDistrital": 1,
    "idGrupo": 1,
    "mando": "CAP. JUAN PEREZ MAMANI",
    "coordX": -17.395972,
    "coordY": -66.156139,
    "idPlanOperacion": 1,
    "breveDetalle": "Operativo antidrogas zona sur",
    "descripcion": "Se realizo operativo de control en zona sur. Se encontraron sustancias controladas.",
    "idTipoOperacion": 1,
    "organizacion": "NARCOTRAFICANTES",
    "clanFamiliar": "Clan Mamani"
  }'

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "id": "42",           ← idOperativo (solo para admin/debug)
#     "idCaso": "3",
#     "numeroOperativo": "IC-042/2026",
#     "coordX": -17.395972,
#     "coordY": -66.156139,
#     ...
#   }
# }

# Verificar: ahora operativo ya no es null
curl "$BASE/operativos/caso/$CASO_ID"
```

---

### PASO 5 — Agregar Droga (multipart/form-data)

```bash
# Con fotos:
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" \
  -F "idTipoDroga=1" \
  -F "idEstadoDroga=3" \
  -F "cantidadGramos=2500.5" \
  -F "cantidadUnidades=0" \
  -F "idFormaTransporte=2" \
  -F "idPaisProcedencia=70" \
  -F "idPaisDestino=70" \
  -F "observaciones=Droga en polvo, embalada en bolsas plasticas" \
  -F "pruebaCampo=@/tmp/prueba_campo.jpg;type=image/jpeg" \
  -F "pesaje=@/tmp/pesaje.jpg;type=image/jpeg"

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "id": "101",            ← GUARDAR ESTE ID (idDroga)
#     "idOperativo": "42",
#     "idTipoDroga": 1,
#     "cantidadGramos": 2500.5,
#     "urlFotoPruebaCampo": "/api/operativos/caso/3/drogas/101/fotos/prueba-campo",
#     "urlFotoPesaje": "/api/operativos/caso/3/drogas/101/fotos/pesaje"
#   }
# }

DROGA_ID=101

# Sin fotos (también válido):
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas" \
  -F "idTipoDroga=2" \
  -F "idEstadoDroga=1" \
  -F "cantidadGramos=500" \
  -F "cantidadUnidades=0" \
  -F "idFormaTransporte=1" \
  -F "idPaisProcedencia=70" \
  -F "idPaisDestino=71"
# → urlFotoPruebaCampo: null, urlFotoPesaje: null

# Listar drogas:
curl "$BASE/operativos/caso/$CASO_ID/drogas"

# Recuperar foto (binaria):
curl "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/fotos/prueba-campo" --output prueba.jpg
curl "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/fotos/pesaje" --output pesaje.jpg

# Eliminar droga (cascade: borra también sus logotipos):
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID"
```

---

### PASO 6 — Agregar Logotipo a una Droga

```bash
# Con foto:
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos" \
  -F "imagen=CALI-01" \
  -F "descripcionLogo=Marca del cartel para identificar cargamentos de cocaina" \
  -F "organizacion=CARTEL CALI" \
  -F "blanco=Mercado europeo" \
  -F "observacion=Encontrado en embalaje de plastico negro sellado" \
  -F "enlace=https://ref.ejemplo.com/cali01" \
  -F "fotografia=@/tmp/logo_cali.jpg;type=image/jpeg"

# Respuesta 201:
# {
#   "finalizado": true,
#   "datos": {
#     "id": "5",              ← GUARDAR ESTE ID (idLogotipo)
#     "idDroga": "101",
#     "idOperativo": "42",
#     "imagen": "CALI-01",
#     "idTipoDroga": 1,       ← resuelto automáticamente desde la droga
#     "idPaisOrigen": 70,     ← resuelto automáticamente desde la droga
#     "urlFotografia": "/api/operativos/caso/3/logotipos/5/foto"
#   }
# }

LOGO_ID=5

# Sin foto:
curl -X POST "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos" \
  -F "imagen=LOCAL-02" \
  -F "descripcionLogo=Marca sin identificar" \
  -F "organizacion=DESCONOCIDO"

# Listar logotipos de esa droga:
curl "$BASE/operativos/caso/$CASO_ID/drogas/$DROGA_ID/logotipos"

# Listar todos los logotipos del caso:
curl "$BASE/operativos/caso/$CASO_ID/logotipos"

# Recuperar foto logotipo (binaria):
curl "$BASE/operativos/caso/$CASO_ID/logotipos/$LOGO_ID/foto" --output logo.jpg

# Eliminar logotipo:
curl -X DELETE "$BASE/operativos/caso/$CASO_ID/logotipos/$LOGO_ID"
```

---

### PASO 7 — Editar Operativo (PATCH)

```bash
# PATCH usa el mismo DTO que POST — todos los campos son requeridos (no es PartialType)
curl -X PATCH "$BASE/operativos/caso/$CASO_ID" \
  -H 'Content-Type: application/json' \
  -d '{
    "numeroOperativo": "IC-042/2026",
    "idTipoRelevancia": 2,
    "idTipoDenuncia": 1,
    "idTipoPenal": 1,
    "fechaOperativo": "2026-03-08T14:30:00Z",
    "idDepartamento": 1,
    "idProvincia": 1,
    "idLocalidad": 1,
    "lugar": "Zona Sur, Av. Circunvalacion Km 3 — ACTUALIZADO",
    "idCategoriaOperativo": 1,
    "idItemOperativo": 1,
    "idUnidad": 1,
    "idDistrital": 1,
    "idGrupo": 1,
    "mando": "MAY. CARLOS QUISPE",
    "coordX": -17.395972,
    "coordY": -66.156139,
    "idPlanOperacion": 1,
    "breveDetalle": "Operativo actualizado",
    "descripcion": "Descripcion actualizada del operativo.",
    "idTipoOperacion": 1,
    "organizacion": "NARCOTRAFICANTES",
    "clanFamiliar": "Clan X"
  }'
```

---

### RESUMEN — Errores esperados y sus causas

| HTTP | Causa | Solución |
|---|---|---|
| 400 `coordX should not be empty` | Se enviaron campos DMS viejos en lugar de `coordX`/`coordY` | Usar `"coordX": -17.39, "coordY": -66.15` |
| 400 `validation errors` | Falta un campo requerido | Revisar todos los campos del DTO |
| 404 `No existe operativo` | Se intenta agregar droga/detenido sin crear operativo antes | Ejecutar PASO 4 primero |
| 409 `ya existe` | Se hace POST operativo cuando ya existe uno para ese caso | Usar PATCH para actualizar |
| 500 `siii-lookups` | Schema `parametricas` no existe en BD | Ejecutar `npm run migration:run` |

---

**Última actualización:** 2026-03-08
**Versión:** 4.5 — Sección 10: curls flujo completo Servicio → Asignación → Operativo para pruebas. Coordenadas: solo coordX/coordY decimal.
