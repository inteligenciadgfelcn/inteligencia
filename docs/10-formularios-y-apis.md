# Formularios del frontend, APIs y tablas de base de datos

> Alcance: `frontend/felcn-base-frontend/src/app/`, **excluyendo** `(fase_2)/`. Generado el 2026-07-30 cruzando el frontend contra los controladores/servicios/repositorios/entidades reales de `felcn-auth-backend` y `felcn-base-backend-v2`. Cada afirmación de este documento se verificó leyendo el código fuente correspondiente (no se copió de documentación previa).

## 0. Convenciones

- **Backend**: `auth-backend` (`felcn-auth-backend`, puerto 4000 en dev) o `base-backend-v2` (`felcn-base-backend-v2`, puerto 3000 en dev, prefijo global `/api`).
- Las rutas de API se listan **relativas al backend** (sin el host ni, en el caso de base-backend-v2, el prefijo `/api`).
- "Obligatorio" se refiere a la validación del formulario en el frontend (react-hook-form + zod, o validación manual), no necesariamente a una constraint `NOT NULL` en la base de datos.
- Los campos de texto marcados "mayúsculas" se transforman a uppercase automáticamente en el frontend antes de enviarse.

## 1. Panorama de backends y bases de datos

| Backend | Base de datos | Schemas relevantes | Notas |
|---|---|---|---|
| `felcn-auth-backend` | `felcn_auth_v3` | `usuario` (usuarios, roles, módulos, casbin_rule, recurso_excepcion, bitácora, otp, refresh_token), `parametro` (grado, unidad, distrital, grupo) | Variable `DB_SCHEMA_FELCN` existe en `.env.sample` pero no se usa en ninguna entidad activa. El adaptador Casbin (`typeorm-adapter`) abre **su propia conexión** a Postgres hacia `usuario.casbin_rule`, separada del `DataSource` principal de la app. |
| `felcn-base-backend-v2` (módulo `sunesis/siii`) | `felcn_siii` | `public` (asignacion, operativo, droga, persona_auxiliar, item_bien_secuestrado, investigacion_paralela, seguimiento, etc.), `parametricas` (catálogos), `auth_fdw` (**foreign tables** vía `postgres_fdw` hacia `felcn_auth_v3.parametro.{unidad,distrital,grupo,grado}` — fuente canónica de estructura organizacional; ver [fix de hoy](#10-hallazgos-técnicos)), `fiscalia` | Un endpoint (`GET /operativos/caso/:idCaso`) toca además una **quinta base**, `felcn_asignacion_casos` (conexión `DB_ASIG_CASOS`), solo para `fechaOperativo`. |
| `felcn-base-backend-v2` (módulo `sunesis/siii`, legado) | `felcn_lgi` | `public` (asignacion, operativo, investigador, distritales, unidades, departamentosc, provincias, localidad) | Sistema GIAEF migrado; **no** usa `auth_fdw` — tiene su propio catálogo organizacional legado, desincronizado del canónico por diseño (no es el mismo bug del fix de hoy). |
| `felcn-base-backend-v2` (módulo `sunesis/s2i`) | `felcn_s2i` | `public` (asignacion/caso, blanco, empresa, item_bien_investigado, conductor, transporte, flujo_transporte, lugar, telefono, vehiculo), `parametricas` (catálogos) | Resuelve Conductor y Transporte consultando primero `felcn_personas`/`felcn_vls` (ver más abajo). |
| `felcn-base-backend-v2` (auxiliar) | `felcn_personas` | `public.personas` | Datos civiles por documento; usado por el módulo Transporte para resolver Conductor. |
| `felcn-base-backend-v2` (auxiliar) | `felcn_vls` | `public` (vehiculo, marca, modelo, clase, color) | Registro vehicular oficial; usado por el módulo Transporte para resolver Transporte (por placa). |

---

## 2. Admin → Configuración (`/admin/(configuracion)`)

Backend: **auth-backend**, `felcn_auth_v3`.

### 2.1 Usuarios — Alta / Edición

- **Ruta**: `/admin/usuarios/nuevo`, `/admin/usuarios/editar/:id`
- **Archivos**: `usuarios/nuevo/page.tsx`, `usuarios/editar/[id]/page.tsx`, `usuarios/ui/FormularioUsuario.tsx`, `usuarios/ui/RecursosPorRol.tsx`
- **Campos**: Nombre*, Primer/Segundo Apellido (≥1 de los dos), Nro. Documento*, Fecha de Nacimiento*, Correo*, Teléfono (regex `^[6-7]\d{7}$`), Roles* (multiselect), Habilitar Ciudadanía Digital (switch), Recursos por rol (radio Todos/Personalizar + checkboxes), Unidad/Distrital/Grupo* (cascada), Grado*, Número de Pase*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/usuarios/:id` | `usuario.usuario` + JOIN `usuario.usuario_rol`, `usuario.rol`, `usuario.persona`, `parametro.grado/grupo/distrital/unidad` |
| GET | `/autorizacion/roles` | `usuario.rol` |
| GET | `/lookups/grados`, `/lookups/unidades` | `parametro.grado`, `parametro.unidad` |
| GET | `/lookups/distritales/unidad/:idUnidad` | `parametro.distrital` |
| GET | `/lookups/grupos/distrital/:idDistrital` | `parametro.grupo` |
| GET | `/autorizacion/recursos?rol=&idUsuarioRol=` (sub-bloque RecursosPorRol) | `usuario.casbin_rule`, `usuario.recurso_excepcion`, `usuario.modulo` |
| POST | `/usuarios` | Transacción: `usuario.persona` → `usuario.usuario` → `usuario.usuario_rol`; si hay excepciones, `usuario.recurso_excepcion` |
| PATCH | `/usuarios/:id` | `usuario.usuario`, `usuario.persona`, `usuario.usuario_rol`, `usuario.recurso_excepcion` |

### 2.2 Usuarios — Datatable (modales de confirmación)

- **Ruta**: `/admin/usuarios`
- **Archivos**: `usuarios/ui/UsuariosDatatable.tsx` + `AlertaEstadoUsuario.tsx`, `AlertaReenvioCorreo.tsx`, `AlertaRestablecerContrasena.tsx`

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/usuarios?pagina&limite&filtro&rol&orden` | `usuario.usuario` + mismos JOINs que 2.1 |
| PATCH | `/usuarios/:id/activacion` \| `/inactivacion` | `usuario.usuario` |
| PATCH | `/usuarios/:id/reenviar` | `usuario.usuario` (columna `codigo_activacion`) |
| PATCH | `/usuarios/:id/restauracion` | `usuario.usuario` |

> Ver [Hallazgo: `ModalUsuarios.tsx` código muerto](#10-hallazgos-técnicos).

### 2.3 Módulos — Modal Crear/Editar

- **Ruta**: `/admin/modulos`
- **Archivos**: `modulos/ui/ModalModulo.tsx`, `modulos/ui/AlertaEstadoModulo.tsx`
- **Campos**: Sección (select, condicional), Nombre*, Label*, URL*, Orden*, Icono (obligatorio solo si no es sección), Descripción*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| POST / PATCH | `/autorizacion/modulos[/:id]` | `usuario.modulo` |
| PATCH | `/autorizacion/modulos/:id/activacion` \| `/inactivacion` | `usuario.modulo` |

### 2.4 Parámetros — Modal Crear/Editar

- **Ruta**: `/admin/parametros`
- **Archivos**: `parametros/ui/ModalParametros.tsx`, `parametros/ui/AlertaEstadoParametro.tsx`
- **Campos**: Código*, Nombre*, Grupo*, Descripción*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| POST / PATCH | `/parametros[/:id]` | `parametro.parametro` |
| PATCH | `/parametros/:id/activacion` \| `/inactivacion` | `parametro.parametro` |

### 2.5 Políticas — Modal Crear/Editar

- **Ruta**: `/admin/politicas`
- **Archivos**: `politicas/ui/ModalPoliticas.tsx`, `politicas/ui/AlertaEliminarPolitica.tsx`
- **Campos**: Sujeto* (rol), Objeto*, App* (frontend/backend), Acción* (multiselect, opciones distintas según App).

| Método | Endpoint | Tabla(s) BD | Notas |
|---|---|---|---|
| POST | `/autorizacion/politicas` | `usuario.casbin_rule` | Vía adaptador Casbin (conexión propia) |
| PATCH | `/autorizacion/politicas` (sin `:id`, la política original va en `params`) | `usuario.casbin_rule` | UPDATE in-place preservando `id`, a propósito, para no romper la FK de `recurso_excepcion` |
| DELETE | `/autorizacion/politicas` (params `sujeto,objeto,accion,app`) | `usuario.casbin_rule` | `ON DELETE CASCADE` arrastra `usuario.recurso_excepcion` |

### 2.6 Roles — Modal Crear/Editar

- **Ruta**: `/admin/roles`
- **Archivos**: `roles/ui/ModalRol.tsx`, `roles/ui/AlertaEstadoRol.tsx`
- **Campos**: Rol/código*, Nombre*, Descripción*.

| Método | Endpoint | Tabla(s) BD | Notas |
|---|---|---|---|
| POST / PATCH | `/autorizacion/roles[/:id]` | `usuario.rol` | |
| PATCH | `/autorizacion/roles/:id/activacion` \| `/inactivacion` | `usuario.rol`, `usuario.usuario_rol` | Efecto secundario amplio: cambia el estado de **todas** las filas `usuario_rol` de ese rol, no solo las de un usuario |

---

## 3. Admin → Principal (`/admin/(principal)`)

Backend: **auth-backend**, `felcn_auth_v3`. `home/` es un dashboard de solo lectura, sin formularios.

### 3.1 Perfil — Editar datos / Cambiar contraseña / Foto

- **Ruta**: `/admin/perfil`
- **Archivos**: `perfil/components/{Perfil,EditarPerfilModal,CambioPassModal,FotoPerfilModal}.tsx`

| Formulario | Campos | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| Editar datos | Nombres*, Primer Apellido*, Segundo Apellido, Correo*, Teléfono | PATCH | `/usuarios/cuenta/perfil` | `usuario.persona`, `usuario.usuario` |
| Cambio de contraseña | Actual*, Nueva* (min 8, score 4), Confirmar* | PATCH | `/usuarios/cuenta/contrasena` | `usuario.usuario` (lectura de validación hace JOIN amplio; escritura solo `usuario`) |
| Foto de perfil | Dropzone imagen | PATCH / DELETE | `/usuarios/cuenta/foto` | `usuario.usuario` (columna `url_foto`; el archivo va al filesystem `STORAGE_NFS_PATH`, no a la BD) |

---

## 4. Login, Registro y Cuenta

Backend: **auth-backend**, `felcn_auth_v3`.

### 4.1 Login

- **Ruta**: `/login`
- **Archivos**: `login/ui/LoginContainer.tsx`, `src/context/AuthProvider.tsx`
- **Campos**: Usuario*, Contraseña*.

| Método | Endpoint | Tabla(s) BD | Notas |
|---|---|---|---|
| GET | `/estado` | *(ninguna)* | Solo metadata de `package.json`/config |
| POST | `/auth` | `usuario.usuario`, `usuario.usuario_rol`, `usuario.rol`, `usuario.bitacora_login`, `usuario.otp_sesion`, `usuario.refresh_token`, `usuario.casbin_rule`, `usuario.recurso_excepcion`, `usuario.modulo` | El flujo con más tablas de todo el sistema: guard siempre escribe `bitacora_login` (éxito o fallo); si OTP habilitado, crea `otp_sesion` y responde 202 sin `refresh_token` |

### 4.2 Login — Callback Ciudadanía Digital

- **Ruta**: `/login/ciudadania`

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/ciudadania-auth` (inicio OAuth, redirección) | `usuario.bitacora_login` (solo si falla antes de llegar al IdP) |
| GET | `/ciudadania-autorizar` (callback) | `usuario.usuario`, `usuario.persona`, `usuario.usuario_rol`, `usuario.rol`, `usuario.bitacora_login`, `usuario.refresh_token` |

### 4.3 Registro de cuenta

> Actualizado 20/08/2026: la contraseña ya **no** se captura en el registro — se define recién al activar la cuenta (ver 4.4). Antes de este cambio, `crear-cuenta` sí pedía contraseña en el mismo formulario; si algo referencia ese comportamiento viejo, está desactualizado.

- **Ruta**: `/registro`
- **Archivo**: `login/ui/RegistroContainer.tsx`
- **Campos**: Nro. Documento*, Nombres*, Primer/Segundo Apellido, Fecha de nacimiento*, Correo*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| POST | `/usuarios/crear-cuenta` | Transacción: `usuario.persona` → `usuario.usuario` (estado `PENDIENTE`, contraseña placeholder — ver `UsuarioRepository.crear`) → `usuario.usuario_rol` (rol fijo "USUARIO") |

La cuenta creada por `POST /usuarios` (alta por administrador, panel) y la reactivación de un usuario `INACTIVO` (`PATCH /usuarios/:id/activacion`) siguen el mismo patrón desde el 20/08/2026: nunca se genera ni se envía una contraseña por correo — se manda (o reutiliza) un enlace de activación/recuperación para que el propio usuario la defina.

### 4.4 Activación / Desbloqueo / Recuperación

- **Rutas**: `/activacion?q=`, `/desbloqueo?q=`, `/recuperacion[?q=]`
- **Archivos**: `(cuenta)/{activacion,desbloqueo,recuperacion}/page.tsx`, `login/ui/CambioPass.tsx`

| Formulario | Campos | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| Activación | Nueva contraseña*, Confirmar* | PATCH | `/usuarios/cuenta/activacion` | `usuario.usuario` |
| Desbloqueo (automático, sin captura) | — | GET (con efecto de escritura) | `/usuarios/cuenta/desbloqueo` | `usuario.usuario` |
| Recuperación paso 1 | Correo* | POST | `/usuarios/recuperar` | `usuario.usuario` |
| Recuperación (validar código, automático) | — | POST | `/usuarios/validar-recuperar` | `usuario.usuario` |
| Recuperación paso 2 | Nueva contraseña*, Repetir* | PATCH | `/usuarios/cuenta/nueva-contrasena` | `usuario.usuario` |

Si el correo no llega (SMTP caído u otro problema), un administrador con permisos puede ver y copiar el link de activación/recuperación directamente desde el panel de usuarios (respuesta de `POST /usuarios`, `PATCH /usuarios/:id/reenviar`, `PATCH /usuarios/:id/restauracion` y `PATCH /usuarios/:id/activacion` — todas devuelven `urlActivacion`/`urlRecuperacion` en el JSON, no solo lo mandan por correo) y compartirlo por otro medio.

---

## 5. Operativos y Patrimonio (`/operativos`)

Backend: **base-backend-v2**, `felcn_siii`.

### 5.1 Gestión Operativo — Listado

- **Ruta**: `/operativos`
- **Archivos**: `operativos/ui/GestionOperativoListado.tsx`, `GestionOperativoTabs.tsx`
- **Formulario embebido**: modal "Enviar a Fiscalía" — CUD* (texto, maxLength 15).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/operativos/casos`, `/casos/aprobados`, `/casos/no-aprobados`, `/casos/con-cud` | SQL crudo: `public.asignacion` JOIN `auth_fdw.unidad`, `auth_fdw.distrital`, `auth_fdw.grupo` |
| PATCH | `/operativos/casos/:idCaso/ianus` | `public.asignacion` |
| GET | `/reportes/operativo/pdf?numero=` | Agrega todas las tablas de 5.2 (compone datos, sin queries propias) |

### 5.2 Registro / Edición de Operativo (formulario multi-sección)

- **Ruta**: `/operativos/registro?id={idCaso}`
- **Archivos**: `operativos/registro/ui/FormGestionOperativo.tsx` + `ui/secciones/*`, hooks `useGestionOperativoForm.ts`, `useGestionOperativoSecciones.ts`

| Sección | Campos clave | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| **1. Datos Generales** | Nro. Informe*, Relevancia*, Unidad/Distrital/Grupo* (cascada), Categoría→Ítem Operativo* (cascada), Tipo Operación*, Plan Operaciones*, Tipo Denuncia*, Tipo Penal*, Al Mando de*, Departamento→Provincia→Municipio* (cascada), Dirección*, Lat/Long* (+ mapa Leaflet + Nominatim), Detalle* | GET | `/operativos/caso/:idCaso` | `public.asignacion`, `public.operativo` + relations `parametricas.*`, `auth_fdw.unidad/distrital` **+ `felcn_asignacion_casos` (`fechaOperativo`, otra BD)** |
| | | POST | `/operativos/caso/:idCaso` | `public.operativo` (INSERT) |
| | | PATCH | `/operativos/:idOperativo` | `public.operativo` |
| **2. Drogas, Fotografía y Logotipos** | Tipo→Estado Droga* (cascada), Cantidad, Costo*, Sólido/Líquido (switch cambia campos), Forma Transporte*, País Origen/Destino*, 2 fotos* | GET/POST/DELETE | `/operativos/:idOperativo/drogas[/:idDroga]` | `public.droga` + relations `public.estado_droga`, `parametricas.tipo_droga/forma_transporte/pais` |
| | Sub-formulario Logotipos: Imagen*, Descripción*, Organización*, Blanco, Observación*, Foto* | GET/POST/DELETE | `/operativos/:idCaso/drogas/:idDroga/logotipos[/:idLogotipo]` | `public.logotipo` |
| | (botón "Pesaje", no persiste) | POST | `/operativos/:idOperativo/pesaje-drogas` | **ninguna** — ver [Hallazgo](#10-hallazgos-técnicos) |
| **3. Sust. Sólidas** | Tipo*, Costo*, Toneladas/Kilos/Gramos/Miligramos | GET/POST/DELETE | `/operativos/:idOperativo/sustancias-solidas[/:id]` | `public.sustancia_solida` + `parametricas.sustancia_solida_descripcion` |
| **4. Sust. Líquidas** | Tipo*, Costo*, Litros/Mililitros | GET/POST/DELETE | `/operativos/:idOperativo/sustancias-liquidas[/:id]` | `public.sustancia_liquida` + `parametricas.sustancia_liquida_descripcion` |
| **5. Laboratorios** | Tipo→Modelo Fábrica* (cascada), Cantidad* | GET/POST/DELETE | `/operativos/:idOperativo/fabricas[/:id]` | `public.fabrica` + `public.fabrica_modelo` (**no** `parametricas`, pese a ser catálogo) + `parametricas.tipo_fabrica` |
| **6. Personas** | Nombres*, Apellidos*, Tipo Implicado*, Género*, Tipo/Nro. Documento*, F. Nacimiento*, Dirección*, Nacionalidad*, 3 fotos* | GET/POST/DELETE | `/operativos/:idOperativo/personas[/:idPersona]` | `public.persona_auxiliar` + `parametricas.pais/tipo_documento` |
| **7. Bienes** | Bien→Clase→Tipo* (cascada), Cantidad*, Costo Aprox.*, ¿En Investigación?*, Foto | GET/POST/DELETE | `/operativos/:idOperativo/bienes[/:idBien]` | `public.item_bien_secuestrado` + `public.catalogo_tipo/catalogo_clase` (**no** `parametricas`) + `parametricas.bienes` |
| | Sub-panel Características: Característica*, Descripción* | GET/POST/DELETE | `.../bienes/:idBien/caracteristicas[/:idCaracteristica]` | `public.item_bien_caracteristica` + `public.catalogo_caracteristica` |
| **8. Galería** | Descripción*, Foto* | GET/POST/DELETE | `/operativos/:idOperativo/galeria[/:idGaleria]` | `public.galeria` |

> Sección "Evidencia por Id" (`GET/POST .../evidencia-por-id`) está en el hook pero no renderizada como pestaña — no documentada como formulario activo.

### 5.3 Patrimonio de Bienes

- **Ruta**: `/operativos/bienes/patrimonio?caso=`
- **Archivos**: `operativos/bienes/patrimonio/ui/PatrimonioView.tsx`
- **Campos**: Costo Aproximado ($us), Tipo de Cambio (default 6.92).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/operativos/:idOperativo` | `public.operativo` |
| GET | `/operativos/:idOperativo/bienes?pagina&limite` | `public.item_bien_secuestrado` |
| PATCH | `/operativos/:idOperativo/bienes/:idBien/costos` | `public.item_bien_secuestrado` (UPDATE `costo_aproximado`, `costo_cuantificado`) |
| GET | `/operativos/:idOperativo/bienes/patrimonio?tipoCambio=` | `public.item_bien_secuestrado` (`SUM(costo_cuantificado)`) |

### 5.4 Búsqueda de Patrimonio (`/patrimonio`)

- **Archivos**: `patrimonio/ui/BusquedaOperativos.tsx`
- **Campos**: Tipo de búsqueda* (select: Mis Casos/Nro. Caso/Investigador/Nombre/Nro. Pérdida Dominio/Nro. Operativo) + valor.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/usuarios/unidad/:valor` | `felcn_auth_v3` (endpoint vive en módulo `inteligencia/usuario`, fuera de `sunesis/siii`) |
| GET | `/investigacion/asignacion?...` | SQL crudo: `public.asignacion` JOIN `auth_fdw.unidad/distrital` (+ `public.investigador` si es búsqueda por investigador) |
| GET | `/investigacion/asignacion/:idCaso/operativos` | `public.operativo` + relations `parametricas.departamento/provincia/localidad`, `auth_fdw.unidad/distrital` |

---

## 6. Investigaciones (`/investigaciones`)

### 6.1 LGI (`/investigaciones/lgi`)

Backend: **base-backend-v2**, base **`felcn_lgi`** (sistema legado GIAEF, catálogo organizacional propio, no usa `auth_fdw`).

- **`/investigaciones/lgi/ingreso`** — búsqueda: Tipo de búsqueda* (Mis Casos/Nro. Caso FELCN/GIAEF/Fiscalía/Nombre/Pérdida de Dominio) + valor.
  - `GET /lgi/mis-casos?...` → SQL crudo: `public.asignacion` JOIN `public.investigador`, `public.distritales`, `public.departamentosc`
- **`/investigaciones/lgi/ingreso/[casosId]`** — detalle de solo lectura; **la sección editable (LGI-ING1) está marcada como "pendiente de implementación"** en el código, sin campos de captura reales ni endpoint de guardado todavía.
- **`/investigaciones/lgi/operativo`** — mismo formulario de búsqueda + listado de operativos vinculados (selección aún sin flujo de navegación conectado — `TODO` explícito en el código).
  - `GET /lgi/asignacion/:casosId/operativos` → SQL crudo: `public.operativo` LEFT JOIN `public.departamentosc`, `public.provincias`, `public.localidad`, `public.unidades`, `public.distritales`
- **`/investigaciones/lgi/listado`** — placeholder "en desarrollo", sin formulario ni API.

### 6.2 Investigación Paralela (`/investigaciones/paralelo`)

Backend: **base-backend-v2**, `felcn_siii`.

- **Ruta**: `/investigaciones/paralelo`
- **Archivos**: `ui/BusquedaCasos.tsx`, `ui/FormInvestigacionParalela.tsx`
- **Formulario principal**: Delito Precedente* (select fijo, 3 opciones Ley 1008), Fecha Envío a Fiscalía* (default hoy), Delito Precedente Detalle* (textarea), Informe de Inteligencia Financiera* (textarea).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/usuarios/unidad/:valor` (investigadores) | `felcn_auth_v3` |
| GET | `/investigacion/asignacion?...` | SQL crudo: `public.asignacion` JOIN `auth_fdw.unidad/distrital` |
| GET | `/investigacion/por-operativo/:idOperativo` | `public.investigacion_paralela` + relations `public.departamento_caso`, `auth_fdw.unidad/distrital/grupo` |
| POST | `/investigacion` | `public.investigacion_paralela` |
| PATCH | `/investigacion/:id` | `public.investigacion_paralela` |

- **`/investigaciones/paralelo/listado`** (sin formulario, solo tabla): `GET /investigacion/en-analisis` \| `/judicializados` \| `/desestimados` → `public.investigacion_paralela` (filtrado por `resultado`/`respuestaInvestigacionParalela`).

---

## 7. Análisis (`/analisis`) — módulo S2I

Backend: **base-backend-v2**, `felcn_s2i` (+ `felcn_personas`, `felcn_vls` para Transporte).

### 7.1 Casos

- **`/analisis/casos/nuevo`** — País*, Lugar*, Nombre del Caso*, Estado*, Etapa Investigación*, Fecha Inicio*, Palabra Clave, Nro. Correlativo/CER, Antecedentes*.
  - `GET /s2i/lookups/paises,estados-caso,etapas-investigacion` → `parametricas.pais/estado_caso/etapa_investigacion`
  - `GET /s2i/casos/numero-siguiente` → `public.asignacion`
  - `POST /s2i/casos` → `public.asignacion`

### 7.2 Detalle del Caso (`/analisis/casos/[idCaso]`) — pestañas Blancos / Organizaciones / Bienes

(Pestañas Telefonía y Vehículos existen en código pero están **ocultas de la UI** por decisión de negocio.)

| Tab | Formulario | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| Blancos | Alta: Nombres*, Paterno*, Materno, Ap. Esposo, Alias, Nro. Documento*, País* | POST | `/s2i/casos/:idCaso/blancos` | `public.blanco` |
| ↳ Foto | Dropzone | PATCH/GET | `/s2i/blancos/:id/foto` | `public.blanco` (columna bytea) |
| ↳ Antecedentes | Tipo Delito*, País*, Lugar*, Nro. Caso*, Fecha*, Descripción* | GET/POST/DELETE | `/s2i/blancos/:id/antecedentes` | `public.antecedente_blanco` |
| ↳ Redes Sociales | Tipo de Red* (fijo), Usuario/Dirección* | GET/POST | `/s2i/blancos/:id/redes-sociales` | `public.red_social` |
| ↳ SIG | Descripción*, Lat/Long* (mapa), Contenido* | GET/POST | `/s2i/blancos/:id/lugares-sig` | `public.lugar_blanco` |
| ↳ Archivos | Tipo Contenido*, Tipo*, Nombre*, Archivo* | GET/POST | `/s2i/blancos/:id/archivos`; descarga `/s2i/archivos-blanco/:id/descargar` | `public.archivos_blanco` |
| ↳ Flujo Telefónico | Empresa*, Dirección*, Número* | GET/POST | `/s2i/blancos/:id/flujos-telefonicos` | `public.flujo_telefonico` |
| ↳↳ Detalle llamadas (Fiscalía) | 17 campos (Servicio, Registro, Fecha/Hora, Duración, y por extremo A/B: Número, IMEI, RBS, Celda, Lat/Long, Titular) | POST | `/s2i/flujos-telefonicos/:id/fiscalia` | `public.flujo_fiscalia` |
| ↳ Activo Patrimonial | Tipo Activo*, Gestión*, Archivo*, Contenido* | GET/POST | `/s2i/blancos/:id/activos-patrimoniales` | `public.activo_patrimonial` |
| ↳ OVISE | Lugar*, Lat/Long*, Acción*, Reporte*, Archivo | GET/POST | `/s2i/blancos/:id/ovise` | `public.ovise` |
| Organizaciones | Alta: Tipo Organización*, Nombre/Razón Social*, NIT, Matrícula, Representante Legal, Observaciones | POST | `/s2i/casos/:idCaso/organizaciones` | `public.empresa` |
| ↳ SIG / Archivos | (mismos paneles compartidos) | GET/POST | `/s2i/organizaciones/:id/lugares-sig` \| `/archivos` | `public.lugar_empresa` \| `public.archivos_organizacion` |
| Bienes | Alta: Bien→Clase→Tipo* (cascada), Tipo de Investigación* | POST | `/s2i/casos/:idCaso/bienes` | `public.item_bien_investigado` |
| ↳ Características | Característica*, Descripción* | GET/POST | `/s2i/bienes/:id/caracteristicas` | `public.item_bien_caracteristica` |
| ↳ SIG / Archivos | (paneles compartidos) | GET/POST | `/s2i/bienes/:id/lugares-sig` \| `/archivos` | `public.lugar_bien` \| `public.archivos_bien` |
| *(oculto)* Telefonía | Número 1/2*, Propietario 1/2*, Mensaje* | POST | `/s2i/casos/:idCaso/telefonos` | `public.telefono` |
| *(oculto)* Vehículos | Propietario*, Placa*, Color*, Marca* | POST | `/s2i/casos/:idCaso/vehiculos` | `public.vehiculo` *(en `felcn_s2i`, distinto del `vehiculo` de `felcn_vls`)* |

### 7.3 Reportes de Casos (`/analisis/reportes`)

- Filtro: Nombre del Caso, Estado, Antecedente (todos opcionales).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/s2i/reportes/casos?nombre&estado&antecedente` | `public.asignacion` (agregación en memoria) |
| GET | `/s2i/reportes/casos/:idCaso/detalle` | `asignacion`+`blanco`+`antecedente_blanco`+`red_social`+`lugar_blanco`+`empresa`+`lugar_empresa`+`item_bien_investigado`+`item_bien_caracteristica` |
| GET | `/s2i/reportes/casos/:idCaso/sig` \| `/sig/pdf` | `asignacion`+`lugar_blanco`+`lugar_empresa`+`lugar_bien` |
| GET | `/s2i/reportes/casos/:idCaso/pdf` | igual a `/detalle` |
| GET | `/s2i/reportes/casos/:idCaso/vinculos-cruzados` | `public.blanco`, `public.empresa`, `public.asignacion` (cruce por documento/NIT en otros casos) |

### 7.4 Diagrama de Vínculos (`/analisis/reportes/vinculos`)

- Filtro: Nombre del Caso o Nro. CER. Usa los mismos endpoints `/s2i/reportes/casos`, `/detalle`, `/vinculos-cruzados` de 7.3.

### 7.5 Transporte (`/analisis/transporte`)

| Formulario | Campos | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| Buscar Conductor | Documento* | GET | `/s2i/conductores/:documento` | 1) `public.personas` (**felcn_personas**) 2) `public.conductor` (**felcn_s2i**, PK=documento) |
| Alta manual Conductor (si 404) | Nombres*, Paterno*, Materno*, Sexo*, Ocupación*, F. Nacimiento*, Dirección*, Ap. Esposo, Dir. secundaria, Depto*, Provincia*, Municipio* | POST | `/s2i/conductores` | 1) `public.personas` (INSERT, **felcn_personas**) 2) `public.conductor` (**felcn_s2i**) |
| Buscar Transporte | Placa/código* | GET | `/s2i/transporte/:placa` | 1) `public.vehiculo`+`marca`+`modelo`+`clase`+`color` (**felcn_vls**) 2) `public.transporte` (**felcn_s2i**, PK=código) |
| Alta manual Transporte (si 404) | Tipo*, Marca*, Modelo*, Clase*, Color*, Nro. Motor*, Nro. Chasis* | POST | `/s2i/transporte` | `public.transporte` (**felcn_s2i** solamente — no toca `felcn_vls`) |
| Registrar Flujo de Transporte | Lugar* (autocompletado/alta), Color*, Fecha/hora*, Origen*, Destino*, Carga*, Lat/Long* | GET/POST | `/s2i/lugares`; `POST /s2i/flujo-transporte` | `public.lugar`; `public.flujo_transporte` (FK a conductor/transporte/lugar/`parametricas.color`) |
| — | Color sugerido (no vinculante) | GET | `/s2i/flujo-transporte/color-sugerido` | `parametricas.regla_color` (config) + funciones SQL dinámicas evaluadas contra `felcn_personas`/`felcn_vls` |

### 7.6 Reporte de Flujo de Transporte (`/analisis/transporte/reportes`)

- Filtro: Documento, Placa, Desde, Hasta (todos opcionales).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/s2i/reportes/flujo-transporte?...`, `/recientes`, `/pdf` | `public.flujo_transporte` LEFT JOIN `conductor`, `transporte`, `lugar`, `parametricas.color` (todo dentro de `felcn_s2i`, no vuelve a consultar `felcn_personas`/`felcn_vls`) |

### 7.7 Lookups S2I usados en este módulo

`GET /s2i/lookups/{paises,estados-caso,etapas-investigacion,tipos-delito,contenido-caso,clases/:idBien,tipos/:idClase,colores}` → `parametricas.{pais,estado_caso,etapa_investigacion,tipo_delito,contenido_caso,catalogo_clase,catalogo_tipo,color}`.

---

## 8. Reportes (`/reportes`)

Backend: **base-backend-v2**, `felcn_siii`.

### 8.1 Búsqueda Cruzada (`/reportes/cruzados`)

- 8 modos de búsqueda independientes (fecha, caso, tipo/estado droga, tipo operativo, relevancia, aprehendido, arrestado).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/reportes/cruzadas/{por-fecha,por-caso,por-tipo-droga,por-estado-droga,por-tipo-operativo,por-relevancia,por-aprehendido,por-arrestado}` | SQL crudo: `public.asignacion, operativo, droga, estado_droga, sustancia_solida, sustancia_liquida, fabrica, fabrica_modelo, persona_auxiliar, arrestado_auxiliar, item_bien_secuestrado, catalogo_tipo, hoja_coca` + `parametricas.*` (geografía, tipos, planes) + **`auth_fdw.unidad/distrital/grupo`** |

### 8.2 Búsqueda Avanzada (`/reportes/cruzados-all`)

- ~40 filtros en 7 secciones (caso, clasificación, geografía, droga, persona, bienes, indicadores).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/reportes/cruzadas/avanzado` | Mismo set que 8.1 + `auth_fdw.unidad/distrital/grupo` |
| GET | `/reportes/cruzadas-avanzado/pdf` | Mismo set (reutiliza `cruzadasService.buscarAvanzado`) |

### 8.3 Cuadro de Resultados (`/reportes/cuadros`)

- 6 modos de búsqueda (servicio, fecha, tipo droga, tipo operativo, relevancia, persona).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/reportes/cuadros/{por-servicio,por-fecha,por-tipo-droga,por-tipo-operativo,por-relevancia,por-persona}` | Mismo set de tablas `public.*`/`parametricas.*` que 8.1 + `auth_fdw.unidad/distrital/grupo` |

> Los tres reportes de esta sección están entre los **5 archivos corregidos hoy** (ver [Hallazgos](#10-hallazgos-técnicos)) — confirmado que ya usan `auth_fdw`, no `public.unidad/distrital/grupo`.

---

## 9. Seguimientos (`/seguimientos`)

Backend: **base-backend-v2**, `felcn_siii`.

### 9.1 Registro de Casos — búsqueda

- **Ruta**: `/seguimientos`
- **Campos**: Nro. Caso / Nombre del Caso / rango Desde-Hasta (3 modos independientes).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/asignaciones-ingreso/{sin-registrar,por-numero,por-nombre,por-fecha}` | SQL crudo: `public.asignacion, operativo` + **`auth_fdw.distrital/grupo/unidad`** |

> También corregido hoy — confirmado sin regresión al `public.*` viejo.

### 9.2 Seguimiento de Caso Jurídico — detalle (`/seguimientos/[id]`)

Carga inicial: `GET /seguimiento/detalle/:idCaso` → `public.asignacion` (+ `parametricas.etapa_investigacion`), `public.operativo` (+ `auth_fdw.unidad/distrital`), `public.investigador` (+ `auth_fdw.grado`), `public.fiscal`, `public.jurisdiccion`, `public.control_jurisdiccional`, `public.archivo` (+ `parametricas.contenido_caso`).

**Tab Casos:**

| Sub-sección | Campos | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| Actualización del Informe | CUD Fiscalía, Nro. Pérdida Dominio, Etapa*, Informe/Detalle | PATCH | `/seguimiento/metadatos/:idCaso/:idOperativo` | `public.asignacion`, `public.operativo` |
| Cuaderno de Investigación Digital | Categoría*, Nombre*, Tipo*, Archivo* (≤10MB) | POST/GET/DELETE | `/seguimiento/archivo/:idCaso` (+`/descargar/:idArchivo`, `DELETE /:idArchivo`) | `public.archivo` (bytea) |
| Servidores Policiales | Grado*, Nombre y Apellidos* | GET/POST | `/seguimiento/servidor-policial/:idOperativo` | `public.servidor_policial` + `auth_fdw.grado` |
| Jurisdicción del Caso | Fecha*, Jurisdicción*, Observación | POST | `/seguimiento/jurisdiccion/:idCaso` | `public.jurisdiccion` |
| Control Jurisdiccional | Fecha Inicio*, Juzgado*, Juzgado Mixto, J. Ejecución Penal, Tribunal Sentencia | POST | `/seguimiento/control-jurisdiccional/:idCaso` | `public.control_jurisdiccional` |
| Investigadores Asignados | Fecha*, Grado*, Nombre*, Celular, Teléfono | POST | `/seguimiento/investigador/:idCaso` | `public.investigador` + `auth_fdw.grado` |
| Fiscales Asignados | Fecha*, Nombre*, Celular, Teléfono | POST | `/seguimiento/fiscal/:idCaso` | `public.fiscal` |

**Tab Personas** (base `/personas`):

| Sub-sección | Campos | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| (grilla previa) | — | GET | `/personas/operativo/:idOperativo` | `public.detenido_auxiliar` + `parametricas.pais/estado_civil` |
| Situación Legal | Fecha*, Situación Legal*, Nro. Resolución, Depto/Prov/Lugar*, Autoridad/Juez*, Juzgado* | GET/POST | `/personas/:idDetenido/situacion` | `public.situacion` + `parametricas.situacion_legal` |
| Etapa del Proceso | Fecha*, Etapa→Estado* (cascada), Nro. Resolución*, Lugar*, Autoridad*, Fiscalía/Juzgado* | GET/POST | `/personas/:idDetenido/etapa-proceso` | `public.etapa_proceso, public.estado` + `parametricas.etapa` |

**Tab Bienes** (base `/bienes`):

| Sub-sección | Campos | Método | Endpoint | Tabla(s) BD |
|---|---|---|---|---|
| Bienes Secuestrados | Fiscal*, Fecha del Acta*, Investigador* | GET/POST | `/bienes/:idItemBien/secuestrado` | `public.bien_secuestrado` |
| Bienes Incautados | Nro. Resolución*, Fecha*, Autoridad* | GET/POST | `/bienes/:idItemBien/incautado` | `public.bien_incautado` |
| Bienes Confiscados | Nro. Sentencia*, Fecha*, Autoridad* | GET/POST | `/bienes/:idItemBien/confiscado` | `public.bien_confiscado` |
| Pérdida de Dominio | Fiscalía*, Fecha*, A Requerimiento de* | GET/POST | `/bienes/:idItemBien/perdida-dominio` | `public.perdida_dominio` |
| Entrega o Devolución | F. Requerimiento*, Fiscal*, Condición Legal*, F. Entrega*, Responsable Entrega/Recepción*, Institución*, Ubicación* | GET/POST | `/bienes/:idItemBien/situacion` | `public.situacion_bien` + `parametricas.calidad_bien` |
| Cuaderno de Investigación Digital | Categoría*, Nombre*, Tipo*, Archivo* (≤10MB) | GET/POST | `/bienes/caso/:idCaso/archivos` (+descarga/eliminar) | `public.archivo_bien` (bytea) + `parametricas.contenido_bien` |

### 9.3 Lookups usados en Seguimientos

`GET /siii-lookups/{etapas-investigacion,contenido-caso,situaciones-legales,etapas,estados/:idEtapa,calidades-bien,contenido-bien}` → `parametricas.*` excepto `estados/:idEtapa` que vive en **`public.estado`** (pese al nombre "lookup"). Además `GET /usuarios/grados` (Servidores Policiales/Investigadores) — **no** es un lookup de `siii-lookups`: vive en el módulo `inteligencia/usuario` (`felcn_auth_v3.parametro.grado` por conexión directa `DB_AUTH`, no vía `auth_fdw`).

---

## 10. Hallazgos técnicos

Encontrados al verificar el código real durante esta documentación (no relacionados con el objetivo de documentar en sí, reportados por transparencia):

1. **Fix de esquema `unidad/distrital/grupo` (30/07/2026)** — antes de hoy, 5 repositorios (`asignacion-siii.repository.ts`, `investigacion.repository.ts`, `cuadros.repository.ts`, `cruzados.repository.ts`, `asignaciones-ingreso.repository.ts`) usaban SQL crudo contra `public.unidad/distrital/grupo` (copia local de `felcn_siii`, desactualizada — 36/76 distritales, 90/169 grupos frente al catálogo real) en vez de `auth_fdw.unidad/distrital/grupo` (foreign tables hacia el catálogo canónico de `felcn_auth_v3`). Verificado con datos reales: causaba descripciones NULL y filas descartadas en reportes para IDs nuevos. **Corregido y verificado** — los 8 agentes de este documento confirman que hoy todo el código de `felcn-siii` usa `auth_fdw` correctamente, sin regresiones.
2. **`POST /operativos/:idOperativo/pesaje-drogas` no persiste nada** — el controlador hace *echo* del body recibido sin llamar a ningún service/repositorio (`operativo.controller.ts`). El frontend llama a este endpoint pero los datos no se guardan en base de datos.
3. **`GET /operativos/caso/:idCaso` toca dos bases de datos** — además de `felcn_siii`, consulta `felcn_asignacion_casos` (conexión `DB_ASIG_CASOS`) solo para obtener `fechaOperativo`.
4. **`usuarios/ui/ModalUsuarios.tsx` es código muerto** — formulario modal de crear/editar usuario (con los mismos campos básicos, `POST/PATCH /usuarios`), exportado en `ui/index.ts` pero no referenciado por ningún componente activo. `UsuariosDatatable` navega a `/admin/usuarios/nuevo` y `/editar/:id` en su lugar.
5. **Endpoints `/personas-por-id` y `/bienes-por-id` no existen** en `operativo.controller.ts` pese a que los hooks del frontend (`useSeccion6`, `useSeccion7`) los definen — no están conectados en el formulario visible.
6. **LGI-ING1 (`/investigaciones/lgi/ingreso/[casosId]`) sin implementar** — toda la sección editable está marcada explícitamente en el código como pendiente; solo muestra datos de solo lectura, sin endpoint de guardado.
7. **`/investigaciones/lgi/operativo`** — selección de operativo tiene un `TODO` explícito en el código; no navega a ningún flujo todavía.
8. **Varias tablas "catálogo" viven en `public`, no en `parametricas`** (contraintuitivo dado el nombre): `estado_droga`, `catalogo_tipo`, `catalogo_clase`, `catalogo_caracteristica`, `fabrica_modelo`, `item_operativo`, `departamento_caso`, y `estado` (siii, usada en Seguimiento→Personas→Etapa del Proceso).
9. **`GET /usuarios/cuenta/desbloqueo`** es un `GET` con efecto de escritura (limpia el bloqueo de la cuenta) — no sigue la convención REST de que GET sea idempotente/sin efectos secundarios.
10. **`PATCH /autorizacion/roles/:id/activacion|inactivacion`** tiene efecto secundario amplio: cambia el estado de todas las filas `usuario_rol` asociadas a ese rol (de cualquier usuario), no solo las del usuario que se esté editando en el momento.
