# Propuesta: APIs Fiscalía (MP → POL) — contrato unificado

> Fecha: 2026-07-06 · Estado: **pendiente de aprobación**
> Reemplaza el contrato del documento del convenio ([REQUERIMIENTO-MP-POL.md](./REQUERIMIENTO-MP-POL.md))
> en cuanto a URIs, nomenclatura y códigos HTTP. La fiscalía aún no consume nada:
> nosotros definimos el contrato con buenas prácticas.

## 1. Decisiones de contrato (confirmadas con el equipo)

| Aspecto | Decisión |
|---|---|
| Nomenclatura de campos JSON (request y response) | **snake_case** (`mp_caso_id`, `tipo_denuncia_id`) |
| URIs | **REST anidado**: recursos en plural kebab-case, el id del padre en el path (no en el body) |
| Códigos HTTP | **201 + header `Location`** en creaciones, **204 No Content** en PATCH/PUT, **200** en GET; errores 400/404/409 |
| Objeto de respuesta | **REST puro, sin envoltura**: el body es el resultado directo; el código HTTP es la fuente de verdad |
| Errores | **RFC 9457 Problem Details** (`application/problem+json`) vía exception filter propio del módulo |
| Seguridad | **Sin API key ni JWT** — endpoints abiertos; el hub de interoperabilidad publica y aplica la seguridad |
| Auditoría | Toda petición queda en `fiscalia.mp_evento_recepcion` (endpoint, payload, respuesta, IP, duración) |
| Idempotencia | `mp_*_id` UNIQUE: reenvíos devuelven el mismo `pol_*_id` con 200 (no 201, no duplican) |
| Punto único de documentación | Swagger **`{host}/fiscalia/docs`** con recepción + catálogos (sin auth declarada) |
| Persistencia | Staging schema `fiscalia` en `felcn_siii` (columnas de correlación + payload JSONB completo); homologación a tablas SIII diferida (Fase B) |

Base de rutas: `/{PATH_SUBDOMAIN}/v1/external/fiscalia` (hoy `/api/v1/external/fiscalia`).

## 2. Estándar de respuesta (REST puro + RFC 9457)

**Creación (POST):** `201 Created` + header `Location` con la URI del recurso; el body es el
resultado directo (el mapeo de ids que necesita el MP):

```
POST /casos → HTTP 201
Location: /api/v1/external/fiscalia/casos/1

{ "pol_caso_id": 1 }
```

**Edición (PATCH/PUT):** `204 No Content`, sin body.

**Consulta (GET):** `200 OK`, el recurso o la lista directamente.

**Idempotencia en POST:** si el `mp_*_id` ya fue recibido, se responde `200 OK` (no 201) con el
mismo mapeo ya asignado — el reintento es visible en el código y no duplica.

**Errores:** `Content-Type: application/problem+json` (RFC 9457), con la extensión `errores`
para validación:

```
HTTP 400
{
  "type": "about:blank",
  "title": "Errores de validación",
  "status": 400,
  "detail": "El body contiene campos inválidos",
  "errores": { "cud": ["cud es requerido"] }
}

HTTP 404
{
  "type": "about:blank",
  "title": "Recurso no encontrado",
  "status": 404,
  "detail": "No existe un caso con pol_caso_id 999"
}
```

## 3. Endpoints de recepción MP → POL (18)

Los bulk (delitos, sujetos, abogados, situaciones, fiscales, actividades) reciben una lista y
responden el mapeo `mp_*_id → pol_*_id` por elemento.

| # | Convenio | Método y URI | HTTP OK | Body de respuesta |
|---|---|---|---|---|
| 1 | 3.1 | `POST /casos` | 201 | `{ pol_caso_id }` |
| 2 | 3.2 | `PATCH /casos/{pol_caso_id}` | 204 | — |
| 3 | 3.3 + 3.5 | `POST /casos/{pol_caso_id}/delitos` | 201 | `{ delitos: [{ mp_caso_delito_id, pol_caso_delito_id }] }` |
| 4 | 3.4 + 3.6 | `PATCH /delitos/{pol_caso_delito_id}` | 204 | — |
| 5 | 3.7 | `POST /casos/{pol_caso_id}/sujetos` | 201 | `{ sujetos: [{ mp_caso_persona_id, pol_caso_persona_id }] }` |
| 6 | 3.8 | `PATCH /sujetos/{pol_caso_persona_id}` | 204 | — |
| 7 | 3.9 | `POST /sujetos/{pol_caso_persona_id}/abogados` | 201 | `{ abogados: [{ mp_caso_persona_abogado_id, pol_caso_persona_abogado_id }] }` |
| 8 | 3.10 | `PATCH /abogados/{pol_caso_persona_abogado_id}` | 204 | — |
| 9 | 3.11 | `POST /sujetos/{pol_caso_persona_id}/situaciones-juridicas` | 201 | `{ situaciones_juridicas: [{ mp_caso_persona_situacion_juridica_id, pol_caso_persona_situacion_juridica_id }] }` |
| 10 | 3.12 | `POST /sujetos/{pol_caso_persona_id}/domicilios` | 201 | `{ pol_persona_residencia_id }` |
| 11 | 3.13 | `POST /casos/{pol_caso_id}/fiscales` | 201 | `{ fiscales: [{ mp_caso_funcionario_id, pol_caso_funcionario_id }] }` |
| 12 | 3.14 | `PATCH /fiscales/{pol_caso_funcionario_id}` | 204 | — |
| 13 | 3.15 | `POST /casos/{pol_caso_id}/actividades` | 201 | `{ actividades: [{ mp_caso_actividad_id, pol_caso_actividad_id }] }` |
| 14 | 3.16 | `POST /reservas` | 201 | `{ pol_reserva_id }` |
| 15 | 3.17 | `POST /casos/juzgado` | 201 | — |
| 16 | 3.18 | `POST /sujetos/juzgado` | 201 | — (bulk: `pol_caso_persona_ids[]`) |
| 17 | 3.19 | `POST /casos/{pol_caso_id}/agendas` | 201 | `{ pol_agenda_id }` |
| 18 | 3.16b + 3.20 | `PATCH /agendas/{pol_agenda_id}` | 204 | — |

Notas de diseño:

- **Delitos inicial vs principal (3.3/3.5)**: el convenio los define como el mismo endpoint con
  campos extra; se unifican — `es_principal` y `es_tentativo` son opcionales en el POST y el
  PATCH acepta `es_principal?`, `es_tentativo?`, `estado`.
- **"Investigadores" del convenio son fiscales**: la URI usa `fiscales` (nombre real del recurso).
- **Reserva (3.16)**: `POST /reservas` con body `{ estado, tabla, tabla_id, fecha_fin_reserva? }`
  (`tabla`: 1=caso, 2=sujeto, 3=actividad). Se guarda historial y se refleja el flag en el
  recurso correspondiente.
- **Juzgados (3.17/3.18)**: `POST` según la Ficha Técnica (id de caso/sujetos va en el body, no
  en la URL); cada llamada agrega un registro al historial en staging y el vigente es el más
  reciente.
- **Agenda (3.16b/3.20)**: el convenio trae dos variantes de PATCH; se unifica en un solo DTO con
  la unión de campos (todos opcionales salvo los requeridos comunes).
- **Sujetos**: `persona_natural` XOR `persona_juridica` (validación custom); el objeto completo
  va al payload JSONB.
- **Actividades**: `meta_data` polimórfico según `tipo_solicitud_id` (detención preventiva,
  sentencia, medidas de protección, plazos, baja) — se valida lo estructural y se conserva
  íntegro en JSONB.
- Descarga de archivos (3.21): **fuera de alcance** (decisión previa).

### Ejemplo — POST /casos

```
POST /api/v1/external/fiscalia/casos
Content-Type: application/json

{
  "cud": "LP2600123",
  "mp_caso_id": 100,
  "mp_caso_padre_id": null,
  "tipo_denuncia_id": 1,
  "creacion_fecha_hora": "2026-07-06T09:00:00Z",
  "esta_reservado": false,
  "oficina_comun_id": 5,
  "hecho_municipio_id": 20101,
  "hecho_zona": "Zona Central",
  "hecho_relato": "…",
  "caso_estado_id": 1,
  "caso_etapa_id": 1,
  "tags": ["misiles", "china"]
}

HTTP/1.1 201 Created
Location: /api/v1/external/fiscalia/casos/1

{ "pol_caso_id": 1 }
```

## 4. Catálogos (16) — unificados en el mismo punto

Los catálogos que la otra rama expuso en `catalogo-fiscalia/*` (fachada sobre los services
`lgi/parametro/*`) se mueven bajo el mismo prefijo, en plural kebab-case, con la misma envoltura:

```
GET /v1/external/fiscalia/catalogos/unidades
GET /v1/external/fiscalia/catalogos/bienes
GET /v1/external/fiscalia/catalogos/clases
GET /v1/external/fiscalia/catalogos/caracteristicas
GET /v1/external/fiscalia/catalogos/tipos
GET /v1/external/fiscalia/catalogos/juridicas
GET /v1/external/fiscalia/catalogos/situaciones-legales
GET /v1/external/fiscalia/catalogos/recursos
GET /v1/external/fiscalia/catalogos/etapas
GET /v1/external/fiscalia/catalogos/estados
GET /v1/external/fiscalia/catalogos/tipos-persona
GET /v1/external/fiscalia/catalogos/contenidos-caso
GET /v1/external/fiscalia/catalogos/grados
GET /v1/external/fiscalia/catalogos/tamanos-documento
GET /v1/external/fiscalia/catalogos/contenidos-bien
GET /v1/external/fiscalia/catalogos/calidades-bien
```

Respuesta: `200 OK` con la **lista directa** `[ { "id": 1, "descripcion": "…" }, … ]`, campos de
cada ítem en **snake_case** (se mapea desde las entidades; no se exponen los prefijos legacy tipo
`uniAbrev` → se expone `abreviatura`, `descripcion`, etc.).

El módulo `catalogo-fiscalia` de develop **se elimina** (nada lo consume aún); los CRUD internos
`lgi/parametro/*` con JWT quedan intactos (son del producto 2). Se corrige de paso el bug del
catálogo `recursos` (inyecta el service de situación legal en develop).

## 5. Persistencia (extensión del schema `fiscalia`)

Mismo patrón ya aplicado en `mp_caso`: `pol_*_id BIGSERIAL PK`, `mp_*_id BIGINT UNIQUE`,
columnas de correlación, `estado SMALLINT`, `homologado BOOLEAN`, `payload JSONB`, timestamps.

Tablas nuevas: `mp_caso_delito`, `mp_caso_sujeto`, `mp_sujeto_abogado`,
`mp_sujeto_situacion_juridica`, `mp_sujeto_domicilio`, `mp_caso_fiscal`, `mp_caso_actividad`,
`mp_caso_juzgado` (historial, caso y sujeto), `mp_caso_agenda`, `mp_reserva` (historial).
Script: `database/scripts/fiscalia.sql` (extendido, idempotente con `IF NOT EXISTS`).

## 6. Estructura del módulo

```
src/application/fiscalia/
├── fiscalia.module.ts
├── controller/
│   ├── mp-caso.controller.ts        ← casos, juzgado caso
│   ├── mp-delito.controller.ts
│   ├── mp-sujeto.controller.ts      ← sujetos, abogados, situaciones, domicilios, juzgado sujetos
│   ├── mp-fiscal.controller.ts
│   ├── mp-actividad.controller.ts
│   ├── mp-agenda.controller.ts
│   ├── mp-reserva.controller.ts
│   └── catalogo.controller.ts       ← 16 GET (fachada sobre services lgi/parametro)
├── dto/            ← snake_case en propiedades (coincide 1:1 con el JSON)
├── entity/         ← + nuevas entidades staging
├── repository/
├── service/
├── filter/
│   └── fiscalia-exception.filter.ts ← errores RFC 9457 (application/problem+json)
├── interceptor/
│   └── evento-recepcion.interceptor.ts (ya existe; se quita el alias de API key)
└── interface/problem-details.interface.ts (reemplaza a respuesta-convenio)
```

Cambios respecto a lo ya implementado en `develop-fase1-v2`:
- Se **elimina `ApiKeyGuard`** y la variable `MP_API_KEYS` (seguridad delegada al hub).
- DTOs y responses pasan de camelCase a **snake_case**.
- URIs pasan de `caso` a `casos` (plural REST).
- Se elimina la envoltura `{error, message, response, status}`: POST crear → **201 + Location +
  resultado directo**, PATCH/PUT → **204 sin body**, errores → **RFC 9457**.
- Swagger: documento separado `fiscalia/docs` (adoptando el `swagger.config.ts` de develop) con
  `include: [FiscaliaModule]`; se retira el `addBearerAuth()` de ese documento.

## 7. Plan de integración a `develop`

1. Crear rama `feat/backend/fase2/fiscalia-mp-pol` **desde `origin/develop`** (ya contiene los
   catálogos LGI y el refactor de swagger).
2. Portar el módulo `fiscalia` + docs + SQL desde `develop-fase1-v2` (es autocontenido; evita
   arrastrar a develop el resto del trabajo de fase1-v2).
3. Aplicar este contrato: renombrar URIs, snake_case, 201, filter de errores, quitar API key,
   catálogo unificado, eliminar módulo `catalogo-fiscalia`, corregir bug `recursos`, lint.
4. Extender `database/scripts/fiscalia.sql` y aplicarlo en `felcn_siii`.
5. Pruebas end-to-end de los 18 + 16 endpoints en contenedor paralelo (puerto 3333).
6. PR a `develop`.

## 8. Fases de implementación

| Fase | Endpoints | Comentario |
|---|---|---|
| 1 | Infraestructura (filter, swagger, quitar apikey) + refactor casos (1–2) + catálogos (16) | Deja el contrato base validable |
| 2 | Delitos (3–4), Sujetos (5–6), Abogados (7–8), Situaciones (9), Domicilios (10) | Núcleo del flujo |
| 3 | Fiscales (11–12), Actividades (13), Reservas (14) | Actos investigativos |
| 4 | Juzgados (15–16), Agendas (17–18) | Cierre del flujo |
