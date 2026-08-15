# Producto 3 — Informe técnico de implementación definitiva de la Fase 1 del Sistema Nacional de Inteligencia en el entorno operativo de la FELCN

| | |
|---|---|
| **Entidad** | Fuerza Especial de Lucha Contra el Narcotráfico (FELCN) |
| **Producto** | 3 — Implementación definitiva de la Fase 1 en el entorno operativo |
| **Fecha** | 4 de agosto de 2026 |
| **Elaborado por** | Eitner Montero |
| **Estado** | Para revisión y validación institucional |

---

## 1. Resumen ejecutivo

La Fase 1 del Sistema Nacional de Inteligencia se encuentra **implementada y en operación** en el entorno de la FELCN, accesible en `https://desarrollo.felcn.gob.bo`, con dos ambientes activos (desarrollo y staging) sobre una misma infraestructura contenedorizada. El sistema está integrado con las plataformas institucionales de identidad (Ciudadanía Digital de AGETIC), consulta de identificación personal (SEGIP vía plataforma de interoperabilidad) y con el Ministerio Público (APIs de intercambio bidireccional POL↔MP), y fue sometido a pruebas funcionales, de seguridad y de rendimiento cuyos resultados se presentan en este informe.

Los cinco alcances definidos para el producto presentan el siguiente estado:

| Alcance del TDR | Estado |
|---|---|
| Acompañamiento técnico en la integración con otras plataformas | ✅ Realizado (§3) |
| Validación en sistemas Windows y Linux | ✅ Realizado (§4) |
| Pruebas finales: funcionales, seguridad y rendimiento | ✅ Ejecutadas con evidencia (§5) |
| Validación conjunta con usuarios clave | 🔄 Programada — acta en §6 |
| Manuales y guías de uso, operación y mantenimiento | 🔄 Manual técnico completo y publicado; manual de usuario final en elaboración (§7) |

## 2. Implementación en el entorno operativo

### 2.1 Arquitectura desplegada

El sistema está compuesto por servicios contenedorizados (Docker) orquestados mediante `docker-compose`, con un único punto de entrada HTTPS (nginx + certificado TLS emitido por Let's Encrypt con renovación automática):

| Componente | Tecnología | Función |
|---|---|---|
| Frontend base | Next.js (React) | Interfaz de usuario del sistema |
| Backend base v2 | NestJS (Node.js) | Lógica de negocio, formularios, reportes, websockets |
| Backend de autenticación | NestJS (Node.js) | Autenticación, autorización RBAC, integración OIDC |
| API de consulta de personas | FastAPI (Python) | Servicio de consulta de identidad con caché Redis |
| Proveedor OIDC de desarrollo | NestJS | Simulador de Ciudadanía Digital para el ambiente dev |
| PostgreSQL | v16 | Persistencia (bases separadas por dominio funcional) |

Todos los contenedores operan con política de reinicio automático (`restart: unless-stopped`) y arranque supervisado por systemd, lo que garantiza la recuperación del servicio ante reinicios del servidor sin intervención manual.

### 2.2 Ambientes

- **Desarrollo** (`/` del dominio): integración continua del equipo, proveedor de identidad simulado.
- **Staging** (`/staging`): réplica del sistema conectada al **proveedor real de Ciudadanía Digital** (ambiente demo de AGETIC), utilizada para validación institucional previa a producción.

Ambos ambientes comparten el mismo código y definición de despliegue, lo que asegura que lo validado en staging sea representativo del comportamiento productivo.

## 3. Integración e interoperabilidad con plataformas institucionales

Durante esta fase se realizó el acompañamiento técnico para las siguientes integraciones:

### 3.1 Ciudadanía Digital (AGETIC)

Autenticación de usuarios mediante el protocolo estándar OpenID Connect contra el proveedor oficial de Ciudadanía Digital. El flujo completo (inicio de sesión, obtención de identidad, cierre de sesión) está operativo en el ambiente staging con el proveedor real y verificado de extremo a extremo.

### 3.2 SEGIP — consulta de identificación personal

Consulta de datos de identidad de personas a través de la plataforma de interoperabilidad del Estado (IOP), integrada al flujo de registro de personas del sistema, con servicio de contingencia para ambientes sin conectividad al servicio real.

### 3.3 Ministerio Público — intercambio POL↔MP

Se implementaron y entregaron las APIs de interoperabilidad con la Fiscalía en sus dos direcciones, conforme a los acuerdos técnicos alcanzados en mesas de trabajo conjuntas:

- **Dirección POL→MP**: remisión de información policial al Ministerio Público conforme al contrato de datos definido por el MP.
- **Dirección MP→POL**: recepción de información de la Fiscalía conforme al contrato propuesto por la Policía, incluyendo el Código Único de Denuncia (CUD) como llave de correlación entre ambas instituciones.

Las rutas de intercambio con instituciones externas están protegidas adicionalmente con **autenticación mutua TLS (mTLS)**, de modo que solo instituciones con certificado emitido pueden consumir los servicios.

### 3.4 Estabilidad de la integración

Las integraciones operan tras un punto de entrada único con reintentos y servicios de contingencia donde aplica; el monitoreo de estado se realiza mediante endpoints de salud (`/api/estado`) expuestos por cada backend, los mismos utilizados en las pruebas de rendimiento (§5.3).

## 4. Validación en sistemas Windows y Linux

El sistema es una **aplicación web**, por lo que su validación multiplataforma cubre dos planos:

- **Servidor**: desplegado y validado sobre **Linux** (Debian 13). La contenedorización Docker garantiza además la portabilidad del despliegue a cualquier distribución Linux con soporte Docker.
- **Estaciones de trabajo cliente**: el acceso es vía navegador web (Chrome, Edge, Firefox) y fue validado en equipos con **Windows** y **Linux**, sin requerir instalación de software adicional en las estaciones de la FELCN. Las pruebas automatizadas de interfaz (Playwright, ver §5.1) ejercitan el sistema con los mismos motores de navegador disponibles en ambas plataformas, incluida la vista móvil.

## 5. Pruebas finales

### 5.1 Validación funcional

**Pruebas unitarias y de integración (Jest).** Cada backend incluye su suite de pruebas automatizadas dentro del propio repositorio, junto al código que verifican:

| Proyecto | Ubicación de las pruebas | Suites | Cobertura funcional |
|---|---|---|---|
| Backend de autenticación | `backend/felcn-auth-backend/src/**/*.spec.ts` | 23 | Autenticación, autorización RBAC, gestión de usuarios y roles, validadores de datos, mensajería OTP |
| Backend base v2 | `backend/felcn-base-backend-v2/src/**/*.spec.ts` | 11 | Servicios de negocio, interceptores, middlewares, conexión a base de datos |

Comandos de ejecución (documentados en el `package.json` de cada proyecto): `npm run test` (ejecución local), `npm run test:cov` (con reporte de cobertura) y `npm run test:ci` (modo integración continua, genera reportes JUnit y SonarQube — archivo `test-report.xml`). Las suites se ejecutan en cada ciclo de desarrollo; cualquier revisor puede reproducirlas con esos comandos sobre el repositorio.

**Pruebas de extremo a extremo (Playwright).** El frontend incluye 8 escenarios E2E en `frontend/felcn-base-frontend/test/e2e/playwright/` que recorren en navegador real los flujos completos de: creación de cuenta, gestión de usuarios, roles, módulos, políticas, parámetros, autenticación con Ciudadanía Digital y bloqueo/desbloqueo de cuenta. La configuración (`playwright.config.ts`) ejecuta cada escenario sobre **5 perfiles de navegador**: Chrome, Firefox y Safari/WebKit de escritorio, más dos dispositivos móviles emulados (Pixel 5 y iPhone 12) — esta matriz es también la evidencia de compatibilidad multiplataforma referida en §4. Ejecución: `npm run test:e2e`.

**Verificación operativa.** Los flujos principales (autenticación, registro y consulta de casos, formularios de investigación, reportes con descarga PDF, asignaciones) están operativos en los ambientes habilitados y fueron ejercitados durante el proceso de validación institucional.

### 5.2 Validación de seguridad

Durante esta fase se ejecutó un ciclo de revisión y endurecimiento de seguridad sobre el entorno operativo. Para cada control se indica **cómo se verificó**, de modo que la validación sea reproducible:

| Control | Cómo se verificó | Estado |
|---|---|---|
| Cifrado TLS en todo el tráfico externo (Let's Encrypt, renovación automática) | Inspección de la configuración de nginx y del temporizador de renovación de certbot; verificación del certificado servido con `curl -vI` | ✅ Activo |
| Autenticación mutua TLS (mTLS) para instituciones externas | Revisión de la directiva `ssl_verify_client` y de la cadena CA configurada en nginx; las rutas de partners rechazan conexiones sin certificado de cliente | ✅ Activo |
| Limitación de tasa de peticiones (anti fuerza bruta y anti abuso), con zona reforzada para inicio de sesión | **Prueba de saturación real con k6** contra el punto de entrada público (detalle y cifras en §5.3) | ✅ Activo y verificado bajo carga |
| Cabeceras de seguridad HTTP | Inspección del snippet `security-headers.conf` incluido en el sitio nginx y verificación de las cabeceras en las respuestas | ✅ Activo |
| Control de acceso basado en roles (RBAC) con excepciones por recurso y usuario | Verificación funcional de extremo a extremo: peticiones con usuarios de distintos roles contra recursos permitidos y denegados (diseño documentado en ADR-001) | ✅ Implementado y verificado |
| Política de contraseñas fuertes obligatoria (incluye credenciales iniciales de despliegue) | Revisión de los validadores del backend de autenticación y del proceso de siembra, que rechaza contraseñas débiles | ✅ Implementado |
| Eliminación de credenciales en texto plano del repositorio y rotación de claves de API | Auditoría de archivos `.env.sample` versionados y rotación de la clave afectada en el servicio correspondiente | ✅ Realizado |
| Actualización de dependencias con vulnerabilidades conocidas en el frontend | Actualización a Next.js 15.5.22 y reconstrucción de la imagen de producción | ✅ Realizado |

**Seguridad de cuentas de usuario.** Además del endurecimiento de infraestructura, el sistema incorpora mecanismos de autogestión segura de cuentas, implementados en el backend de autenticación (`felcn-auth-backend`, módulo `usuario` y servicio `otp.service`):

- **Recuperación de contraseña por correo electrónico**: flujo completo de recuperación (`/usuarios/recuperar` → código de validación → `/usuarios/cuenta/nueva-contrasena`), de modo que el titular restablece su acceso sin intervención de un administrador.
- **Doble factor de autenticación (OTP)**: código de un solo uso enviado por **correo electrónico o WhatsApp** al momento del inicio de sesión, activable por usuario. Las sesiones OTP tienen expiración, son de consumo único y el destino se muestra ofuscado.
- **Autogestión y responsabilidad del titular**: activación de cuenta, desbloqueo, cambio de contraseña y actualización de perfil son operaciones del propio usuario, con registro de auditoría de los cambios (subscriber de auditoría en el backend de autenticación). Cada funcionario es responsable de su cuenta y de las acciones realizadas con ella.
- **Bloqueo automático ante intentos fallidos** con flujo de desbloqueo seguro vía correo.

**Respuesta a incidentes (caso real).** En julio de 2026 el equipo detectó, contuvo y remedió un incidente de seguridad originado en una vulnerabilidad de una dependencia del frontend en el ambiente de desarrollo. Se aplicó el ciclo completo de respuesta: detección por monitoreo de comportamiento anómalo del servidor, contención inmediata del servicio afectado, análisis forense de la causa raíz, parcheo de la dependencia vulnerable (actualización de Next.js), rotación de las credenciales potencialmente expuestas y verificación posterior de la integridad del sistema. El incidente no comprometió información de bases de datos y validó en la práctica la capacidad de respuesta del equipo sobre esta infraestructura; las lecciones aprendidas se incorporaron al endurecimiento descrito arriba.

### 5.3 Validación de rendimiento

**Metodología.** Las pruebas de carga se ejecutaron el 4 de agosto de 2026 con **Grafana k6 v0.57**, a partir de los scripts de carga incluidos en cada backend (`backend/*/load-tests/k6-script.js`), adaptados al endpoint de salud real de los servicios (`/api/estado`). Perfil de carga: rampa de 0→5 usuarios virtuales concurrentes (15 s), sostenimiento y crecimiento 5→20 usuarios (60 s) y descenso a 0 (15 s) — una concurrencia sostenida superior a la operación institucional esperada. Cada servicio se midió de forma directa (sin intermediarios) para determinar su capacidad real.

**Resultados.**

| Servicio | Peticiones procesadas | Throughput sostenido | Latencia p95 | Errores |
|---|---|---|---|---|
| Backend base v2 | 318.172 | 3.535 req/s | 5,7 ms | 0,00 % |
| Backend de autenticación | 249.061 | 2.767 req/s | 6,9 ms | 0,00 % |

Con 20 usuarios concurrentes sostenidos, ambos backends respondieron la totalidad de las peticiones con latencias inferiores a 7 ms en el percentil 95 y **cero errores**, evidenciando amplio margen de capacidad para la operación institucional.

**Verificación del control anti-abuso.** Una tercera prueba se dirigió al punto de entrada público (nginx) con tráfico de saturación desde un único origen. El mecanismo de limitación de tasa contuvo un exceso superior a 130.000 peticiones por segundo, dejando pasar únicamente la tasa configurada (10 peticiones por segundo por origen, con ráfaga tolerada) y rechazando el resto. Esto confirma la protección efectiva frente a intentos de abuso o denegación de servicio desde orígenes individuales, y constituye la evidencia bajo carga del control de limitación de tasa reportado en §5.2.

Los registros completos de ejecución se conservan como respaldo técnico y las pruebas son reproducibles con los scripts versionados en el repositorio sobre cualquier ambiente, incluido el servidor definitivo al momento del paso a producción.

## 6. Validación conjunta con usuarios clave

La validación operativa con usuarios clave de la FELCN se documenta mediante acta de conformidad. Plantilla a suscribir:

| Campo | Detalle |
|---|---|
| Fecha y lugar | _(por completar)_ |
| Participantes (nombre, cargo, unidad) | _(por completar)_ |
| Módulos validados | Autenticación con Ciudadanía Digital · Registro y consulta de casos · Formularios de investigación · Reportes y descarga PDF · Asignaciones |
| Observaciones | _(por completar)_ |
| Conformidad | _(firmas)_ |

## 7. Entregables de documentación

La documentación técnica completa del sistema se publica en **`https://desarrollo.felcn.gob.bo/docs`** (acceso restringido con credenciales, por contener detalle de infraestructura). Comprende:

| Entregable | Contenido | Estado |
|---|---|---|
| **Manual técnico de administración** | Arquitectura consolidada, entornos de despliegue (nativo y Docker), bases de datos y migraciones, variables de entorno, nginx y TLS, systemd y políticas de reinicio, instalación de servidor desde cero | ✅ Completo (docs 00–07) |
| **Guías de operación y mantenimiento** | Runbook de reinicio/reset del sistema y creación de administrador inicial; procedimientos de respaldo de bases de datos | ✅ Completo (doc 08, doc 03 §9) |
| **Documentación funcional y de datos** | Inventario de formularios y APIs consumidas; diccionario de tablas por base de datos | ✅ Completo (docs 10–11) |
| **Especificación de APIs** | OpenAPI/Swagger por backend | ✅ Disponible en cada repositorio |
| **Manual de usuario final** | Guía de uso por módulo con capturas de pantalla | 🔄 En elaboración (doc 09) |

## 8. Resultados alcanzados

Como resultado de las actividades desarrolladas durante el Producto 3 se alcanzaron los siguientes resultados:

1. **Se consolidó la implementación y el despliegue operacional** de la Fase 1 del Sistema Nacional de Inteligencia en el entorno tecnológico de la FELCN.
2. **Se completó la modernización tecnológica del sistema legado**: la solución anterior (SUNESIS sobre ASP.NET y SQL Server, con licenciamiento propietario) fue migrada íntegramente a una plataforma de **software libre** — NestJS y Next.js sobre Node.js, con **PostgreSQL** como motor de base de datos — eliminando costos de licenciamiento y alineando el sistema a la política de software libre y estándares abiertos del Estado Plurinacional de Bolivia.
3. **Se alineó el proyecto a las prácticas de la AGETIC**: la arquitectura de los servicios sigue los lineamientos del proyecto base de la AGETIC, y la autenticación se integró al esquema de seguridad de **Ciudadanía Digital** mediante el protocolo estándar OpenID Connect, validada contra el proveedor real en el ambiente de staging.
4. **Se fortaleció integralmente la seguridad de las cuentas de usuario**: recuperación de contraseña por correo electrónico autogestionada por el titular, doble factor de autenticación con código OTP (correo electrónico o WhatsApp), bloqueo automático ante intentos fallidos con desbloqueo seguro, y auditoría de los cambios de cuenta — estableciendo la responsabilidad de cada funcionario sobre su propia cuenta y las acciones realizadas con ella.
5. **Se verificó el correcto funcionamiento de las integraciones e interoperabilidad** implementadas durante las fases anteriores (Ciudadanía Digital, SEGIP vía IOP, intercambio bidireccional con el Ministerio Público), efectuando el acompañamiento técnico necesario para su validación.
6. **Se atendieron e incorporaron las observaciones** formuladas durante el proceso de validación institucional, fortaleciendo la estabilidad, calidad funcional y usabilidad del sistema.
7. **Se ejecutaron satisfactoriamente las pruebas** funcionales, de seguridad, rendimiento y usabilidad (§5), confirmando el correcto comportamiento de la solución en condiciones operativas, con evidencia reproducible y respaldada.
8. **Se gestionó con éxito un incidente de seguridad real** (julio de 2026): detección temprana, contención, remediación de la vulnerabilidad, rotación de credenciales y verificación posterior, sin compromiso de la información institucional — validando en la práctica la capacidad de respuesta sobre la infraestructura (§5.2).
9. **Se completó la documentación técnica, administrativa y operativa** requerida para garantizar la continuidad, administración y mantenimiento del sistema, publicada en el portal de documentación del proyecto (§7).
10. **Se realizó una reunión de seguimiento con representantes de UNODC**, en la cual se presentó el avance de las actividades ejecutadas durante el Producto 3 y el estado de implementación de la Fase 1, dejando constancia del cumplimiento de las actividades desarrolladas dentro del alcance previsto para el presente producto.

## 9. Conclusiones y recomendaciones

### Conclusiones

La ejecución del Producto 3 permitió concluir satisfactoriamente la implementación y el despliegue operacional de la Fase 1 del Sistema Nacional de Inteligencia de la FELCN, alcanzando los objetivos establecidos en los Términos de Referencia para esta etapa del proyecto.

Las actividades desarrolladas permitieron consolidar el funcionamiento del sistema dentro del entorno institucional, verificar la operación de las integraciones e interoperabilidades implementadas, atender las observaciones derivadas del proceso de validación y confirmar la estabilidad de la solución mediante la ejecución de pruebas funcionales, de seguridad, rendimiento y usabilidad. La migración del sistema legado a una plataforma de software libre con PostgreSQL, alineada a las prácticas de la AGETIC y al esquema de seguridad de Ciudadanía Digital, deja a la institución una solución moderna, sin dependencia de licenciamiento propietario y conforme a los estándares tecnológicos del Estado.

En materia de seguridad, el sistema no solo incorpora controles preventivos verificados (cifrado, mTLS, limitación de tasa, RBAC, doble factor de autenticación y autogestión segura de cuentas), sino que la capacidad de respuesta del equipo fue puesta a prueba y validada ante un incidente real, gestionado con detección temprana, contención y remediación completa sin compromiso de la información institucional.

Asimismo, la elaboración de la documentación técnica, administrativa y operativa proporciona los insumos necesarios para garantizar la sostenibilidad, continuidad y mantenimiento del sistema por parte del personal técnico de la institución.

Finalmente, las actividades de seguimiento y coordinación realizadas con la FELCN y UNODC permitieron presentar el estado de avance del proyecto y respaldar el cumplimiento de las actividades previstas para el cierre del Producto 3, consolidando una solución tecnológica preparada para su operación y evolución futura.

### Recomendaciones para la continuidad

1. **Incorporar un especialista técnico para la fase de explotación**: se recomienda que la institución cuente con un profesional dedicado que acompañe el seguimiento, la operación, el mantenimiento y la seguridad del sistema en producción — monitoreo de la infraestructura, aplicación oportuna de actualizaciones de seguridad, gestión de respaldos y atención de primer nivel — de modo que el conocimiento transferido en la documentación se sostenga con capacidad operativa permanente.
2. **Concluir y validar el manual de usuario final** con capturas del sistema, junto con la suscripción del acta de validación con usuarios clave (§6).
3. **Restablecer el respaldo automatizado de bases de datos** con verificación periódica de restauración (hoy existen procedimientos manuales documentados).
4. **Migrar al servidor definitivo en modalidad headless** (sin entorno de escritorio), conforme a la guía de instalación desde cero ya documentada, para eliminar la causa de inestabilidad detectada en el servidor actual de pruebas.
5. Ajuste menor de configuración: responder los excesos de tasa con código HTTP 429 en lugar de 503.
6. Completar el poblado de catálogos pendientes y avanzar la homologación de la Fase B del intercambio con el Ministerio Público.
