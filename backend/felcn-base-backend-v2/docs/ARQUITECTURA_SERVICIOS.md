# Arquitectura propuesta, servicios y transacciones por interfaz — Proyecto SUNESIS

Resumen
- Objetivo: transformar la lógica del monolito WebForms en microservicios con un frontend desacoplado.  
- Entregable: mapa de servicios, contratos HTTP razonables, y la secuencia/transacción esperada por cada interfaz `.aspx` detectada en el análisis.

1. Principios arquitectónicos
- Bounded contexts por dominio (Auth, Usuarios, Casos/Asignación, Operativos, Reportes, Ficheros, Lookups).  
- API REST (JSON) para comunicación síncrona; eventos (mensajería) para procesos asíncronos y consistencia eventual.  
- Seguridad centralizada: Auth Service (OAuth2/JWT).  
- Evitar transacciones distribuidas; usar SAGA para orquestar operaciones que toquen varios servicios.  
- Datos: cada microservicio su propia BD o esquema; migración desde tablas legadas (Users, ChildMenu, ASIGNACION, SERVICIO, etc.).

2. Lista de servicios (roles y endpoints recomendados)
- API Gateway
  - Función: entrada única, routing, rate-limiting, CORS, TLS, validación de JWT.
- Auth Service
  - Responsabilidad: login, refresh, logout, me, authorize, gestión de tokens.
  - Endpoints:
    - `POST /api/auth/login` -> {username,password}
    - `POST /api/auth/refresh` -> {refresh_token}
    - `POST /api/auth/logout` -> auth + {refresh_token}
    - `GET /api/auth/me` -> auth
    - `GET /api/auth/authorize?userId=&resource=&action=` -> auth
- User Profile Service
  - Responsabilidad: CRUD perfil, teléfonos, grados, mapping legacy (NombreApp, TelefonoCel, Gr_Id).
  - Endpoints:
    - `GET /api/users/{id}`
    - `GET /api/users/by-username/{username}`
    - `PUT /api/users/{id}`
- Permissions Service
  - Responsabilidad: mapping ChildMenu ? Permissions, check granular por recurso.
  - Endpoints:
    - `GET /api/permissions/resource/{resource}`
    - `POST /api/permissions/check` -> {userId, resource, action}
- Cases Service (Asignación)
  - Responsabilidad: lectura/gestion de ASIGNACION, búsqueda por usuario.
  - Endpoints:
    - `GET /api/cases?username={username}`
    - `GET /api/cases/{id}`
    - `PUT /api/cases/{id}` (actualizaciones)
- Operatives Service
  - Responsabilidad: operaciones relacionadas a operativos/numero operativo, relación con ASIGNACION/OPERATIVO tables.
  - Endpoints:
    - `GET /api/operatives?nroOperativo={nro}`
    - `POST /api/operatives`
- Services/Servicio Service (registro de servicios)
  - Responsabilidad: lógica de `SERVICIO` (Verificaservicio, Muestraservicio, Numeropase).
  - Endpoints:
    - `GET /api/servicios/active?usuario={pase}`
    - `POST /api/servicios`
- Reports Service
  - Responsabilidad: generación de reportes (sincronía/asincronía), RPT-MN-*.
  - Endpoints:
    - `POST /api/reports/generate` -> devuelve jobId
    - `GET /api/reports/{jobId}/status`
    - `GET /api/reports/{jobId}/download`
- File Service (Attachments)
  - Responsabilidad: recibir ficheros, almacenar en Blob storage, metadatos en DB.
  - Endpoints:
    - `POST /api/files` -> multipart/form-data -> devuelve fileId + URL
    - `GET /api/files/{id}` -> stream
    - `DELETE /api/files/{id}`
- Lookups Service
  - Responsabilidad: Unidades, Distritales, Grados, Grupos, País, etc.
  - Endpoints: `GET /api/lookups/{type}`

3. Mapeo de datos (tabla legacy ? servicio)
- Users table:
  - Legacy: `Users.Username`, `Users.Usuario`, `Users.NombreApp`, `Users.TelefonoCel`, `Users.Email`, `Gr_Id`.
  - Mapeo:
    - `Users.Username` -> `users.username`
    - `Users.Usuario` -> `users.userCode`
    - `Users.NombreApp` + `Grados.Descripcion` -> `users.displayName`
    - `Users.TelefonoCel` -> `users.phone`
    - `Gr_Id` -> `users.gradeId`
- ChildMenu ? Permissions: `ChildUrl` -> permission.resource; `usuario` -> mapping user/role grants.
- ASIGNACION/OPERATIVO/SERVICIO ? Cases/Operatives/Services services: conservar campos claves `Casos_Id`, `NroCaso`, `NroOperativo`, `Username`, `Uni_Abrev`, `Dis_Descripcion`, `Grp_Id`.

4. Transacciones / secuencias por interfaz (página ? microservicios)
- Login (flujo equivalente a /Login actual)
  1. Frontend: POST `/api/auth/login` {username,password}.  
  2. Auth Service valida credenciales contra Users DB (hash compare).  
  3. Emite `access_token` (JWT) + `refresh_token`.  
  4. Frontend almacena tokens (secure cookie HttpOnly o storage con mitigaciones).  
  5. Frontend llama `GET /api/auth/me` para poblar labels (`lblgrado`, `lblnombres`, `lblcuenta`, `lblnumero`).  
  6. Frontend usa claims o `GET /api/permissions/check` para habilitar vistas/links.

- `Forms\FRM-CA-01.aspx` (Perfil del usuario)
  1. Frontend obtiene token y llama `GET /api/users/by-username/{username}` (User Profile Service).  
  2. User Service devuelve perfil y `gradeId` ? render en UI (`lblgrado`, etc.).  
  3. Para registros relacionados: llamadas a `GET /api/servicios/active?usuario={pase}` y `GET /api/cases?username={username}` según corresponda.

- `Forms\FRM-OP-ING.aspx` / `FRM-OP-UP.aspx` (operativos)
  1. Front: validar permiso (`permissions.check`) para `FRM-OP-ING.aspx`.  
  2. Llamada `GET /api/operatives?username={username}` y `GET /api/cases?username={username}`.  
  3. Mostrar Grid (GridView) con datos obtenidos.  
  4. Acciones de actualización ? `PUT /api/operatives/{id}` o `PUT /api/cases/{id}`.  
  5. En operaciones que necesitan notificar varios servicios (ej. crear operativo + crear registro de servicio), se usa SAGA: Orchestrator Service lanza pasos y publica eventos (ej. `operative.created`).

- `Forms\ICIA-SERV-01.aspx` y `ICIA-SERV-04.aspx` (servicios / emergencias)
  1. Page_Init: Front llama `GET /api/servicios/active?usuario={pase}` y `GET /api/servicios/emergency?usuario={pase}`.  
  2. Si no hay servicio, redirect (frontend behavior).  
  3. Para reportes o grabaciones: `POST /api/servicios` con payload; Service guarda en DB y publica evento `servicio.created`.

- `Forms\FRM_ING_ENT2.aspx` (upload doc)
  1. Front llama `POST /api/files` con multipart file + metadata.  
  2. File Service guarda blob (S3/Blob) y retorna `fileId` y `url`.  
  3. Front llama `POST /api/cases/{id}/attachments` o `POST /api/files/metadata` para registrar relación en DB.

- Report pages (`RPT-MN-01`, `RPT-MN-02`, `RepFormIcia.aspx`)
  1. Front solicita generación: `POST /api/reports/generate` con filtros (caseId, fechas).  
  2. Reports Service encola job (RabbitMQ/Kafka) y responde jobId.  
  3. Front consulta `GET /api/reports/{jobId}/status` y obtiene URL cuando listo.

5. Consistencia y transacciones
- Lecturas: usar CQRS para separar consultas pesadas de escrituras; caches para lookups.  
- Escrituras multi-servicio: implementar SAGA (orquestada o coreografiada). Ejemplo: crear operativo que implica actualizar `Operatives` + `Cases` + insertar `SERVICIO` ? Orchestrator controla secuencia y compensaciones.  
- Evitar transacciones distribuidas (MS DTC): preferir compensaciones idempotentes.

6. Seguridad y cumplimiento
- Migrar conexiones: mover strings de conexión fuera de código (ValoresGlobales) a secret store (KeyVault/Azure/Hashicorp).  
- Hash de contraseñas: Argon2id o bcrypt.  
- Firmar JWT con RS256, JWK endpoint.  
- TLS extremo a extremo, CORS permitido solo para frontend.  
- Auditoría central para accesos y cambios sensibles.

7. Migración: plan alto nivel por interfaz
- Fase 0: Inventario y mapeo (obtener todas las stored queries en code-behind, identificar tablas usadas).  
- Fase 1: Implementar Auth Service + Users migration + Permissions seeding (ChildMenu ? Permissions).  
- Fase 2: Crear Cases & Operatives & Services services; crear endpoints read-only que apunten a legacy DB (compat layer) para cut-over incremental.  
- Fase 3: Reescribir cada UI page para llamar APIs en lugar de código-behind directo. Empezar por páginas no críticas.  
- Fase 4: Switch de sesión: deshabilitar OWIN Cookie (o mantener puente) y forzar JWT.  
- Fase 5: Retirar lógica legacy y limpiar `App_Code` y connectionstrings en código.

8. Observabilidad y operaciones
- Centralizar logs (ELK/EFK), métricas (Prometheus), tracing (OpenTelemetry).  
- Health endpoints `/health` por servicio.  
- Deploy en contenedores; orquestador: Kubernetes.  
- Backups y runbooks para rollback.

9. Recomendaciones técnicas rápidas
- Stack sugerido: .NET 7/8 (WebAPI + EF Core), SQL Server, Redis (cache), RabbitMQ/Kafka (event bus), Azure Blob / S3 (files).  
- API contracts: OpenAPI/Swagger obligatorio.  
- Tests automatizados en cada servicio (unit + integration).

10. Siguiente entregable que puedo generar
- Especificación OpenAPI para cada servicio (Auth, Users, Cases, Operatives, Files, Reports).  
- Scripts SQL para migración inicial de `Users` y `ChildMenu`.  
- Plantilla de SAGA orchestrator (puntos de compensación) para la operación de creación de operativo.

---

Si quieres, genero ahora el OpenAPI inicial para el Auth Service y el mapping SQL concreto para `Users` y `ChildMenu` (para poblar `Roles/Permissions`). ¿Cuál prefieres primero: OpenAPI Auth o scripts de migración?  