# Análisis y propuesta: recepción de información MP → POL (Fiscalía)

> Complementa a [REQUERIMIENTO-MP-POL.md](./REQUERIMIENTO-MP-POL.md). Fecha: 2026-07-06.
> Estado: **propuesta — pendiente de aprobación**.

## 1. Contexto

La Fiscalía (MP) enviará información de casos a la FELCN (POL) consumiendo ~21 endpoints que
nosotros debemos exponer en `felcn-base-backend`. Características clave del requerimiento:

- Autenticación por **API key fija** ("token hijo"), **sin JWT ni Casbin** — distinto a todo el
  resto de la aplicación, que usa `JwtAuthGuard`.
- El MP siempre manda su PK (`mpCasoId`, `mpCasoDelitoId`, …) y espera de vuelta nuestra PK
  (`polCasoId`, `polCasoDelitoId`, …) para mantener correlación bidireccional.
- Formato de respuesta fijo: `{ error, message, response, status }`.
- Muchos campos referencian **catálogos del MP** (tipoDenunciaId, casoEstadoId, delitoId,
  situacionJuridicaId, juzgadoId, …) que hoy **no existen** en nuestras BDs — la homologación de
  catálogos tomará tiempo.

## 2. Cuadro de homologación contra entidades existentes

Se revisaron las entidades de `felcn_siii` (seguimiento jurídico), `felcn_sii`, `f_s2i`,
`felcn_sospechoso` y `felcn_asignacion_casos`.

| # | Recurso MP | Entidad/tabla existente más cercana | BD | Nivel de acople | Observaciones |
|---|---|---|---|---|---|
| 3.1/3.2 | Caso | `AsignacionSiii` → `public.asignacion` | felcn_siii | 🟡 Parcial | Tiene `numeroCaso`, `ianus` (equivalente conceptual al CUD/id MP), `nombreCaso`, fiscal. NO tiene: municipio/lat-long del hecho, relato, estado/etapa como catálogo, reserva, tags. Estructura legacy orientada a operativos, no a denuncia MP. |
| 3.3–3.6 | Delitos del caso | `TipoPenal` (catálogo `parametricas.tipo_penal`) | felcn_siii | 🔴 No existe | Solo existe el catálogo interno de tipos penales; no hay tabla relacional `caso_delito` ni mapeo con el catálogo de delitos del MP. |
| 3.7/3.8 | Sujetos (persona natural) | `DetenidoAuxiliar` → `public.detenido_auxiliar` | felcn_siii | 🟡 Parcial | Cubre nombres/apellidos/nacionalidad/género, pero está atada a `id_operativo` (no a caso-MP), y no tiene: tipoIdentidad SEGIP/NN, género/autoidentificación/idiomas/grupo vulnerable/discapacidad, fallecido/desaparecido, querellante, reserva identidad. |
| 3.7/3.8 | Sujetos (persona jurídica) | — (lo más cercano: `Empresa` en s2i, para inteligencia) | f_s2i | 🔴 No existe | No hay persona jurídica como sujeto procesal en SIII. |
| 3.9/3.10 | Abogados del sujeto | — | — | 🔴 No existe | Ningún sistema registra abogados defensores (RPA). |
| 3.11 | Situación jurídica del sujeto | `Situacion` → `public.situacion` + catálogo `SituacionLegal` | felcn_siii | 🟡 Parcial | Buen fit conceptual (historial de situaciones legales del implicado), pero cuelga de `detenido_auxiliar` y el catálogo local no coincide con el del MP. |
| 3.12 | Domicilios del sujeto | Campos sueltos de domicilio en `detenido` (SII) | felcn_sii | 🔴 No existe | No hay tabla de residencias 1-N por persona. |
| 3.13/3.14 | Fiscales del caso | `Fiscal` → `public.fiscal` | felcn_siii | 🟡 Parcial | Fit conceptual directo (historial de fiscales por caso) pero campos incompatibles: guarda `nombre_apellidos` concatenado, sin CI ni tipoResponsable. |
| 3.17/3.18 | Juzgado del caso/sujeto | `ControlJurisdiccional`, `Jurisdiccion` → `public.*` | felcn_siii | 🟡 Parcial | Registra juzgados como **texto libre** (juzgado_instruccion, tribunal_sentencia…), no como `juzgadoId` de catálogo del OJ/MP. |
| 3.15 | Actividades / actos investigativos (con metadata polimórfica) | `Archivo` (seguimiento casos) | felcn_siii | 🔴 No existe | El concepto actividad-MP (documento firmado + metadata de solicitud: detención preventiva, sentencia, medidas de protección, plazos) no existe. |
| 3.16 | Reserva (caso/sujeto/actividad) | — | — | 🔴 No existe | No hay mecanismo de reserva. |
| 3.19/3.20/3.16b | Agenda de audiencias | — | — | 🔴 No existe | No hay agenda/audiencias en ningún módulo. |
| 3.21 | Descarga de archivo por hash | `Archivo`/`ArchivoBien`/`Galeria` (referencias a ficheros) | felcn_siii/f_s2i | 🔴 No existe | Requiere cliente HTTP hacia el MP + almacenamiento local del fichero descargado. |

**Conclusión del análisis:** ninguna entidad existente puede recibir directamente la información
del MP sin pérdida de datos ni acoplamiento forzado. Las tablas legacy de SIII están modeladas
alrededor del *operativo policial*, no de la *denuncia/caso fiscal*, y todos los catálogos
(delitos, estados, etapas, juzgados, situaciones jurídicas) son incompatibles con los del MP.
Intentar mapear directo ahora bloquearía la integración hasta terminar la homologación de
catálogos.

## 3. Propuesta: zona de aterrizaje (staging) genérica + homologación diferida

### 3.1. Estrategia general

**Fase A (ahora):** recibir y persistir TODO lo que envíe el MP en un modelo propio y aislado
(schema `fiscalia`), con estructura híbrida: columnas relacionales para las claves de correlación
y el estado + columna `JSONB` con el payload íntegro. Así:

- No se pierde ningún dato aunque el MP agregue campos.
- Se responde de inmediato con los `pol*Id` que el MP necesita.
- La homologación hacia SIII/S2I se hace después, tabla por tabla, sin bloquear la integración.

**Fase B (posterior):** procesos de homologación que lean el staging y pueblen las tablas
operativas (asignacion, fiscal, situacion, …) cuando las tablas de mapeo de catálogos MP↔FELCN
estén definidas.

### 3.2. Ubicación física de los datos

Nuevo **schema `fiscalia`** dentro de la BD `felcn_siii` (conexión `DB_SIII` ya existente).
Justificación: el destino final natural de esta información es el módulo de seguimiento jurídico
que vive en `felcn_siii`; usar la misma BD permite en Fase B hacer la homologación con FKs/joins
locales. Alternativa si se prefiere aislamiento total: BD nueva `felcn_mp` con conexión propia
`DB_MP` (el módulo de BD ya soporta N conexiones).

### 3.3. Modelo de datos staging (schema `fiscalia`)

Todas las tablas comparten el patrón:

```
pol_<recurso>_id  BIGSERIAL PK      ← lo que devolvemos al MP
mp_<recurso>_id   BIGINT UNIQUE     ← PK del MP (idempotencia: reintentos no duplican)
payload           JSONB NOT NULL    ← body completo recibido
estado            SMALLINT          ← 1 activo / 0 baja (PATCH estado)
homologado        BOOLEAN DEFAULT false  ← marcado por la Fase B
created_at / updated_at TIMESTAMPTZ
```

| Tabla | Claves de correlación adicionales (columnas propias) |
|---|---|
| `fiscalia.mp_caso` | `cud`, `mp_caso_padre_id`, `esta_reservado`, `fecha_fin_reserva` |
| `fiscalia.mp_caso_delito` | `pol_caso_id` FK, `delito_id`, `es_principal`, `es_tentativo` |
| `fiscalia.mp_caso_sujeto` | `pol_caso_id` FK, `tipo_persona` (natural/jurídica), `numero_documento`/`nit`, `es_querellante`, `reserva_identidad` |
| `fiscalia.mp_sujeto_abogado` | `pol_caso_persona_id` FK, `ci`, `codigo_rpa`, `motivo_baja` |
| `fiscalia.mp_sujeto_situacion_juridica` | `pol_caso_persona_id` FK, `situacion_juridica_id`, `fecha_inicio` |
| `fiscalia.mp_sujeto_domicilio` | `pol_caso_persona_id` FK, `pais_id`, `municipio_id` |
| `fiscalia.mp_caso_fiscal` | `pol_caso_id` FK, `ci`, `tipo_responsable_id` |
| `fiscalia.mp_caso_actividad` | `pol_caso_id` FK, `actividad_id`, `archivo_hash`, `tipo_solicitud_id` (del metadata) |
| `fiscalia.mp_caso_juzgado` | `pol_caso_id` FK, `pol_caso_persona_id` FK nullable, `juzgado_id` (historial) |
| `fiscalia.mp_caso_agenda` | `pol_caso_id` FK, `oj_audiencia_id`, `juzgado_id`, `fecha_hora_inicio/fin` |
| `fiscalia.mp_reserva` | `tabla` (1/2/3), `tabla_id`, `estado`, `fecha_fin_reserva` (historial) |
| `fiscalia.mp_archivo` | `archivo_hash` UNIQUE, `extension`, `tamano`, `contenido_ref` (ruta local), `estado_descarga` |
| `fiscalia.mp_evento_recepcion` | **Bitácora de TODA petición**: endpoint, método, payload, respuesta, http_status, ip_origen, api_key_id, duración. Auditoría e investigación de incidencias. |

Ventaja del híbrido: los PATCH de edición solo actualizan columnas clave + hacen merge del JSONB;
nada se pierde y no hay que modelar hoy los ~90 campos (persona natural sola tiene 24).

### 3.4. Módulo NestJS aislado

```
src/application/fiscalia/
├── fiscalia.module.ts
├── guard/
│   └── api-key.guard.ts          ← header x-api-key vs env MP_API_KEYS (lista separada por coma)
├── controller/
│   ├── mp-caso.controller.ts     ← 3.1–3.6, 3.17, 3.18
│   ├── mp-sujeto.controller.ts   ← 3.7–3.12
│   ├── mp-fiscal.controller.ts   ← 3.13, 3.14
│   ├── mp-actividad.controller.ts← 3.15, 3.16
│   ├── mp-agenda.controller.ts   ← 3.16b, 3.19, 3.20
│   └── mp-archivo.controller.ts  ← 3.21
├── dto/                          ← validación class-validator de los payloads del requerimiento
├── entity/                       ← entidades TypeORM schema fiscalia (conexión DB_SIII)
├── repository/
└── service/
```

Aislamiento respecto a las APIs de la aplicación:

1. **Prefijo de ruta propio**: todos los controllers bajo `external/mp/…`
   (ej. `POST /api/external/mp/caso`). Nada comparte rutas con la app.
2. **`ApiKeyGuard` a nivel de módulo** (`@UseGuards(ApiKeyGuard)` en cada controller): valida
   header `x-api-key` contra `MP_API_KEYS` del `.env`. Sin JWT, sin Casbin. Si la key no
   coincide → 401. Cada key se identifica con un alias para la bitácora (`mp-prod`, `mp-test`).
3. **Swagger con tag separado** (`@ApiTags('MP → POL (Fiscalía)')`) y `@ApiSecurity('apikey')`;
   opcionalmente excluible del swagger público con una env (`SWAGGER_HIDE_EXTERNAL=true`).
4. **Interceptor de bitácora** propio del módulo que graba `mp_evento_recepcion` en cada request
   (entrada y salida), independiente del logger global.
5. **Formato de respuesta del convenio** `{ error, message, response, status }` implementado en
   un helper del módulo (NO se toca `BaseController` de la app).
6. (Recomendado, fuera de código) restringir en nginx/gateway el acceso a `external/mp/*` por IP
   de origen del MP.

### 3.5. Reglas de comportamiento

- **Idempotencia**: `mp_*_id UNIQUE`. Si el MP reenvía un POST con el mismo `mpCasoId`, se
  devuelve el `polCasoId` ya asignado (200, mismo response) en lugar de duplicar.
- **Validación en dos niveles**: DTO valida solo lo estructural (requeridos y tipos del
  requerimiento). Los IDs de catálogo del MP NO se validan contra catálogos locales en Fase A
  (aún no existen los mapeos) — se guardan tal cual.
- **Bajas lógicas**: los PATCH con `estado` actualizan la columna `estado`, nunca DELETE físico.
- **Reserva**: se guarda como historial en `mp_reserva` y se refleja como flag en la tabla
  correspondiente (`esta_reservado`).
- **Archivos (3.21)**: cuando llega una actividad con `archivoHash`, se registra en `mp_archivo`
  con estado `pendiente`; un job (o llamada síncrona configurable) descarga desde el MP
  (`GET {urlMP}/{archivoHash}?user=…`) y guarda el binario en disco
  (`MP_ARCHIVOS_PATH`), marcando `descargado`/`error`.

### 3.6. Variables de entorno nuevas

```
# ─── Interoperabilidad MP → POL (Fiscalía) ───
MP_API_KEYS=<alias1>:<key1>,<alias2>:<key2>   # keys aceptadas en x-api-key
MP_BASE_URL=https://<host-mp>                 # para descargar archivos (3.21)
MP_ARCHIVOS_PATH=/app/storage/mp              # almacenamiento local de archivos descargados
SWAGGER_HIDE_EXTERNAL=false
```

### 3.7. Fases de implementación sugeridas

| Fase | Alcance | Resultado |
|---|---|---|
| A1 | Schema `fiscalia` + script SQL, módulo, `ApiKeyGuard`, bitácora, endpoints de **Caso** (3.1, 3.2) | MP puede empezar a crear casos |
| A2 | Delitos, Sujetos, Situación jurídica, Domicilios, Abogados (3.3–3.12) | Núcleo del flujo completo |
| A3 | Fiscales, Actividades + metadata, Reserva (3.13–3.16) | Actos investigativos |
| A4 | Juzgados, Agenda de audiencias, Descarga de archivos (3.16b–3.21) | Flujo completo |
| B | Tablas de mapeo de catálogos MP↔FELCN + jobs de homologación hacia SIII | Datos utilizables por los módulos internos |

## 4. Decisiones pendientes (confirmar antes de implementar)

1. ¿Schema `fiscalia` en `felcn_siii` (recomendado) o BD nueva `felcn_mp`?
2. ¿Prefijo de ruta `external/mp` está bien, o el convenio exige rutas exactas
   (`/caso`, `/caso/delitos`, …) sin prefijo? — el documento dice `{urlPOL}/caso`, por lo que el
   `{urlPOL}` puede absorber el prefijo vía gateway.
3. ¿La API key la definimos nosotros o la entrega el MP? ¿Una sola o una por ambiente?
4. Descarga de archivos: ¿síncrona al recibir la actividad o job en segundo plano?
