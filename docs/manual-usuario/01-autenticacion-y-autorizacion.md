# Manual de usuario — Parte 1: Autenticación y Autorización

## Sistema Nacional de Inteligencia — FELCN

> Este documento cubre el acceso al sistema, la gestión de la cuenta personal y —para el rol Administrador— la configuración de usuarios, roles y permisos. Para los módulos operativos del sistema de inteligencia (Operativos, Análisis, Investigaciones, Reportes, Seguimientos), ver la [Parte 2 — Sistema de Inteligencia](./02-sistema-de-inteligencia.md).
>
> Las capturas de pantalla de este documento están pendientes de incorporar; cada punto donde corresponde una se marca así: `📷 Captura pendiente — [pantalla]`. La estructura, los pasos y los campos descritos ya están verificados contra el sistema real.

---

## 1. Roles del sistema

El sistema define los siguientes roles. Un usuario puede tener más de un rol asignado simultáneamente, y el menú y los permisos se combinan según todos sus roles activos.

| Rol | Descripción |
|---|---|
| **Administrador** | Responsable de la gestión y supervisión general del sistema: usuarios, roles, permisos, parámetros y estructura organizacional. |
| **Técnico** | Responsable de herramientas y funciones específicas del sistema. |
| **Inteligencia** | Acceso al módulo de creación, registro y seguimiento de servicios de inteligencia. |
| **Investigador** | Acceso a los módulos de investigación financiera (Paralela / LGI) y seguimiento de casos. |
| **Analista** | Acceso a los módulos de Análisis de Información de Inteligencia (S2I). |
| **Consulta** | Acceso de solo consulta a la información habilitada para el rol. |
| **Usuario** | Rol base asignado automáticamente a toda cuenta creada por autorregistro (§3.1); sin permisos operativos hasta que un Administrador le asigne un rol adicional. |

El acceso a cada pantalla del sistema está controlado por **políticas** asociadas al rol (ver §5.3) y, opcionalmente, por **excepciones individuales** por usuario (ver §5.4).

---

## 2. Acceso al sistema

### 2.1 Ingreso con usuario y contraseña

1. Ingresar a la dirección del sistema. Se muestra la pantalla de inicio de sesión.

   `📷 Captura pendiente — Pantalla de login`

2. Completar **Usuario** y **Contraseña**.
3. Presionar **Ingresar**.
4. Si las credenciales son correctas y la cuenta no tiene el doble factor habilitado (§2.3), se accede directamente a la pantalla principal del sistema.

Si las credenciales son incorrectas, el sistema informa el error sin indicar si el problema es el usuario o la contraseña (por seguridad). Cada intento fallido queda registrado en la bitácora de accesos. Al tercer intento fallido consecutivo la cuenta se bloquea automáticamente; ver §3.4 para el procedimiento de desbloqueo.

### 2.2 Ingreso con Ciudadanía Digital

El sistema permite iniciar sesión utilizando la cuenta de **Ciudadanía Digital** (AGETIC), sin necesidad de una contraseña propia del sistema.

1. En la pantalla de login, seleccionar la opción de ingreso con Ciudadanía Digital.

   `📷 Captura pendiente — Botón de ingreso con Ciudadanía Digital`

2. El sistema redirige al portal oficial de Ciudadanía Digital, donde el usuario se autentica con sus propias credenciales.
3. Al autenticarse correctamente, Ciudadanía Digital redirige de vuelta al sistema, que reconoce al usuario por su número de documento y completa el ingreso automáticamente.

Esta opción solo está disponible para usuarios cuya cuenta tiene habilitada la vinculación con Ciudadanía Digital (configurable por un Administrador al crear o editar el usuario, ver §4.2).

### 2.3 Doble factor de autenticación (OTP)

Para las cuentas con el doble factor habilitado, después de validar usuario y contraseña el sistema solicita un **código de un solo uso**:

1. El sistema envía un código numérico al **correo electrónico** o **WhatsApp** registrado del usuario (según el canal configurado para la cuenta) y muestra el destino parcialmente oculto (por ejemplo, `j***@correo.com`).

   `📷 Captura pendiente — Pantalla de ingreso de código OTP`

2. El usuario ingresa el código recibido. Tiene un máximo de 3 intentos para ingresarlo correctamente antes de que la sesión de verificación se invalide y deba reiniciar el ingreso.
3. El código es de un solo uso y vence a los 5 minutos; si vence o ya fue utilizado, el sistema solicita reiniciar el ingreso.

El doble factor se habilita por usuario desde el formulario de creación/edición de usuario (§4.2), a criterio de un Administrador — no está activado de forma general ni obligatoria.

---

## 3. Autogestión de cuenta

Estas funciones no requieren sesión iniciada ni intervención de un Administrador — el propio usuario gestiona su cuenta, y es responsable de la información y las acciones realizadas con ella.

### 3.1 Registro de nueva cuenta

1. Desde la pantalla de login, seleccionar la opción de registro.
2. Completar el formulario:

   | Campo | Obligatorio | Detalle |
   |---|---|---|
   | Número de documento | Sí | |
   | Nombres | Sí | |
   | Primer / Segundo apellido | Al menos uno | |
   | Fecha de nacimiento | Sí | |
   | Correo electrónico | Sí | Debe ser válido y único en el sistema |
   | Contraseña | Sí | Mínimo 8 caracteres y nivel de seguridad "muy fuerte" según el indicador en pantalla |
   | Confirmar contraseña | Sí | Debe coincidir con la anterior |

   `📷 Captura pendiente — Formulario de registro, con el indicador de fortaleza de contraseña`

3. Al enviar el formulario, la cuenta se crea con el rol base **Usuario** y queda **pendiente de activación**.
4. El sistema envía un correo con un enlace de activación (ver §3.2).

### 3.2 Activación de cuenta

1. Abrir el enlace de activación recibido por correo tras el registro.
2. El sistema valida el enlace y activa la cuenta automáticamente, sin pasos adicionales.
3. A partir de ese momento la cuenta puede iniciar sesión con normalidad.

Si el enlace expiró o no fue recibido, un Administrador puede reenviar el correo de activación desde el listado de usuarios (§4.1).

### 3.3 Recuperación de contraseña olvidada

1. En la pantalla de login, seleccionar "¿Olvidó su contraseña?".
2. Ingresar el correo electrónico registrado en la cuenta.

   `📷 Captura pendiente — Formulario de recuperación (paso 1: correo)`

3. El sistema envía un enlace de recuperación al correo indicado (por seguridad, se muestra el mismo mensaje de confirmación exista o no una cuenta con ese correo).
4. Al abrir el enlace recibido, el sistema valida su vigencia automáticamente y presenta el formulario de nueva contraseña.
5. Ingresar la **nueva contraseña** y **repetirla**. Debe cumplir el mismo requisito de fortaleza que en el registro, y no puede coincidir con la contraseña actual ni con ninguna de las últimas 5 contraseñas que el usuario haya tenido — el sistema la rechaza si detecta una reutilización.

   `📷 Captura pendiente — Formulario de nueva contraseña`

6. Al confirmar, la contraseña queda actualizada, el usuario puede iniciar sesión con ella, y **todas las sesiones que estuvieran abiertas con la contraseña anterior quedan cerradas** (ver también §3.5, "Cerrar todas las sesiones").

### 3.4 Desbloqueo de cuenta

Al tercer intento fallido de inicio de sesión, la cuenta queda bloqueada. El bloqueo **no vence solo con el tiempo** — permanece hasta que se desbloquea explícitamente por uno de estos dos medios:

1. **Por correo**: al momento del bloqueo el sistema envía un enlace de desbloqueo al correo registrado. Abrirlo desbloquea la cuenta de inmediato, sin captura de datos adicionales.
2. **Por un Administrador**: desde el listado de usuarios (§4.1), un Administrador puede desbloquear la cuenta manualmente en cualquier momento, sin depender del correo del usuario.

### 3.5 Perfil de usuario

Desde el menú de usuario (icono superior derecho) → **Perfil**, cada usuario gestiona su propia información:

| Acción | Campos | Detalle |
|---|---|---|
| **Editar datos personales** | Nombres*, Primer apellido*, Segundo apellido, Correo*, Teléfono | Formato de teléfono: número boliviano de 8 dígitos iniciado en 6 o 7 |
| **Cambiar contraseña** | Contraseña actual*, Nueva contraseña*, Confirmar* | La nueva contraseña requiere mínimo 8 caracteres, nivel "muy fuerte", y no puede repetir la actual ni ninguna de las últimas 5 |
| **Cambiar foto de perfil** | Imagen (arrastrar y soltar o seleccionar archivo) | Reemplaza o elimina la foto mostrada en el sistema |
| **Cerrar todas las sesiones** | — (botón, con confirmación) | Cierra la sesión en todos los dispositivos donde la cuenta esté iniciada, incluido el actual — el usuario debe volver a iniciar sesión de inmediato. Útil si se sospecha que la cuenta quedó abierta en un equipo que ya no se controla |

`📷 Captura pendiente — Pantalla de Perfil con las cuatro opciones`

Además, cualquier cambio de contraseña (por este medio, por recuperación en §3.3, o por restablecimiento de un Administrador en §4.1) cierra automáticamente todas las demás sesiones activas de la cuenta, sin necesidad de usar el botón "Cerrar todas las sesiones" por separado.

---

## 4. Administración de usuarios *(rol Administrador)*

Ruta: **Configuración → Usuarios**.

### 4.1 Listado y búsqueda

El listado muestra todos los usuarios registrados, con filtro por texto (nombre, documento, correo) y por rol, y paginación.

`📷 Captura pendiente — Listado de usuarios con filtros`

Desde cada fila del listado, según el estado del usuario, están disponibles las acciones:

| Acción | Efecto |
|---|---|
| **Activar / Inactivar** | Habilita o deshabilita el acceso de la cuenta al sistema sin eliminarla |
| **Reenviar correo de activación** | Genera y reenvía un nuevo enlace de activación (para cuentas pendientes de activar) |
| **Restablecer** | Restaura una cuenta a un estado definido (uso administrativo) |
| **Desbloquear cuenta** | Solo visible para cuentas actualmente bloqueadas por intentos fallidos (§3.4). Levanta el bloqueo de inmediato, sin depender del correo del usuario |

### 4.2 Crear usuario

Ruta: **Configuración → Usuarios → Nuevo**.

| Campo | Obligatorio | Detalle |
|---|---|---|
| Nombres | Sí | |
| Primer / Segundo apellido | Al menos uno | |
| Número de documento | Sí | |
| Fecha de nacimiento | Sí | |
| Correo electrónico | Sí | |
| Teléfono | No | Formato boliviano de 8 dígitos (6 o 7 inicial) |
| Roles | Sí | Selección múltiple |
| Habilitar Ciudadanía Digital | No | Switch — permite a la cuenta iniciar sesión con Ciudadanía Digital (§2.2) |
| Habilitar doble factor (2FA) | No | Switch, desactivado por defecto — exige el código OTP (§2.3) en cada inicio de sesión de esta cuenta |
| Unidad → Distrital → Grupo | Sí | Selección en cascada, según estructura organizacional |
| Grado | Sí | |
| Número de pase | Sí | |
| Recursos por rol | No | Ver §5.4 — por defecto el usuario accede a todo lo permitido por su(s) rol(es); esta sección permite personalizar el acceso solo para este usuario |

`📷 Captura pendiente — Formulario de creación de usuario, incluyendo el bloque de Recursos por rol`

Al guardar, el sistema crea la cuenta y envía el correo de activación correspondiente (§3.2). El usuario no puede iniciar sesión hasta activarla.

### 4.3 Editar usuario

Mismo formulario que la creación, con los datos precargados. Ruta: **Configuración → Usuarios → (fila) → Editar**.

---

## 5. Administración de roles y permisos *(rol Administrador)*

Esta sección controla **quién puede hacer qué** en el sistema. Se compone de tres piezas que trabajan juntas: **Roles**, **Módulos** (el menú) y **Políticas** (las reglas de acceso).

### 5.1 Roles

Ruta: **Configuración → Roles**.

| Campo | Obligatorio |
|---|---|
| Código del rol | Sí |
| Nombre | Sí |
| Descripción | Sí |

Acciones disponibles: crear, editar, y **activar/inactivar**. Importante: inactivar un rol afecta a **todos** los usuarios que lo tengan asignado — no es una acción por usuario individual.

### 5.2 Módulos (menú del sistema)

Ruta: **Configuración → Módulos**.

Cada módulo representa una entrada del menú lateral. Pueden ser una **sección** (agrupador, sin pantalla propia) o un **ítem** (con una URL y un ícono asociados).

| Campo | Obligatorio | Detalle |
|---|---|---|
| Sección | Condicional | Módulo padre, si corresponde |
| Nombre | Sí | Identificador interno |
| Etiqueta (label) | Sí | Texto visible en el menú |
| URL | Sí | Ruta a la que apunta |
| Orden | Sí | Posición dentro del menú |
| Ícono | Condicional | Obligatorio si no es una sección |
| Descripción | Sí | |

Un módulo (o sección) puede **activarse o inactivarse**; al inactivarse, desaparece del menú de todos los usuarios, independientemente de su rol o de las políticas configuradas.

### 5.3 Políticas de acceso

Ruta: **Configuración → Políticas**.

Cada política define una regla de la forma: *"el rol \[Sujeto] puede realizar la acción \[Acción] sobre \[Objeto], en \[App]"*.

| Campo | Obligatorio | Detalle |
|---|---|---|
| Sujeto | Sí | Rol al que aplica la regla |
| Objeto | Sí | Pantalla o endpoint sobre el que aplica |
| App | Sí | `frontend` (pantallas del menú) o `backend` (operaciones de datos) |
| Acción | Sí | Selección múltiple; las opciones disponibles cambian según la App elegida (por ejemplo, en frontend: leer/crear/editar/eliminar; en backend: los métodos HTTP correspondientes) |

Ejemplos reales de política ya configurados en el sistema:

- Rol `ADMINISTRADOR`, objeto `/admin/roles`, acciones `leer, crear, editar, eliminar`, app `frontend` → el menú "Roles" es visible y editable para el rol Administrador.
- Sujeto `*` (cualquier rol autenticado), objeto `/api/usuarios/cuenta/perfil`, acciones `GET, PATCH`, app `backend` → cualquier usuario autenticado puede leer y actualizar su propio perfil (§3.5), sin necesidad de una política específica por rol.

`📷 Captura pendiente — Formulario de política, mostrando el cambio de opciones de Acción según la App`

### 5.4 Recursos por rol y excepciones individuales

Cuando se configuran las Políticas por rol, todos los usuarios de ese rol comparten el mismo acceso. Para necesidades puntuales (por ejemplo, un usuario del rol Investigador que además debe ver un módulo normalmente reservado a Analista), el formulario de usuario (§4.2) incluye el bloque **Recursos por rol**:

- **Todos**: el usuario accede a todo lo que su(s) rol(es) permite(n) — comportamiento por defecto.
- **Personalizar**: se muestra la lista de recursos disponibles para el rol como casillas de verificación, permitiendo otorgar o quitar recursos puntuales **solo para ese usuario**, sin alterar la política general del rol ni afectar a otros usuarios del mismo rol.

---

## 6. Parámetros del sistema *(rol Administrador)*

Ruta: **Configuración → Parámetros**.

Los parámetros son catálogos de valores usados en distintos formularios del sistema (por ejemplo, tipos de documento, estados, categorías). Cada parámetro pertenece a un **grupo**.

| Campo | Obligatorio |
|---|---|
| Código | Sí |
| Nombre | Sí |
| Grupo | Sí |
| Descripción | Sí |

Acciones: crear, editar, activar/inactivar.

---

## 7. Estructura organizacional

La estructura organizacional (Grados, Unidades, Distritales, Grupos) es la base para asignar usuarios a su unidad correspondiente (§4.2) y para filtrar información por unidad en los módulos operativos.

> **Estado actual**: el módulo de administración de Estructura desde el menú está actualmente **inactivo** (no visible en el menú de ningún rol). Los catálogos existen y están en uso por el resto del sistema; su mantenimiento, mientras el módulo permanezca inactivo, debe canalizarse a través del equipo técnico responsable.

---

## 8. Glosario

| Término | Significado |
|---|---|
| **OTP** | *One-Time Password*, código de un solo uso para el doble factor de autenticación |
| **Ciudadanía Digital** | Sistema de identidad digital del Estado boliviano, administrado por AGETIC |
| **RBAC** | *Role-Based Access Control*, control de acceso basado en roles |
| **Política** | Regla que autoriza a un rol a realizar una acción sobre una pantalla o endpoint |
| **Módulo** | Entrada del menú del sistema (sección o pantalla) |
| **Recurso** | En el contexto de permisos, una pantalla o endpoint sobre el que aplica una política |
