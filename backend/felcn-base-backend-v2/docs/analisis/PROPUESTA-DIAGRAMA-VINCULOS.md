# Propuesta: Diagrama de vínculos (grafo de red) por caso — módulo S2I

Estado: **propuesta, sin implementar**. Pendiente bloqueante: tabla `flujo_transporte` (ver abajo).

## Objetivo

Visualizar, para un caso de investigación (`asignacion`), la red de entidades relacionadas
(blancos, flujos telefónicos, flujos de transporte, empresas, lugares, bienes) como un grafo
de nodos y aristas, similar al ejemplo de referencia en https://visjs.org (vis-network).

Debe ser simple, integrado al sistema existente (no un prototipo aparte), y permitir descarga
del resultado.

## Modelo de datos del grafo (verificado contra el código real en `develop`, commit `1088652f`)

Aclaración de nombres: el pedido original usaba nombres conceptuales (`caso`, `lugares`,
`lugares_empresas`) que no coinciden 1:1 con las tablas reales. Este documento usa los nombres
reales de tabla/entity.

```
caso (tabla: asignacion, PK id_caso)         label del nodo raíz: nro_caso_cer
 ├─ blanco (id_caso)                         label: alias / nombres, tooltip: numero_documento, país
 │    ├─ flujo_telefonico (id_blanco)        label: numero, tooltip: empresa, direccion        [EXISTE]
 │    ├─ flujo_transporte (id_blanco)        label: ?, tooltip: ?                               [NO EXISTE — ver pendiente]
 │    └─ lugar_blanco (id_blanco)            label: descripcion, tooltip: coordenas_x/y, contenido
 ├─ empresa (id_caso)                        label: nombre, tooltip: nit, matricula, representante
 │    └─ lugar_empresa (id_empresa)          label: descripcion, tooltip: coordenas_x/y, contenido
 └─ item_bien_investigado (id_caso)          label: tipo de bien (vía catálogo)
      ├─ item_bien_caracteristica (id_item_bien_secundario)   label: descripcion
      └─ lugar_bien (id_item_bien_secundario)                 label: descripcion, tooltip: coordenas_x/y
```

Notas de verificación:
- **NO** usar las tablas `telefono` (`S2iTelefono`) ni `vehiculo` (`S2iVehiculo`) — son legado,
  quedan fuera del alcance de este grafo. Se reemplazan por `flujo_telefonico` y `flujo_transporte`.
- `flujo_telefonico` cuelga de **`blanco`** (FK `id_blanco`), NO directo del caso. Entity:
  `src/application/sunesis/s2i/blanco/entity/flujo-telefonico.entity.ts`. Columnas: `id_flujo` (PK),
  `id_blanco` (FK), `empresa` (varchar 15), `direccion` (varchar 50), `numero` (varchar 15).
- `blanco.numero_documento` (varchar 20) ya existe en el código — es el campo candidato para
  cruces entre casos en una fase futura (ver "Fuera de alcance").
- `lugares` no es una tabla única: son 3 satélites 1-a-1 con FK real (`@ManyToOne`) —
  `lugar_blanco` (→blanco), `lugar_empresa` (→empresa), `lugar_bien` (→item_bien_investigado).
- `lugares_empresas` no es tabla puente many-to-many; es `lugar_empresa` con FK directa
  `id_empresa → empresa`.
- Ninguna de las tablas "hijas de caso" (`blanco`, `empresa`, `item_bien_investigado`) tiene
  relación TypeORM (`@ManyToOne`) declarada hacia `asignacion` — solo columna `id_caso` suelta.
  El servicio que arme el grafo debe hacer las queries explícitas por `id_caso`, no puede
  apoyarse en relaciones existentes.

## Pendiente bloqueante: `flujo_transporte`

No existe todavía en el código (ni tabla, ni entity, ni migration), en ningún backend del repo.
Debe crearse **análoga a `flujo_telefonico`**: colgando de `blanco` vía `id_blanco`, con
columnas propias del dominio de transporte (a definir — ej. placa, empresa transportista, ruta,
propietario). Falta:
1. Definir las columnas exactas.
2. Crear entity + migration + DTO + repository/service + controller (mismo patrón que
   `flujo-telefonico.entity.ts` / `blanco.controller.ts`).
3. Solo entonces se puede agregar como rama del grafo.

El resto del plan (grafo con lo demás: blanco, flujo_telefonico, lugares, empresa, bienes) no
depende de esto y se puede construir en paralelo.

## Arquitectura propuesta

**Fase 1 — Backend.** Nuevo endpoint `GET /s2i/caso/:id_caso/grafo` en el módulo `s2i/caso` de
`base-backend-v2`. Un service consulta cada tabla del árbol de arriba por `id_caso`/`id_blanco`
y arma directamente el JSON en formato que vis-network consume:
```
{
  nodes: [{ id, label, group, title }, ...],
  edges: [{ from, to }, ...]
}
```
`group` determina el color/forma en el frontend (un grupo por tipo de entidad). `title` es el
tooltip (HTML simple con los campos descriptivos de la tabla de arriba). `flujo_transporte` se
agrega a este service cuando la tabla exista, sin tocar el resto del endpoint.

**Fase 2 — Frontend.** Página nueva en `felcn-base-frontend`, probablemente bajo
`analisis/casos/[idCaso]/`, junto a los paneles ya existentes (`FlujoTelefonicoPanel.tsx`,
`SigPanel.tsx`, etc.). Usa `vis-network` (agregar a `package.json` como dependencia directa —
ya está como transitiva). Carga el JSON del endpoint y renderiza con
`new Network(container, data, options)`, siguiendo el ejemplo de visjs.org.

**Fase 3 — Descarga.**
- Imagen PNG: `canvas.toDataURL('image/png')` sobre el canvas que vis-network ya renderiza.
  Botón simple, sin backend adicional.
- JSON: el mismo payload `{nodes, edges}` del endpoint, para reabrir o importar en otra
  herramienta.
- (Opcional, no en esta fase) exportar a GEXF/GraphML si se necesita análisis de red más serio
  en herramientas externas como Gephi.

## Fuera de alcance de esta primera versión

**Cruce/deduplicación entre casos distintos** (ej. mismo `numero_documento` de blanco apareciendo
en dos casos, mismo lugar, misma empresa). Es un problema de entity-resolution, no solo de
consulta: requiere definir reglas de coincidencia por tipo de entidad (documento exacto vs.
nombre con tolerancia a typos, coordenadas con radio de tolerancia, NIT exacto, etc.), maneja
volumen distinto (query sobre toda la tabla, no por `id_caso`), y cambia la forma del grafo (deja
de ser árbol, nodos con más de un caso padre). Se aborda en una fase futura, con datos reales
delante para validar las reglas junto con el usuario del sistema, usando `blanco.numero_documento`
como llave candidata.

## Próximos pasos

1. Definir estructura de `flujo_transporte` (columnas) y crearla (entity + migration + DTO +
   service + controller), siguiendo el patrón de `flujo_telefonico`.
2. Implementar Fase 1 (endpoint de grafo) para todo lo que ya existe, dejando el nodo de
   `flujo_transporte` listo para conectarse en cuanto la tabla esté disponible.
3. Implementar Fase 2 (página frontend con vis-network).
4. Implementar Fase 3 (descarga PNG/JSON).
5. Evaluar Fase 4 (cruce entre casos) una vez validado lo anterior.
