# Tablas de base de datos por sistema — vista consolidada

> Alcance: reorganización de [10-formularios-y-apis.md](./10-formularios-y-apis.md) desde la perspectiva de **base de datos → tabla → dónde se usa**, en vez de formulario → endpoint → tabla. Generado el 2026-08-04 a partir del inventario ya verificado contra código fuente en el documento 10; no se volvió a leer el código para este documento — es una re-lectura/agrupación del mismo inventario.
>
> Útil para responder: *"¿qué se rompe si cambio la tabla X?"* o *"¿qué toca esta base de datos en todo el sistema?"* — la pregunta inversa a la que responde el documento 10.
>
> **Orden**: dentro de cada base de datos, las filas están en **orden alfabético por tabla** (agrupadas primero por schema: `auth_fdw` → `parametricas` → `public`/`usuario`/`parametro` según corresponda). Las filas que combinan varias tablas conservan su agrupación original (representan un mismo feature) y se ordenan por la primera tabla listada.

## Convenciones

- Las referencias `§X.Y` apuntan a la sección correspondiente de [10-formularios-y-apis.md](./10-formularios-y-apis.md), donde está el detalle de campos, métodos HTTP y endpoints exactos.
- `auth_fdw` son **foreign tables** (vía `postgres_fdw`) que viven físicamente en `felcn_auth_v3` pero se consultan desde `felcn_siii` — no son una base de datos aparte.
- Las tablas marcadas "(catálogo en `public`)" están contraintuitivamente fuera del schema `parametricas` pese a ser catálogos — ver hallazgo #8 de `10-formularios-y-apis.md`.

---

## 1. `felcn_auth_v3` (auth-backend) — schemas `usuario` / `parametro`

| Tabla | Dónde se necesita |
|---|---|
| `parametro.distrital` | Lookups usuario `§2.1` |
| `parametro.grado` | Lookups usuario `§2.1`; lookup directo (no FDW) en Seguimientos `§9.3` |
| `parametro.grupo` | Lookups usuario `§2.1` |
| `parametro.parametro` | CRUD parámetros `§2.4` |
| `parametro.unidad` | Lookups usuario `§2.1` |
| `usuario.bitacora_login` | Login `§4.1`, callback Ciudadanía Digital `§4.2` |
| `usuario.casbin_rule` | Recursos por rol `§2.1`, CRUD políticas `§2.5`, login `§4.1` |
| `usuario.modulo` | Recursos por rol `§2.1`, CRUD módulos `§2.3`, login `§4.1` |
| `usuario.otp_sesion` | Login `§4.1` |
| `usuario.persona` | Alta/edición usuario `§2.1`, editar perfil `§3.1`, callback Ciudadanía Digital `§4.2`, registro `§4.3` |
| `usuario.recurso_excepcion` | Alta/edición usuario `§2.1`, delete cascade políticas `§2.5`, login `§4.1` |
| `usuario.solicitud_registro` *(nueva, 28/08/2026 — no auditada contra doc 10 todavía)* | Autorregistro rediseñado en 2 pasos: `POST /usuarios/solicitudes-registro/acceso` (solicitar link, no escribe nada) → `POST /usuarios/solicitudes-registro/completar` (persiste solo si no hay duplicado real) → panel admin `/admin/usuarios/solicitudes-registro` (listar/aprobar/rechazar). Reemplaza al viejo `POST /usuarios/crear-cuenta` (eliminado) — cualquier referencia a ese endpoint en doc 10/otros documentos está desactualizada. |
| `usuario.refresh_token` | Login `§4.1`, callback Ciudadanía Digital `§4.2` |
| `usuario.rol` | Alta/edición usuario `§2.1`, CRUD roles `§2.6`, login `§4.1`, Ciudadanía Digital `§4.2` |
| `usuario.usuario` | Alta/edición usuario `§2.1`, datatable+estados `§2.2`, editar perfil/contraseña/foto `§3.1`, login `§4.1`, callback Ciudadanía Digital `§4.2`, registro `§4.3`, activación/desbloqueo/recuperación `§4.4` |
| `usuario.usuario_rol` | Alta/edición usuario `§2.1`, datatable `§2.2`, activación/inactivación de rol `§2.6`, login `§4.1`, Ciudadanía Digital `§4.2`, registro `§4.3` |
| *(conexión directa `DB_AUTH`, sin FDW)* | Lookup investigadores/unidad — Búsqueda de Patrimonio `§5.4`, Investigación Paralela `§6.2` |

## 2. `felcn_siii` (base-backend-v2 · módulo `sunesis/siii`) — schemas `public` / `parametricas` / `auth_fdw`

`auth_fdw.{unidad,distrital,grupo,grado}` son foreign tables hacia `felcn_auth_v3.parametro.*` — fuente canónica de estructura organizacional (ver hallazgo #1 en el documento 10: 5 repositorios usaban un catálogo local desactualizado hasta el fix del 30/07/2026).

| Tabla | Dónde se necesita |
|---|---|
| `auth_fdw.grado` | Servidores policiales / investigadores en Seguimiento `§9.2` |
| `auth_fdw.unidad` / `auth_fdw.distrital` / `auth_fdw.grupo` | Transversal: `§5.1`, `§5.2`, `§5.4`, `§6.2`, `§8`, `§9.1`, `§9.2` |
| `parametricas.departamento/provincia/localidad` | Búsqueda patrimonio `§5.4` |
| `parametricas.etapa_investigacion` | Seguimiento detalle `§9.2`, lookups `§9.3` |
| `parametricas.tipo_droga` / `forma_transporte` / `pais` | Sección Drogas `§5.2` (sec. 2) |
| `public.archivo` + `parametricas.contenido_caso` | Seguimiento — Cuaderno de Investigación Digital (Casos) `§9.2` |
| `public.archivo_bien` + `parametricas.contenido_bien` | Seguimiento — Cuaderno de Investigación Digital (Bienes) `§9.2` |
| `public.arrestado_auxiliar` / `public.hoja_coca` | Reportes cruzados/cuadros `§8` |
| `public.asignacion` | Listado operativos `§5.1`, registro operativo sec. Datos Generales `§5.2`, búsqueda patrimonio `§5.4`, investigación paralela `§6.2`, reportes cruzados/cuadros `§8`, seguimientos búsqueda+detalle `§9.1`/`§9.2` |
| `public.bien_secuestrado` / `bien_incautado` / `bien_confiscado` / `perdida_dominio` | Seguimiento — Tab Bienes `§9.2` |
| `public.control_jurisdiccional` | Seguimiento — Control Jurisdiccional `§9.2` |
| `public.departamento_caso` *(catálogo en `public`)* | Investigación Paralela `§6.2` |
| `public.detenido_auxiliar` + `parametricas.pais/estado_civil` | Seguimiento — grilla Tab Personas `§9.2` |
| `public.droga` / `public.estado_droga` | Sección Drogas `§5.2` (sec. 2), reportes `§8` |
| `public.etapa_proceso` / `public.estado` *(catálogo en `public`)* + `parametricas.etapa` | Seguimiento — Etapa del Proceso `§9.2` |
| `public.fabrica` / `public.fabrica_modelo` *(catálogo en `public`)* + `parametricas.tipo_fabrica` | Laboratorios `§5.2` (sec. 5) |
| `public.fiscal` | Seguimiento — Fiscales Asignados `§9.2` |
| `public.galeria` | Galería `§5.2` (sec. 8) |
| `public.investigacion_paralela` | Investigación Paralela — formulario y listado `§6.2` |
| `public.investigador` | Búsqueda patrimonio `§5.4`, Investigadores Asignados en Seguimiento `§9.2` |
| `public.item_bien_caracteristica` + `public.catalogo_caracteristica` *(catálogo en `public`)* | Características de bien `§5.2` (sec. 7) |
| `public.item_bien_secuestrado` + `public.catalogo_tipo/catalogo_clase` *(catálogo en `public`)* + `parametricas.bienes` | Bienes `§5.2` (sec. 7), patrimonio `§5.3`, reportes `§8` (solo `catalogo_tipo`) |
| `public.item_operativo` *(catálogo en `public`)* | Categoría→Ítem Operativo, sec. Datos Generales `§5.2` |
| `public.jurisdiccion` | Seguimiento — Jurisdicción del Caso `§9.2` |
| `public.logotipo` | Sub-formulario Logotipos `§5.2` (sec. 2) |
| `public.operativo` | Registro operativo sec. Datos Generales `§5.2`, patrimonio `§5.3`, búsqueda patrimonio `§5.4`, reportes `§8`, seguimientos `§9.1`/`§9.2` |
| `public.persona_auxiliar` + `parametricas.pais/tipo_documento` | Personas `§5.2` (sec. 6) |
| `public.servidor_policial` | Seguimiento — Servidores Policiales `§9.2` |
| `public.situacion` + `parametricas.situacion_legal` | Seguimiento — Situación Legal `§9.2` |
| `public.situacion_bien` + `parametricas.calidad_bien` | Seguimiento — Entrega o Devolución `§9.2` |
| `public.sustancia_liquida` + `parametricas.sustancia_liquida_descripcion` | Sust. Líquidas `§5.2` (sec. 4) |
| `public.sustancia_solida` + `parametricas.sustancia_solida_descripcion` | Sust. Sólidas `§5.2` (sec. 3) |

## 3. `felcn_lgi` (base-backend-v2 · módulo `sunesis/siii`, legado GIAEF — **sin** `auth_fdw`)

Catálogo organizacional propio y desincronizado del canónico por diseño (no es el mismo bug del fix de `auth_fdw`).

| Tabla | Dónde se necesita |
|---|---|
| `public.asignacion` + `public.investigador`, `public.distritales`, `public.departamentosc` | Ingreso — búsqueda "mis casos" `§6.1` |
| `public.operativo` + `public.departamentosc`, `public.provincias`, `public.localidad`, `public.unidades`, `public.distritales` | Operativos vinculados `§6.1` |

> El detalle editable de Ingreso (LGI-ING1) y el Listado están sin implementar/placeholder — no tienen tablas de escritura activas (hallazgos #6 y #7 de `10-formularios-y-apis.md`).

## 4. `felcn_s2i` (base-backend-v2 · módulo `sunesis/s2i`) — schemas `public` / `parametricas`

| Tabla | Dónde se necesita |
|---|---|
| `parametricas.pais/estado_caso/etapa_investigacion/tipo_delito/contenido_caso/catalogo_clase/catalogo_tipo/color` | Lookups `§7.1`, `§7.7` |
| `parametricas.regla_color` | Color sugerido, no vinculante `§7.5` |
| `public.activo_patrimonial` | Activo Patrimonial `§7.2` |
| `public.antecedente_blanco` | Antecedentes de Blanco `§7.2` |
| `public.archivos_blanco` | Archivos de Blanco `§7.2` |
| `public.asignacion` | Alta de caso `§7.1`, reportes `§7.3` |
| `public.blanco` | Alta de Blanco + foto `§7.2` |
| `public.conductor` | Buscar/alta Conductor `§7.5` |
| `public.empresa` | Organizaciones — alta `§7.2` |
| `public.flujo_telefonico` / `public.flujo_fiscalia` | Flujo Telefónico + detalle de llamadas (Fiscalía) `§7.2` |
| `public.item_bien_caracteristica` | Características de bien `§7.2` (mismo nombre que en `felcn_siii`, es otra base de datos) |
| `public.item_bien_investigado` | Bienes — alta `§7.2` |
| `public.lugar` / `public.flujo_transporte` + `parametricas.color` | Registrar Flujo de Transporte `§7.5`, reporte `§7.6` |
| `public.lugar_bien` / `public.archivos_bien` | SIG/Archivos de bien `§7.2` |
| `public.lugar_blanco` | SIG de Blanco `§7.2` |
| `public.lugar_empresa` / `public.archivos_organizacion` | SIG/Archivos de Organización `§7.2` |
| `public.ovise` | OVISE `§7.2` |
| `public.red_social` | Redes Sociales `§7.2` |
| `public.telefono` *(oculto en UI)* | Tab Telefonía `§7.2` |
| `public.transporte` | Buscar/alta Transporte `§7.5` |
| `public.vehiculo` *(oculto en UI)* | Tab Vehículos `§7.2` (distinto del `vehiculo` de `felcn_vls`) |

## 5. `felcn_personas` (auxiliar)

| Tabla | Dónde se necesita |
|---|---|
| `public.personas` | Datos civiles por documento — resolución de Conductor `§7.5` |

## 6. `felcn_vls` (auxiliar — registro vehicular oficial)

| Tabla | Dónde se necesita |
|---|---|
| `public.clase`, `color`, `marca`, `modelo`, `vehiculo` | Resolución de Transporte por placa `§7.5` |

## 7. `felcn_asignacion_casos` (auxiliar)

| Tabla/columna | Dónde se necesita |
|---|---|
| *(sin tabla nombrada en el documento fuente, solo columna `fechaOperativo`, conexión `DB_ASIG_CASOS`)* | `GET /operativos/caso/:idCaso`, sección Datos Generales `§5.2` |

---

## Lectura cruzada: bases de datos por módulo de frontend

| Módulo de frontend | Base(s) de datos que toca |
|---|---|
| Admin → Configuración, Admin → Principal, Login/Registro/Cuenta | `felcn_auth_v3` (única) |
| Operativos y Patrimonio | `felcn_siii` (+ `felcn_asignacion_casos` solo para `fechaOperativo`, + `felcn_auth_v3` vía `auth_fdw`) |
| Investigaciones → LGI | `felcn_lgi` (aislado, sin `auth_fdw`) |
| Investigaciones → Paralelo | `felcn_siii` (+ `felcn_auth_v3` vía `auth_fdw` y vía conexión directa para lookup de investigadores) |
| Análisis (S2I) | `felcn_s2i` (+ `felcn_personas` y `felcn_vls` solo para el sub-módulo Transporte) |
| Reportes | `felcn_siii` (+ `felcn_auth_v3` vía `auth_fdw`) |
| Seguimientos | `felcn_siii` (+ `felcn_auth_v3` vía `auth_fdw` y vía conexión directa en `§9.3`) |

**Observación**: `felcn_lgi` es la única base de un módulo activo que no pasa por `auth_fdw` — mantiene su propio catálogo organizacional legado. Si se detecta el mismo síntoma que el hallazgo #1 (descripciones NULL, filas descartadas por ID desconocido) dentro de `/investigaciones/lgi`, **no** es el mismo bug: ahí es un catálogo desincronizado por diseño, no un uso incorrecto de `public.*` en vez de `auth_fdw.*`.
