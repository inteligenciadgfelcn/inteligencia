# 📋 CHANGELOG

> Todos los cambios notables en este proyecto serán documentados en este archivo.
## 🚀 Version [1.18.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.17.2-rc...1.18.1-rc) <small> ✨ Added: 2 🔧 Changed: 54</small>

### [1.18.1-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.18.0-rc...1.18.1-rc) <small>(2025-11-13)</small>
#### 🔧 Changed
* agregar archivos cicd (0cf8319e, @project_4353_bot_5b50eda698b811aedb4a73b081a43f10@noreply.gitlab.agetic.gob.bo)
* verificar deploy (aacb239f, @wilder.quispe)
* corregir despliegue (5e6cbb26, @wilder.quispe)
* corregir comando (f503e558, @wilder.quispe)
* corregir imagen (cbf1bf9c, @wilder.quispe)
* ver deploy (356834c9, @wilder.quispe)
* ver deploy (177b2f7a, @wilder.quispe)
* adas-cli (c56005a7, @wilder.quispe)
* update adas-agente executable binary (4543a8b8, @andres.teran)
* update adas-agente executable binary (c757238e, @andres.teran)
* update .dockerignore to exclude adas-agente script (360c27bc, @andres.teran)
* update adas-agente executable binary (6da213eb, @andres.teran)
* update adas-agente executable binary (97771350, @andres.teran)
* move adas-agente executable to project root (718f5e94, @andres.teran)
* update adas-agente executable binary (c998487d, @andres.teran)
* update adas-agente executable binary (d00e8bff, @andres.teran)
* add chmod to adas-agente executable in development pipeline (6804b246, @andres.teran)
* add ls command to development pipeline script (c9e6a8b9, @andres.teran)
* update adas-agente command paths in development pipeline (bc56ed1c, @andres.teran)
* remove adas-agente binary from build directory (2131fcd6, @andres.teran)
* remove symlink build directory (f5cc661d, @andres.teran)
* update development pipeline script to list build directory (d92e1ace, @andres.teran)
* remove adas-agente executable from dockerfile (9129e53d, @andres.teran)
* replace shell scripts with custom adas-agente executable (55046f9c, @andres.teran)
* configurar pipeline (5f2c24bc, @nadya.huanca)
* configurar pipeline (6b3a9563, @nadya.huanca)

### [1.18.0-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.17.2-rc...1.18.0-rc) <small>(2025-11-07)</small>
#### ✨ Added
* agregar más tipos de Documentos  para constrastación con SEGIP (691ae9ed, @melvy.montes)
* añadir nuevos scripts para la generación de reporte de pruebas e2e (30d7aa6c, @melvy.montes)
#### 🔧 Changed
* ajustar valor de campo tipoDocumento y actualizar reporte (1808a46a, @melvy.montes)
* actualizar reporte de test (edd4fa3d, @melvy.montes)
* ajustar forma en la descripción del test (c7aab73a, @melvy.montes)
* actualizar reporte de test e2e (3a1d50b5, @melvy.montes)
* actualizar pruebas para usuarioController (b3a36170, @melvy.montes)
* mejorar validación y agregar constante para tipoPersonaSegip (45e56907, @melvy.montes)
* actualizar reporte e2e (bf0df490, @melvy.montes)
* simplificar mocking de jest y eliminar casting (530be676, @melvy.montes)
* cambiar nombres de script para generación de reportes e2e (5bf30be7, @melvy.montes)
* agregar reporte de pruebas (3b401d20, @melvy.montes)
* actualizar info para la generación de reporte (12080e4b, @melvy.montes)
* ajustar ruta de generación de reporte y eliminar código innecesario (862fe655, @melvy.montes)
* eliminar comentarios (d7856c13, @melvy.montes)
* agregar script para la generación de reporte de pruebas e2e (1619aaa0, @melvy.montes)
* eliminar pruebas duplicadas de usuarioController (f42c1cd0, @melvy.montes)
* eliminar redundancias (a69628f6, @melvy.montes)
* agregar documentación para la ejecución de pruebas e2e (1a08a377, @melvy.montes)
* actualizar el .gitignore (79bacddd, @melvy.montes)
* mejorar la estructura y legibilidad de las pruebas de integración para usuarioController (355fe0de, @melvy.montes)
* actualizar package.json (b5ef2756, @melvy.montes)
* actualizar .gitignore (49a48dfb, @melvy.montes)
* agregar pruebas para el rol de técnico de usuarioController (8625b2a5, @melvy.montes)
* agregar pruebas para el rol de usuario de usuarioController (a1ca8ff0, @melvy.montes)
* eliminar código muerto, líneas comentadas  y agregar accestokenFake (6281ad1a, @melvy.montes)
* refactorizar para rol administrador (0d2ac8e1, @melvy.montes)
* renombrar archivo usuario.e2e-spec.ts a usuario-rol-administrador.e2e-spec.ts (6837d2c2, @melvy.montes)
* aumentar pruebas de integración a usuarios (4d2ec126, @melvy.montes)
* agregar pruebas de integración de usuarios (339d8238, @melvy.montes)
## 🚀 Version [1.17.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.16.0-rc...1.17.2-rc) <small> ✨ Added: 1 🔧 Changed: 15 🐛 Fixed: 2</small>

### [1.17.2-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.17.1-rc...1.17.2-rc) <small>(2025-10-15)</small>
#### 🔧 Changed
* 📦 actualiza versión de paquetes (minor) (e2e58b2b, @wilmer.quispe)
* 🔨 cambia target de ES2022 a ES2021 por temas de compatibilidad con typeorm (4b2e9d08, @wilmer.quispe)

### [1.17.1-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.17.0-rc...1.17.1-rc) <small>(2025-10-13)</small>
#### 🔧 Changed
* 🔨 refactoriza suite de pruebas de logger para omitir según ruta de logs (d598eb6c, @wilmer.quispe)
* 📦 actualiza dependencias reorganizando paquetes (d174c544, @wilmer.quispe)
* 📦 actualiza versión de paquetes (minor) (2ac0c359, @wilmer.quispe)
* 🔨 actualiza target a ES2022 y establece lib en ES2022 (4861f43d, @wilmer.quispe)
* 📦 actualiza versión de paquetes (major) 1ra parte (2e0aa0c2, @wilmer.quispe)
* 🔨 agrega format-check al hook de pre-commit (4e9ecf8c, @wilmer.quispe)
* 🧪 agrega pruebas unitarias para middlewares, interceptores y filtros (451910f5, @wilmer.quispe)
* 📦 actualiza versión de paquetes (minor) (a151602c, @wilmer.quispe)
* :recycle: renombra ControllerController a HealthController (e95b692b, @wilmer.quispe)
* 🧪 actualiza test para HealthController (6e0ed3cb, @wilmer.quispe)

### [1.17.0-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.16.0-rc...1.17.0-rc) <small>(2025-09-12)</small>
#### ✨ Added
* habilitar validación de SSL para PostgreSQL por variable de entorno (f1e3a8d8, @hans.cuentas)
#### 🔧 Changed
* cambia variables de entorno para SSL en conexión postgres (064352e9, @hans.cuentas)
* agrega test de conexión a base de datos postgres (44a19c4b, @hans.cuentas)
* actualizar descripción de DB_SSL_VALIDATE en la documentación (ec8b9a03, @hans.cuentas)
#### 🐛 Fixed
* 🐛 corregir implementación de SSL para la base de datos (80a44345, @gonzalo.yupanqui)
* conflictos (cd67af9d, @hans.cuentas)
## 🚀 Version [1.16.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.15.0-rc...1.16.0-rc) <small> 🔧 Changed: 6</small>

### [1.16.0-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.15.0-rc...1.16.0-rc) <small>(2025-08-25)</small>
#### 🔧 Changed
* formatear correctamente la documentacion (ba9538d4, @antonio.pantoja)
* actualizacion conexion ciudadania digital (01e500c2, @antonio.pantoja)
* actualizacion direccion URL de la documentacion API (35ec3759, @antonio.pantoja)
* actualizacion de nombre de  directorio en clonacion (0d51bff3, @antonio.pantoja)
* actualizacion de directivas de comandos (78ca7d60, @antonio.pantoja)
* actualizacion README (af1dfc54, @antonio.pantoja)
## 🚀 Version [1.15.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.14.3...1.15.0-rc) <small> ✨ Added: 4 🔧 Changed: 8</small>

### [1.15.0-rc](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.14.3...1.15.0-rc) <small>(2025-08-12)</small>
#### ✨ Added
* actualizar manejo de errores del health check (e42253cd, @nadya.huanca)
* actualizar funcion de health checks (82bff522, @nadya.huanca)
* agregar health checks para base de datos y ciudadanía digital (22eb0540, @nadya.huanca)
* agregar health checks para base de datos y ciudadanía digital (7c596f26, @nadya.huanca)
#### 🔧 Changed
* actualizar versión terminus (bbabecac, @nadya.huanca)
* instalar terminus (88c7b260, @nadya.huanca)
* actualizar archivo package-lock.json (901555b8, @nadya.huanca)
* arreglar package json lock (dc7d06a8, @nadya.huanca)
* arreglar paquetes (5a7d3f4a, @nadya.huanca)
* quitar paquetes (e415f242, @nadya.huanca)
* resolviendo conflicto de fusión (facd1246, @nadya.huanca)
* resolviendo conflicto de fusión (1e967848, @nadya.huanca)
## 🚀 Version [1.14.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.13.2...1.14.3) <small> ✨ Added: 5 🔧 Changed: 14</small>

### [1.14.3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.14.2...1.14.3) <small>(2025-07-25)</small>
#### 🔧 Changed
* actualiza ambiente en pipeline de test (bbbe3eb5, @hans.cuentas)
* actualiza nombre de ambiente en pipeline test (415b2be4, @hans.cuentas)
* limitar la ejecución del pipeline (663dddac, @hans.cuentas)
* probar despliegue con tag de prueba (ff3c3cc9, @hans.cuentas)
* agrega jobs para gestionar ambiente test (f7ecea39, @hans.cuentas)

### [1.14.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.14.1...1.14.2) <small>(2025-07-03)</small>
#### 🔧 Changed
* agregar documentación de ssl (cb587850, @nadya.huanca)

### [1.14.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.14.0...1.14.1) <small>(2025-07-03)</small>
#### 🔧 Changed
* quitar cambios de pruebas (6aa2f3bc, @nadya.huanca)
* quitar cambios de pruebas (9a4f471a, @nadya.huanca)

### [1.14.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.13.2...1.14.0) <small>(2025-06-13)</small>
#### ✨ Added
* agregar un readme para pruebas de carga (6c571fac, @nadya.huanca)
* agregar un readme para pruebas de carga (ac90ac24, @nadya.huanca)
* modificar variables de env.sample (ee56c221, @nadya.huanca)
* agregar variables de entorno para pruebas de carga (5e6fed12, @nadya.huanca)
* agregar arhivo con la configuración para pruebas de carga (27f1a4c1, @nadya.huanca)
#### 🔧 Changed
* cambiar regla de pruebas de carga de pipeline (c8e4a11e, @nadya.huanca)
* cambiar dominio de script de carga (3b339c6c, @nadya.huanca)
* actualizar configuración de k6 (21aa2433, @nadya.huanca)
* resolver conflictos de fusión (1f5682b5, @nadya.huanca)
* cambiar comando de las pruebas de carga (0fbe9edf, @nadya.huanca)
* agregar en build tests para pruebas de carga con k6 (0daf85a9, @nadya.huanca)
## 🚀 Version 1.13.x <small> 🔧 Changed: 2 🐛 Fixed: 1</small>

### [1.13.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/1.13.1...1.13.2) <small>(2025-06-12)</small>
#### 🔧 Changed
* actualiza la configuración (a6d4e5f7, @hans.cuentas)

### [1.13.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.13.0...1.13.1) <small>(2025-05-20)</small>
#### 🔧 Changed
* elimina configuraciones de Turbo repo (fa9d54d0, @hans.cuentas)
#### 🐛 Fixed
* actualiza la imagen de njsscan en el pipeline de merge request (9e5478f5, @hans.cuentas)
## 🚀 Version [v1.13.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.12.1...v1.13.0) <small> 🐛 Fixed: 1</small>

### [v1.13.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.12.1...v1.13.0) <small>(2025-05-07)</small>
#### 🐛 Fixed
* :bug: corrige la impresión de errores causados por sockets y/o streams (cb428764, @wilmer.quispe)
## 🚀 Version [v1.12.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.5...v1.12.1) <small> ✨ Added: 6 🔧 Changed: 15 🐛 Fixed: 3</small>

### [v1.12.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.12.0...v1.12.1) <small>(2025-05-07)</small>
#### ✨ Added
* :sparkles: agrega causa del error de validación para los logs de error (2d9fcd0e, @wilmer.quispe)
* :package: remueve paquetes obsoletos csurf y [@types](:/types)/cron (4753c987, @wilmer.quispe)
* :package: actualiza dependencias patch y minor (b573dc23, @wilmer.quispe)
#### 🔧 Changed
* :white_check_mark: adiciona referencias faltantes a los tests (4f7b8cec, @wilmer.quispe)
* actualiza comandos de adas-cli en archivos de pipeline (371123aa, @hans.cuentas)
* agrega flag -s en pipeline de merge para traer archihvo .env (d8349fc9, @hans.cuentas)
* quita USER en dockerfile setup (8444d4d5, @hans.cuentas)
* configura envs en dockerfiles (d4e6bd20, @hans.cuentas)
* agrega flag -u en merge pipeline para agregar variables de turbo repo (b5c43c8d, @hans.cuentas)
* optimiza multistages en dockerfile para mejorar cacheo en Kaniko (9a1d752d, @hans.cuentas)
* 🛠️ Agregar dependencias faltantes en las pruebas unitarias de RolService y UsuarioService (6b8b16e7, @gonzalo@gonzalo.gonzalo)
#### 🐛 Fixed
* mostrar los errores de validación en dtos anidados (28e393aa, @ricardo.paucara)
* conflictos (934e96a4, @hans.cuentas)

### [v1.12.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.5...v1.12.0) <small>(2024-12-10)</small>
#### ✨ Added
* adición de servicio "FileValidationService" con validaciones XSS para imágenes y PDFs (f9b0c6df, @ivillarreal)
* implementación de cambio de foto de perfil con validaciones de extensión y XSS (5b5c9f2f, @ivillarreal)
* crea endpoint para obtener usuario por id (74017041, @luis.choque)
#### 🔧 Changed
* 1.12.0 (99d3dbf9, @ivillarreal)
* corregir problema de build (2e59be6d, @jose.calancha)
* agregar validación del teléfono a las funciones encargadas de modificar y crear usuarios (d3e807b2, @jose.calancha)
* actualización de dependencias y corrección de tipado (cfe614fe, @ivillarreal)
* agregar el campo teléfono a la consulta del perfil y registrar cuenta (ddd482d1, @jose.calancha)
* agregar validación al campo teléfono (d20e6ed8, @jose.calancha)
* migrar husky (28130f20, @jose.calancha)
#### 🐛 Fixed
* adición de nombre de rol en lista de usuarios (6ec5e23b, @ivillarreal)
## 🚀 Version [v1.11.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.10.0...v1.11.5) <small> ✨ Added: 46 🔧 Changed: 74 🐛 Fixed: 32</small>

### [v1.11.5](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.4...v1.11.5) <small>(2024-11-17)</small>
#### ✨ Added
* se cambió la versió de node a 22 y se actualizo las dependencias (1ecaed89, @jose.calancha)
#### 🔧 Changed
* 1.11.5 (b8845166, @ivillarreal)
* ajuste en scripts de package.json para mantener compatibilidad con npm (dbcf4ad9, @ivillarreal)
* eliminación de migración de otro ORM (5697b6e5, @ivillarreal)
* se modificó los dockerfile para usar node --run y node 22 (889298c7, @jose.calancha)
* ajustar los scripts del archivo package.json a node 22 (dfba9b4e, @jose.calancha)
* corrección de tipo de estado para función de cambiarEstadoPorRoles (455647cd, @ivillarreal)
* cambiar el nombre del job a jest (948d52ac, @wilder.quispe)
* cambiar la duración de los artefactos en 5 minutos (4534ffc6, @wilder.quispe)
* pipelines reportes de test y seguridad (71bfa5d6, @wilder.quispe)
#### 🐛 Fixed
* remover espacio en blanco del script lint (e5bd7771, @jose.calancha)
* corregir el comando setup (3dc76045, @jose.calancha)
* :bug: corrección para obtener la IP correctamente (4ec722c0, @wilmer.quispe)
* :white_check_mark: corrección de los tests de mensajería (03713ec0, @wilmer.quispe)
* :bug: ajuste para controlar posible request undefined (388ba8bb, @wilmer.quispe)
* validado de roles activos (119cbcdf, @cristhian.conde)

### [v1.11.4](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.3...v1.11.4) <small>(2024-10-13)</small>
#### ✨ Added
* ✨ ajuste para las nuevas funcionalidades de logger (accc486d, @wilmer.quispe)
* ✨ mejoras y correcciones con el manejo de streams y pino (f45d1686, @wilmer.quispe)
* crea cuentas de usuarios con datos de personas (cfff7f29, @luis.choque)
* agregar cambios para el turbo (20935ec4, @jose.mamani)
* probar modificacion de package (4e57e990, @jose.mamani)
* implementar turborepo y test para la rama test (97efa4fe, @jose.mamani)
* cambiar rules de jobs (edffbb8a, @jose.mamani)
* configurar test con jest (3b368189, @jose.mamani)
* terminar pruebas de cacheo (665ef633, @jose.mamani)
* actualización de estilo de documentación (a86d6c86, @ivillarreal)
* :sparkles: se agregó la gestión de errores al validar una ip (dc3cd9f6, @neilgraneros11@gmail.com)
* volver cambios atras (c6dd0036, @jose.mamani)
* ver valores en trivy (fecdfb18, @jose.mamani)
* cambiar a images estables (c68901fa, @jose.mamani)
* agrega pruebas sast (72c98a93, @gustavo.marconi)
* agrega job para tests en el pipeline (6755f921, @gustavo.marconi)
* cambiar version de image (40dfb7da, @jose.mamani)
* cambiar tag runner (c8121263, @jose.mamani)
* cambiar image (8f36a31d, @jose.mamani)
* probar en test-pipeline (2b2ae339, @jose.mamani)
* actualizar automatizacion con scripts (64244254, @jose.mamani)
* corregir nombre de tag para develop (701c9770, @jose.mamani)
* cambiar condicional para que se ejecuto solo con la rama test (0501d74e, @jose.mamani)
* probar cambios (31994d25, @jose.mamani)
* actualizar automatizacion (b777c0bf, @jose.mamani)
#### 🔧 Changed
* 1.11.4 (7bf420c6, @ivillarreal)
* adición de log de error en caso de fallo en envio de correo en verificación de bloqueo de cuenta (9d76607d, @ivillarreal)
* eliminación de dependencia jest-junit duplicada (5d464dd5, @ivillarreal)
* ✨ cambiando código de error con el prefijo EXT (external) (426f94d7, @wilmer.quispe)
* ver errores de merge (cbc7bc54, @jose.mamani)
* probar test jobs (b9457479, @jose.mamani)
* corregir ambientes (e07caa76, @wilder.quispe)
* modificar rules (70cf8d05, @jose.mamani)
* probar tests (b5e6b519, @jose.mamani)
* obtener cambios de la rama feat/archivos-k8s (dee87b1c, @jose.mamani)
* preparar presentación (0d199f33, @wilder.quispe)
* probar cacheo 3 (4a85add8, @jose.mamani)
* probar cacheado 2 (95345ed1, @jose.mamani)
* corregir ambiente en trivy (2fc9d560, @wilder.quispe)
* ejecutar cicd cluster kt7 (31b40238, @wilder.quispe)
* ejecutar cicd cluster kt7 (be86301e, @wilder.quispe)
* probar cacheo (0eaf93ed, @jose.mamani)
* se añadio campos de información de fecha de creación para módulos de Módulos, Roles y Usuarios (1f70f106, @ivillarreal)
* pull de la rama test, corregir conflictos (2d006e01, @wilder.quispe)
* reordenar pipelines (85f1ea7a, @wilder.quispe)
* :recycle: se simplificó la función getIPAddress utilizando guard clauses (99526d0b, @neilgraneros11@gmail.com)
* ejecutar dockerfile.merge (887bc373, @quispe@gmail.com)
* agregar tag merge a k8s-merge (9094be1f, @quispe@gmail.com)
* ajustes versión pipelines (156aaab2, @quispe@gmail.com)
* .dockerignore (4995e200, @hans.cuentas)
* format check en merge build (e972b63a, @hans.cuentas)
* pipelines actualizado (61c0b464, @andres.teran)
* cambio de ruta vault en merge build (491b7076, @hans.cuentas)
* se elimina copia de archivos samples (c3118d2e, @elias.condori)
* se actualiza pipeline para ambiente test (7fd5daae, @elias.condori)
*  remove unnecessary file copy in build step (c71912f5, @andres.teran)
*  remove unnecessary file copy in build step (d8bc4aab, @andres.teran)
* 1.9.3 (654802cf, @ivillarreal)
* pipeline solo en test (c6241346, @juan.torrez)
#### 🐛 Fixed
* escuchar evento merge para trivy (49e43be5, @wilder.quispe)
* corregir conflictos pull (4713c731, @wilder.quispe)
* :bug: ofuscando datos sensibles (OWASP A09:2021 mitigation) (7b46c6a7, @wilmer.quispe)
* arreglar donde apunta el merge (69c97cda, @jose.mamani)
* modificar merge de develop (e510b0d7, @jose.mamani)
* corregir k8s-dev (e6f4e69f, @jose.mamani)
* añadida función decodeBase64 al registrar una nueva cuenta, denominación de tipos de Ciudadanía y Correo (c270df39, @ivillarreal)
* :package: se reemplazó el paquete ip por ip-address (a10a1207, @neilgraneros11@gmail.com)
* actualizar tags (8aa9b124, @jose.mamani)
* actualizar tags (61c648cb, @jose.mamani)
* corregir merge (423d4f75, @jose.mamani)
* agregar diagrama de arquitectura y ajustar pipelines (f8fa5344, @jose.mamani)
* ajustar pipelines (35ea3328, @jose.mamani)

### [v1.11.3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.2...v1.11.3) <small>(2024-07-28)</small>
#### ✨ Added
* cambiar tag (e44b95bb, @jose.mamani)
* cambiar la condicional para test (c04e4dbe, @jose.mamani)
* agregar cambio de imagen (58e605ae, @jose.mamani)
* usar imagen version 2 (af71b397, @jose.mamani)
* cambiar sin tags (20eeee64, @jose.mamani)
* agregar -D (24a4ce21, @jose.mamani)
* cambiar images del pipelines (3586e47b, @jose.mamani)
* log del deploy argo (efc91201, @jose.mamani)
* configuracion con scripts (cd3b4d13, @jose.mamani)
* resolver conflicto del merge (e72b3097, @jose.mamani)
* configurar automatizacion (90001378, @jose.mamani)
* actualización de dependencias, soporte para Node 20 🎉 (f4ed6df8, @ivillarreal)
* :sparkles: upgrade mejoras y correcciones del módulo de logger (97a735e7, @wilmer.quispe)
#### 🔧 Changed
* 1.11.3 (a12b8f74, @ivillarreal)
* actualización de depencencias NestJS 10.3.10 (52ae4c38, @ivillarreal)
* develop pipeline (cafb85cc, @elias.condori)
* actualización de dependencias NestJS 10.2.1, etc (58932808, @ivillarreal)
* se elimina "QueryDeepPartialEntity" de respositorio de parámetros (637a43f4, @ivillarreal)
* :bug: corrección en el dto ParamUUID (a10fdd54, @wilmer.quispe)
* :memo: actualizando archivos README.md e INSTALL.md (c7949bc3, @wilmer.quispe)
* 1.9.1 (41a5266b, @ivillarreal)
* correción de importación de dto en test de parámetros (9bda6566, @ivillarreal)
* correción en .gitignore para ignorar archivos de configuración de VS Code (3c3fcede, @ivillarreal)
* :sparkles: actualizando estructura del módulo de parámetros (7692d9ce, @wilmer.quispe)
* actualizada documentación de API's formato OpenAPI desde Swagger (0fbd9f40, @ivillarreal)
* corrección en referencia de API's que usan ApiBearerAuth (ea10f548, @ivillarreal)
* corrección de variables sin usar (54bd5c23, @ivillarreal)
* :memo: actualizando scripts de base de datos (33288834, @wilmer.quispe)
* actualización de dependencias Nest 10.1.17, TypeScript 5.2 y otros (d3672190, @ivillarreal)
#### 🐛 Fixed
* cambio de usernameFromContext por userFromContext desde nest-authz (076dbd1e, @ivillarreal)
* modificado número de saltos para generar un Hash a 15 (69bf5d08, @ivillarreal)
* corregir k8s (66b2ce91, @jose.mamani)
* log error (478dab84, @jose.mamani)
* cambiar nombre de tag del runner (e015b687, @jose.mamani)
* corrección en sintaxis de uso de URL para evitar contatenación de parámetros (00e262f5, @ivillarreal)
* corrigiendo y añadiendo swagger a los endpoints (fb9ef4a7, @douglasjaviercolquem@gmail.com)
* corregido error ocasionado al registrar un usuario con el registro de una persona existente (b402e8dd, @ivillarreal)

### [v1.11.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.1...v1.11.2) <small>(2024-06-08)</small>
#### ✨ Added
* se agrega **commit-and-tag-version** en reemplazo de **standard-version** que fue deprecada (f8a607bf, @ivillarreal)
* implementación de node:fs/promises para uso asincrono de sistema de archivos (8086f461, @ivillarreal)
* actualización de dependencias NestJS 10.3.9 y otros (8ca8300c, @ivillarreal)
#### 🔧 Changed
* 1.11.2 (37649b2c, @ivillarreal)
* corrección de estado de inactivación de módulos (0b32095d, @ivillarreal)
#### 🐛 Fixed
* corrección en doble declaración de ApiProperty en DTO de actualización de parámetros (fc99c292, @ivillarreal)

### [v1.11.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.11.0...v1.11.1) <small>(2024-04-21)</small>
#### ✨ Added
* cambio de estados genéricos a estados espesíficos por módulo (9ba53ef7, @ivillarreal)
#### 🔧 Changed
* 1.11.1 (093626a4, @ivillarreal)
* actualización de dependencias, commitlint (d0315e0c, @ivillarreal)
#### 🐛 Fixed
* adición de [@types](:/types)/passport-jwt y actualización menor de dependencias (ec6242fc, @ivillarreal)
* actualización de dependencias NestJS 10.3.7 y otros (fc021bd0, @ivillarreal)
* corrección en importaciones de utilidades de validación en lugar de Class Validator (497d7652, @ivillarreal)

### [v1.11.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.10.0...v1.11.0) <small>(2024-03-15)</small>
#### ✨ Added
* se cambió las importaciones con rutas relativas por las rutas con alias (f664588f, @alfredochoque.c@gmail.com)
* mejora de descripciones de API, para claridad y consistencia (54e6a0d0, @Fernandonina611@gmail.com)
* aplicando alias en las importaciones del módulo Parametro (b6924330, @alfredochoque.c@gmail.com)
#### 🔧 Changed
* 1.11.0 (4d9ff866, @ivillarreal)
* corrección de importación y Prettier el seeder de roles (5d0aa80f, @ivillarreal)
* se centralizó las definiciones de estados en las Entidades (2a03c1d4, @Fernandonina611@gmail.com)
* downgrade de librería Bcrypt por error persistenten con Docker y actualizaciones de seguridad (36b074e6, @ivillarreal)
* se centralizó las definiciones de estados en las Entidades (223609dd, @Fernandonina611@gmail.com)
* corrección de test unitario de API de estado (5cf4c532, @ivillarreal)
* corrección de importaciones restantes con rutas con alias (1999ca93, @ivillarreal)
* corrección de formato de documentación de las APIs según Prettier (f7f71122, @Fernandonina611@gmail.com)
* :sparkles: ajuste de scripts con ShellCheck SC2148 (4f9fd816, @wilmer.quispe)
* ajuste de ortografía - descripción (a934f042, @neilgraneros11@gmail.com)
* actualización de dependencias NestJS 10.3.2 y retirada dependencia reflect-metadata (ab6f6a62, @ivillarreal)
#### 🐛 Fixed
* configuraciones faltantes para el mapeo de las rutas con alias en los tests (71c8c8ec, @alfredochoque.c@gmail.com)
## 🚀 Version [v1.10.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.9.3...v1.10.0) <small> ✨ Added: 1 🔧 Changed: 6</small>

### [v1.10.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.9.3...v1.10.0) <small>(2024-03-10)</small>
#### ✨ Added
* :sparkles: removiendo el código de error de los mensajes que se envían al cliente (f9ac4d33, @wilmer.quispe)
#### 🔧 Changed
* 1.10.0 (bab899b8, @ivillarreal)
* actualización de dependencias 10/03/2024 (f34489a9, @ivillarreal)
* actualización de depedencias vulnerables - 6 de marzo de 2024 (ca4dcd9e, @ivillarreal)
* :sparkles: mejoras visuales en la impresión de logs (0962944c, @wilmer.quispe)
* corrección en nombre de variable uuidCiudadano en PersonaDTO (36c4b887, @ivillarreal)
* corrección de nombre de variable de "uuidCiudadano" (6a400f40, @ivillarreal)
## 🚀 Version [v1.9.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.8.1...v1.9.3) <small> ✨ Added: 49 🔧 Changed: 48 🐛 Fixed: 9</small>

### [v1.9.3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.9.2...v1.9.3) <small>(2024-01-21)</small>
#### 🔧 Changed
* 1.9.3 (654802cf, @ivillarreal)

### [v1.9.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.9.1...v1.9.2) <small>(2023-12-03)</small>
#### 🔧 Changed
* 1.9.2 (03ef9adb, @ivillarreal)
* actualización de dependencias: NestJS 10.2.10 y otros (0e793591, @ivillarreal)
* actualización de dependencias NestJS 10.2.1, etc (58932808, @ivillarreal)
* se elimina "QueryDeepPartialEntity" de respositorio de parámetros (637a43f4, @ivillarreal)
* :bug: corrección en el dto ParamUUID (a10fdd54, @wilmer.quispe)
* :memo: actualizando archivos README.md e INSTALL.md (c7949bc3, @wilmer.quispe)
* 1.9.1 (41a5266b, @ivillarreal)
#### 🐛 Fixed
* correcciones de espaciado entre sentencias condicionales en nueva versión de Lint (6e17bd1e, @ivillarreal)

### [v1.9.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.9.0...v1.9.1) <small>(2023-10-26)</small>
#### ✨ Added
* actualización de dependencias, soporte para Node 20 🎉 (f4ed6df8, @ivillarreal)
* :sparkles: upgrade mejoras y correcciones del módulo de logger (97a735e7, @wilmer.quispe)
#### 🔧 Changed
* 1.9.1 (92c6f3d1, @ivillarreal)
* correción de importación de dto en test de parámetros (9bda6566, @ivillarreal)
* correción en .gitignore para ignorar archivos de configuración de VS Code (3c3fcede, @ivillarreal)
* :sparkles: actualizando estructura del módulo de parámetros (7692d9ce, @wilmer.quispe)
* actualizada documentación de API's formato OpenAPI desde Swagger (0fbd9f40, @ivillarreal)
* corrección en referencia de API's que usan ApiBearerAuth (ea10f548, @ivillarreal)
* corrección de variables sin usar (54bd5c23, @ivillarreal)
* :memo: actualizando scripts de base de datos (33288834, @wilmer.quispe)
* actualización de dependencias Nest 10.1.17, TypeScript 5.2 y otros (d3672190, @ivillarreal)
#### 🐛 Fixed
* corrigiendo y añadiendo swagger a los endpoints (fb9ef4a7, @douglasjaviercolquem@gmail.com)
* corregido error ocasionado al registrar un usuario con el registro de una persona existente (b402e8dd, @ivillarreal)

### [v1.9.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.8.1...v1.9.0) <small>(2023-08-17)</small>
#### ✨ Added
* :sparkles: ajuste en error stack para que las rutas se vuelvan enlaces (83b6db8a, @wilmer.quispe)
* :sparkles: mejora en la definición de rutas con diferente tiemout (9cd3cb14, @wilmer.quispe)
* :sparkles: mejoras en el valor del origen del error (6f0494ea, @wilmer.quispe)
* :sparkles: logs de auditoría para el servicio de mensajería (562653e4, @wilmer.quispe)
* :sparkles: se agregaron tipos de logs de auditoría (daaad832, @wilmer.quispe)
* :sparkles: ajuste para evitar duplicidad de registro de logs (8dcd7d44, @wilmer.quispe)
* :sparkles: agregando pid en los logs de auditoría: (8db84528, @wilmer.quispe)
* :sparkles: agregando config para mostrar logs por consola (be4c2493, @wilmer.quispe)
* :sparkles: agregando reqId a los logs de auditoría (fa1852d5, @wilmer.quispe)
* :sparkles: funcionalidad para imprimir logs por consola (eb30f2a6, @wilmer.quispe)
* :sparkles: función para habilitar logs en tiempo de ejecución (bf15239d, @wilmer.quispe)
* :sparkles: ajuste en el origen para casos del tipo logger.error(msg) (9214dc2d, @wilmer.quispe)
* :sparkles: exponiendo funciones getIPAddress y getReqID (817df2b2, @wilmer.quispe)
* :sparkles: ajustando config por defecto para el registro de logs (eaf0e4ee, @wilmer.quispe)
* :sparkles: ajustando nombre de variables para los logs de auditoría (5ab26520, @wilmer.quispe)
* :sparkles: ajuste en el nombre de los ficheros de logs (d6cd52d2, @wilmer.quispe)
* :sparkles: ajustes para mantener la compatibilidad con veriones anteriores (0e9158f4, @wilmer.quispe)
* :sparkles: ajuste para compatibilidad con versiones anteriores (cffd9bcf, @wilmer.quispe)
* :sparkles: agregando custom exceptions (45204435, @wilmer.quispe)
* :sparkles: actualizando logs de auditoría para el casbin (8c998d65, @wilmer.quispe)
* :sparkles: agregando la funcionalidad logger.audit() TG-11 (d44e0aad, @wilmer.quispe)
* :sparkles: se agregó la función audit (639d6466, @wilmer.quispe)
* :sparkles: removiendo campos redundantes de mensajes de tipo info (a2ca3c62, @wilmer.quispe)
* :sparkles: ajustando config para el TimeoutInterceptor (92b84944, @wilmer.quispe)
* :sparkles: agregando tests para el registro de logs TG-11 (2a3a1892, @wilmer.quispe)
* :sparkles: ajuste en el formato del error de conexión TG-11 (11fd5aaf, @wilmer.quispe)
* :construction: actualizando los códigos de error TG-11 (db54f626, @wilmer.quispe)
* :sparkles: ajuste de formato para errorStack TG-11 (75e1c47a, @wilmer.quispe)
* :sparkles: cambiando sistema por appName TG-11 (45ec3a96, @wilmer.quispe)
* :sparkles: cambiando detalle por metadata TG-11 (d9e87188, @wilmer.quispe)
* :sparkles: baseLog agregado para el registro de metadatos TG-11 (a208cede, @wilmer.quispe)
* :sparkles: agregando el campo fecha formateado TG-11 (4cbda695, @wilmer.quispe)
* :sparkles: agregando el campo código de error TG-11 (d9e60ec3, @wilmer.quispe)
* :sparkles: agregando el campo código de error TG-11 (646a46c1, @wilmer.quispe)
* :sparkles: ajustes en los campos error, codigo y causa TG-11 (5fc1f451, @wilmer.quispe)
* :construction: actualizando mensajes de error para los guards TG-11 (198bda33, @wilmer.quispe)
* :construction: ajuste en el campo detalle de ErrorInfo TG-11 (1e89ce34, @wilmer.quispe)
* :construction: ajustando logs con el nuevo formato TG-11 (4fc95347, @wilmer.quispe)
* :sparkles: removiendo config de grafana (a530ff76, @wilmer.quispe)
* :construction: ajustando formato para el registro de logs TG-11 (711e68ed, @wilmer.quispe)
* :sparkles: ajustes para la función logger.error() TG-11 (99502af4, @wilmer.quispe)
* funcinoalidad para imprimir mesajes de error desde ErrorInfo (1ab89db3, @wilmer.quispe)
* agregando ejemplo del campo origen en ErrorInfo (78029c5a, @wilmer.quispe)
* :sparkles: separando ExceptionManager del módulo de logs (e8b6f4e1, @wilmer.quispe)
* :sparkles: agregando config para levantar grafana en local TG-11 (a2e16472, @wilmer.quispe)
* :construction: mejoras y correcciones en el módulo de logs TG-11 (bffcfa9a, @wilmer.quispe)
* :construction: módulo de logs versión 2 TG-11 (4c1e14df, @wilmer.quispe)
#### 🔧 Changed
* 1.9.0 (38d981a9, @ivillarreal)
* corrección de datos de prueba de usuarios por defecto (792bcac5, @ivillarreal)
* :white_check_mark: actualizando pruebas unitarias para los logs (1c1bd877, @wilmer.quispe)
* correcciones de code smells e importaciones, añadidos iconos para evitar logs de error para Safari (2c45c7b2, @ivillarreal)
* cambio de favicon por defecto (da61af42, @ivillarreal)
* validación del config para las pruebas con logger (96ee6d8c, @wilmer.quispe)
* :white_check_mark: actualizando pruebas para el módulo de logs (c78c5d45, @wilmer.quispe)
* :white_check_mark: actualizando tests unitarios para el módulo de logs (c5525b6d, @wilmer.quispe)
* ajuste para evitar conflictos con palabras reservadas (e791f3ef, @wilmer.quispe)
* removiendo archivos innecesarios (78a967e7, @wilmer.quispe)
* removiendo comentarios (bbf5283e, @wilmer.quispe)
* :memo: actualizando README.md (41dcf2f8, @wilmer.quispe)
* :sparkles: actualizando pruebas unitarias y de integración para los logs (bac2655e, @wilmer.quispe)
* :memo: actualizando README.md (f0feafbf, @wilmer.quispe)
* corrección de sintaxis (cb9aa23f, @wilmer.quispe)
* :memo: actualizando archivo INSTALL.md (22b18b45, @wilmer.quispe)
* :sparkles: ajuste en la carpeta de logs (0bab6cdc, @wilmer.quispe)
* :sparkles: agregando tests para los ficheros de logs TG-11 (39090461, @wilmer.quispe)
* revirtiendo habilitación de contrastación con SEGIP al actualizar usuario (829083ca, @carlomonttt16@gmail.com)
* corrección en el código de error (56bdde00, @wilmer.quispe)
* :memo: agregando ejemplos de implementación de logs TG-11 (29780023, @wilmer.quispe)
* :sparkles: ajustando mensajes de error TG-11 (ca2fbee5, @wilmer.quispe)
* :construction: reordenando módulo de logger (7787eb0d, @wilmer.quispe)
* ajuste en la impresión de logs (ccf96d50, @wilmer.quispe)
* :memo: actualizando documentación para el despliegue (cac64d5e, @wilmer.quispe)
* ajuste para el ofuscado de datos en los logs (9130a125, @wilmer.quispe)
* :sparkles: removiendo clases obsoletas (122881e7, @wilmer.quispe)
* :memo: Actualizando README.md para el config de grafana (4e7c5bc4, @wilmer.quispe)
* removiendo campos irrelevantes del log (49bab387, @wilmer.quispe)
* removiendo payload.idRol de JWT Strategy (b0e264ab, @wilmer.quispe)
* :construction: refactor del método printErrorInfo TG-11 (d158d492, @wilmer.quispe)
#### 🐛 Fixed
* :bug: cambiando a rutas absolutas en el stack del error (893788ae, @wilmer.quispe)
* correcciones de tipado en peticiones y separación de lógica de negocio desde respositorio de usuarios (ff12d287, @ivillarreal)
* corrección en el constructor de excepciones de logger (232ad6fb, @wilmer.quispe)
* :sparkles: ajuste para evitar conflictos con palabras reservadas (888a43c1, @wilmer.quispe)
* :bug: corrección en LoggerMiddleware forRoot (af7fa915, @wilmer.quispe)
* corrección en actualización de datos de usuario, en caso de no usar validación de Segip (ab9d23e9, @carlomonttt16@gmail.com)
## 🚀 Version [v1.8.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.7.3...v1.8.1) <small> ✨ Added: 8 🔧 Changed: 9 🐛 Fixed: 19</small>

### [v1.8.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.8.0...v1.8.1) <small>(2023-08-09)</small>
#### 🔧 Changed
* 1.8.1 (4274ac47, @ivillarreal)
* correcciones de seguridad en dependencias transitivas (3e5e3ef9, @ivillarreal)
* eliminación de datos de prueba de proveedor OIDC (4aebe537, @ivillarreal)
* se corrige error de función no definida en test de usuarios (5d4ce375, @ivillarreal)
* se agrego api solo para pruebas para obtener código de activación de un usuario (799dc83b, @carlomonttt16@gmail.com)
#### 🐛 Fixed
* se añade PoliticaDTO para controlador y servicios de autorización (b5a14d91, @ivillarreal)

### [v1.8.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.7.3...v1.8.0) <small>(2023-07-28)</small>
#### ✨ Added
* añadido tipo genérico que servira para inferir el tipo de respuesta en controladores (a8ca1ce1, @ivillarreal)
* actualización de dependencias NestJS 10 (23b620dd, @ivillarreal)
* comentarios para entity de usuarios (6bc23285, @ivillarreal)
* añadida función de validación de token JWT al hacer el cambio con refreshToken ignorando la expiración (19c342cb, @ivillarreal)
* refresh token (b0037023, @ecanqui)
* cambio en API de perfil para retornar rol activo (b67b49c0, @ecanqui)
* cambio de rol (4554e4f5, @ecanqui)
* se adiciona idRol en token (958e8c91, @ecanqui)
#### 🔧 Changed
* 1.8.0 (58fe8542, @ivillarreal)
* correcciones a comentarios en todas las entidades (671d9a92, @ivillarreal)
* actualización de dependencias NestJS 9.4.2 y TypeScript 5.1 (f2250d39, @ivillarreal)
* cambio de rol (fe2b08e5, @ecanqui)
#### 🐛 Fixed
* se añade tipado faltante en variables y funciones de repositorios y servicios (fba4a122, @ivillarreal)
* se eliminan tipos QueryDeepPartialEntity ya que TypeScript infiere los tipos (c365cf99, @ivillarreal)
* mejorada gramática de mensajes de respuesta (c50fd657, @ivillarreal)
* se agrega 'rol' en token para validar únicamente ese rol en Casbin 🛡️ (e41b7ffa, @ivillarreal)
* corregido log de error, solo en caso de JsonWebTokenError (fea3fd78, @ivillarreal)
* correcciónes (612591a9, @samuel.guerrero)
* correción de ortografía de comentarios (eea8da85, @samuel.guerrero)
* se define comentarios de campos de Personas (bec8f7d2, @samuel.guerrero)
* se define comentarios de campo de UsuariosRol (b20ab7e4, @samuel.guerrero)
* se define comentarios de campos de Rol (587a535c, @samuel.guerrero)
* se define comentarios de campos de modulo (c4579d97, @samuel.guerrero)
* se define comentarios de campos de casbin (04b69b0c, @samuel.guerrero)
* se define comentarios de campos de Sesión (d8b0a243, @samuel.guerrero)
* se define comentarios de campo de RefresToken (c75b09b7, @samuel.guerrero)
* se define comentarios de campos de Auditoria (a7f1939c, @samuel.guerrero)
* se define comentarios de campos de Parametro (106779b6, @samuel.guerrero)
* modificados test unitarios para nuevos métodos de obtenerRolActual y buscarUsuarioPerfil (7da5d785, @ivillarreal)
* corregida asignación de rol inicial a proveedor de identidad (5f73fa13, @ivillarreal)
## 🚀 Version [v1.7.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.6...v1.7.3) <small> ✨ Added: 17 🔧 Changed: 23 🐛 Fixed: 20</small>

### [v1.7.3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.7.2...v1.7.3) <small>(2023-07-14)</small>
#### ✨ Added
* agregado tipo 'PayloadType' para controlar el tipo de Payload que se va a firmar (ed584a4b, @ivillarreal)
#### 🔧 Changed
* 1.7.3 (99b60543, @ivillarreal)
* actualización de dependencias [@nestjs](:/nestjs)/cli 10.1.8 y [@typescript](:/typescript)-eslint/eslint-plugin 6.0 (26c8e332, @ivillarreal)
* corregidos errores de gramática y ortografía, especialmente en OpenAPI (e167c4cf, @ivillarreal)
* actualización de dependencias Nest.JS 10.0.5 (b7dd396c, @ivillarreal)
#### 🐛 Fixed
* corrección de valor duplicado en es.enum.ts (10cecc8d, @ivillarreal)
* corrección de error que ocasionaba que se despliegue API-DOC en producción 🤦‍♂️ (3ff5fc02, @ivillarreal)
* corrección de codeSmell en filtro de roles para payload en función de refreshToken (3d1e2746, @ivillarreal)
* se corrigieron sentencias where anidadas de los repositorios de TypeORM usando brackets (d6af3832, @carlomonttt16@gmail.com)
* corrección de tipado en instancia de Enforcer de Casbin (149a30ba, @ivillarreal)

### [v1.7.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.7.1...v1.7.2) <small>(2023-07-02)</small>
#### ✨ Added
* actualización de dependencias NestJS 10 (84c91fb4, @ivillarreal)
* comentarios para entity de usuarios (65f78e75, @ivillarreal)
#### 🔧 Changed
* 1.7.2 (b178347c, @ivillarreal)
* correcciones a comentarios en todas las entidades (e11f17b4, @ivillarreal)
* actualización de dependencias NestJS 9.4.2 y TypeScript 5.1 (a35e908f, @ivillarreal)
#### 🐛 Fixed
* correcciónes (540cb425, @samuel.guerrero)
* correción de ortografía de comentarios (a7a9b205, @samuel.guerrero)
* se define comentarios de campos de Personas (3e9b28b0, @samuel.guerrero)
* se define comentarios de campo de UsuariosRol (deb60760, @samuel.guerrero)
* se define comentarios de campos de Rol (387fec8f, @samuel.guerrero)
* se define comentarios de campos de modulo (b939c777, @samuel.guerrero)
* se define comentarios de campos de casbin (88f88746, @samuel.guerrero)
* se define comentarios de campos de Sesión (01048785, @samuel.guerrero)
* se define comentarios de campo de RefresToken (35e97092, @samuel.guerrero)
* se define comentarios de campos de Auditoria (743cbc97, @samuel.guerrero)
* se define comentarios de campos de Parametro (91df9f34, @samuel.guerrero)

### [v1.7.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.7.0...v1.7.1) <small>(2023-05-22)</small>
#### ✨ Added
* añadida ordenación para módulo de políticas (a24e0b85, @ivillarreal)
* añadida ordenación para módulo de roles (b7bfb2af, @ivillarreal)
* añadida ordenación para módulo de módulos (ff599e54, @ivillarreal)
* añadida utilidad que determina el valor del campo y sentido para criterios de orden en repositorios (9469697d, @ivillarreal)
* añadida ordenación para repositorio de parámetros (77a8c1a3, @ivillarreal)
* añadido filtro de estado activo para lista de grupo de parámetros (0b605031, @ivillarreal)
* añadidos varios criterios de ordenación para lista de usuarios (7ed7dec6, @ivillarreal)
* añadido parámetro de ordenación para repositorio de usuarios (dcff7b4e, @ivillarreal)
#### 🔧 Changed
* 1.7.1 (c4e290c2, @ivillarreal)
* eliminación de archivos para pipelines de gitlab (b061a3fc, @ivillarreal)
* se agrego desplegar ArgoCD (10056138, @andres.teran)
* optimizadas condiciones de criterio de orden en repositorios (eeeef419, @ivillarreal)
* las utilidades de orden se mueven a Paginación DTO para su mejor comprensión (033ee21a, @ivillarreal)
* se limita la variable de orden a solamente un criterio (f67d89ce, @ivillarreal)
* corrección en Code Smell en función para obtener instancia de LoggerService (5fe92fa9, @ivillarreal)
* actualización de dependencias, TypeScript 5 y NestJS 9.4.2 (40aa3715, @ivillarreal)
* :memo: Ejemplo de cómo colocar el path para el registro de logs (54d7dd18, @wilmer.quispe)
#### 🐛 Fixed
* corregido tipo de dato de rol para DTO de usuarios (62981c46, @ivillarreal)
* :bug: cambiando el método de impresión de logs por consola (8439a0af, @wilmer.quispe)

### [v1.7.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.6...v1.7.0) <small>(2023-04-02)</small>
#### ✨ Added
* :sparkles: ajustes para mostrar logs junto con jest (075b1e90, @wilmer.quispe)
* :sparkles: mejoras en los mensajes y registro de logs (b7a1cea0, @wilmer.quispe)
* :sparkles: parámetro para guardar logs en una subcarpeta (65a4147e, @wilmer.quispe)
* :sparkles: controlando posibles errores al imprimir mensajes con logger (e49748d7, @wilmer.quispe)
* :sparkles: ajuste en los comandos de ejecución de scripts (cffa063c, @wilmer.quispe)
* :sparkles: registro de errores de las consultas SQL sobre los ficheros de logs (425055ce, @wilmer.quispe)
#### 🔧 Changed
* 1.7.0 (e7c1ef7a, @ivillarreal)
* actualización de dependencias Nest 9.3.12 (faa76075, @ivillarreal)
* :sparkles: removiendo el contexto de las clases (e8bbe4eb, @wilmer.quispe)
* :sparkles: agregando PrintSQL al archvo index.ts (7402dbbc, @wilmer.quispe)
* :sparkles: cambiando tipo de acceso de variables en LoggerService (280e6bd4, @wilmer.quispe)
* :memo: actualizando archivo INSTALL.md (f69e0533, @wilmer.quispe)
* se actualizaron variables client_id, client_secret y de redirección de cudadanía a login/ciudadanía (c2bd4f0c, @ivillarreal)
#### 🐛 Fixed
* :bug: correciones para cuando se utiliza el rotado de logs (070704d5, @wilmer.quispe)
* :bug: correciones para cuando se utiliza el rotado de logs (88497824, @wilmer.quispe)
## 🚀 Version [v1.6.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.5.0...v1.6.6) <small> ✨ Added: 41 🔧 Changed: 59 🐛 Fixed: 54</small>

### [v1.6.6](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.5...v1.6.6) <small>(2023-02-26)</small>
#### ✨ Added
* :sparkles: agregando tipos al seeder del casbin (d5cdd7d7, @wilmer.quispe)
#### 🔧 Changed
* 1.6.6 (ba752496, @ivillarreal)
* actualización de dependencias [@nestjs](:/nestjs)/core 9.3.9 y otros (fdb880b2, @ivillarreal)
* se reorganizaron los seeders de módulos, incluyendo la propiedad de orden (fedaddb7, @ecanqui)
* actualización de dependencias que incluyen TypeORM 0.3.12 y nestjs/axios 2.0 con correcciones de tipado (ec7b4099, @ivillarreal)
* pipeline ambiente test (c2b5a3b1, @andres.teran)
* pipeline ambiente test (3d56cb51, @andres.teran)
* limpiando pipeline (63fba0fa, @andres.teran)
* actualización openid-client 5.3.4 (cba9d2f4, @ivillarreal)
* actualización de dependencias NestJS 9.3.1 (cfcbadb8, @ivillarreal)
* reemplazadas excepciones manuales por clases que extienden de HttpException de [@nestjs](:/nestjs)/common (deecf6a5, @ivillarreal)
* actualización de dependencias [@nestjs](:/nestjs)/cli 9.1.9 y otros (9eec4d0a, @ivillarreal)
* aplicando técnica guard clauses para controladores de usuarios, autenticación, servicio SEGIP (9aeae905, @ivillarreal)
* cambio de icono de modulo, por 'widgets', eliminados tipos de funciones redundantes (f90d5e9d, @ivillarreal)
* actualización de versión node (00c5d835, @andres.teran)
* mantenimiento pipeline (1d07472b, @andres.teran)
#### 🐛 Fixed
* se corrigieron las validaciones de la propiedad de orden de los módulos y las descripciones en los seeders (75765593, @ivillarreal)
* corregido mensaje de validación de correo como usuario existenten (d00a5f6e, @ivillarreal)
* corregido permiso de cambio de contraseña en seeder de casbin (ba63c230, @ivillarreal)
* añadido filtro de nro. de documento para repositorio de usuarios, cambiando a filtro de consultas con Brackets (85c1d357, @ivillarreal)
* ajuste en el query para filtros en rol.repository (b8b61fcc, @santos.chambilla)
* :bug: resolviendo problemas de instancias por contexto en LoggerService (3e9d12cc, @wilmer.quispe)
* corregido ordén de lista de módulos y submódulos (1c668bd3, @ivillarreal)
* refactorización casbin rules (e96f78b3, @german.limachi)

### [v1.6.5](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.4...v1.6.5) <small>(2023-01-24)</small>
#### 🔧 Changed
* 1.6.5 (0f3759e1, @ivillarreal)
* actualización de dependencias, reemplazado ES2017 por ES2022 (400e85c2, @ivillarreal)
* actualización de dependencias, otra vez (85bea8bb, @ivillarreal)
* actualización de dependencias, corrección de vulnerabilidades (13855f76, @ivillarreal)
* actualización de dependencias jsdom 21.0.0 (8fdd5571, @ivillarreal)
* actualización de dependencias NestJS 9.1.8 (74c2580a, @ivillarreal)
* actualización de dependencias mitigando problemas de seguridad (83c20934, @ivillarreal)
* ajustes para evitar problemas de tipado en los repositorios (4fa48e58, @wilmer.quispe)
* :package: actualizando dependencia [@nestjs](:/nestjs)/jwt a v10.0.1 (3c269bf2, @wilmer.quispe)
* :rotating_light: actualizando reglas de eslint (b7f0d79e, @wilmer.quispe)
* ajuste para las nuevas reglas de eslint (d50674e6, @wilmer.quispe)
#### 🐛 Fixed
* cambio de versión a ES2021, dado que TypeORM no es compatible con ES2022 (b01bf83f, @ivillarreal)
* validación y corrección de test de parámetros (05f2f382, @ivillarreal)
* habilitados test para analisis en de lint, corregidos test de usuario service (3a51f4b7, @ivillarreal)
* corregido tipado de respuesta de funciones de authentication servicio (4ffc906b, @ivillarreal)
* estandarizado formato de actualizar usuario DTO para que sea similar a otros servicios 🧹 (1fa10ef2, @ivillarreal)
* estandarizados formatos de peticiones para módulos y roles, con sus respectivos DTO's (2dc68acd, @ivillarreal)

### [v1.6.4](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.3...v1.6.4) <small>(2022-12-11)</small>
#### 🔧 Changed
* 1.6.4 (86bababe, @ivillarreal)
* actualización de dependencias NestJS 9.2.1 (4e5a30cd, @ivillarreal)
* soporte para npm v9 (407d87ae, @wilmer.quispe)
* actualización de dependencias NestJS 9.2 (94203e68, @ivillarreal)
* cambiando la importación de componentes con rutas relativas [#9](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/issues/9) (3cca2747, @wilmer.quispe)
* renombrando moduloPadre por modulo [#9](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/issues/9) (92174805, @wilmer.quispe)
* 1.6.3 (3af63fe6, @ivillarreal)
#### 🐛 Fixed
* actualización de dependencias, corrección en mensajes de correo y estado de activación de cuenta (49f87d8e, @ivillarreal)
* corrección en busqueda de políticas, que ocasionaba que los filtros no funcionaran (73b81f0e, @ivillarreal)
* corrección identificador de módulo para seeders (005f2747, @ivillarreal)

### [v1.6.3](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.2...v1.6.3) <small>(2022-11-09)</small>
#### ✨ Added
* se arreglo el comando setup en CI (72e8616f, @andres.teran)
* crud de roles (902f7f53, @alvaro.martinez)
* ajustes node 18, ahora que es LTS (6a34980d, @ivillarreal)
#### 🔧 Changed
* 1.6.3 (3eb6af1f, @ivillarreal)
* renombrando fidModulo por moduloPadre (1459dda2, @wilmer.quispe)
* actualización node 16 -> 18 (6df82d1e, @andres.teran)
* actualización de dependencias NestJS 9.1.6 y openid-client 5.2.1 (972f7a62, @ivillarreal)
#### 🐛 Fixed
* ajuste en seeder para creación de registros con fecha por defecto y usuario sistema (9b4e1e12, @ivillarreal)
* cambios de fid_modulo a id_modulo y removiendo el término módulo padre (a934fde5, @wilmer.quispe)
* cambio de nombre de meotodos de roles-table a roles-todos (c96fcbde, @alvaro.martinez)
* cambio de nombre de api de roles-table a roles-todos (f830318a, @alvaro.martinez)
* cambio de ruta rol a roles (d5726e15, @alvaro.martinez)
* ajustes en loggerService para evitar logs gigantescos causados por axios (8ef145dc, @wilmer.quispe)

### [v1.6.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.1...v1.6.2) <small>(2022-10-26)</small>
#### ✨ Added
* cambiando por defecto SQL_LOG a true (f5e7308a, @wilmer.quispe)
* se adicionó el alias dev para ejecutar el comando "npm run start:dev:sql" (422b4e4d, @wilmer.quispe)
* cambios en el comando de ejecución (npm run start:dev:sql) (c98cf248, @wilmer.quispe)
* mensajes de casbin guards actualizados (f863b641, @wilmer.quispe)
* cambiando a plural los nombres de las tablas (15898b3c, @wilmer.quispe)
* mejoras en el mensaje de error de SQL (adc69081, @wilmer.quispe)
* cambios en los logs para las consultas sql (960a6d05, @wilmer.quispe)
* se completan los test faltantes para buscarPorId en usuarioService (979baf26, @wilmer.quispe)
#### 🔧 Changed
* 1.6.2 (93794689, @ivillarreal)
* actualización de dependencias NestJS 9.1.4 (70338e69, @ivillarreal)
* corregidos code smells de importaciones (5095d30f, @ivillarreal)
#### 🐛 Fixed
* corrección en envio de correos de restablecimiento de contraseña (47bdb989, @ivillarreal)
* corrección en actualización de datos al crear o validar usuario OIDC (05c8afdd, @ivillarreal)
* mejoras en la validación OIDC y correcciones cuando se utiliza logger en las migraciones (dff2a491, @wilmer.quispe)
* agregado nuevo ClientId y ClientSecret en nuevo entorno de AGCS (54776dd7, @ivillarreal)
* parse fecha con formato ISO para los logs de las consultas (fd79986c, @wilmer.quispe)
* controlando respuesta datos.errores y cambios en base-external-service (c14d0eb2, @wilmer.quispe)
* modificada documentación mencionando que sacar un fork ya no es necesario 🤦‍♂️ (5d54f82c, @ivillarreal)

### [v1.6.1](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.6.0...v1.6.1) <small>(2022-10-01)</small>
#### ✨ Added
* añadido servicio que reenvia el correo de activación para usuarios con cuenta sin verificación para rol administrador (bd584a3b, @ivillarreal)
* se agregó el validador de tipos enumerados buildCheck (6e2a1c4f, @wilmer.quispe)
#### 🔧 Changed
* 1.6.1 (8791d945, @ivillarreal)
* actualización dependencias NestJS 9.1.4 y Openid-Client 5.1.10 (4f87a68c, @ivillarreal)
* removiendo el uso de entidades desde la capa de servicio (f7988da8, @wilmer.quispe)
* filtros en función a parámetros (0060a739, @ecanqui)
#### 🐛 Fixed
* modificadas funciones de repositorio de usuario para usar update en lugar de save, dado que TypeOrm soporta ambas (2fd90cc5, @ivillarreal)
* corregidos repositorios de actualización de datos de activación y recuperación de cuenta (3a8db8c6, @ivillarreal)
* corregido método que crea usuarios con Ciudadanía Digital con rol usuario por defecto, logs de correos fallidos, refactor de validarOCrearUsuarioOidc (2fb1ac12, @ivillarreal)
* modificados métodos de usuario.service que usaban if's anidados, varias optimizaciones de código (1a7070c1, @ivillarreal)
* respuesta del refresh token (6eb6eaf5, @wilmer.quispe)

### [v1.6.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.5.0...v1.6.0) <small>(2022-09-26)</small>
#### ✨ Added
* adicionando validaciones para dto (75256df4, @wilmer.quispe)
* merge con feature/log-files (bba78831, @wilmer.quispe)
* :sparkles: validación global de parámetros adicionado (496a2223, @wilmer.quispe)
* buildCheck adicionado para validar estados (0aa29e51, @wilmer.quispe)
* desactivando logs de JWTGuard (c6f0a7c4, @wilmer.quispe)
* regla de eslint eqeqeq adicionado (7cad55e7, @wilmer.quispe)
* se adicionó la impresión de rutas en el cargado de la aplicación (391df101, @wilmer.quispe)
* adicionando id del usuario autenticado a reqId (56ebae04, @wilmer.quispe)
* mejoras en los mensajes de error de los metodos de autenticación (644a7e7d, @wilmer.quispe)
* se cambió la forma de instanciar logger (f89f6917, @wilmer.quispe)
* adicionando transacción a crear usuario (a6545be3, @wilmer.quispe)
* incorporación de transaccion por defecto (afe8219b, @ecanqui)
* resolviendo conflictos del merge con develop (a7e3a31b, @wilmer.quispe)
* cambios en la forma de instanciar logger (cea5ad0a, @wilmer.quispe)
* parámetro LOG_LEVEL adicionado a las variables de entorno (2201cc23, @wilmer.quispe)
* redact path adicionado para ocultar información sensible en la consola (bd955aa9, @wilmer.quispe)
* servicio estado actualizado con más información (38e221ee, @wilmer.quispe)
* loggerService adicionado a OidcStrategy del módulo de autenticación (d1516106, @wilmer.quispe)
* timestamp adicionado para los logs de la consola (028480a3, @wilmer.quispe)
* servicio SIN actualizado con BaseExternalService (c0878fc4, @wilmer.quispe)
* clase BaseExternalService adicionado para instanciar los servicios externos (902aef5c, @wilmer.quispe)
* ip address adicionado al log de inicio de la aplicación (d2faeebe, @wilmer.quispe)
* actualizando servicios y controladores con BaseService y BaseController (48ca6f07, @wilmer.quispe)
* logger module actualizado (146d16f0, @wilmer.quispe)
* actualización de dependencias Nest 9.1.1 (b32b66e1, @ivillarreal)
* mejoras en logo nest (9ce9e763, @wilmer.quispe)
* normalizando modelos con el campo _estado (269aa711, @wilmer.quispe)
#### 🔧 Changed
* 1.6.0 (964b9080, @ivillarreal)
* cambiando baseRepository (533b0714, @wilmer.quispe)
* modificación declaración de estados (5b65798d, @ecanqui)
* validador de estados (c7fdf7ab, @wilmer.quispe)
* actualización de dependencias NestJS 9.1.2 (e9d4e1ce, @ivillarreal)
* transacción adicionado a la creación de usuario (9089b5a1, @wilmer.quispe)
* crear usuario (e210c265, @wilmer.quispe)
* esquema proyecto adicionado al script para crear la base (ba559b97, @wilmer.quispe)
* actualización NestJS 9.1.1 (38579f9b, @ivillarreal)
* actualización de dependencias Nest 9.1.3 (be111745, @ivillarreal)
* se agrego en la documentación la configuración de schema del proyecto (c1120c4e, @falvarez)
* mejoras en la documentación, .env.sample e INSTALL.md actualizado (4731c389, @wilmer.quispe)
* función para validar el estado de las entities (1970b0e6, @wilmer.quispe)
* campos de auditoria renombrados (5db87b11, @wilmer.quispe)
* actualización de campos de auditoria e id's segun AGETIC/RA/0101/2022 (acab934b, @ivillarreal)
#### 🐛 Fixed
* manejo de errores en el envio de correos (9262bc4b, @wilmer.quispe)
* sample para crear scripts (330503b1, @wilmer.quispe)
* eliminación de pipe validacion en controladores, corrección de path de class-validator (2301f2d1, @ecanqui)
* corrección en los seeders de usuario (c40c93e6, @wilmer.quispe)
* cambio de nombre variable paramsIdDto (cc9879dd, @ecanqui)
* añadido campo _usuarioCreación a repositorios de parámetros, módulos y usuario; nuevo DTO IsNumberString (ca60c48f, @ivillarreal)
* print logo (8d666f8e, @wilmer.quispe)
* ajuste de lint para seeder de parámetros e importacionies de logger (7c8d4081, @ivillarreal)
* resuelto el error al imprimir objetos por la consola (284c0bee, @wilmer.quispe)
* cambios en ExternalServiceException para el registro de logs (d041020f, @wilmer.quispe)
* solucionado la visualización de logs con pm2 (52de2c47, @wilmer.quispe)
* obtener appName y appVersion para el modo producción (6c04f47c, @wilmer.quispe)
* cargado de las variables de entorno para LoggerConfig (0e8b7839, @wilmer.quispe)
* corrección en validación de fidModulo nulo para creación de secciones (efe20a1c, @ivillarreal)
* los usuarios creados por administrador tienen estado "ACTIVO" por defecto (01a7c52b, @ivillarreal)
* corrección en interpretación de formato fecha de persona (baaa341d, @ivillarreal)
* corrección en validación de oidc strategy para formato de user info con scope profile (0f5b2fb9, @ivillarreal)
* creación automática de la carpeta de logs (d754b004, @wilmer.quispe)
* modificadas instancias condicionales anidadas, para evitar anidación de condicionales (22a146e7, @ivillarreal)
## 🚀 Version [v1.5.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.4.0...v1.5.0) <small> ✨ Added: 8 🔧 Changed: 2 🐛 Fixed: 7</small>

### [v1.5.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.4.0...v1.5.0) <small>(2022-08-24)</small>
#### ✨ Added
* añadido flujo de activación de cuenta, con envio de correo y ajustes menores de logs (3412178c, @ivillarreal)
* se agregó morgan para logs de desarrollo (b6ddb4e2, @wilmer.quispe)
* mejoras en los mensajes de log para el modo desarrollo (0b3721f2, @wilmer.quispe)
* agregando variables de entorno a LogService (ec329ed2, @wilmer.quispe)
* añadido PinnoLogger para el contexto de cada controlador, corregidos test de logs y propiedad req (e20a197f, @ivillarreal)
* agregando carpeta de logs por defecto al gitignore (dd4f28b3, @wilmer.quispe)
* ficheros de log actualizados (e587dfb5, @wilmer.quispe)
* añadidas API's necesarias para crear y recuperar una cuenta con envio de correos (d2708a3c, @ivillarreal)
#### 🔧 Changed
* 1.5.0 (e0a34d24, @ivillarreal)
* 1.4.0 (d527f771, @ivillarreal)
#### 🐛 Fixed
* mensajes de error para errores personalizados (1867dd72, @wilmer.quispe)
* log en modo producción (8c5f1557, @wilmer.quispe)
* log de todas las rutas registradas (5940712b, @wilmer.quispe)
* mejoras en la configuración de logs (0ed85682, @wilmer.quispe)
* log service test (66bad157, @wilmer.quispe)
* modificado registro de cuenta con datos del usuario sin datos personales y tipos de dato fecha (76c39a01, @ivillarreal)
* filtros de politicas (ae277eb9, @alvaro.martinez)
## 🚀 Version [v1.4.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.3.2...v1.4.0) <small> ✨ Added: 1 🔧 Changed: 1 🐛 Fixed: 1</small>

### [v1.4.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.3.2...v1.4.0) <small>(2022-08-15)</small>
#### ✨ Added
* actualización de librerías NestJS 9.0.9 (b309f4d0, @ivillarreal)
#### 🔧 Changed
* 1.4.0 (3e747de6, @ivillarreal)
#### 🐛 Fixed
* corrección en paginado para API's de parámetros, módulos y usuarios (2c6e5d8f, @ivillarreal)
## 🚀 Version [v1.3.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.2.0...v1.3.2) <small> ✨ Added: 1 🔧 Changed: 6 🐛 Fixed: 7</small>

### [v1.3.2](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.3.0...v1.3.2) <small>(2022-08-07)</small>
#### 🔧 Changed
* 1.3.2 (9969bb52, @ivillarreal)
* modificadas reglas de prettier, para evitar uso de semicolon (f4eaf7d6, @ivillarreal)
* modificado método que restaura contraseña (91ef77de, @ivillarreal)
#### 🐛 Fixed
* modificadas instancias condicionales anidadas, para evitar anidación de condicionales (ad75c94a, @ivillarreal)
* añadido tipado en transacción para restaurar contraseña (d3b836b3, @ivillarreal)
* actualización de manual, mencionando la creación de esquemas (107d921a, @ivillarreal)
* actualización de dependencias NestJS 9.0.7 (dccd4479, @ivillarreal)

### [v1.3.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.2.0...v1.3.0) <small>(2022-07-31)</small>
#### ✨ Added
* añadido filtro para secciones en API en módulos (92e3816e, @ivillarreal)
#### 🔧 Changed
* 1.3.0 (e668c1ce, @ivillarreal)
* actualización de dependencias core NestJS, esLint y TypeORm (e3d5facc, @ivillarreal)
* añadida instrucción en readme.md para generar changelog (f26ae9ec, @ivillarreal)
#### 🐛 Fixed
* correcciones de ortografía y versión de [@types](:/types)/pdfmake (def332ca, @ivillarreal)
* :wrench: Ajustes en actualizacion de un modulo (516b1473, @37087417+csullaez@users.noreply.github.com)
* :wrench: Ajustes en creacion de modulos (d3f5b243, @37087417+csullaez@users.noreply.github.com)
## 🚀 Version [v1.2.x](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.1.6...v1.2.0) <small> ✨ Added: 3 🔧 Changed: 5 🐛 Fixed: 10</small>

### [v1.2.0](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.1.6...v1.2.0) <small>(2022-07-26)</small>
#### ✨ Added
* versión actualizada en package-lock.json (326621a5, @wilmer.quispe)
* respuesta this.success adicionado para responder desde el crontrolador (42f262be, @wilmer.quispe)
* removiendo paquete requerido pm2 (f7829cfc, @wilmer.quispe)
#### 🔧 Changed
* 1.2.0 (fbde3b44, @ivillarreal)
* actualización de dependencias, ya no es necesario el flag --legacy-peer-deps (9f0b416b, @ivillarreal)
* pipelines + docker k8s (11712a26, @andres.teran)
* actualización de dependencias (nestjs 9) y readme (065cdf92, @ivillarreal)
* actualizado README.md (99625a9e, @wilmer.quispe)
#### 🐛 Fixed
* corrección en filtro de rutas con submodulos (2d6531e1, @ivillarreal)
* añadidas API's para activar/inactivar módulos con permisos y ajuste en API de perfil para módulos activos (eb3c6070, @ivillarreal)
* corrección de parámetros de paginado para API de modulos, actualización de dependencias (b94dfc77, @ivillarreal)
* correcciones para cicd (c0d66e52, @andres.teran)
* cambio columna tipo enum por varchar (9f7af7f8, @ecanqui)
* permitir copia node_modules en pipeline (0f81b1fd, @andres.teran)
* comando para inicio (e95e5672, @andres.teran)
* obtener desde vault el nombre de chart (6e5339eb, @andres.teran)
* copy default index.ts.sample (2ff6f8e8, @andres.teran)
* legacy-peer-deps (91c54035, @andres.teran)
## 🚀 Version v1.1.x <small> ✨ Added: 17 🔧 Changed: 29 🐛 Fixed: 37</small>

### [v1.1.6](https://gitlab.agetic.gob.bo/agetic/agetic/proyectos-base/agetic-nestjs-base-backend/-/compare/v1.1.0...v1.1.6) <small>(2022-07-11)</small>
#### 🔧 Changed
* documentación actualizada para la configuración de base de datos (07bc09b5, @wilmer.quispe)
* información acerca de las versiones actualizada (0ed2aefb, @wilmer.quispe)
* actualizado readme para espesificar que existe el tag v1.1.0 con TypeORM 0.2 (a202665f, @ivillarreal)
* actualización a TypeOrm 0.3, cambios en scripts npm, repositorios y servicios  🥳 (fbdcb879, @ivillarreal)
* agregacion de esquemas (01b87899, @alvaro.martinez)
#### 🐛 Fixed
* format (d477553c, @wilmer.quispe)
* habilitando validación de lint de pre-commit (51589d3d, @wilmer.quispe)
* modificación de origen de librería connect-typeorm a versión de npm (4de9091c, @ivillarreal)
* corregido inicio de sesión con ciudadanía, cambiando la librería de persistencia de sesiones a connect-typeorm con una conexión espesífica (b3c2d7d5, @ivillarreal)
* corrección en referencia de tabla sesiones (a62279f8, @ivillarreal)
* adición de esquemas por defecto en variable de entorno (0841df3b, @ivillarreal)
* cambio de timestamptz a timestamp (5d3806ec, @alvaro.martinez)

### v1.1.0 <small>(2022-07-04)</small>
#### ✨ Added
* "CI configurado como sample" (4424151c, @wilmer.quispe)
* adición de filtros en Políticas (8f3e7b3c, @santos.chambilla)
* adicion de filtros para módulos (931fdf4c, @santos.chambilla)
* adicion de parametros en modulo de parametros (4240c1fc, @alvaro.martinez)
* funcionalidad para el crud de modulo (6c0ffcbe, @santos.chambilla)
* archivos de configuración y documentación actualizada :sparkles: (5244e85d, @wilmer.quispe)
* exp, iat adicionado a PassportUser (dfc02ad0, @wilmer.quispe)
* tipo Request extendido con PassportUser (c8c5f47a, @wilmer.quispe)
* check-node-version cambiado como dependencia externa (0e60713b, @wilmer.quispe)
* check-node-version adicionado (294266df, @wilmer.quispe)
* actualizadas dependencias a últimas versiones compatibles (57574b07, @ivillarreal)
* actualizadas dependencias a últimas versiones compatibles (ebe9efb7, @ivillarreal)
* añadida rotación de logs periodicamente con file-stream-rotator (acd003ea, @ivillarreal)
* añadido comando de preinstalación que añade archivo metadata_never_index para que Spotlight ignore la indexación de node_modules (solo para Mac 😉) (28aed93f, @ivillarreal)
* añadido campo para descripción de módulos (9301520d, @ivillarreal)
* añadido campo 'nombre' para roles (ff7b1636, @ivillarreal)
* se mejora orden de nuevos menus (7189ce17, @alvaro.mamani.qp@gmail.com)
#### 🔧 Changed
* archivo README.md actualizado (54cceb04, @wilmer.quispe)
* añadido flag strictNullChecks, controlando que las variables sean o no definidas en controlares servicios y tests (0001053f, @ivillarreal)
* actualización de todas las dependencias (excepto TypeORM) (e7e10e2e, @ivillarreal)
* actualización de dependencias 29/05/2022 (3884561a, @ivillarreal)
* actualizadas dependencias dayjs, dotenv, nestjs-spelunker, openid-client (a65a60eb, @ivillarreal)
* añadida dependencia [@nestjs](:/nestjs)/axios que reemplaza la importación de las instancias de HttpService y HttpModule para servicios de Segip, Sin y mensajería (Alertin) (2c3438fd, @ivillarreal)
* actualizadas dependencias: jest, tsconfig-paths (44ff82bb, @ivillarreal)
* actualizadas todas las dependencias, corregidos errores de prettier y configuración de getPinoHttpConfig (2ab2e956, @ivillarreal)
* se mejora manejo de assets (94d0bf22, @alvaro.mamani.qp@gmail.com)
* se adiciona test para usuario service (b20e01f2, @alvaro.mamani.qp@gmail.com)
* se actualiza documento de descripcion de directorios (907db636, @alvaro.mamani.qp@gmail.com)
* se adiciona diagrama c4 con formato plantuml (d0436be2, @alvaro.mamani.qp@gmail.com)
* se agrega test para text.service (b8d7d0b9, @almamani)
* se completa test faltante para buscarUsuarioId en usuario.service (b4145980, @almamani)
* se usa nanoid para generacion de contrasenas (42ee48ac, @almamani)
* se corrige test authentication.controller (2d428707, @almamani)
* se reemplazo cookieService en vez de http.module (2ce58ffa, @almamani)
* se corrigio tests para refactor manejo de filas y total en abstract controller (7e5b46ba, @almamani)
* se integra manejo de filas y total en abstract controller (56de2ab4, @almamani)
* actualizacion paquete uuid (b1b191fd, @almamani)
* se modifica .eslintrc para ignorar seeds y specs (3f825d0e, @almamani)
* se adiciona commitLint al precommit (0653ae94, @almamani)
* se refactoriza metodo de contrastacion en segip.service (ea360c91, @almamani)
* modificacion reglas eslint (262fd223, @almamani)
#### 🐛 Fixed
* actualización de dependencias y algunas correccioines de ortografía (dfd5cd7b, @ivillarreal)
* modificadas secciones de código al crear usuarios que son posiblemente nulas (10446bad, @ivillarreal)
* modificados métodos actualizarContrasena, inactivar usuarios, par solo devolver id y estado (cc4c0e2e, @ivillarreal)
* definidos valores de tipo de dato de entidades parámetro, refresh token, sessión, casbin, módulo, rol, personal, usuario (d5e891ff, @ivillarreal)
* corregidas importaciones para módulo de parámetros y actualización de dependencias, a las últimas compatibles (4833e048, @ivillarreal)
* lint errors (2ce8f5f7, @alvaro.martinez)
* corrección callback de ciudadanía digital, sin redirección (becf8467, @ivillarreal)
* corrección cierre de sesión al usar idToken (8ed3a76c, @ivillarreal)
* correcciónes sutiles de code smells y ortografía (8a1dbc90, @ivillarreal)
* corrección cierre de sesión al usar idToken (4a1eeec4, @ivillarreal)
* corregida definición de cookie segura ocasionado por la asignación de una cadena como booleano (5cbf815b, @ivillarreal)
* añadidos controladores, repositorios y servicios para permitir registar a un usuario que ingrese con Ciudadanía Digital (da6dafbd, @ivillarreal)
* corregida dependencia circular LogService en core.module que ya estaba importada en app.module (05f69761, @ivillarreal)
* corregidos test por dependencia deprecada HttpService y orden de dependencias (a0112d2d, @ivillarreal)
* corregidos test unitarios ocasionado por mala importación de dependencias (a83b21e8, @ivillarreal)
* corregido error en respuesta de al eliminar políticas que ocasionaba que la respuesta sea vacía (ec0ca676, @ivillarreal)
* corregido error en respuesta de al eliminar políticas que ocasionaba que la respuesta sea vacía (28063832, @ivillarreal)
* corregidos métodos CRUD de authorization controller que ocasionaban que no se esperara a efectuar el proceso (dc7d9901, @ivillarreal)
* eliminados espacios de .env.sample (b348485f, @ivillarreal)
* corregidos métodos CRUD de authorization controller que ocasionaban que no se esperara a efectuar el proceso (93da40c4, @ivillarreal)
* eliminados espacios de .env.sample (b3687526, @ivillarreal)
* corrección en tipado en parámetros de métodos handler para pino (b3b27467, @ivillarreal)
* cambio de versión en package-lock.json (10467a95, @ivillarreal)
* establecidas últimas versiónes compatibles de todas las dependencias (cbf3320b, @ivillarreal)
* corregido error en filtro de usuarios (f00eed15, @ivillarreal)
* se modifican seeders con nuevo orden de módulos para frontend (9b843c57, @ivillarreal)
* modificado permiso de API de políticas, dado que usa el mismo para agregar y modificar (01cf3dcd, @ivillarreal)
* añadido ValidationPipe en api de lista de parámetros, para obtener lista paginada (a3ecc662, @ivillarreal)
* corregido terrible error que podia ocasionar un problema de concurrencia al modificar parametros (f8155ca3, @ivillarreal)
* corregidos seeder de iconos (79516c17, @ivillarreal)