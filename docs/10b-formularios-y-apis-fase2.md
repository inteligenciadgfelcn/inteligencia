# Formularios, APIs y hallazgos técnicos — Módulos `(fase_2)`

> Alcance: `frontend/felcn-base-frontend/src/app/(fase_2)/` — los 5 módulos que [10-formularios-y-apis.md](./10-formularios-y-apis.md) excluye explícitamente de su alcance. Verificado el 10/08/2026 leyendo el código real de `frontend/felcn-base-frontend/src/app/(fase_2)/`, `backend/felcn-base-backend-v2/src/application/inteligencia/` y `backend/felcn-base-backend-v2/src/application/interoperabilidad/`. Estos módulos están **activos** en el menú real de producción (`usuario.modulo._estado = ACTIVO`), verificado contra la base de datos.
>
> **Nota de arquitectura**: existe un tercer backend NestJS en el repositorio, `backend/felcn-fase2-backend/`, pero ningún archivo de estos 5 módulos lo referencia — todas las llamadas van a `felcn-base-backend-v2`, en un árbol de código nuevo (`src/application/inteligencia/`, `src/application/interoperabilidad/`) separado del `sunesis/siii` que documenta el archivo 10. `felcn-fase2-backend` existe en el repo pero está desconectado del frontend actual.

## 0. Bases de datos adicionales (no cubiertas por el documento 10)

| Constante TypeORM | Base de datos real | Uso |
|---|---|---|
| `DB_ASIG_CASOS` | `a_felcn_asignacion_caso` | Servicios, asignación de caso, catálogos propios (Inteligencia) |
| `DB_SII` | `a_felcn_sii` | Filiación de personas, parentescos, catálogos fenotípicos |
| `DB_SOSPECHOSO` | `a_felcn_sospechoso` | Casos X — operativo, detenido, catálogos propios |
| `DB_SIII` | `felcn_siii` | Misma base del documento 10; consultada en cruce desde Inteligencia/Filiación |
| `DB_AUTH` | `felcn_auth_v3` | Catálogo canónico `parametro.unidad/distrital/grupo` |

Todas las rutas de este documento son relativas a `felcn-base-backend-v2`, salvo indicación contraria.

---

## 1. Inteligencia (`/inteligencia`)

Backend: **base-backend-v2**, `src/application/inteligencia/felcn_asignacion_caso/`.

### 1.1 Creación del servicio (`/inteligencia/creacion`)

Campos: Servicio entrante* (async-select usuarios), Nro. de Pase (autocompletado), Servicio de emergencia* (async-select), Nro. de Pase emergencia (autocompletado), Fecha/hora Ingreso*, Fecha/hora Salida*, Código de servicio (generado por botón).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/usuarios/unidad/inteligencia` | `felcn_auth_v3` |
| GET | `/servicio/generar-codigo-servicio?fechaIngreso&fechaSalida` | *(cálculo, no persiste)* |
| POST | `/servicio` | `a_felcn_asignacion_caso.public.servicio` |

### 1.2 Asignación de caso (`/inteligencia/registro`)

Precondición: el usuario debe tener un servicio activo (§1.1) — `GET /servicio/verificar/:numeroPase` debe devolver `enServicio: true`, o el formulario queda bloqueado.

Campos: Código de servicio (autocompletado), Nro. Pase (autocompletado), Departamento*, Unidad*, Distrital* (cascada), Grupo* (cascada), Nro. de Registro* (botón "Asignar número"), Nombre operativo*, Fecha/hora del operativo*, Quién realiza la solicitud* (cascada de Grupo), Nro. celular (autocompletado), Asignado al caso* (cascada de Grupo), Nro. celular, Fiscal asignado*, Nro. celular fiscal*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/servicio/verificar/:numeroPase` | `a_felcn_asignacion_caso.public.servicio` |
| GET | `/departamento/all/pais` | `a_felcn_sii.parametricas.departamento` |
| GET | `/unidad/allGeneral` | `felcn_auth_v3.parametro.unidad` (SQL crudo vía `DB_AUTH`) — ver Hallazgo 3 |
| GET | `/distrital/all/unidad?idUnidad=` | `felcn_auth_v3.parametro.distrital` |
| GET | `/grupos/all/distrito?idDistrito=` | `felcn_auth_v3.parametro.grupo` |
| GET | `/asignaciones/generar-codigo?idDepartamento&idGrupo` | Genera código cruzando `a_felcn_sii`, `felcn_auth_v3`, `felcn_siii.asignacion` |
| GET | `/asignaciones` | `a_felcn_asignacion_caso.public.asignacion` |
| POST | `/asignaciones` | **Transacción dual**: INSERT en `felcn_siii.public.asignacion` y, con el `idAsignacion` resultante, INSERT espejo en `a_felcn_asignacion_caso.public.asignacion` |

> **Hallazgo**: el botón "Confirmar" del modal de activar/inactivar caso (`AlertaEstadoRegistro.tsx`) no ejecuta ninguna petición — la función que llamaría al backend está comentada; el botón solo cierra el modal. El endpoint que debería usar tampoco existe.

### 1.3 Actualización del caso (`/inteligencia/actualizacion`)

Campos del formulario de asignación de número: Letras Principal Aprendido*, Código Departamento* (autocompletado), Nro. de Registro* (autocompletado), Continuación del Caso (Sí/No), Nro Caso*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/asignaciones/operativos?codigoServicio&registrados=&pagina&limite&filtro` | `a_felcn_asignacion_caso.asignacion` cruzado con `felcn_siii.operativo/asignacion` |
| GET | `/letra/allGeneral` | `a_felcn_asignacion_caso.public.letra` |
| POST | `/asignaciones/generar-numero` | Calcula correlativo sobre `a_felcn_asignacion_caso.asignacion` |
| POST | `/asignaciones/asignar-numero-caso` | **Actualización dual**: `UPDATE` en `felcn_siii.asignacion` y `a_felcn_asignacion_caso.asignacion` |

El botón "Editar caso" navega a `/operativos/registro/?id=<idCaso>` — reutiliza el formulario de Operativos del documento 10 §5.2.

> **Hallazgo — pendiente de verificar**: el botón "Generar reporte" apunta a `GET /reportes/operativos/pdf?numero=`. No se localizó ningún controller `reportes/operativos` en `src/application/inteligencia/`. Podría reutilizar un endpoint de `sunesis/siii` (doc 10) — no confirmado.

### 1.4 Lista de servicios (`/inteligencia/servicio`)

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/servicio?pagina&limite&filtro&ordenar&direccion` | `a_felcn_asignacion_caso.public.servicio` |

> **Hallazgo**: el botón de exportar PDF por fila llama a `GET /prueba/export/pdf`, que **no existe en ningún controller del backend** — produce 404 al usarse. El botón está activo (no deshabilitado).

### 1.5 Antecedentes (`/inteligencia/antecedentes`)

Campos de búsqueda (al menos uno): CI, Nombre, Apellido Paterno, Apellido Materno.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/operativo/antecedentes?ci&nombre&apellidoPaterno&apellidoMaterno` | `felcn_siii.public.persona_auxiliar` (SQL crudo) |

### 1.6 Búsqueda por número operativo (`/inteligencia/buscar_operativo`)

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/operativo/:numero_caso` | `felcn_siii.public.operativo` + relations extensas (persona_auxiliar, bienes, drogas, sustancias, vehículo) |

---

## 2. Filiación de personas (`/filiacion`)

Backend: **base-backend-v2**, `src/application/inteligencia/felcn_sii/`, con escritura cruzada a `felcn_siii.public.arrestado_auxiliar`.

### 2.1 Fenotipos (`/filiacion/registro`)

Flujo: búsqueda por número de caso (personas no filiadas) → formulario completo.

Campos (agrupados): datos personales (estado de la persona, lugar del operativo, nombre/apellidos, nacionalidad, género, profesión, alias, documento, fecha nacimiento, dirección, estado civil, lugar de nacimiento, contrastado con SEGIP, tarjeta prontuario), fenotipo (estatura, peso, señas particulares, tatuajes, tipo de nariz, constitución, color de piel/cabello/ojos, tipo de cabello/ojos), 3 fotografías obligatorias (frontal, perfil izquierdo, perfil derecho), huellas dactilares (captura independiente).

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/filiacion/personas?caso&filiado&pagina&limite` | `felcn_siii.public.persona_auxiliar` cruzado con `a_felcn_sii.public.detenido` |
| POST | `/huellas/guardar` | `a_felcn_sii` (huellas) + archivo `.bmp` en filesystem |
| POST | `/filiacion` | **Transacción** en `a_felcn_sii`: `detenido` → `alias_detenido`/`documento_detenido`/`fenotipo_detenido`/`profesion_detenido`; si estado=Arrestado, INSERT adicional en `felcn_siii.arrestado_auxiliar`; `UPDATE felcn_siii.persona_auxiliar SET enviado=1` |

> **Hallazgo**: `POST /filiacion` solo escribe en `felcn_siii.arrestado_auxiliar` cuando el estado es "Arrestado". Para los otros 3 estados posibles (Aprehendido, LGI/Pérdida de Dominio, Principal aprehendido) el registro queda solo en `a_felcn_sii.detenido` — comportamiento intencional del código, sin aviso en la interfaz.

### 2.2 Parentescos (`/filiacion/parentesco`)

Formulario "Datos familiares": Parentesco*, Nombres*, Apellidos*, Edad*, Dirección*, Teléfono*, Estado (¿vivo?), Implicado.
Formulario "Nombres supuestos": Nombres*, Apellidos*, Apellido de esposo*.

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/parentezco/allGeneral` | `a_felcn_sii.parametricas.parentezco` |
| POST/GET | `/datos-familiares[/detenido?idDetenido=]` | `a_felcn_sii.public.datos_familiares` |
| POST/GET | `/nombres-supuestos[/detenido?idDetenido=]` | `a_felcn_sii.public.nombres_supuestos` |
| GET | `/filiacion/detenido/:id` | Agregado `detenido`+relations |

### 2.3 Tarjeta prontuaria (`/filiacion/tarjeta_prontuaria`)

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/reporte/export/pdf/:id_detenido` | Genera PDF desde `a_felcn_sii.detenido` + relations |

---

## 3. Interoperabilidad (`/interoperabilidad`)

Backend: **base-backend-v2**, `src/application/interoperabilidad/` — proxy HTTP hacia servicios externos vía variables `IOP_*`.

### 3.1 INRA (`/interoperabilidad/inra`)

Campos: Tipo de búsqueda* (Nro. Título / Nro. Identificación), valor*.

| Método | Endpoint | Externo |
|---|---|---|
| GET | `/interoperabilidad/inra/titulo?numTitulo=` | Proxy → `IOP_INRA_TITULO_URL` |
| GET | `/interoperabilidad/inra/identificacion?numeroIdentificacion=` | Proxy → `IOP_INRA_NRO_IDENTIFICACION_URL` |

Cableado real de punta a punta — el único submódulo de Interoperabilidad completamente funcional.

### 3.2 ITV (`/interoperabilidad/itv`)

> **Hallazgo — módulo simulado**: `itv.service.ts` usa exclusivamente `getITVInteroperabilidadFake()`, que devuelve datos hardcodeados (`ITV_FAKE_RESPONSE`) tras un `setTimeout` de 500 ms, sin importar el valor buscado. El backend **sí tiene** un endpoint real (`POST /interoperabilidad/itv/consulta-inspeccion`, proxy a `IOP_ITV_URL`), pero el frontend nunca lo invoca.

---

## 4. Casos X (`/casos_x`)

Backend: **base-backend-v2**, `src/application/inteligencia/felcn_sospechoso/`.

> **Nota de alcance**: solo existen las carpetas `registro` y `listado` — no hay `actualizacion` ni `consulta` en el código ni rutas registradas.

### 4.1 Registro (`/casos_x/registro`)

Flujo en 3 pasos: buscar caso por número → datos del operativo → personas detenidas.

**Paso 1**: Número de caso*. `GET /operativo/registro/:numero_caso_registro`.

**Paso 2** — Datos del operativo: Código radiograma*, Fecha/hora*, Departamento*, Provincia* (cascada), Municipio* (cascada), Localidad/Dirección*, Categoría*, Ítem operativo* (cascada), Unidad*, Distrito* (cascada), Grupo* (cascada), Al mando de*, Resumen*. `POST /operativo` → `a_felcn_sospechoso.public.operativo`.

**Paso 3** — Persona: Nombres*, Apellidos*, Ap. Esposo, País*, Sexo*, Dirección*, Tipo/Nro. Documento*, Estado*. `POST /detenido` → `a_felcn_sospechoso.public.detenido` (valida duplicado por documento+operativo).

> **Hallazgo grave — colisión de rutas `GET /unidad/allGeneral`**: dos controllers registran exactamente la misma ruta — uno de Inteligencia (fuente `felcn_auth_v3` canónica) y uno de Casos X (fuente `a_felcn_sospechoso` propia). El primero en el orden de imports de `InteligenciaModule` gana; el combo "Unidad operativa" de Casos X muy probablemente recibe el catálogo equivocado (IDs de `felcn_auth_v3` en vez de `a_felcn_sospechoso`), lo que puede dejar vacío o incorrecto el combo dependiente "Distrito operativo". Detectado por análisis estático del código; no confirmado en runtime.
>
> **Hallazgo**: `DetenidosDataTable` llama a `GET /detenido` sin enviar `idOperativo`, pese a que el backend soporta ese filtro. La tabla de "Detenidos" de un caso muestra en realidad **todos los detenidos del sistema**, no solo los del operativo abierto.

### 4.2 Listado (`/casos_x/listado`)

| Método | Endpoint | Tabla(s) BD |
|---|---|---|
| GET | `/operativo?pagina&limite&filtro&ordenar&direccion` | `a_felcn_sospechoso.public.operativo` + relations |

Solo consulta, sin formulario de alta/edición.

---

## 5. LGI de nivel superior (`/lgi`)

Backend: **ninguno**. Verificado con búsqueda exhaustiva de llamadas de red (`fetch`, `axios`, servicios HTTP) sobre los 3 submódulos completos: **cero resultados**. Todos los catálogos, listados y "guardados" son datos hardcodeados en el frontend, envueltos en `delay()` simulado. Nada persiste — un registro "guardado" desaparece al recargar la página.

Esto contrasta con el LGI legado documentado en 10-formularios-y-apis.md §6.1 (`/investigaciones/lgi`, sistema GIAEF con base de datos real), que sí tiene backend funcional salvo la sección de ingreso, marcada explícitamente como pendiente. Este módulo (`/lgi/*`) no tiene backend en absoluto, pese a estar activo en el menú de producción.

### 5.1 Agregar personal (`/lgi/agregar_personal`)

Formulario completo (credencial, grado, datos personales, contacto, unidad/distrital/grupo en cascada, rol, permisos) — sin ninguna acción de guardado conectada, ni siquiera simulada.

### 5.2 Ingreso caso nuevo (`/lgi/ingreso_datos`)

Formulario completo de registro de caso LGI — el "guardado" genera un código de caso calculado en el propio navegador y no persiste en ningún lado.

### 5.3 Inicio investigación (`/lgi/inicio_investigacion`)

Listado y detalle (pestañas Caso precedente / Personas naturales / Personas jurídicas / Bienes secuestrados) — de solo lectura, sobre un arreglo de datos de ejemplo fijo.

---

## 6. Hallazgos técnicos consolidados

1. **`/lgi/*` (nivel superior) 100% simulado** — sin backend, sin persistencia, activo en el menú de producción.
2. **Interoperabilidad → ITV simulado** pese a tener backend real implementado y no utilizado.
3. **Colisión de rutas `GET /unidad/allGeneral`** entre Inteligencia y Casos X — el combo "Unidad operativa" de Casos X probablemente recibe el catálogo equivocado.
4. **`DetenidosDataTable` de Casos X sin filtrar por operativo** — muestra todos los detenidos del sistema.
5. **`GET /prueba/export/pdf`** (Lista de servicios) no existe — 404 al usarse.
6. **Botón "Confirmar" de activar/inactivar caso** (Asignación de caso) no hace nada — lógica comentada.
7. **Código muerto** (controllers definidos pero no registrados en ningún módulo): `felcn_asignacion_caso/departamento`, `felcn_sii/parametricas/letra`, `felcn_sii/filiacion/detenido` (módulo completo, sin guard de autenticación).
8. **Filiación**: `POST /filiacion` solo escribe en `felcn_siii.arrestado_auxiliar` si el estado es "Arrestado"; los otros 3 estados quedan solo en `a_felcn_sii.detenido`.
9. **Botón "Generar reporte"** (Actualización del caso) apunta a un endpoint no localizado — pendiente de confirmar si está roto o reutiliza otro módulo.
10. **Catálogos organizacionales divergentes**: la estructura orgánica (unidad/distrital/grupo) se consulta desde al menos 3 fuentes distintas según el módulo (`felcn_auth_v3` canónica, copia propia de `a_felcn_asignacion_caso`, copia propia de `a_felcn_sospechoso`), sin evidencia de la unificación que sí se hizo para `felcn_siii` (ver doc 10 §10.1).
11. **`casos_x/actualizacion` y `casos_x/consulta` no existen** en el código — si el menú de producción muestra 4 entradas para Casos X, dos no tienen pantalla implementada.
12. **Ningún controller de Inteligencia/Casos X expone eliminación** — el CRUD es solo alta/edición/listado.

Estos hallazgos son responsabilidad de decisión institucional, no de este documento: si un módulo simulado debe ocultarse del menú, corregirse, o mantenerse visible con una nota de "en desarrollo" es una decisión de producto, no técnica.
