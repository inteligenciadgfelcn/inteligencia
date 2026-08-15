# Manual de usuario — Parte 2: Sistema de Inteligencia

## Sistema Nacional de Inteligencia — FELCN

> Este documento cubre los módulos operativos del sistema: Operativos, Inteligencia, Filiación de Personas, Interoperabilidad, Casos X, Legitimación de Ganancias Ilícitas, Investigación Financiera, Seguimiento de Casos Jurídicos, Reportes y Análisis de Información de Inteligencia (S2I). Para el acceso al sistema y la gestión de usuarios/roles, ver la [Parte 1 — Autenticación y Autorización](./01-autenticacion-y-autorizacion.md).
>
> El acceso a cada módulo descrito aquí depende del rol y los permisos del usuario (Parte 1, §1 y §5); es normal que un usuario no vea en su menú todos los módulos aquí documentados. El orden de las secciones sigue el orden real del menú del sistema.
>
> Las capturas de pantalla están pendientes de incorporar; cada punto donde corresponde una se marca así: `📷 Captura pendiente — [pantalla]`.
>
> **Convención de campos**: un asterisco (\*) indica campo obligatorio. Los campos marcados "(cascada)" dependen de una selección previa (por ejemplo, elegir primero Unidad habilita las opciones de Distrital).
>
> **Convención de advertencias**: algunas pantallas de este sistema tienen funciones incompletas o no conectadas a una base de datos real. Se marcan siempre así — `⚠️ **No disponible / No funcional**` — con la indicación de qué hacer en su lugar. Esta información proviene de una verificación directa del código del sistema, no de un supuesto.

---

## 1. Operativos

Módulo de registro y seguimiento de operativos policiales: datos generales, sustancias incautadas, personas implicadas, bienes secuestrados y evidencia fotográfica.

### 1.1 Listado de Operativos

Ruta: **Operativos → Registro y Listado**.

Muestra los casos con sus operativos asociados, agrupados por estado: aprobados, no aprobados y con CUD (Código Único de Denuncia) asignado.

`📷 Captura pendiente — Listado de operativos con las pestañas de estado`

Desde el listado:

- **Enviar a Fiscalía**: registra el CUD (Código Único de Denuncia, hasta 15 caracteres) que vincula el caso con el Ministerio Público.
- Acceso al **PDF del reporte del operativo** (compila toda la información registrada en las ocho secciones del formulario, ver §1.2).

### 1.2 Registro y edición de un Operativo

Ruta: **Operativos → Registro y Listado → (caso) → Registrar/Editar**.

El formulario está organizado en ocho secciones, navegables como pestañas dentro del mismo caso. Los datos se guardan por sección.

**Sección 1 — Datos Generales**

| Campo | Detalle |
|---|---|
| Nro. de Informe* | |
| Relevancia* | |
| Unidad → Distrital → Grupo* | Cascada según estructura organizacional |
| Categoría → Ítem Operativo* | Cascada |
| Tipo de Operación* | |
| Plan de Operaciones* | |
| Tipo de Denuncia* | |
| Tipo Penal* | |
| Al mando de* | |
| Departamento → Provincia → Municipio* | Cascada |
| Dirección* | |
| Latitud / Longitud* | Se puede ubicar directamente en el mapa interactivo o buscar una dirección |
| Detalle* | |

`📷 Captura pendiente — Sección Datos Generales con el mapa de ubicación`

**Sección 2 — Drogas, Fotografía y Logotipos**

| Campo | Detalle |
|---|---|
| Tipo → Estado de Droga* | Cascada |
| Cantidad, Costo* | |
| Sólido / Líquido | El formulario cambia los campos siguientes según la opción elegida |
| Forma de Transporte* | |
| País de Origen / Destino* | |
| 2 fotografías* | |

Sub-panel **Logotipos** (marcas/organizaciones identificadas en la droga incautada): Imagen*, Descripción*, Organización*, Blanco (vínculo con un caso de Análisis, si corresponde), Observación*, Foto*.

**Sección 3 — Sustancias Sólidas**: Tipo*, Costo*, cantidad en Toneladas/Kilos/Gramos/Miligramos.

**Sección 4 — Sustancias Líquidas**: Tipo*, Costo*, cantidad en Litros/Mililitros.

**Sección 5 — Laboratorios**: Tipo → Modelo de Fábrica* (cascada), Cantidad*.

**Sección 6 — Personas**: Nombres*, Apellidos*, Tipo de Implicado*, Género*, Tipo y Número de Documento*, Fecha de Nacimiento*, Dirección*, Nacionalidad*, hasta 3 fotografías*.

**Sección 7 — Bienes**: Bien → Clase → Tipo* (cascada), Cantidad*, Costo Aproximado*, ¿En investigación? (Sí/No)*, Foto. Sub-panel de **Características** por bien: Característica*, Descripción*.

**Sección 8 — Galería**: Descripción*, Foto* — imágenes generales del operativo no asociadas a una sección específica.

`📷 Captura pendiente — Navegación entre las ocho secciones del formulario`

> ⚠️ **No disponible / No funcional**: el botón **"Pesaje"** de la sección Drogas no guarda la información ingresada. No debe utilizarse como registro oficial del pesaje; documentar el dato por el medio alternativo que la unidad tenga establecido.

### 1.3 Patrimonio de Bienes de un Operativo

Ruta: **Operativos → (caso) → Patrimonio**.

Permite registrar el costo aproximado (en dólares) de cada bien secuestrado del operativo y ver el total cuantificado, aplicando un tipo de cambio (editable, con un valor de referencia precargado).

### 1.4 Búsqueda de Patrimonio

Búsqueda de operativos por: Mis Casos, Número de Caso, Investigador, Nombre, Número de Pérdida de Dominio, o Número de Operativo — para acceder directamente al detalle patrimonial (§1.3) de un caso específico. El mismo mecanismo de búsqueda se reutiliza en otros módulos de este manual.

---

## 2. Inteligencia

Módulo de gestión de servicios de inteligencia: apertura de turno de servicio, asignación de número de caso y actualización del caso durante la investigación.

### 2.1 Creación del servicio

Ruta: **Inteligencia → Creación del servicio**.

Registra la apertura de un turno de servicio, requisito para poder asignar casos (§2.2).

| Campo | Detalle |
|---|---|
| Servicio entrante* | Selección del funcionario |
| Nro. de Pase | Autocompletado según el funcionario elegido |
| Servicio de emergencia* | Selección del funcionario de emergencia |
| Nro. de Pase emergencia | Autocompletado |
| Fecha y hora de Ingreso* | |
| Fecha y hora de Salida* | |
| Código de servicio | Se genera con el botón correspondiente una vez completadas las fechas |

`📷 Captura pendiente — Formulario de Creación del servicio`

### 2.2 Asignación de caso

Ruta: **Inteligencia → Asignación de caso**.

> Para registrar un caso, el usuario debe tener un **servicio activo** (§2.1). Si no lo tiene, el sistema bloquea el formulario e indica que no hay un servicio asignado.

| Campo | Detalle |
|---|---|
| Código de servicio | Autocompletado del servicio activo |
| Nro. de Pase | Autocompletado |
| Departamento* | |
| Unidad* | |
| Distrital* | Cascada de Unidad |
| Grupo* | Cascada de Distrital |
| Nro. de Registro* | Se genera con el botón "Asignar número de registro" |
| Nombre operativo* | |
| Fecha y hora del operativo* | |
| Quién realiza la solicitud* | Cascada de Grupo |
| Nro. celular | Autocompletado |
| Asignado al caso* | Cascada de Grupo |
| Nro. celular | Autocompletado |
| Fiscal asignado* | |
| Nro. celular fiscal* | |

`📷 Captura pendiente — Formulario de Asignación de caso`

> ⚠️ **No disponible / No funcional**: el botón "Confirmar" del cuadro de activar/inactivar un caso registrado no realiza ninguna acción — el caso conserva su estado actual aunque se presione. Para cambios de estado del caso, utilizar los medios administrativos habituales de la unidad hasta que esta función se habilite.

### 2.3 Actualización del caso

Ruta: **Inteligencia → Actualización del caso**.

Muestra dos listados — "Casos ingresados" y "Casos pendientes de registro" — y un formulario para asignar el número de caso definitivo:

| Campo | Detalle |
|---|---|
| Letras Principal Aprendido* | |
| Código Departamento* | Autocompletado de la fila seleccionada |
| Nro. de Registro* | Autocompletado |
| Continuación del Caso | Sí / No — "No" genera automáticamente un nuevo número |
| Nro Caso* | Editable o generado automáticamente |

El botón **"Editar caso"** de cada fila lleva al formulario de registro de Operativos (§1.2) para continuar cargando la información del caso.

> ⚠️ **No disponible / No funcional**: el botón "Generar reporte" de esta pantalla no pudo confirmarse como funcional durante la verificación del sistema. Si al usarlo no se genera el PDF esperado, reportarlo al equipo técnico en vez de reintentar repetidamente.

### 2.4 Lista de servicios

Ruta: **Inteligencia → Lista de servicios**.

Listado de todos los servicios registrados (§2.1), con búsqueda y orden.

> ⚠️ **No disponible / No funcional**: el ícono de exportar a PDF de cada fila no genera el archivo (error del sistema al presionarlo). No usar esta función; si se requiere el dato en PDF, solicitarlo al equipo técnico.

### 2.5 Antecedentes

Ruta: **Inteligencia → Antecedentes**.

Búsqueda de antecedentes por al menos uno de los siguientes campos: Cédula de Identidad, Nombre, Apellido Paterno, Apellido Materno. Devuelve los operativos en los que la persona buscada aparece registrada.

### 2.6 Búsqueda por número operativo

Ruta: **Inteligencia → Búsqueda por número operativo**.

Ingresar el número de caso para ver el detalle completo del operativo asociado (datos generales, personas, bienes, drogas, sustancias, vehículos).

---

## 3. Filiación de Personas

Módulo de registro de datos filiatorios (fenotipo, huellas, antecedentes familiares) de personas detenidas o aprehendidas en un operativo.

### 3.1 Fenotipos

Ruta: **Filiación de Personas → Fenotipos**.

1. Buscar por número de caso — se listan las personas del operativo aún no filiadas.
2. Seleccionar una persona para abrir el formulario completo de filiación:

   | Sección | Campos |
   |---|---|
   | Datos personales | Estado de la persona* (Arrestado / Aprehendido / LGI o Pérdida de Dominio / Principal aprehendido), Lugar del operativo*, Nombres y apellidos*, Nacionalidad*, Género*, Profesión u ocupación*, Alias*, Tipo y Número de Documento*, Expedido en*, Fecha de nacimiento*, Dirección*, Estado civil*, Lugar de nacimiento*, Contrastado con SEGIP* (Sí/No), Observación, Tarjeta prontuario* (Sí/No), Condición de la persona* |
   | Fenotipo | Estatura*, Peso corporal*, Señas particulares*, Tatuajes, Tipo de nariz*, Constitución*, Color de piel*, Color de cabello*, Tipo de cabello*, Color de ojos*, Tipo de ojos* |
   | Fotografías | Foto frontal*, Foto perfil izquierdo*, Foto perfil derecho* (las tres obligatorias) |
   | Huellas dactilares | Captura mediante el lector conectado al equipo; se guarda de forma independiente al resto del formulario |

`📷 Captura pendiente — Formulario de Fenotipos, con la captura de huellas`

> **Nota**: el registro de filiación de una persona con estado distinto a "Arrestado" (es decir, Aprehendido, LGI/Pérdida de Dominio o Principal aprehendido) no queda reflejado en el listado de arrestados de otros módulos del sistema — es un comportamiento esperado según el estado elegido, no un error.

### 3.2 Parentescos

Ruta: **Filiación de Personas → Parentescos**.

Buscar por número de caso — se listan las personas ya filiadas (§3.1). Al seleccionar una persona:

- **Datos familiares**: Parentesco*, Nombres y apellidos*, Edad*, Dirección*, Teléfono*, ¿Con vida? (Sí/No), ¿Implicado? (Sí/No).
- **Nombres supuestos**: Nombres*, Apellido Paterno*, Apellido Materno*, Apellido de esposo*.

### 3.3 Tarjeta prontuaria

Ruta: **Filiación de Personas → Tarjeta prontuaria**.

Buscar por número de caso, seleccionar una persona ya filiada y descargar directamente su tarjeta prontuaria en PDF (no requiere formulario adicional).

---

## 4. Interoperabilidad

Módulo de consulta a plataformas de otras entidades del Estado.

### 4.1 INRA

Ruta: **Interoperabilidad → INRA**.

Consulta de información de títulos de propiedad ante el Instituto Nacional de Reforma Agraria.

| Campo | Detalle |
|---|---|
| Tipo de búsqueda* | Número de Título / Número de Identificación |
| Valor de búsqueda* | |

`📷 Captura pendiente — Formulario de consulta INRA`

### 4.2 ITV

Ruta: **Interoperabilidad → ITV**.

| Campo | Detalle |
|---|---|
| Tipo de búsqueda* | Placa / Cédula de Identidad / Número de Licencia |
| Valor* | |

> ⚠️ **No disponible / No funcional**: esta pantalla **siempre muestra el mismo resultado de ejemplo**, sin importar el dato que se busque. Actualmente no consulta información real. No utilizar los resultados de esta pantalla para ninguna gestión — la consulta real a la plataforma de ITV debe hacerse por el medio alternativo que la unidad tenga establecido hasta que esta conexión se habilite.

---

## 5. Casos X

Módulo de registro rápido de operativos con personas detenidas, orientado a consulta cruzada.

### 5.1 Registro

Ruta: **Casos X → Registro**.

Flujo en 3 pasos:

1. **Buscar caso** por número de caso.
2. **Datos del operativo**: Código de radiograma*, Fecha y hora del operativo*, Departamento*, Provincia* (cascada), Municipio* (cascada), Localidad o Dirección*, Categoría* (cascada), Ítem operativo* (cascada), Unidad operativa*, Distrito operativo* (cascada), Grupo operativo* (cascada), Al mando de*, Resumen*.
3. **Registrar persona(s) detenida(s)**: Nombres*, Apellido Paterno*, Apellido Materno*, Apellido de esposo, País*, Sexo*, Dirección*, Tipo y Número de Documento*, Estado*.

`📷 Captura pendiente — Los 3 pasos del Registro de Casos X`

> ⚠️ **Advertencia de datos**: en la pantalla de personas detenidas de un caso, el listado que se muestra puede incluir personas registradas en **otros** operativos, no solo del caso que se está viendo — es una limitación conocida del sistema, en revisión. Verificar siempre el número de caso/operativo de cada fila antes de tomarla como referencia.
>
> ⚠️ **Advertencia de catálogo**: es posible que el listado desplegable "Unidad operativa" de esta pantalla no refleje el catálogo específico de Casos X — en revisión. Si el campo dependiente "Distrito operativo" aparece vacío o con opciones inesperadas después de elegir una Unidad, reportarlo al equipo técnico antes de continuar el registro.

### 5.2 Listado

Ruta: **Casos X → Listado**.

Listado de solo consulta de los operativos registrados en este módulo, con acceso al detalle de cada uno.

---

## 6. Legitimación de Ganancias Ilícitas (LGI)

> ⚠️ **Módulo no disponible**: las tres pantallas de este módulo (Agregar personal, Ingreso caso nuevo, Inicio investigación) **no guardan información real** — muestran catálogos y listados de ejemplo, y cualquier dato ingresado se pierde al salir o recargar la pantalla. **No debe utilizarse para el registro oficial de casos de Legitimación de Ganancias Ilícitas.** Para esa gestión, usar el módulo **Investigación Financiera → LGI** (§7.2, sistema heredado con base de datos real, aunque también con limitaciones — ver esa sección) o el procedimiento manual que la unidad tenga establecido, hasta que este módulo quede habilitado.

Se documenta su navegación por completitud:

- **Agregar personal** (`LGI → Agregar personal`): formulario para registrar un funcionario habilitado a ingresar información al sistema LGI.
- **Ingreso caso nuevo** (`LGI → Ingreso caso nuevo`): formulario de registro de un nuevo caso LGI (regional, grupo, funcionarios asignados, tipo de caso, tipo de delito, fechas, número de caso).
- **Inicio investigación** (`LGI → Inicio investigación`): listado y detalle de investigaciones (pestañas Caso precedente, Personas naturales, Personas jurídicas, Bienes secuestrados), de solo lectura.

---

## 7. Investigación Financiera

### 7.1 Investigación Paralela

Ruta: **Investigación Financiera → Paralela**.

1. Buscar el caso operativo de origen (mismo mecanismo de búsqueda que §1.4).
2. Completar el formulario de investigación paralela:

   | Campo | Detalle |
   |---|---|
   | Delito Precedente* | Selección fija, conforme a la Ley 1008 (3 opciones) |
   | Fecha de Envío a Fiscalía* | Por defecto, la fecha actual |
   | Detalle del Delito Precedente* | Texto libre |
   | Informe de Inteligencia Financiera* | Texto libre |

`📷 Captura pendiente — Formulario de Investigación Paralela`

3. El listado (**Investigación Financiera → Paralela → Listado**) permite ver los casos agrupados por resultado: en análisis, judicializados o desestimados.

### 7.2 LGI (sistema legado GIAEF)

Ruta: **Investigación Financiera → LGI**.

Este módulo conserva el sistema de Legitimación de Ganancias Ilícitas heredado (GIAEF), con su propio catálogo organizacional independiente del resto del sistema, y **sí tiene base de datos real** (a diferencia del módulo LGI de nivel superior, §6).

- **Ingreso**: búsqueda de casos por Mis Casos, Número de Caso FELCN, GIAEF, Fiscalía o Nombre, o Número de Pérdida de Dominio.
- **Detalle de caso**: actualmente de **solo lectura**.

  > ⚠️ **No disponible / No funcional**: la captura y edición de datos de esta pantalla está pendiente de habilitar.

- **Operativo**: muestra los operativos vinculados al caso.

  > ⚠️ **No disponible / No funcional**: la selección para continuar el flujo desde aquí está pendiente de habilitar.

- **Listado**: pantalla en desarrollo, aún no disponible.

> Para gestión activa de investigaciones de este tipo, utilizar Investigación Paralela (§7.1) mientras se completa este módulo.

---

## 8. Seguimientos de Casos Jurídicos

Ruta: **Seguimientos Casos Jurídicos → Seguimiento**.

### 8.1 Búsqueda de un caso

Buscar por Número de Caso, Nombre del Caso, o por rango de fechas (Desde–Hasta).

### 8.2 Detalle del caso

El detalle se organiza en tres pestañas:

**Pestaña Casos**

| Sub-sección | Campos principales |
|---|---|
| Actualización del Informe | CUD Fiscalía, Número de Pérdida de Dominio, Etapa*, Informe/Detalle |
| Cuaderno de Investigación Digital | Categoría*, Nombre*, Tipo*, Archivo* (máximo 10 MB) |
| Servidores Policiales | Grado*, Nombre y Apellidos* |
| Jurisdicción del Caso | Fecha*, Jurisdicción*, Observación |
| Control Jurisdiccional | Fecha de Inicio*, Juzgado*, Juzgado Mixto, Juzgado de Ejecución Penal, Tribunal de Sentencia |
| Investigadores Asignados | Fecha*, Grado*, Nombre*, Celular, Teléfono |
| Fiscales Asignados | Fecha*, Nombre*, Celular, Teléfono |

`📷 Captura pendiente — Pestaña Casos del detalle de Seguimiento`

**Pestaña Personas**

| Sub-sección | Campos principales |
|---|---|
| Situación Legal | Fecha*, Situación Legal*, Número de Resolución, Departamento/Provincia/Lugar*, Autoridad/Juez*, Juzgado* |
| Etapa del Proceso | Fecha*, Etapa → Estado* (cascada), Número de Resolución*, Lugar*, Autoridad*, Fiscalía/Juzgado* |

**Pestaña Bienes**

| Sub-sección | Campos principales |
|---|---|
| Bienes Secuestrados | Fiscal*, Fecha del Acta*, Investigador* |
| Bienes Incautados | Número de Resolución*, Fecha*, Autoridad* |
| Bienes Confiscados | Número de Sentencia*, Fecha*, Autoridad* |
| Pérdida de Dominio | Fiscalía*, Fecha*, A Requerimiento de* |
| Entrega o Devolución | Fecha de Requerimiento*, Fiscal*, Condición Legal*, Fecha de Entrega*, Responsable de Entrega/Recepción*, Institución*, Ubicación* |
| Cuaderno de Investigación Digital | Categoría*, Nombre*, Tipo*, Archivo* (máximo 10 MB) |

`📷 Captura pendiente — Pestañas Personas y Bienes del detalle de Seguimiento`

---

## 9. Reportes

Ruta: **Reportes**.

### 9.1 Búsqueda Cruzada

Ruta: **Reportes → Reportes Cruzados**.

Ocho modos de búsqueda independientes, cada uno con su propio criterio: por fecha, por caso, por tipo de droga, por estado de droga, por tipo de operativo, por relevancia, por aprehendido, por arrestado.

`📷 Captura pendiente — Selector de modo de búsqueda cruzada`

### 9.2 Búsqueda Avanzada

Ruta: **Reportes → Avanzado**.

Formulario con cerca de 40 filtros combinables, organizados en 7 secciones: datos del caso, clasificación, geografía, droga, persona, bienes e indicadores. Permite exportar el resultado a PDF.

### 9.3 Cuadro de Resultados

Ruta: **Reportes → Cuadros**.

Seis modos de búsqueda: por servicio, por fecha, por tipo de droga, por tipo de operativo, por relevancia, por persona. Presenta los resultados en formato de cuadro resumen.

---

## 10. Análisis de Información de Inteligencia (S2I)

Ruta: **Análisis de Información de Inteligencia**.

### 10.1 Casos Investigados — Alta de caso

Ruta: **Análisis → Casos Investigados → Nuevo**.

| Campo | Detalle |
|---|---|
| País* | |
| Lugar* | |
| Nombre del Caso* | |
| Estado* | |
| Etapa de Investigación* | |
| Fecha de Inicio* | |
| Palabra Clave | |
| Número Correlativo / CER | |
| Antecedentes* | |

### 10.2 Detalle del Caso

Ruta: **Análisis → Casos Investigados → (caso)**.

El detalle se organiza en pestañas: **Blancos**, **Organizaciones** y **Bienes**.

**Pestaña Blancos** (personas de interés del caso):

| Sub-sección | Campos principales |
|---|---|
| Datos del Blanco | Nombres*, Apellido Paterno*, Apellido Materno, Apellido de Esposo, Alias, Número de Documento*, País* |
| Foto | Imagen del blanco |
| Antecedentes | Tipo de Delito*, País*, Lugar*, Número de Caso*, Fecha*, Descripción* |
| Redes Sociales | Tipo de Red* (selección fija), Usuario o Dirección* |
| Ubicación (SIG) | Descripción*, Latitud/Longitud* (mapa), Contenido* |
| Archivos | Tipo de Contenido*, Tipo*, Nombre*, Archivo* |
| Flujo Telefónico | Empresa*, Dirección*, Número* — con detalle ampliado de llamadas cuando la información proviene de Fiscalía (17 campos: servicio, registro, fecha/hora, duración, y datos de cada extremo de la llamada) |
| Activo Patrimonial | Tipo de Activo*, Gestión*, Archivo*, Contenido* |
| OVISE | Lugar*, Latitud/Longitud*, Acción*, Reporte*, Archivo |

`📷 Captura pendiente — Pestaña Blancos con sus sub-secciones`

**Pestaña Organizaciones**:

| Sub-sección | Campos principales |
|---|---|
| Datos de la Organización | Tipo de Organización*, Nombre/Razón Social*, NIT, Matrícula, Representante Legal, Observaciones |
| Ubicación (SIG) / Archivos | Mismos paneles que en Blancos |

**Pestaña Bienes**:

| Sub-sección | Campos principales |
|---|---|
| Datos del Bien | Bien → Clase → Tipo* (cascada), Tipo de Investigación* |
| Características | Característica*, Descripción* |
| Ubicación (SIG) / Archivos | Mismos paneles que en Blancos |

### 10.3 Reportes de Casos

Ruta: **Análisis → Reportes Casos**.

Filtro por Nombre del Caso, Estado y/o Antecedente (todos opcionales). Permite ver el detalle completo del caso, su información geográfica (SIG) en mapa, exportar a PDF, y consultar los **vínculos cruzados**: coincidencias de un blanco o una organización del caso (por documento o NIT) con otros casos del sistema.

### 10.4 Diagrama de Vínculos

Ruta: **Análisis → Diagrama de Vínculos**.

Representación gráfica de las relaciones entre blancos, organizaciones y bienes de un caso (búsqueda por Nombre del Caso o Número CER), útil para visualizar de forma rápida las conexiones identificadas durante la investigación.

`📷 Captura pendiente — Diagrama de vínculos de un caso`

### 10.5 Flujo de Transporte

Ruta: **Análisis → Flujo de Transporte**.

1. **Buscar Conductor** por número de documento. Si no existe registro previo, se habilita el alta manual: Nombres*, Apellido Paterno*, Apellido Materno*, Sexo*, Ocupación*, Fecha de Nacimiento*, Dirección*, Apellido de Esposo, Dirección secundaria, Departamento*, Provincia*, Municipio*.
2. **Buscar Transporte** por placa o código. Si no existe registro previo, se habilita el alta manual: Tipo*, Marca*, Modelo*, Clase*, Color*, Número de Motor*, Número de Chasis*.
3. **Registrar Flujo de Transporte**: Lugar* (autocompletado o alta de un lugar nuevo), Color*, Fecha/Hora*, Origen*, Destino*, Carga*, Latitud/Longitud*.

   El sistema sugiere un color de alerta (no vinculante) según reglas configuradas, a modo de apoyo visual para el analista — la decisión final queda a criterio del usuario.

`📷 Captura pendiente — Formulario de registro de Flujo de Transporte con el mapa`

### 10.6 Reporte de Flujo de Transporte

Ruta: **Análisis → Reporte de Flujos de Transporte**.

Filtro por Documento, Placa y/o rango de fechas (todos opcionales), con exportación a PDF.

---

## 11. Resumen de funciones no disponibles

Para referencia rápida, las siguientes funciones del sistema **no deben usarse para el registro oficial de información** hasta que se completen o corrijan:

| Módulo | Función | Situación |
|---|---|---|
| Operativos → Drogas | Botón "Pesaje" | No guarda datos (§1.2) |
| Inteligencia → Asignación de caso | Activar/inactivar caso | No ejecuta ninguna acción (§2.2) |
| Inteligencia → Actualización del caso | Botón "Generar reporte" | Sin confirmar como funcional (§2.3) |
| Inteligencia → Lista de servicios | Exportar PDF por fila | Produce error (§2.4) |
| Interoperabilidad → ITV | Toda la pantalla | Siempre muestra datos de ejemplo, no consulta información real (§4.2) |
| Casos X → Registro | Listado de personas detenidas del caso | Puede incluir personas de otros operativos (§5.1) |
| Casos X → Registro | Combo "Unidad operativa" / "Distrito operativo" | Catálogo en revisión, puede comportarse de forma inesperada (§5.1) |
| Legitimación de Ganancias Ilícitas (módulo completo) | Las 3 pantallas | No guardan información real (§6) |
| Investigación Financiera → LGI | Detalle y Operativo | Solo lectura, edición pendiente de habilitar (§7.2) |

Esta tabla se debe mantener actualizada a medida que estas funciones se habiliten; el detalle técnico de cada hallazgo está en [10b-formularios-y-apis-fase2.md](../10b-formularios-y-apis-fase2.md) para el equipo de desarrollo.
