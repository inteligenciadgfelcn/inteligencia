# PROPUESTA: API OPERATIVOS OPTIMIZADA

## 🔍 ANÁLISIS DEL PROBLEMA

### Diseño Antiguo (ASP.NET) - ❌ INEFICIENTE
```
Usuario abre FRM-OP.aspx?id=123
  ├─ Query 1: SELECT ... FROM ASIGNACION WHERE Casos_Id = 123
  ├─ Query 2: SELECT ... FROM OPERATIVO WHERE Casos_Id = 123
  ├─ Query 3: SELECT ... FROM DROGAS WHERE Op_Id = X
  ├─ Query 4: SELECT ... FROM SUSTANCIASSOL WHERE Op_Id = X
  ├─ Query 5: SELECT ... FROM SUSTANCIALIQ WHERE Op_Id = X
  ├─ Query 6: SELECT ... FROM FABRICAS WHERE Op_Id = X
  ├─ Query 7: SELECT ... FROM ITEMBIENSECUESTRADO WHERE Op_Id = X
  ├─ Query 8: SELECT ... FROM PERSONASAUX WHERE Op_Id = X
  ├─ Query 9: SELECT ... FROM GALERIA WHERE Op_Id = X
  └─ Query 10: SELECT ... FROM LOGOTIPOS WHERE Op_Id = X
```
**Resultado:** 10 queries separadas a la base de datos + múltiples roundtrips HTTP

### Diseño Actual (API REST) - ⚠️ INCOMPLETO
```
GET /api/operativos/123
  → Solo datos de OPERATIVO (falta ASIGNACION)

GET /api/operativos/123/completo
  → OPERATIVO + sub-entidades (falta ASIGNACION)
```

---

## ✅ PROPUESTA OPTIMIZADA

### Principios de diseño:
1. **Una sola petición HTTP** para cada caso de uso
2. **Diferenciar entre CREAR y EDITAR**
3. **Incluir CASO (ASIGNACION) + OPERATIVO + sub-entidades** en un solo response
4. **Evitar over-fetching:** No traer datos innecesarios

---

## 🎯 NUEVOS ENDPOINTS PROPUESTOS

### 1. **CREAR NUEVO OPERATIVO**
```http
GET /api/operativos/nuevo/{casoId}
```

**Propósito:** Obtener datos iniciales para crear un operativo nuevo

**Response:**
```json
{
  "finalizado": true,
  "mensaje": "Datos para nuevo operativo",
  "datos": {
    "caso": {
      "casosId": 123,
      "numeroCaso": "CASO-2024-001",
      "nombreCaso": "Operación Alfa",
      "numeroOperativo": "OP-2024-001",
      "numeroPerDom": "PD-2024-001",
      "solicitud": {
        "nombre": "Crnl. José García",
        "telefono": "77712345"
      },
      "asignado": {
        "nombre": "Cmdte. María López",
        "telefono": "77798765"
      },
      "fiscal": {
        "nombre": "Dr. Juan Pérez",
        "telefono": "77755555"
      },
      "unidad": {
        "id": 1,
        "descripcion": "FELCN La Paz"
      },
      "distrital": {
        "id": 1,
        "descripcion": "Distrital 1"
      },
      "grupo": {
        "id": 1,
        "descripcion": "Grupo Alfa"
      }
    },
    "operativo": null,
    "lookups": {
      "tiposRelevancia": [...],
      "tiposDenuncia": [...],
      "tiposPenal": [...],
      "tiposOperacion": [...],
      "departamentos": [...],
      "planesOperaciones": [...],
      "categoriasOperativo": [...]
    }
  }
}
```

**Uso en Frontend:**
```javascript
// Al hacer clic en "Nuevo Operativo" desde la lista de asignaciones
const response = await fetch(`/api/operativos/nuevo/${casoId}`);
const { datos } = response;

// Renderizar formulario vacío con:
// - Datos del caso (solo lectura): datos.caso
// - Formulario de operativo: vacío, listo para llenar
// - Dropdowns poblados: datos.lookups
```

---

### 2. **EDITAR OPERATIVO EXISTENTE**
```http
GET /api/operativos/{id}/completo-con-caso
```
o simplemente mejorar el actual:
```http
GET /api/operativos/{id}/completo
```

**Propósito:** Obtener TODO en una sola petición (CASO + OPERATIVO + sub-entidades)

**Response:**
```json
{
  "finalizado": true,
  "mensaje": "Operativo completo obtenido",
  "datos": {
    "caso": {
      "casosId": 123,
      "numeroCaso": "CASO-2024-001",
      "nombreCaso": "Operación Alfa",
      "numeroOperativo": "OP-2024-001",
      "numeroPerDom": "PD-2024-001",
      "solicitud": {
        "nombre": "Crnl. José García",
        "telefono": "77712345"
      },
      "asignado": {
        "nombre": "Cmdte. María López",
        "telefono": "77798765"
      },
      "fiscal": {
        "nombre": "Dr. Juan Pérez",
        "telefono": "77755555"
      },
      "unidad": {
        "id": 1,
        "descripcion": "FELCN La Paz"
      },
      "distrital": {
        "id": 1,
        "descripcion": "Distrital 1"
      },
      "grupo": {
        "id": 1,
        "descripcion": "Grupo Alfa"
      }
    },
    "operativo": {
      "id": 456,
      "casosId": 123,
      "numeroOperativo": "OP-2024-001",
      "fechaOperativo": "2024-01-15",
      "idTipoOperacion": 1,
      "tipoOperacion": "Intervención",
      "idTipoRelevancia": 1,
      "tipoRelevancia": "Alta",
      "idTipoDenuncia": 1,
      "tipoDenuncia": "Anónima",
      "idTipoPenal": 1,
      "tipoPenal": "Flagrancia",
      "ubicacion": {
        "idDepartamento": 2,
        "departamento": "La Paz",
        "idProvincia": 1,
        "provincia": "Murillo",
        "idLocalidad": 1,
        "localidad": "La Paz",
        "lugar": "Zona Norte, Calle Falsa 123"
      },
      "coordenadas": {
        "latitud": "-16.513056",
        "longitud": "-68.258333",
        "gradosX": 16,
        "minX": 30,
        "segX": 45,
        "gradosY": 68,
        "minY": 15,
        "segY": 30
      },
      "idCategoriaOperativo": 1,
      "categoriaOperativo": "Tráfico ilícito",
      "idItemOperativo": 1,
      "itemOperativo": "Cocaína",
      "idPlanOperaciones": 1,
      "planOperaciones": "Plan Patria 2024",
      "alMando": "Cmdte. Pedro Ramírez",
      "breveDetalle": "Intervención en zona norte",
      "organizacion": "Cartel X",
      "clanFamiliar": "Familia López",
      "revisado": false,
      "fechaHoraRegistro": "2024-01-15T10:30:00",
      "usuario": "admin"
    },
    "drogas": [
      {
        "id": 1,
        "idTipoDroga": 1,
        "tipoDroga": "Cocaína",
        "idEstadoDroga": 1,
        "estadoDroga": "Polvo",
        "cantidadGramos": 5000.5,
        "cantidadPaquetes": 5,
        "idFormaTrans": 1,
        "formaTransporte": "Vehículo",
        "idPaisOrigen": 1,
        "paisOrigen": "Bolivia",
        "idPaisDestino": 2,
        "paisDestino": "Chile",
        "descripcion": "Cocaína en polvo alta pureza",
        "observaciones": "Empaque plástico"
      }
    ],
    "sustanciasSolidas": [
      {
        "id": 1,
        "idSustanciaSolidaDesc": 1,
        "descripcion": "Bicarbonato de sodio",
        "cantidad": 100,
        "unidadMedida": "kg"
      }
    ],
    "sustanciasLiquidas": [
      {
        "id": 1,
        "idSustanciaLiquidaDesc": 1,
        "descripcion": "Ácido clorhídrico",
        "cantidad": 50,
        "unidadMedida": "lt"
      }
    ],
    "fabricas": [
      {
        "id": 1,
        "idTipoFabrica": 1,
        "tipoFabrica": "Laboratorio",
        "idFabricaModelo": 1,
        "fabricaModelo": "Laboratorio rústico",
        "cantidad": 1,
        "capacidad": "100kg/día",
        "descripcion": "Laboratorio clandestino completo"
      }
    ],
    "bienes": [
      {
        "id": 1,
        "idBien": 1,
        "bien": "Vehículos",
        "idCatalogoClase": 1,
        "clase": "Automóviles",
        "idCatalogoTipo": 1,
        "tipo": "Camioneta",
        "cantidad": 1,
        "valorEstimado": 15000,
        "descripcion": "Toyota Hilux 2020",
        "placa": "ABC-123",
        "color": "Blanco",
        "idCalidadBien": 1,
        "calidadBien": "Bueno",
        "caracteristicas": [
          {
            "id": 1,
            "idCaracteristica": 1,
            "nombreCaracteristica": "Marca",
            "valor": "Toyota"
          },
          {
            "id": 2,
            "idCaracteristica": 2,
            "nombreCaracteristica": "Modelo",
            "valor": "Hilux"
          }
        ]
      }
    ],
    "detenidos": [
      {
        "id": 1,
        "nombres": "Juan Carlos",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "López",
        "idTipoDocumento": 1,
        "tipoDocumento": "CI",
        "numeroDocumento": "1234567",
        "fechaNacimiento": "1990-05-15",
        "edad": 34,
        "idPaisNacionalidad": 1,
        "nacionalidad": "Bolivia",
        "idEstadoCivil": 1,
        "estadoCivil": "Soltero",
        "genero": "M",
        "idTipoPersona": 1,
        "tipoPersona": "Sospechoso",
        "idTipoImplicado": 1,
        "tipoImplicado": "Detenido",
        "ocupacion": "Comerciante",
        "direccion": "Calle Falsa 123",
        "telefono": "77712345",
        "caracteristicasFisicas": {
          "idColorPiel": 1,
          "colorPiel": "Moreno",
          "idColorOjos": 1,
          "colorOjos": "Café",
          "idColorCabello": 1,
          "colorCabello": "Negro",
          "idTipoCabello": 1,
          "tipoCabello": "Liso",
          "estatura": 175,
          "peso": 70
        },
        "fotos": {
          "frente": "base64...",
          "perfilDerecho": "base64...",
          "perfilIzquierdo": "base64..."
        }
      }
    ],
    "galeria": [
      {
        "id": 1,
        "descripcion": "Vista general del operativo",
        "foto": "base64..." // o URL
      }
    ],
    "logotipos": [
      {
        "id": 1,
        "numeroCaso": "CASO-2024-001",
        "numeroOperativo": "OP-2024-001",
        "fechaOperativo": "2024-01-15",
        "nombreCaso": "Operación Alfa",
        "descripcion": "Logo identificado",
        "imagen": "logo001.png",
        "descripcionLogo": "Logo del cartel X",
        "idTipoDroga": 1,
        "tipoDroga": "Cocaína",
        "idPaisOrigen": 1,
        "paisOrigen": "Bolivia",
        "idPaisDestino": 2,
        "paisDestino": "Chile",
        "organizacion": "Cartel X",
        "blanco": "Líder de la organización",
        "observacion": "Encontrado en documentos",
        "enlace": "http://referencia.com",
        "fotografia": "base64..." // o URL
      }
    ],
    "estadisticas": {
      "totalDrogas": 1,
      "totalGramosDrogas": 5000.5,
      "totalSustanciasSolidas": 1,
      "totalSustanciasLiquidas": 1,
      "totalFabricas": 1,
      "totalBienes": 1,
      "totalDetenidos": 1,
      "totalFotosGaleria": 1,
      "totalLogotipos": 1
    }
  }
}
```

**Uso en Frontend:**
```javascript
// Al hacer clic en una fila de la tabla de asignaciones
const response = await fetch(`/api/operativos/${operativoId}/completo`);
const { datos } = response;

// Renderizar formulario completo con:
// - Sección 1: Datos del caso (solo lectura): datos.caso
// - Sección 2: Datos del operativo (editable): datos.operativo
// - Sección 3: Tablas de sub-entidades:
//   * Drogas: datos.drogas
//   * Sustancias sólidas: datos.sustanciasSolidas
//   * Sustancias líquidas: datos.sustanciasLiquidas
//   * Fábricas: datos.fabricas
//   * Bienes: datos.bienes (con características anidadas)
//   * Detenidos: datos.detenidos
//   * Galería: datos.galeria
//   * Logotipos: datos.logotipos
// - Sección 4: Estadísticas: datos.estadisticas
```

---

### 3. **ENDPOINT SIMPLIFICADO (OPCIONAL)**
Si solo necesitas datos básicos sin sub-entidades:
```http
GET /api/operativos/{id}
```

**Response:**
```json
{
  "finalizado": true,
  "mensaje": "Operativo obtenido",
  "datos": {
    "caso": { ... },      // Datos de ASIGNACION
    "operativo": { ... }  // Datos de OPERATIVO
    // SIN sub-entidades
  }
}
```

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### ❌ ANTES (Diseño Antiguo)
```javascript
// Frontend ASP.NET
async function cargarOperativo(id) {
  // 10 queries a la BD en el backend
  // 1 response HTML renderizado
}
```
**Problemas:**
- 10 queries separadas
- Acoplamiento fuerte frontend-backend
- No reutilizable para otros clientes (mobile, etc.)

### ❌ DISEÑO ACTUAL (Incompleto)
```javascript
// Frontend React/Vue
async function cargarOperativo(id) {
  const operativo = await fetch(`/api/operativos/${id}`);
  const completo = await fetch(`/api/operativos/${id}/completo`);
  // ⚠️ Falta datos del CASO (ASIGNACION)
  // 2 peticiones HTTP
}
```
**Problemas:**
- Falta datos de ASIGNACION
- 2 peticiones HTTP cuando podría ser 1

### ✅ DESPUÉS (Propuesta Optimizada)
```javascript
// Frontend React/Vue
async function cargarOperativo(id) {
  const { datos } = await fetch(`/api/operativos/${id}/completo`);
  // 1 petición HTTP
  // TODO incluido: CASO + OPERATIVO + sub-entidades
  return datos;
}

async function crearNuevoOperativo(casoId) {
  const { datos } = await fetch(`/api/operativos/nuevo/${casoId}`);
  // 1 petición HTTP
  // TODO lo necesario: CASO + lookups
  return datos;
}
```
**Beneficios:**
- 1 sola petición HTTP por operación
- Response completo y estructurado
- Backend optimiza queries (puede usar JOINs, eager loading, etc.)
- Frontend simple y mantenible
- Reutilizable para otros clientes

---

## 🏗️ IMPLEMENTACIÓN EN EL BACKEND

### Backend debe:
1. **Crear endpoint `GET /api/operativos/nuevo/{casoId}`**
   ```typescript
   async obtenerDatosNuevoOperativo(casoId: string) {
     const caso = await this.asignacionRepo.findById(casoId);
     const lookups = await this.lookupsService.obtenerLookupsOperativo();

     return {
       caso: this.mapearCaso(caso),
       operativo: null,
       lookups
     };
   }
   ```

2. **Mejorar endpoint `GET /api/operativos/{id}/completo`**
   ```typescript
   async obtenerOperativoCompleto(id: string) {
     // Usar eager loading / JOINs para optimizar
     const operativo = await this.operativoRepo.findById(id, {
       relations: [
         'caso', // ASIGNACION
         'drogas',
         'sustanciasSolidas',
         'sustanciasLiquidas',
         'fabricas',
         'bienes',
         'bienes.caracteristicas', // Nested
         'detenidos',
         'galeria',
         'logotipos'
       ]
     });

     return {
       caso: this.mapearCaso(operativo.caso),
       operativo: this.mapearOperativo(operativo),
       drogas: operativo.drogas.map(this.mapearDroga),
       sustanciasSolidas: operativo.sustanciasSolidas.map(...),
       // ... resto de sub-entidades
       estadisticas: this.calcularEstadisticas(operativo)
     };
   }
   ```

3. **Optimización de queries:**
   - Usar `eager loading` o `JOIN` en lugar de queries N+1
   - Cachear lookups/parametricas que no cambian frecuentemente
   - Considerar paginación para sub-entidades si pueden ser muy grandes

---

## 🎯 FLUJOS DE FRONTEND OPTIMIZADOS

### Flujo 1: CREAR NUEVO OPERATIVO
```
Usuario en lista de asignaciones
  ↓
Click en fila → obtiene casoId
  ↓
Navega a /operativos/nuevo/:casoId
  ↓
Frontend: GET /api/operativos/nuevo/:casoId
  ↓
Response: { caso, operativo: null, lookups }
  ↓
Renderiza formulario vacío con:
  - Datos del caso (readonly)
  - Formulario operativo (campos vacíos)
  - Dropdowns poblados (lookups)
  ↓
Usuario llena formulario
  ↓
Frontend: POST /api/operativos
  ↓
Operativo creado → redirige a edición
```

### Flujo 2: EDITAR OPERATIVO EXISTENTE
```
Usuario en lista de asignaciones
  ↓
Click en fila → obtiene operativoId
  ↓
Navega a /operativos/:id
  ↓
Frontend: GET /api/operativos/:id/completo
  ↓
Response: { caso, operativo, drogas, sustancias, ... }
  ↓
Renderiza formulario completo con:
  - Sección 1: Datos del caso (readonly)
  - Sección 2: Datos del operativo (editable)
  - Sección 3: Tablas de sub-entidades
    * Drogas (tabla con datos)
    * Sustancias (tabla con datos)
    * Fábricas (tabla con datos)
    * Bienes (tabla con datos + características)
    * Detenidos (tabla con datos)
    * Galería (grid de imágenes)
    * Logotipos (tabla con datos)
  ↓
Usuario edita/agrega datos
  ↓
Frontend: PATCH /api/operativos/:id
Frontend: POST /api/operativos/:id/drogas
Frontend: DELETE /api/operativos/:id/drogas/:idDroga
... (operaciones CRUD sobre sub-entidades)
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Backend:
- [ ] Crear endpoint `GET /api/operativos/nuevo/{casoId}`
- [ ] Mejorar `GET /api/operativos/{id}/completo` para incluir datos de ASIGNACION
- [ ] Implementar eager loading / JOINs para optimizar queries
- [ ] Incluir características de bienes en la respuesta de bienes
- [ ] Agregar campo `estadisticas` en response completo
- [ ] Mapear correctamente relaciones ASIGNACION ↔ OPERATIVO
- [ ] Documentar en Swagger los nuevos schemas de respuesta

### Frontend:
- [ ] Implementar página "Nuevo Operativo" usando `GET /api/operativos/nuevo/{casoId}`
- [ ] Implementar página "Editar Operativo" usando `GET /api/operativos/{id}/completo`
- [ ] Renderizar sección de datos del CASO (readonly)
- [ ] Renderizar sección de datos del OPERATIVO (editable)
- [ ] Renderizar secciones de sub-entidades (tablas CRUD)
- [ ] Mostrar estadísticas/resumen
- [ ] Manejo de errores y estados de carga

### Testing:
- [ ] Test endpoint `/nuevo/{casoId}` con caso válido
- [ ] Test endpoint `/nuevo/{casoId}` con caso inexistente
- [ ] Test endpoint `/{id}/completo` con operativo existente
- [ ] Test endpoint `/{id}/completo` con operativo sin sub-entidades
- [ ] Validar performance de queries (debe ser < 500ms para operativo completo)
- [ ] Validar tamaño de response (considerar compresión gzip)

---

## 💡 BENEFICIOS DE ESTA PROPUESTA

### Performance:
- ✅ **1 petición HTTP** en lugar de 2-10
- ✅ **Backend optimiza queries** con JOINs/eager loading
- ✅ **Menos latencia** de red
- ✅ **Menos overhead** de HTTP headers

### Mantenibilidad:
- ✅ **Frontend más simple:** 1 llamada, 1 estructura de datos
- ✅ **Backend encapsula complejidad:** El frontend no necesita saber sobre ASIGNACION vs OPERATIVO
- ✅ **Reutilizable:** Mismo endpoint para web, mobile, APIs externas

### Experiencia de Usuario:
- ✅ **Carga más rápida** de la pantalla
- ✅ **Menos spinners/loaders**
- ✅ **Datos consistentes** (todo en una transacción)

### Escalabilidad:
- ✅ **Fácil de cachear** (response completo)
- ✅ **Fácil de optimizar** (una query compuesta vs múltiples)
- ✅ **Fácil de monitorear** (1 endpoint vs múltiples)

---

## 🚀 MIGRACIÓN GRADUAL (OPCIONAL)

Si no se puede implementar todo de golpe:

### Fase 1 (Rápida):
- Mejorar `GET /api/operativos/{id}/completo` para incluir datos de ASIGNACION
- Frontend usa este endpoint mejorado

### Fase 2 (Media):
- Crear `GET /api/operativos/nuevo/{casoId}`
- Implementar página de "Nuevo Operativo"

### Fase 3 (Opcional):
- Optimizar queries en backend (JOINs, eager loading)
- Agregar estadísticas
- Cachear lookups

---

**Recomendación:** Implementar todo junto para evitar deuda técnica y aprovechar los beneficios completos desde el inicio.
