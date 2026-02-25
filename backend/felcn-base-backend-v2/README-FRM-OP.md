# FRM-OP - Formulario de Operativos

## Análisis del Formulario Original (ASP.NET)

### Formularios Analizados
| Formulario | Descripción | Funcionalidad |
|------------|-------------|---------------|
| FRM-OP-ING | Lista de casos para registrar | Muestra casos pendientes de registro de operativo |
| FRM-OP | Registro de nuevo operativo | Formulario principal para crear operativos |
| FRM-OP-ACT | Actualización de operativo | Permite editar operativos existentes |
| FRM-OP-PT | Vista previa/impresión | Genera reportes del operativo |
| FRM-OP-UP | Subida de archivos | Carga de imágenes y documentos |

### Flujo del Formulario

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FRM-OP-ING    │────▶│     FRM-OP      │────▶│   FRM-OP-ACT    │
│ (Lista casos)   │     │ (Crear operat.) │     │ (Editar operat.)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Sub-entidades:     │
                    │  - Drogas           │
                    │  - Sustancias       │
                    │  - Fábricas         │
                    │  - Bienes           │
                    │  - Detenidos        │
                    │  - Galería          │
                    └─────────────────────┘
```

### Proceso de Generación de Código

El código del operativo se genera desde el módulo de **Asignación de Casos** (ASIG-CASOS):

1. Se crea un caso en `asignacion` con número de operativo
2. El operativo referencia el `id_caso` de la asignación
3. El número de operativo sigue el formato: `OP-YYYY-NNN`

---

## APIs Implementadas

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/operativos | Listar operativos |
| GET | /api/operativos/:id | Obtener operativo por ID |
| GET | /api/operativos/:id/completo | Obtener operativo con todas sus sub-entidades |
| GET | /api/operativos/caso/:idCaso | Buscar operativos por caso |
| GET | /api/operativos/numero/:numero | Buscar por número de operativo |
| POST | /api/operativos | Crear operativo |
| PATCH | /api/operativos/:id | Actualizar operativo |
| PATCH | /api/operativos/:id/inactivar | Inactivar operativo |

### Endpoints Sub-entidades

| Recurso | GET | POST | DELETE |
|---------|-----|------|--------|
| Drogas | /operativos/:id/drogas | ✓ | /operativos/:id/drogas/:idDroga |
| Sustancias Sólidas | /operativos/:id/sustancias-solidas | ✓ | /operativos/:id/sustancias-solidas/:id |
| Sustancias Líquidas | /operativos/:id/sustancias-liquidas | ✓ | /operativos/:id/sustancias-liquidas/:id |
| Fábricas | /operativos/:id/fabricas | ✓ | /operativos/:id/fabricas/:idFabrica |
| Bienes | /operativos/:id/bienes | ✓ | /operativos/:id/bienes/:idBien |
| Detenidos | /operativos/:id/detenidos | ✓ | /operativos/:id/detenidos/:idDetenido |
| Galería | /operativos/:id/galeria | - | /operativos/:id/galeria/:idGaleria |

### Endpoints Catálogos

| Endpoint | Descripción |
|----------|-------------|
| /operativos/catalogos/estados-droga/:idTipoDroga | Estados de droga por tipo |
| /operativos/catalogos/fabrica-modelos/:idTipoFabrica | Modelos de fábrica por tipo |
| /operativos/catalogos/items-operativo/:idCategoria | Items por categoría |
| /operativos/catalogos/clases/:idBien | Clases de catálogo por bien |
| /operativos/catalogos/tipos/:idClase | Tipos por clase |
| /operativos/catalogos/caracteristicas/:idClase | Características por clase |

---

## Tests con cURL

### Autenticación

```bash
# Obtener token JWT
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "contrasena": "admin123"
  }'

# Guardar el token
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 1. OPERATIVO PRINCIPAL

#### Listar Operativos
```bash
curl -X GET http://localhost:3000/api/operativos \
  -H "Authorization: Bearer $TOKEN"
```

#### Obtener Operativo por ID
```bash
curl -X GET http://localhost:3000/api/operativos/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Obtener Operativo Completo (con todas las sub-entidades)
```bash
curl -X GET http://localhost:3000/api/operativos/1/completo \
  -H "Authorization: Bearer $TOKEN"
```

#### Buscar Operativos por Caso
```bash
curl -X GET http://localhost:3000/api/operativos/caso/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Buscar por Número de Operativo
```bash
curl -X GET http://localhost:3000/api/operativos/numero/OP-2024-001 \
  -H "Authorization: Bearer $TOKEN"
```

#### Crear Operativo
```bash
curl -X POST http://localhost:3000/api/operativos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idCaso": "1",
    "idTipoRelevancia": 1,
    "numeroOperativo": "OP-2024-001",
    "idTipoDenuncia": 1,
    "idTipoPenal": 1,
    "fechaOperativo": "2024-01-15T14:30:00Z",
    "idDepartamento": 1,
    "idProvincia": 1,
    "idLocalidad": 1,
    "lugar": "Zona Sur, Calle 21 de Calacoto",
    "idCategoriaOperativo": 1,
    "idItemOperativo": 1,
    "idUnidad": 1,
    "idDistrital": 1,
    "idGrupo": 1,
    "mando": "CAP. JUAN PEREZ MAMANI",
    "gradosX": 16,
    "minX": 30,
    "segX": 15.5,
    "gradosY": 68,
    "minY": 9,
    "segY": 30.2,
    "idPlanOperacion": 1,
    "breveDetalle": "Operativo de interdicción",
    "descripcion": "Se realizó operativo de interdicción en la zona sur...",
    "idTipoOperacion": 1,
    "organizacion": "ORGANIZACION X",
    "clanFamiliar": ""
  }'
```

#### Actualizar Operativo
```bash
curl -X PATCH http://localhost:3000/api/operativos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "breveDetalle": "Operativo actualizado",
    "descripcion": "Descripción actualizada del operativo..."
  }'
```

#### Inactivar Operativo
```bash
curl -X PATCH http://localhost:3000/api/operativos/1/inactivar \
  -H "Authorization: Bearer $TOKEN"
```

---

### 2. DROGAS

#### Listar Drogas del Operativo
```bash
curl -X GET http://localhost:3000/api/operativos/1/drogas \
  -H "Authorization: Bearer $TOKEN"
```

#### Obtener Pesaje Total de Drogas
```bash
curl -X GET http://localhost:3000/api/operativos/1/drogas/pesaje \
  -H "Authorization: Bearer $TOKEN"
```

#### Agregar Droga al Operativo
```bash
curl -X POST http://localhost:3000/api/operativos/1/drogas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoDroga": 1,
    "idEstadoDroga": 1,
    "cantidadGramos": 1500.5,
    "cantidadUnidades": 0,
    "idFormaTransporte": 1,
    "idPaisProcedencia": 70,
    "idPaisDestino": 70,
    "observaciones": "Droga encontrada en vehículo"
  }'
```

#### Eliminar Droga
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/drogas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. SUSTANCIAS SÓLIDAS

#### Listar Sustancias Sólidas
```bash
curl -X GET http://localhost:3000/api/operativos/1/sustancias-solidas \
  -H "Authorization: Bearer $TOKEN"
```

#### Agregar Sustancia Sólida
```bash
curl -X POST http://localhost:3000/api/operativos/1/sustancias-solidas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idSustanciaSolidaDescripcion": 1,
    "cantidad": 500,
    "unidadMedida": "KG",
    "observaciones": "Precursor químico"
  }'
```

#### Eliminar Sustancia Sólida
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/sustancias-solidas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. SUSTANCIAS LÍQUIDAS

#### Listar Sustancias Líquidas
```bash
curl -X GET http://localhost:3000/api/operativos/1/sustancias-liquidas \
  -H "Authorization: Bearer $TOKEN"
```

#### Agregar Sustancia Líquida
```bash
curl -X POST http://localhost:3000/api/operativos/1/sustancias-liquidas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idSustanciaLiquidaDescripcion": 1,
    "cantidad": 200,
    "unidadMedida": "LT",
    "observaciones": "Acetona industrial"
  }'
```

#### Eliminar Sustancia Líquida
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/sustancias-liquidas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. FÁBRICAS/LABORATORIOS

#### Listar Fábricas
```bash
curl -X GET http://localhost:3000/api/operativos/1/fabricas \
  -H "Authorization: Bearer $TOKEN"
```

#### Agregar Fábrica
```bash
curl -X POST http://localhost:3000/api/operativos/1/fabricas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idFabricaModelo": 1,
    "cantidad": 1,
    "observaciones": "Laboratorio clandestino"
  }'
```

#### Eliminar Fábrica
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/fabricas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. BIENES SECUESTRADOS

#### Listar Bienes
```bash
curl -X GET http://localhost:3000/api/operativos/1/bienes \
  -H "Authorization: Bearer $TOKEN"
```

#### Agregar Bien Secuestrado
```bash
curl -X POST http://localhost:3000/api/operativos/1/bienes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "idCatalogoTipo": 1,
    "cantidad": 1,
    "costoAproximado": 15000,
    "costoCuantificado": 12000,
    "esInvestigacion": false,
    "observaciones": "Vehículo Toyota Land Cruiser"
  }'
```

#### Eliminar Bien
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/bienes/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7. DETENIDOS

#### Listar Detenidos
```bash
curl -X GET http://localhost:3000/api/operativos/1/detenidos \
  -H "Authorization: Bearer $TOKEN"
```

#### Agregar Detenido
```bash
curl -X POST http://localhost:3000/api/operativos/1/detenidos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCaso": "CASO-2024-001",
    "nombres": "JUAN CARLOS",
    "apellidoPaterno": "PEREZ",
    "apellidoMaterno": "GARCIA",
    "apellidoEsposo": "",
    "idPais": 70,
    "esMasculino": true,
    "fechaNacimiento": "1985-05-15",
    "idEstadoCivil": 1,
    "serie": "LP",
    "seccion": "A",
    "direccion": "Av. 6 de Agosto #123, Zona Sopocachi",
    "observaciones": "Detenido con 500g de cocaína"
  }'
```

#### Eliminar Detenido
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/detenidos/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 8. GALERÍA

#### Listar Galería
```bash
curl -X GET http://localhost:3000/api/operativos/1/galeria \
  -H "Authorization: Bearer $TOKEN"
```

#### Eliminar Foto de Galería
```bash
curl -X DELETE http://localhost:3000/api/operativos/1/galeria/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 9. CATÁLOGOS

#### Listar Estados de Droga por Tipo
```bash
curl -X GET http://localhost:3000/api/operativos/catalogos/estados-droga/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Listar Modelos de Fábrica por Tipo
```bash
curl -X GET http://localhost:3000/api/operativos/catalogos/fabrica-modelos/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Listar Items de Operativo por Categoría
```bash
curl -X GET http://localhost:3000/api/operativos/catalogos/items-operativo/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Listar Clases de Catálogo por Bien
```bash
curl -X GET http://localhost:3000/api/operativos/catalogos/clases/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Listar Tipos de Catálogo por Clase
```bash
curl -X GET http://localhost:3000/api/operativos/catalogos/tipos/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Listar Características por Clase
```bash
curl -X GET http://localhost:3000/api/operativos/catalogos/caracteristicas/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Entidades Creadas

### Entidades Principales
| Entidad | Tabla | Descripción |
|---------|-------|-------------|
| Operativo | operativo | Datos principales del operativo |
| Droga | droga | Drogas secuestradas |
| SustanciaSolida | sustancia_solida | Sustancias sólidas (precursores) |
| SustanciaLiquida | sustancia_liquida | Sustancias líquidas |
| Fabrica | fabrica | Fábricas/laboratorios |
| ItemBienSecuestrado | item_bien_secuestrado | Bienes secuestrados |
| ItemBienCaracteristica | item_bien_caracteristica | Características de bienes |
| DetenidoAuxiliar | detenido_auxiliar | Personas detenidas |
| ArrestadoAuxiliar | arrestado_auxiliar | Personas arrestadas |
| Galeria | galeria | Fotos del operativo |
| Logotipo | logotipo | Logos del operativo |
| Coca | coca | Hoja de coca |
| ServidorPolicial | servidor_policial | Policías participantes |

### Catálogos Operativos
| Entidad | Tabla | Descripción |
|---------|-------|-------------|
| CatalogoClase | catalogo_clase | Clasificación de bienes |
| CatalogoTipo | catalogo_tipo | Tipos de bienes |
| CatalogoCaracteristica | catalogo_caracteristica | Características |
| FabricaModelo | fabrica_modelo | Modelos de fábricas |
| EstadoDroga | estado_droga | Estados de droga |
| ItemOperativo | item_operativo | Subcategorías |

---

## Esquema de Base de Datos

```sql
-- Ver archivo: database/scripts/FELCN-SIII-postgres.sql
-- Tablas agregadas:
-- - public.droga
-- - public.sustancia_solida
-- - public.sustancia_liquida
-- - public.fabrica
-- - public.item_bien_secuestrado
-- - public.item_bien_caracteristica
-- - public.coca
```

---

## Notas para el Desarrollador Frontend

### Flujo de Trabajo

1. **Obtener caso desde ASIG-CASOS**
   - El caso debe existir en la tabla `asignacion`
   - El número de operativo se genera en ese módulo

2. **Crear operativo**
   - POST /api/operativos con el `idCaso`
   - Se calcula automáticamente las coordenadas decimales

3. **Agregar sub-entidades**
   - Usar los endpoints POST para cada tipo
   - Las imágenes se manejan como Buffer/Base64

4. **Actualizar operativo**
   - PATCH /api/operativos/:id
   - Solo enviar campos que cambian

5. **Obtener vista completa**
   - GET /api/operativos/:id/completo
   - Retorna operativo con todas sus sub-entidades

### Dependencias de Catálogos

```
TipoDroga → EstadoDroga (por tipo)
TipoFabrica → FabricaModelo (por tipo)
CategoriaOperativo → ItemOperativo (subcategorías)
Bienes → CatalogoClase → CatalogoTipo
                       → CatalogoCaracteristica
```

### Lookups Necesarios (SIII-Lookups)

- `/api/siii-lookups/tipos-droga`
- `/api/siii-lookups/tipos-operacion`
- `/api/siii-lookups/tipos-penal`
- `/api/siii-lookups/tipos-relevancia`
- `/api/siii-lookups/tipos-denuncia`
- `/api/siii-lookups/categorias-operativo`
- `/api/siii-lookups/departamentos`
- `/api/siii-lookups/provincias/departamento/:id`
- `/api/siii-lookups/localidades/provincia/:id`
- `/api/siii-lookups/paises`
- `/api/siii-lookups/estados-civiles`
- `/api/siii-lookups/formas-transporte` (pendiente)
- `/api/siii-lookups/tipos-fabrica` (pendiente)
- `/api/siii-lookups/bienes` (pendiente)

---

## Swagger/OpenAPI

Documentación interactiva disponible en:
```
http://localhost:3000/api/docs
```
