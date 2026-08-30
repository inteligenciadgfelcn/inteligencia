# SUNESIS - Migración a NestJS Multi-Database

## Resumen del Proyecto

Migración del sistema SUNESIS (originalmente ASP.NET WebForms) a APIs REST en NestJS, manejando **3 bases de datos PostgreSQL** en un solo proyecto.

---

## Análisis Inicial

### Sistema Original
- **Tecnología**: ASP.NET WebForms
- **Bases de datos**: 3 bases PostgreSQL independientes
- **Problema**: Sistema monolítico difícil de mantener y escalar

### Objetivos de la Migración
1. Modernizar a arquitectura REST con NestJS
2. Mantener las 3 bases de datos existentes
3. Implementar autenticación híbrida (JWT + perfil desde BD)
4. Crear APIs documentadas con Swagger

### Bases de Datos Identificadas

| Base de Datos | Propósito | Esquemas |
|---------------|-----------|----------|
| `felcn_asignacion_casos` | Asignación de casos y servicios | public |
| `felcn_s3i` | Usuarios, seguridad, estructura organizacional | public |
| `felcn_iii` | Operativos y datos paramétricos | parametricas, public |

---

## Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────┐
│                    felcn-base-backend (NestJS)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ AsigCasosModule  │  │    S2iModule     │  │  SiiiModule   │ │
│  │    (default)     │  │      (s2i)       │  │    (siii)     │ │
│  ├──────────────────┤  ├──────────────────┤  ├───────────────┤ │
│  │ - Asignacion     │  │ - Usuario        │  │ Paramétricas: │ │
│  │ - Servicio       │  │ - Rol            │  │ - 38 tablas   │ │
│  │ - DepartamentoCaso│ │ - Grado          │  │               │ │
│  │ - UnidadCaso     │  │ - Unidad         │  │ Operativas:   │ │
│  │ - Letra          │  │ - Distrital      │  │ - Operativo   │ │
│  │ - UsuarioUnidad  │  │ - Grupo          │  │               │ │
│  │ - UsuarioIcia    │  │ - Menu           │  │               │ │
│  └──────────────────┘  │ - Formulario     │  │               │ │
│                        │ - Auditoria      │  │               │ │
│                        └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Resultado de la Implementación

### Estadísticas

| Métrica | Cantidad |
|---------|----------|
| Entidades creadas | 59 |
| Controladores | 8 |
| Endpoints REST | 50+ |
| Conexiones a BD | 3 |

### Módulos Implementados

#### 1. AsigCasosModule (BD: felcn_asignacion_casos)
- **7 entidades**: Asignacion, Servicio, DepartamentoCaso, UnidadCaso, Letra, UsuarioUnidad, UsuarioIcia
- **3 controladores**: AsignacionController, ServicioController, AsigLookupController

#### 2. S2iModule (BD: felcn_s3i)
- **12 entidades**: Usuario, ActivacionUsuario, Rol, Grado, Unidad, Distrital, Grupo, ContenidoCaso, Menu, MenuHijo, Formulario, AuditoriaCambio
- **3 controladores**: UsuarioController, EstructuraController, MenuController

#### 3. SiiiModule (BD: felcn_iii)
- **39 entidades** (38 paramétricas + 1 operativa)
- **2 controladores**: LookupController, OperativoController

### Entidades Paramétricas SIII

| Categoría | Entidades |
|-----------|-----------|
| Geografía | Continente, Pais, PaisDestino, Departamento, Provincia, Localidad |
| Tipos | TipoDroga, TipoOperacion, TipoPenal, TipoRelevancia, TipoPersona, TipoImplicado, TipoFabrica, TipoDocumento, TipoDenuncia |
| Persona | EstadoCivil, ColorPiel, ColorOjos, ColorCabello, TipoCabello |
| Operativo | CategoriaOperativo, PlanOperaciones, Etapa, EtapaInvestigacion, FormaTransporte, Recurso, TamanioDocumento |
| Sustancia | SustanciaSolidaDescripcion, SustanciaLiquidaDescripcion, CocaProcedencia, CocaEstado, CocaDescripcion, SituacionLegal |
| Bienes | Bienes, CalidadBien, ContenidoBien, ContenidoCaso, Grado, Letra |

---

## Configuración

### Variables de Entorno (.env)

```env
# BD 1: ASIG-CASOS (conexión default)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=felcn_asignacion_casos

# BD 2: S2I (usuarios/seguridad)
DB_S2I_HOST=localhost
DB_S2I_PORT=5432
DB_S2I_USERNAME=postgres
DB_S2I_PASSWORD=postgres
DB_S2I_DATABASE=felcn_s3i

# BD 3: SIII (operativos/paramétricas)
DB_SIII_HOST=localhost
DB_SIII_PORT=5432
DB_SIII_USERNAME=postgres
DB_SIII_PASSWORD=postgres
DB_SIII_DATABASE=felcn_iii
```

### Iniciar la Aplicación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

---

## Tests con cURL

### Autenticación

Primero, obtener un token JWT:

```bash
# Login (ajustar según tu configuración de auth)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "contrasena": "admin123"
  }'
```

Guardar el token para usarlo en las siguientes peticiones:

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### ASIG-CASOS (felcn_asignacion_casos)

#### Asignaciones

```bash
# Listar todas las asignaciones
curl -X GET http://localhost:3000/api/asignaciones \
  -H "Authorization: Bearer $TOKEN"

# Obtener asignación por ID
curl -X GET http://localhost:3000/api/asignaciones/1 \
  -H "Authorization: Bearer $TOKEN"

# Crear asignación
curl -X POST http://localhost:3000/api/asignaciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroCaso": "CASO-2024-001",
    "descripcion": "Caso de prueba",
    "idDepartamento": 1,
    "idUnidad": 1
  }'

# Actualizar asignación
curl -X PATCH http://localhost:3000/api/asignaciones/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Caso actualizado"
  }'

# Inactivar asignación
curl -X PATCH http://localhost:3000/api/asignaciones/1/inactivar \
  -H "Authorization: Bearer $TOKEN"
```

#### Servicios

```bash
# Listar servicios
curl -X GET http://localhost:3000/api/asig-servicios \
  -H "Authorization: Bearer $TOKEN"

# Obtener servicio por ID
curl -X GET http://localhost:3000/api/asig-servicios/1 \
  -H "Authorization: Bearer $TOKEN"

# Crear servicio
curl -X POST http://localhost:3000/api/asig-servicios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Servicio de prueba",
    "descripcion": "Descripción del servicio"
  }'

# Actualizar servicio
curl -X PATCH http://localhost:3000/api/asig-servicios/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Servicio actualizado"
  }'
```

#### Lookups ASIG-CASOS

```bash
# Listar departamentos
curl -X GET http://localhost:3000/api/asig-lookups/departamentos \
  -H "Authorization: Bearer $TOKEN"

# Listar unidades
curl -X GET http://localhost:3000/api/asig-lookups/unidades \
  -H "Authorization: Bearer $TOKEN"

# Listar unidades por departamento
curl -X GET http://localhost:3000/api/asig-lookups/unidades/departamento/1 \
  -H "Authorization: Bearer $TOKEN"

# Listar letras
curl -X GET http://localhost:3000/api/asig-lookups/letras \
  -H "Authorization: Bearer $TOKEN"

# Listar usuarios por unidad
curl -X GET http://localhost:3000/api/asig-lookups/usuarios/unidad/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### S2I (felcn_s3i)

#### Usuarios

```bash
# Listar usuarios
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer $TOKEN"

# Obtener usuario por ID
curl -X GET http://localhost:3000/api/usuarios/1 \
  -H "Authorization: Bearer $TOKEN"

# Obtener perfil del usuario actual
curl -X GET http://localhost:3000/api/usuarios/perfil \
  -H "Authorization: Bearer $TOKEN"

# Buscar usuario por username
curl -X GET http://localhost:3000/api/usuarios/username/admin \
  -H "Authorization: Bearer $TOKEN"

# Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "password": "password123",
    "nombres": "Juan",
    "primerApellido": "Pérez",
    "segundoApellido": "García",
    "ci": "1234567",
    "idGrado": 1,
    "idGrupo": 1
  }'

# Actualizar usuario
curl -X PATCH http://localhost:3000/api/usuarios/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan Carlos"
  }'

# Inactivar usuario
curl -X PATCH http://localhost:3000/api/usuarios/1/inactivar \
  -H "Authorization: Bearer $TOKEN"
```

#### Estructura Organizacional

```bash
# Listar grados
curl -X GET http://localhost:3000/api/estructura/grados \
  -H "Authorization: Bearer $TOKEN"

# Listar unidades
curl -X GET http://localhost:3000/api/estructura/unidades \
  -H "Authorization: Bearer $TOKEN"

# Listar distritales
curl -X GET http://localhost:3000/api/estructura/distritales \
  -H "Authorization: Bearer $TOKEN"

# Listar distritales por unidad
curl -X GET http://localhost:3000/api/estructura/distritales/unidad/1 \
  -H "Authorization: Bearer $TOKEN"

# Listar grupos
curl -X GET http://localhost:3000/api/estructura/grupos \
  -H "Authorization: Bearer $TOKEN"

# Listar grupos por distrital
curl -X GET http://localhost:3000/api/estructura/grupos/distrital/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Menús

```bash
# Listar menús
curl -X GET http://localhost:3000/api/menus \
  -H "Authorization: Bearer $TOKEN"

# Obtener menú por ID
curl -X GET http://localhost:3000/api/menus/1 \
  -H "Authorization: Bearer $TOKEN"

# Listar menús hijos por menú padre
curl -X GET http://localhost:3000/api/menus/1/hijos \
  -H "Authorization: Bearer $TOKEN"

# Listar formularios
curl -X GET http://localhost:3000/api/menus/formularios \
  -H "Authorization: Bearer $TOKEN"
```

---

### SIII (felcn_iii)

#### Operativos

```bash
# Listar operativos
curl -X GET http://localhost:3000/api/operativos \
  -H "Authorization: Bearer $TOKEN"

# Obtener operativo por ID
curl -X GET http://localhost:3000/api/operativos/1 \
  -H "Authorization: Bearer $TOKEN"

# Buscar operativos por caso
curl -X GET http://localhost:3000/api/operativos/caso/1 \
  -H "Authorization: Bearer $TOKEN"

# Buscar operativo por número
curl -X GET http://localhost:3000/api/operativos/numero/OP-2024-001 \
  -H "Authorization: Bearer $TOKEN"

# Crear operativo
curl -X POST http://localhost:3000/api/operativos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroOperativo": "OP-2024-001",
    "idCaso": "1",
    "fechaOperativo": "2024-01-15",
    "horaOperativo": "14:30",
    "lugar": "La Paz, Zona Sur",
    "latitud": -16.5000,
    "longitud": -68.1500,
    "idTipoOperacion": 1,
    "idCategoriaOperativo": 1,
    "descripcion": "Operativo de control"
  }'

# Actualizar operativo
curl -X PATCH http://localhost:3000/api/operativos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Operativo actualizado",
    "observaciones": "Se añaden observaciones"
  }'

# Inactivar operativo
curl -X PATCH http://localhost:3000/api/operativos/1/inactivar \
  -H "Authorization: Bearer $TOKEN"
```

#### Lookups SIII - Geografía

```bash
# Listar continentes
curl -X GET http://localhost:3000/api/siii-lookups/continentes \
  -H "Authorization: Bearer $TOKEN"

# Listar países
curl -X GET http://localhost:3000/api/siii-lookups/paises \
  -H "Authorization: Bearer $TOKEN"

# Listar países por continente
curl -X GET http://localhost:3000/api/siii-lookups/paises/continente/1 \
  -H "Authorization: Bearer $TOKEN"

# Listar países destino
curl -X GET http://localhost:3000/api/siii-lookups/paises-destino \
  -H "Authorization: Bearer $TOKEN"

# Listar departamentos
curl -X GET http://localhost:3000/api/siii-lookups/departamentos \
  -H "Authorization: Bearer $TOKEN"

# Listar departamentos por país
curl -X GET http://localhost:3000/api/siii-lookups/departamentos/pais/1 \
  -H "Authorization: Bearer $TOKEN"

# Listar provincias
curl -X GET http://localhost:3000/api/siii-lookups/provincias \
  -H "Authorization: Bearer $TOKEN"

# Listar provincias por departamento
curl -X GET http://localhost:3000/api/siii-lookups/provincias/departamento/1 \
  -H "Authorization: Bearer $TOKEN"

# Listar localidades
curl -X GET http://localhost:3000/api/siii-lookups/localidades \
  -H "Authorization: Bearer $TOKEN"

# Listar localidades por provincia
curl -X GET http://localhost:3000/api/siii-lookups/localidades/provincia/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Lookups SIII - Tipos

```bash
# Listar tipos de droga
curl -X GET http://localhost:3000/api/siii-lookups/tipos-droga \
  -H "Authorization: Bearer $TOKEN"

# Listar tipos de operación
curl -X GET http://localhost:3000/api/siii-lookups/tipos-operacion \
  -H "Authorization: Bearer $TOKEN"

# Listar tipos penal
curl -X GET http://localhost:3000/api/siii-lookups/tipos-penal \
  -H "Authorization: Bearer $TOKEN"

# Listar tipos de relevancia
curl -X GET http://localhost:3000/api/siii-lookups/tipos-relevancia \
  -H "Authorization: Bearer $TOKEN"

# Listar tipos de persona
curl -X GET http://localhost:3000/api/siii-lookups/tipos-persona \
  -H "Authorization: Bearer $TOKEN"

# Listar estados civiles
curl -X GET http://localhost:3000/api/siii-lookups/estados-civiles \
  -H "Authorization: Bearer $TOKEN"

# Listar categorías de operativo
curl -X GET http://localhost:3000/api/siii-lookups/categorias-operativo \
  -H "Authorization: Bearer $TOKEN"
```

---

### Health Check

```bash
# Verificar estado de la aplicación
curl -X GET http://localhost:3000/api/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "info": {
#     "database": { "status": "up" }
#   }
# }
```

---

## Swagger / OpenAPI

La documentación interactiva de la API está disponible en:

```
http://localhost:3000/api/docs
```

---

## Estructura de Carpetas

```
src/application/sunesis/
├── sunesis.module.ts              # Módulo principal
├── shared/
│   └── constants/
│       └── database-connections.ts
├── asig-casos/                    # BD: felcn_asignacion_casos
│   ├── asig-casos.module.ts
│   ├── asignacion/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── entity/
│   ├── servicio/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── entity/
│   └── lookup/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       └── entity/
├── s2i/                           # BD: felcn_s3i
│   ├── s2i.module.ts
│   ├── usuario/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── entity/
│   ├── rol/
│   │   └── entity/
│   ├── estructura/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   └── entity/
│   ├── menu/
│   │   ├── controller/
│   │   ├── service/
│   │   └── entity/
│   └── auditoria/
│       └── entity/
└── siii/                          # BD: felcn_iii
    ├── siii.module.ts
    ├── parametrica/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   └── entity/
    │       ├── geografia/
    │       ├── tipo/
    │       ├── persona/
    │       ├── operativo/
    │       ├── sustancia/
    │       └── bien/
    └── operativo/
        ├── controller/
        ├── service/
        ├── repository/
        └── entity/
```

---

## Scripts de Base de Datos

Los scripts SQL para crear las bases de datos se encuentran en:

```
database/scripts/
├── FELCN-ASIG-CASOS-postgres.sql
├── FELCN-S2I-postgres.sql
└── FELCN-SIII-postgres.sql
```

---

## Próximos Pasos

1. **Entidades adicionales SIII**: Crear entidades operativas restantes (DetenidoAuxiliar, ArrestadoAuxiliar, Investigador, etc.)
2. **DTOs con validación**: Agregar class-validator a todos los endpoints
3. **Tests unitarios**: Implementar tests para servicios y controladores
4. **Integración JWT híbrido**: Conectar UsuarioPerfilService con el módulo de autenticación

---

## Tecnologías Utilizadas

- **NestJS** v10.x
- **TypeORM** v0.3.x
- **PostgreSQL** v14+
- **Swagger/OpenAPI** v7.x
- **JWT** para autenticación
- **Casbin** para autorización

---

## Autor

Migración realizada como parte del proyecto SUNESIS - FELCN
