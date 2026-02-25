# Reporte de Pruebas de Integración

**Proyecto:** CORE - AGETIC NESTJS BACKEND BASE
**Fecha:** vie 07 nov 2025 14:46:47 -04
**Duración:** 54s

## Resumen
- **Total de pruebas:** 88
- **Aprobadas:** 88
- **Fallidas:** 0
- **Omitidas:** 0


## AppController (e2e)

###  AppController (e2e)

| N° | CÓDIGO ITEM | DESCRIPCIÓN | MÉTODO | API | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ------ | --- | ----------- | ------ |
| 1 | N/A | /estado (GET) | `GET` | `N/A` | `N/A` | ✅ PASSED |


## UsuarioController (e2e)

### TI-18 | `GET` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-030 | Debería obtener la información del usuario por su ID | `403` | ✅ PASSED |

### TI-19 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-031 | Debería generar un error cuando no exista un usuario en la BD | `403` | ✅ PASSED |

### TI-12 | `POST` : **/api/usuarios/cuenta/perfil**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-012 | Debería obtener la información del perfil del usuario | `200` | ✅ PASSED |
| 2 | U-013 | Debería generar error cuando el usuario no este autenticado | `403` | ✅ PASSED |
| 3 | U-014 | Debería generar error cuando el usuario este autenticado pero no exista en BD | `404` | ✅ PASSED |

### TI-13 | `PATCH` : **/api/usuarios/cuenta/perfil**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-015 | Debería de actualizar el perfil del usuario | `200` | ✅ PASSED |
| 2 | U-016 | Debería generar error cuando el usuario este autenticado pero no exista en BD | `404` | ✅ PASSED |
| 3 | U-017 | Debería generar error si se intenta actualizar con un telefono ya existente | `412` | ✅ PASSED |
| 4 | U-018 | Debería generar error si se intenta actualizar con un correo ya existente | `400` | ✅ PASSED |
| 5 | U-019 | Debería generar error si se intenta actualizar sin estar autenticado | `403` | ✅ PASSED |

### TI-10 | `POST` : **/api/usuarios/crear-cuenta**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-001 | Debería crear una nueva cuenta para una persona nacional si no se envía el tipoDocumento | `201` | ✅ PASSED |
| 2 | U-048 | Debería crear un nuevo usuario nacional si se envía el campo tipoDocumento CI | `201` | ✅ PASSED |
| 3 | U-049 | Debería crear un nuevo usuario extranjero si se envía el campo tipoDocumento CIE | `201` | ✅ PASSED |
| 4 | U-002 | Debería de mostrar error cuando exista un usuario previamente registrado | `412` | ✅ PASSED |
| 5 | U-003 | Debería de mostrar error cuando exista un correo previamente registrado | `412` | ✅ PASSED |
| 6 | U-004 | Debería de mostrar error cuando exista un telefono previamente registrado | `412` | ✅ PASSED |
| 7 | U-005 | Debería de mostrar error cuando no exista el ROL USUARIO EN LA BD | `412` | ✅ PASSED |
| 8 | U-006 | Debería de mostrar error cuando el nivel del password sea incorrecta | `412` | ✅ PASSED |
| 9 | U-007 | Debería de fallar cuando se envíe campos obligatorios incompletos | `412` | ✅ PASSED |
| 10 | U-008 | Debería de mostrar error cuando no exista contrastación con el SEGIP | `412` | ✅ PASSED |
| 11 | U-009 | Debería crear un usuario, aun cuando no se pueda enviar correo de activación de cuenta | `201` | ✅ PASSED |
| 12 | U-050 | Debería de generar un error si no se conecta con SegipService | `412` | ✅ PASSED |

### TI-11 | `POST` : **/api/usuarios/cuenta/activacion**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-010 | Debería de activar una cuenta de usuario | `200` | ✅ PASSED |
| 2 | U-011 | Debería fallar si no existe un usuario asociado la código | `412` | ✅ PASSED |

### TI-16 | `GET` : **/api/usuarios**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-028 | Debería de generar error por usuario no autorizado | `403` | ✅ PASSED |

### TI-17 | `POST` : **/api/usuarios**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-029 | Debería crear un nuevo usuario | `403` | ✅ PASSED |

### TI-14 | `PATCH` : **/api/usuarios/cuenta/foto**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-020 | Debería de actualizar el perfil del usuario | `200` | ✅ PASSED |
| 2 | U-021 | Debería devolver error si no se envía la foto | `400` | ✅ PASSED |
| 3 | U-022 | Debería devolver error si no el usuario no esta autenticado | `403` | ✅ PASSED |
| 4 | U-023 | Debería devolver error si el archivo no es imagen | `400` | ✅ PASSED |

### TI-15 | `DELETE` : **/api/usuarios/cuenta/foto**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-024 | Debería de eliminarse la foto de perfil del usuario | `200` | ✅ PASSED |
| 2 | U-025 | Debería generar error si el usuario no existe en la DB | `404` | ✅ PASSED |
| 3 | U-026 | Debería de eliminarse la foto de perfil del usuario | `200` | ✅ PASSED |
| 4 | U-027 | Debería no fallar si el usuario no tiene foto | `200` | ✅ PASSED |

### TI-09 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-030 | Debería de reeenviar el córreo de activación | `200` | ✅ PASSED |
| 2 | A-031 | Debería fallar si no existe el usuario en la BD | `404` | ✅ PASSED |
| 3 | A-032 | Debería de fallar si existe un error con el servicio de mensajería | `200` | ✅ PASSED |

### TI-08 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-027 | Debería de restaurar la contraseña de un usuario | `200` | ✅ PASSED |
| 2 | A-028 | Debería de generar un error si el usario no existe en la BD | `404` | ✅ PASSED |
| 3 | A-029 | Debería de restaurar la contraseña aun si falla el servicio de mensajería | `200` | ✅ PASSED |

### TI-05 | `POST` : **/api/usuarios/cuenta/ciudadania**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-016 | Debería crear un nuevo usuario relacionado con Ciudadanía Digital | `201` | ✅ PASSED |
| 2 | A-017 | Debería generar un error si el usuario ya existe en la BD | `412` | ✅ PASSED |
| 3 | A-018 | Debería generar un error si el ROL USUARIO NO EXISTIRIA | `404` | ✅ PASSED |

### TI-04 | `GET` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-014 | Debería obtener la información del usuario por su ID | `200` | ✅ PASSED |
| 2 | A-015 | Debería generar error cuando el usuario no este autenticado | `403` | ✅ PASSED |

### TI-07 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-022 | Debería de activar a un usuario no propietario | `200` | ✅ PASSED |
| 2 | A-023 | Debería generar un error si un usuario propietario intenta activarse | `403` | ✅ PASSED |
| 3 | A-024 | Debería generar un error si el usuario a activar cuenta no existe en la BD | `404` | ✅ PASSED |
| 4 | A-025 | Debería generar un error si un usuario a activar tiene el estado ACTIVO | `404` | ✅ PASSED |
| 5 | A-026 | Debería actualizar los datos aunque se genere un error si no se puede enviar correo con la contraseña al usuario | `200` | ✅ PASSED |

### TI-06 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-019 | Debería generar un error cuando no exista un usuario en la BD | `404` | ✅ PASSED |
| 2 | A-020 | Debería generar un error cuando se intente inactivar el propietario | `403` | ✅ PASSED |
| 3 | A-021 | Debería de inactivar a un usuario no propietario | `200` | ✅ PASSED |

### TI-01 | `GET` : **/api/usuarios**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-001 | Debería de obtener el listado de usuarios | `200` | ✅ PASSED |
| 2 | A-002 | Debería generar error cuando el usuario no este autenticado | `403` | ✅ PASSED |

### TI-03 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-010 | Debería de actualizar los datos de un usuario nacional | `200` | ✅ PASSED |
| 2 | TI-036 | Debería de fallar si un usuario intenta cambiar el tipo de documento de CI a CIE | `200` | ✅ PASSED |
| 3 | A-011 | Debería de fallar cuando un usuario no este autenticado intente crear al usuario | `403` | ✅ PASSED |
| 4 | A-012 | Debería generar un error cuando el usuario no exista en la BD | `404` | ✅ PASSED |
| 5 | A-013 | Debería generar un error cuando no se pueda hacer la contrastación con el SEGIP | `412` | ✅ PASSED |
| 6 | A-037 | Debería de generar un error si no se conecta con SegipService | `412` | ✅ PASSED |

### TI-02 | `POST` : **/api/usuarios**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | A-003 | Debería crear un nuevo usuario nacional si no se envía el campo tipoDocumento | `201` | ✅ PASSED |
| 2 | A-033 | Debería crear un nuevo usuario nacional si se envía el campo tipoDocumento CI | `201` | ✅ PASSED |
| 3 | A-034 | Debería crear un nuevo usuario extranjero si se envía el campo tipoDocumento CIE | `201` | ✅ PASSED |
| 4 | A-035 | Debería de generar un error si no se conecta con SegipService | `412` | ✅ PASSED |
| 5 | A-004 | Debería generar un error cuando el usuario ya existe | `412` | ✅ PASSED |
| 6 | A-005 | Debería generar un error cuando el usuario ingrese un EMAIL registrado previamente | `412` | ✅ PASSED |
| 7 | A-006 | Debería generar un error cuando el usuario ingrese un TELEFONO registrado previamente | `412` | ✅ PASSED |
| 8 | A-007 | Debería de fallar cuando un usuario no este autenticado intente crear al usuario | `403` | ✅ PASSED |
| 9 | A-008 | Debería generar un error cuando falla la contrastación con SEGIP | `412` | ✅ PASSED |
| 10 | A-009 | Debería crear un usuario aun cuando falle el envío del correo con la contraseña | `201` | ✅ PASSED |

### TI-27 | `PATCH` : **/api/usuarios/cuenta/contrasena**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-042 | Debería de actualizar la contraseña de un usuario autenticado | `200` | ✅ PASSED |

### TI-26 | `POST` : **/api/usuarios/validar-recuperar**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-040 | Debería de validar el código de recuperación | `201` | ✅ PASSED |
| 2 | U-041 | Debería de generar error si el código de recuperación no pertenece a ningún usuario | `412` | ✅ PASSED |

### TI-25 | `POST` : **/api/usuarios/recuperar**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-037 | Debería de recuperar la cuenta del usuario | `201` | ✅ PASSED |
| 2 | U-038 | ebería devolver Búsqueda terminada si el usuario no existe en BD | `201` | ✅ PASSED |
| 3 | U-039 | Debería manejar el error cuando falle el envío de correo | `201` | ✅ PASSED |

### TI-24 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-036 | reenviar [PATCH]: Debería generar error a un usuario no autorizado | `403` | ✅ PASSED |

### TI-23 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-035 | Debería de restaurar la contraseña de un usuario | `403` | ✅ PASSED |

### TI-22 | `POST` : **/api/usuarios/cuenta/ciudadania**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-034 | Debería crear un nuevo usuario relacionado con Ciudadanía Digital | `403` | ✅ PASSED |

### TI-21 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-033 | Debería de actualizar los datos de un usuario | `403` | ✅ PASSED |

### TI-20 | `PATCH` : **/api/usuarios/**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-032 | Debería de activar a un usuario no propietario | `403` | ✅ PASSED |

### TI-29 | `GET` : **/api/usuarios/cuenta/desbloqueo**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-046 | Debería de desbloquear la cuenta del usuario | `401` | ✅ PASSED |
| 2 | U-047 | Debería generar error cuando no exista un código de transacción relacionado con el usuario | `200` | ✅ PASSED |

### TI-28 | `PATCH` : **/api/usuarios/cuenta/nueva-contrasena**

| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |
| -- | ----------- | ----------- | ----------- | ------ |
| 1 | U-043 | Debería generar error cuando no exista un código de transacción relacionado con el usuario | `412` | ✅ PASSED |
| 2 | U-044 | Debería generar error cuando el password no tenga un nivel valido | `412` | ✅ PASSED |
| 3 | U-045 | Debería de actualizar la contraseña del usuario | `200` | ✅ PASSED |

