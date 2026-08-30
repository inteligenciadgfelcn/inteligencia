# API OPERATIVOS SIII - FELCN Backend

Documentacion de APIs REST para los formularios de Operativos del sistema SUNESIS (SIII).

**Base URL:** `http://localhost:3000/api`

---

## TABLA DE CONTENIDOS

1. [Operativos](#operativos)
2. [Drogas](#drogas)
3. [Sustancias Solidas](#sustancias-solidas)
4. [Sustancias Liquidas](#sustancias-liquidas)
5. [Fabricas](#fabricas)
6. [Bienes Secuestrados](#bienes-secuestrados)
7. [Detenidos](#detenidos)
8. [Galeria](#galeria)
9. [Logotipos](#logotipos)
10. [Catalogos Operativo](#catalogos-operativo)
11. [Lookups - Parametricas](#lookups---parametricas)

---

## OPERATIVOS

### Listar todos los operativos
```bash
curl -X GET "http://localhost:3000/api/operativos"
```

### Obtener operativo por ID
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}"
```

### Obtener operativo completo con sub-entidades
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/completo"
```
**Retorna:** operativo + drogas + sustanciasSolidas + sustanciasLiquidas + fabricas + bienes + detenidos + galeria + logotipos

### Obtener operativos por caso
```bash
curl -X GET "http://localhost:3000/api/operativos/caso/{idCaso}"
```

### Buscar operativo por numero
```bash
curl -X GET "http://localhost:3000/api/operativos/numero/{numeroOperativo}"
```

### Crear operativo
```bash
curl -X POST "http://localhost:3000/api/operativos" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroOperativo": "OP-2024-001",
    "idCaso": "1",
    "fechaOperativo": "2024-01-15",
    "gradosX": 16,
    "minX": 30,
    "segX": 45,
    "gradosY": 68,
    "minY": 15,
    "segY": 30,
    "idTipoOperacion": 1,
    "idDepartamento": 1,
    "idProvincia": 1,
    "idLocalidad": 1,
    "lugar": "Zona Norte",
    "idTipoDenuncia": 1,
    "idCategoriaOperativo": 1,
    "idPlanOperaciones": 1,
    "idEtapa": 1,
    "idEtapaInvestigacion": 1,
    "idFormaTransporte": 1,
    "idRecurso": 1,
    "observaciones": "Sin novedad"
  }'
```

### Actualizar operativo
```bash
curl -X PATCH "http://localhost:3000/api/operativos/{id}" \
  -H "Content-Type: application/json" \
  -d '{
    "observaciones": "Actualizado",
    "lugar": "Zona Sur"
  }'
```

### Inactivar operativo
```bash
curl -X PATCH "http://localhost:3000/api/operativos/{id}/inactivar"
```

---

## DROGAS

### Listar drogas del operativo
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/drogas"
```

### Obtener pesaje/resumen de drogas
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/drogas/pesaje"
```
**Retorna:** `{ totalGramos, totalRegistros }`

### Agregar droga al operativo
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/drogas" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoDroga": 1,
    "idEstadoDroga": 1,
    "cantidadGramos": 500.5,
    "descripcion": "Cocaina en polvo",
    "cantidadPaquetes": 5,
    "observaciones": "Empaque plastico"
  }'
```

### Eliminar droga
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/drogas/{idDroga}"
```

---

## SUSTANCIAS SOLIDAS

### Listar sustancias solidas
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/sustancias-solidas"
```

### Agregar sustancia solida
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/sustancias-solidas" \
  -H "Content-Type: application/json" \
  -d '{
    "idSustanciaSolidaDesc": 1,
    "cantidad": 100,
    "unidadMedida": "kg",
    "descripcion": "Precursor quimico"
  }'
```

### Eliminar sustancia solida
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/sustancias-solidas/{idSustancia}"
```

---

## SUSTANCIAS LIQUIDAS

### Listar sustancias liquidas
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/sustancias-liquidas"
```

### Agregar sustancia liquida
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/sustancias-liquidas" \
  -H "Content-Type: application/json" \
  -d '{
    "idSustanciaLiquidaDesc": 1,
    "cantidad": 50,
    "unidadMedida": "lt",
    "descripcion": "Acido"
  }'
```

### Eliminar sustancia liquida
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/sustancias-liquidas/{idSustancia}"
```

---

## FABRICAS

### Listar fabricas
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/fabricas"
```

### Agregar fabrica
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/fabricas" \
  -H "Content-Type: application/json" \
  -d '{
    "idTipoFabrica": 1,
    "idFabricaModelo": 1,
    "cantidad": 2,
    "descripcion": "Laboratorio clandestino",
    "capacidad": "100kg/dia"
  }'
```

### Eliminar fabrica
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/fabricas/{idFabrica}"
```

---

## BIENES SECUESTRADOS

### Listar bienes
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/bienes"
```

### Agregar bien
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/bienes" \
  -H "Content-Type: application/json" \
  -d '{
    "idBien": 1,
    "idCatalogoClase": 1,
    "idCatalogoTipo": 1,
    "cantidad": 1,
    "descripcion": "Vehiculo Toyota Hilux",
    "valorEstimado": 15000,
    "placa": "ABC-123",
    "color": "Blanco",
    "idCalidadBien": 1
  }'
```

### Eliminar bien
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/bienes/{idBien}"
```

---

## DETENIDOS

### Listar detenidos
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/detenidos"
```

### Agregar detenido
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/detenidos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan Carlos",
    "apellidoPaterno": "Perez",
    "apellidoMaterno": "Lopez",
    "idTipoDocumento": 1,
    "numeroDocumento": "1234567",
    "fechaNacimiento": "1990-05-15",
    "idPaisNacionalidad": 1,
    "idEstadoCivil": 1,
    "genero": "M",
    "idTipoPersona": 1,
    "idTipoImplicado": 1,
    "ocupacion": "Comerciante",
    "direccion": "Calle Falsa 123",
    "telefono": "77712345",
    "idColorPiel": 1,
    "idColorOjos": 1,
    "idColorCabello": 1,
    "idTipoCabello": 1,
    "estatura": 175,
    "peso": 70
  }'
```

### Eliminar detenido
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/detenidos/{idDetenido}"
```

---

## GALERIA

### Listar galeria
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/galeria"
```

### Eliminar foto de galeria
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/galeria/{idGaleria}"
```

---

## LOGOTIPOS

### Listar logotipos
```bash
curl -X GET "http://localhost:3000/api/operativos/{id}/logotipos"
```

### Agregar logotipo (multipart/form-data)
```bash
curl -X POST "http://localhost:3000/api/operativos/{id}/logotipos" \
  -H "Content-Type: multipart/form-data" \
  -F "numeroCaso=CASO-2024-001" \
  -F "numeroOperativo=OP-2024-001" \
  -F "fechaOperativo=2024-01-15" \
  -F "nombreCaso=Operacion Alfa" \
  -F "descripcion=Logo identificado en operativo" \
  -F "imagen=logo001.png" \
  -F "descripcionLogo=Logo de organizacion criminal" \
  -F "idTipoDroga=1" \
  -F "idPaisOrigen=1" \
  -F "idPaisDestino=2" \
  -F "organizacion=Cartel X" \
  -F "blanco=Objetivo principal" \
  -F "observacion=Encontrado en documentos" \
  -F "enlace=http://referencia.com" \
  -F "fotografia=@/ruta/al/archivo.png"
```

### Eliminar logotipo
```bash
curl -X DELETE "http://localhost:3000/api/operativos/{id}/logotipos/{idLogotipo}"
```

---

## CATALOGOS OPERATIVO

### Estados de droga por tipo
```bash
curl -X GET "http://localhost:3000/api/operativos/catalogos/estados-droga/{idTipoDroga}"
```

### Modelos de fabrica por tipo
```bash
curl -X GET "http://localhost:3000/api/operativos/catalogos/fabrica-modelos/{idTipoFabrica}"
```

### Items de operativo por categoria
```bash
curl -X GET "http://localhost:3000/api/operativos/catalogos/items-operativo/{idCategoriaOperativo}"
```

### Clases de catalogo por bien
```bash
curl -X GET "http://localhost:3000/api/operativos/catalogos/clases/{idBien}"
```

### Tipos de catalogo por clase
```bash
curl -X GET "http://localhost:3000/api/operativos/catalogos/tipos/{idCatalogoClase}"
```

### Caracteristicas de catalogo por clase
```bash
curl -X GET "http://localhost:3000/api/operativos/catalogos/caracteristicas/{idCatalogoClase}"
```

---

## LOOKUPS - PARAMETRICAS

**Base URL:** `http://localhost:3000/api/siii-lookups`

### GEOGRAFIA

| Endpoint | Descripcion |
|----------|-------------|
| `GET /continentes` | Listar continentes |
| `GET /paises` | Listar todos los paises |
| `GET /paises/continente/{id}` | Paises por continente |
| `GET /paises-destino` | Paises destino de trafico |
| `GET /departamentos` | Listar departamentos |
| `GET /departamentos/pais/{id}` | Departamentos por pais |
| `GET /provincias` | Listar provincias |
| `GET /provincias/departamento/{id}` | Provincias por departamento |
| `GET /localidades` | Listar localidades |
| `GET /localidades/provincia/{id}` | Localidades por provincia |

```bash
# Ejemplos
curl -X GET "http://localhost:3000/api/siii-lookups/continentes"
curl -X GET "http://localhost:3000/api/siii-lookups/paises"
curl -X GET "http://localhost:3000/api/siii-lookups/departamentos/pais/1"
curl -X GET "http://localhost:3000/api/siii-lookups/provincias/departamento/1"
curl -X GET "http://localhost:3000/api/siii-lookups/localidades/provincia/1"
```

### TIPOS

| Endpoint | Descripcion |
|----------|-------------|
| `GET /tipos-droga` | Tipos de droga |
| `GET /tipos-operacion` | Tipos de operacion |
| `GET /tipos-penal` | Tipos penal |
| `GET /tipos-relevancia` | Tipos de relevancia |
| `GET /tipos-persona` | Tipos de persona |
| `GET /tipos-denuncia` | Tipos de denuncia |
| `GET /tipos-fabrica` | Tipos de fabrica |
| `GET /tipos-documento` | Tipos de documento |
| `GET /tipos-implicado` | Tipos de implicado |
| `GET /estados-civiles` | Estados civiles |
| `GET /categorias-operativo` | Categorias de operativo |

```bash
# Ejemplos
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-droga"
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-operacion"
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-fabrica"
curl -X GET "http://localhost:3000/api/siii-lookups/estados-civiles"
```

### OPERATIVO PARAMS

| Endpoint | Descripcion |
|----------|-------------|
| `GET /planes-operaciones` | Planes de operaciones |
| `GET /formas-transporte` | Formas de transporte |
| `GET /etapas` | Etapas |
| `GET /etapas-investigacion` | Etapas de investigacion |
| `GET /recursos` | Recursos |

```bash
# Ejemplos
curl -X GET "http://localhost:3000/api/siii-lookups/planes-operaciones"
curl -X GET "http://localhost:3000/api/siii-lookups/formas-transporte"
curl -X GET "http://localhost:3000/api/siii-lookups/etapas"
curl -X GET "http://localhost:3000/api/siii-lookups/recursos"
```

### SUSTANCIAS

| Endpoint | Descripcion |
|----------|-------------|
| `GET /sustancias-solidas-desc` | Descripciones sustancias solidas |
| `GET /sustancias-liquidas-desc` | Descripciones sustancias liquidas |
| `GET /coca-procedencias` | Procedencias de coca |
| `GET /coca-estados` | Estados de coca |
| `GET /coca-descripciones` | Descripciones de coca |

```bash
# Ejemplos
curl -X GET "http://localhost:3000/api/siii-lookups/sustancias-solidas-desc"
curl -X GET "http://localhost:3000/api/siii-lookups/sustancias-liquidas-desc"
curl -X GET "http://localhost:3000/api/siii-lookups/coca-procedencias"
```

### BIENES

| Endpoint | Descripcion |
|----------|-------------|
| `GET /bienes` | Tipos de bienes |
| `GET /calidades-bien` | Calidades de bien |

```bash
# Ejemplos
curl -X GET "http://localhost:3000/api/siii-lookups/bienes"
curl -X GET "http://localhost:3000/api/siii-lookups/calidades-bien"
```

### PERSONA - CARACTERISTICAS

| Endpoint | Descripcion |
|----------|-------------|
| `GET /colores-piel` | Colores de piel |
| `GET /colores-ojos` | Colores de ojos |
| `GET /colores-cabello` | Colores de cabello |
| `GET /tipos-cabello` | Tipos de cabello |

```bash
# Ejemplos
curl -X GET "http://localhost:3000/api/siii-lookups/colores-piel"
curl -X GET "http://localhost:3000/api/siii-lookups/colores-ojos"
curl -X GET "http://localhost:3000/api/siii-lookups/colores-cabello"
curl -X GET "http://localhost:3000/api/siii-lookups/tipos-cabello"
```

---

## RESPUESTAS

### Formato de respuesta exitosa (Lista)
```json
{
  "finalizado": true,
  "mensaje": "Registros obtenidos con exito",
  "datos": [...]
}
```

### Formato de respuesta exitosa (Creacion)
```json
{
  "finalizado": true,
  "mensaje": "Registro creado con exito",
  "datos": {...}
}
```

### Formato de respuesta exitosa (Actualizacion)
```json
{
  "finalizado": true,
  "mensaje": "Registro actualizado con exito",
  "datos": {...}
}
```

### Formato de respuesta exitosa (Eliminacion)
```json
{
  "finalizado": true,
  "mensaje": "Registro eliminado con exito"
}
```

### Formato de error
```json
{
  "finalizado": false,
  "codigo": 404,
  "mensaje": "Operativo con ID xxx no encontrado"
}
```

---

## SWAGGER

Documentacion interactiva disponible en:
```
http://localhost:3000/api/docs
```

---

## RESUMEN DE ENDPOINTS

| Modulo | GET | POST | PATCH | DELETE |
|--------|-----|------|-------|--------|
| Operativos | 5 | 1 | 2 | - |
| Drogas | 2 | 1 | - | 1 |
| Sustancias Solidas | 1 | 1 | - | 1 |
| Sustancias Liquidas | 1 | 1 | - | 1 |
| Fabricas | 1 | 1 | - | 1 |
| Bienes | 1 | 1 | - | 1 |
| Detenidos | 1 | 1 | - | 1 |
| Galeria | 1 | - | - | 1 |
| Logotipos | 1 | 1 | - | 1 |
| Catalogos | 6 | - | - | - |
| Lookups | 30+ | - | - | - |
| **TOTAL** | **50+** | **8** | **2** | **9** |

---

**Version:** 1.0.0
**Ultima actualizacion:** 2024-02-24
**Backend:** NestJS + TypeORM + PostgreSQL
