# Manual de instalación

## 1. Requerimientos

| Nombre       | Versión | Descripción                                            | Instalación                                      |
| ------------ | ------- | ------------------------------------------------------ | ------------------------------------------------ |
| `PostgreSQL` | ^16     | Gestor de base de datos.                               | https://www.postgresql.org/download/linux/debian |
| `NodeJS`     | ^20     | Entorno de programación de JavaScript.                 | `nvm install 20` https://github.com/nvm-sh/nvm   |
| `NPM`        | ^10     | Gestor de paquetes de NodeJS.                          | `npm install -g npm@10`                          |
| `PM2`        | ^5.3    | Gestor avanzado de procesos de producción para NodeJS. | `npm install -g pm2@5.3`                         |

## 2. Instalación

### Clonación del proyecto e instalación de dependencias

```bash
# Clonación del proyecto
git clone git@gitlab.felcn.gob.bo:/proyectos-base/felcn-base-backend.git

# Ingresamos dentro de la carpeta del proyecto
cd felcn-base-backend

# Cambiamos a la rama develop
git checkout develop

# Instalamos dependencias
npm install
```

### Archivos de configuración.

Copiar archivos `.sample` y modificar los valores que sean necesarios (para más detalles revisa la sección **Variables
de entorno**).

```bash
# Variables de entorno globales
cp .env.sample .env

# [OPCIONAL] Para el modo producción
cp ecosystem.config.js.sample ecosystem.config.js
```

### Creación y configuración de la Base de Datos

Ver el archivo [database/scripts/README.md](./database/scripts/README.md)

Una vez se tenga creada la base de datos y sus respectivos esquemas ejecutar el siguiente comando para crear las tablas y configurar la base de datos:

```bash
npm run setup
```

### Despliegue de la aplicación

```bash
# Ejecución en modo desarrollo
npm run start

# Ejecución en modo desarrollo (live-reload)
npm run start:dev

# Ejecución en modo desarrollo (muestra logs de las consultas SQL)
npm run dev

# Ejecución en modo PRODUCCIÓN
npm run build
npm run start:prod

# Ejecución en modo PRODUCCIÓN (con proceso activo en segundo plano)
npm run build
pm2 start ecosystem.config.js
```

### Ejecución de pruebas unitarias y de integración

Realizar Todas las pruebas
```bash
npm run test
```

Realizar pruebas e2e
```bash
npm run test:e2e
```

Realizar pruebas de cobertura
```bash
npm run test:cov
```

### Comandos útiles para el modo desarrollo

```bash
# Verifica la sintaxis
npm run lint

# Crea una nueva migración
npm run seeds:create database/seeds/addColumnCategoria

# Ejecuta las migraciones
npm run seeds:run
```

### Variables de entorno

Las siguientes variables de entorno se encuentran en el archivo .env que fue copiado del archivo `.env.sample`. 

> NOTA: Recuerde que debe reiniciar el servidor despues de haber realizado cambios en cualquiera de estas variables de entorno para que tome efecto en el despliegue.

**Datos de despliegue**

| Variable   | Valor por defecto | Descripción                                                    |
| ---------- | ----------------- | -------------------------------------------------------------- |
| `NODE_ENV` | `development`     | Ambiente de despliegue (`development`, `test` o `production`). |
| `PORT`     | `3000`            | Puerto en el que se levantará la aplicación.                   |

\*\*\* La URL de despliegue sería: `http://localhost:3000/api/estado`

**Configuración de la base de datos**

| Variable                 | Valor por defecto | Descripción                                                                             |
| ------------------------ | ----------------- | --------------------------------------------------------------------------------------- |
| `DB_HOST`                | `localhost`       | Host de la base de datos.                                                               |
| `DB_USERNAME`            | `postgres`        | nombre de usuario de la base de datos.                                                  |
| `DB_PASSWORD`            | `postgres`        | contraseña de la base de datos.                                                         |
| `DB_DATABASE`            | `database_db`     | nombre de la base de datos.                                                             |
| `DB_PORT`                | `5432`            | puerto de despliegue de la base de datos.                                               |
| `DB_USE_SSL`             | `false`           | Para indicar si se utilizará SSL o no en la conexión con la base de datos.                        |
| `DB_VERIFY_SSL`          | `false`           | Para indicar si se validará que el certificado SSL del servidor sea válido y de confianza.        |
| `DB_SCHEMA`              | `proyecto`        | Para almacenar las tablas del proyecto, y todo lo relacionado con la lógica de negocio. |
| `DB_SCHEMA_USUARIOS`     | `usuarios`        | Para almacenar la tabla usuarios, roles y todo lo relacionado con la autenticación.     |
| `DB_SCHEMA_PARAMETRICAS` | `parametricas`    | Para almacenar tablas de tipo paramétricas.                                             |
| `DB_USE_SSL`                | `false`           | Indica si se utilizará una conexión SSL para la base de datos.                                                                             |
| `DB_VERIFY_SSL`             | `false`           | Especifica si se validará el certificado SSL del servidor para asegurar su autenticidad y confianza.                                       |

**Configuración general de la aplicación**

| Variable                     | Valor por defecto | Descripción                                                                  |
| ---------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| `PATH_SUBDOMAIN`             | `api`             | Prefijo para todas las rutas de los servicios (Se debe mantener este valor). |
| `REQUEST_TIMEOUT_IN_SECONDS` | `30`              | Tiempo máximo de espera para devolver el resultado de una petición.          |

**Configuración para módulo de autenticación**

| Variable                   | Valor por defecto | Descripción                                                                             |
| -------------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `JWT_SECRET`               |                   | Llave para generar los tokens de autorización. Genera una llave fuerte para producción. |
| `JWT_EXPIRES_IN`           |                   | Tiempo de expiración del token de autorización en milisegundos.                         |
| `REFRESH_TOKEN_NAME`       | `jid`             |                                                                                         |
| `REFRESH_TOKEN_EXPIRES_IN` |                   | tiempo en milisegundos                                                                  |
| `REFRESH_TOKEN_ROTATE_IN`  |                   | tiempo en milisegundos                                                                  |
| `REFRESH_TOKEN_SECURE`     | `false`           |                                                                                         |
| `REFRESH_TOKEN_DOMAIN`     |                   | dominio de despliegue                                                                   |
| `REFRESH_TOKEN_PATH`       | `/`               |                                                                                         |
| `REFRESH_TOKEN_REVISIONS`  | `*/5 * * * *`     |                                                                                         |

**Configuración para el servicio de Mensajería Electrónica (Alertín), si se utiliza en el sistema**

| Variable                  | Valor por defecto | Descripción                                                       |
| ------------------------- | ----------------- | ----------------------------------------------------------------- |
| `MSJ_URL`                 |                   | URL de consumo al servicio de Mensajería Electrónico (Alertín).   |
| `MSJ_TOKEN`               |                   | TOKEN de consumo al servicio de Mensajería Electrónico (Alertín). |
| `MSJ_TIMEOUT_EN_SEGUNDOS` | `10`              | Tiempo máximo de espera para las consultas a mensajería           |

**Configuración para el servicio SIN de IOP, si corresponde**

| Variable        | Valor por defecto | Descripción                                           |
| --------------- | ----------------- | ----------------------------------------------------- |
| `IOP_SIN_URL`   |                   | URL de consumo al Servicio de Impuestos Nacionales.   |
| `IOP_SIN_TOKEN` |                   | Token de consumo al Servicio de Impuestos Nacionales. |

**Configuración para la integracion de autenticación con Ciudadanía Digital**

Para realizar la configuración de la integración de autenticación con Ciudadanía Digital debe considerar tener conocimiento sobre los siguientes puntos importantes primero:

* Protocolo de autenticación OIDC.
* Creación de proyecto y habilitación de servicio de autenticación en la plataforma [Ciudadanía Digital Developer](https://developer.ciudadaniadigital.bo/).

| Variable                        | Valor por defecto | Descripción                                                                                                                                                                            |
|---------------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `OIDC_ISSUER`                   | —                 | URL base del *OpenID Provider* (OP) usado para descubrir dinámicamente los endpoints de autorización y token.                                                                          |
| `OIDC_CLIENT_ID`                | —                 | Identificador público del cliente registrado en el OP, que el servidor usará al iniciar el flujo de autorización.                                                                      |
| `OIDC_CLIENT_SECRET`            | —                 | Secreto compartido con el OP para autenticar al cliente al intercambiar el código por tokens. Proporcionada en plataforma **Ciudadanía Digital Developer** como `Secreto del cliente`. |
| `OIDC_SCOPE`                    | —                 | Conjunto de *scopes* solicitados al OP; se requiere mínimamente el **openid** para recibir el ID Token, `profile`, `fecha_nacimiento`, `email` y `celular`.                            |
| `OIDC_REDIRECT_URI`             | —                 | URL configurada en **Ciudadanía Digital Developer** a la que el OP redirigirá con `?code=` tras el login exitoso.                                                                      |
| `OIDC_POST_LOGOUT_REDIRECT_URI` | —                 | URL en la aplicación base a la que el OP redirigirá tras cerrar sesión (logout) para finalizar el flujo de identidad. Generalmente esta dirección es `http://localhost:8080/login`     |
| `SESSION_SECRET`                | —                 | Cadena aleatoria para firmar la cookie de sesión.                                                                                                                                      |

Para poder acceder a un usuario de prueba, la plataforma **Ciudadanía Digital Developer** proporciona una batería de usuarios de prueba con sus respectivas credenciales para poder acceder al OP de prueba. Se debe acceder a la plataforma [Yopmail](https://yopmail.com/es/wm) para poder ver el código de verificación con el correo del ciudadano de prueba y así poder acceder a la plataforma.

**Configurar la URL del frontend**

| Variable       | Valor por defecto | Descripción                                                           |
| -------------- | ----------------- | --------------------------------------------------------------------- |
| `URL_FRONTEND` |                   | dominio en el que se encuentra levantado el frontend, si corresponde. |

**Configuración para almacenamiento de archivos**

| Variable           | Valor por defecto | Descripción                                                 |
| ------------------ | ----------------- | ----------------------------------------------------------- |
| `STORAGE_NFS_PATH` |                   | ruta en el que se almacenarán los archivos, si corresponde. |

**Configuración de Logs**

| Variable                  | Valor por defecto | Descripción                                                                                |
| ------------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| `LOG_ENABLED`             | `true`            | Habilita el registro de logs.                                                              |
| `LOG_LEVEL`               | `info`            | Nivel de logs (en PRODUCCIÓN utilizar el valor `info`)                                     |
| `LOG_AUDIT`               | `application ...` | Habilita los logs de auditoria.                                                            |
| `LOG_CONSOLE`             | `true`            | Indica si se mostrarán los logs en la terminal (en PRODUCCIÓN utilizar el valor `false`)   |
| `LOG_SQL`                 | `true`            | Habilita los logs SQL (en PRODUCCIÓN utilizar el valor `false`)                            |
| `LOG_FILE_ENABLED`        | `true`            | Para guardar logs en ficheros.                                                             |
| `LOG_FILE_PATH`           | `/tmp/logs/`      | Ruta absoluta de la carpeta logs. Si esta vacio no se crearán los archvos.                 |
| `LOG_FILE_SIZE`           | `50M`             | Para el rotado de logs por tamaño (`K` = kilobytes, `M` = megabytes, `G` = gigabytes).     |
| `LOG_FILE_INTERVAL`       | `YM`              | Para el rotado de logs por tiempo (`Y` = cada año, `YM` = cada mes, `YMD` = cada día, ...) |
| `LOG_LOKI_ENABLED`        | `false`           | Para guardar logs en la nube con loki.                                                     |
| `LOG_LOKI_URL`            |                   | Indica la URL del servicio de loki para el registro de logs.                               |
| `LOG_LOKI_USERNAME`       |                   | Indica el nombre de usuario para autenticarse con el servicio de loki.                     |
| `LOG_LOKI_PASSWORD`       |                   | Indica la contraseña de usuario para autenticarse con el servicio de loki.                 |
| `LOG_LOKI_BATCHING`       | `true`            | Habilitado el envío de logs por lote cuando se utiliza loki.                               |
| `LOG_LOKI_BATCH_INTERVAL` | `5`               | Tiempo en segundos para el envío de logs con loki si `LOG_BATCHING=true`.                  |

**Configuración de Reportes**

| Variable      | Valor por defecto | Descripción                                                                 |
| ------------- | ----------------- | --------------------------------------------------------------------------- |
| `LOGO_REPORT` |                   | Logo del reporte en formato Base64 (sin el prefijo `data:image/png;base64,`). |

### Monitoreo de logs

Para más info sobre los códigos de error ver el archivo [src/core/logger/README.md](./src/core/logger/README.md)

Esta configuración es opcional y se utiliza para visualizar logs en tiempo real. Puede encontrar más información
respecto al despliegue de estos servicios en el siguiente enlace:
