# Backend Base - NestJS con TypeORM

![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange?style=flat-square)
<a href="./">
<img src="https://img.shields.io/badge/version-v1.9.1-blue" alt="Versión">
</a>
<a href="./LICENSE">
<img src="https://img.shields.io/static/v1?label=license&message=LPG%20-%20Bolivia&color=green" alt="Licencia: LPG - Bolivia" />
</a>

Backend Base es una plantilla robusta y escalable para el desarrollo de APIs, diseñada para ser compatible con
el [Frontend Base](https://gitlab.felcn.gob.bo/proyectos-base/felcn-base-frontend) creado con
Next.js.

## Autoría — Fase 1

Sistema Nacional de Inteligencia de la FELCN, Proyecto BOLEU1 (UNODC) — DG-FELCN.

- Ing. Erika Carmiña Camargo Salvatierra · `erikacamargo936@gmail.com`
- Ing. Eitner Montero · `eitnermontero@gmail.com`

Ver `AUTHORS.md`. La historia de contribuciones se conserva en el control de versiones.

## 🚀 Características

- 🔐 Sistema de autenticación robusto con JWT y Ciudadanía Digital
- 🔒 Autorización avanzada con Casbin para control de acceso basado en roles
- 🌐 Clientes para interoperabilidad (SEGIP, SIN)
- 📨 Cliente para Mensajería Electrónica
- 📊 ORM TypeORM para manejo eficiente de base de datos
- 📝 Documentación automática de API con OpenAPI (Swagger)
- 🧪 Configuración de pruebas con Jest
- 🐳 Dockerización para fácil despliegue y desarrollo

## 🛠️ Tecnologías principales

- [NestJS](https://nestjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [PostgreSQL](https://www.postgresql.org)
- [TypeORM](https://typeorm.io)
- [Passport.js](http://www.passportjs.org)
- [Jest](https://jestjs.io)
- [OpenAPI](https://www.openapis.org)
- [Casbin](https://casbin.org)
- [PinoJs](https://getpino.io)
- [Docker](https://www.docker.com)

## 📁 Estructura del proyecto

```
src/
├── app.module.ts              # Módulo principal de la aplicación
├── application/               # Módulos de la aplicación
│   └── parametro/             # Ejemplo de módulo (Parámetros)
├── common/                    # Utilidades y componentes comunes
├── core/                      # Módulos centrales (autenticación, autorización, etc.)
│   ├── authentication/        # Módulo de autenticación
│   ├── authorization/         # Módulo de autorización
│   ├── config/                # Configuraciones
│   ├── external-services/     # Servicios externos (IOP, mensajería)
│   ├── logger/                # Módulo de logging
│   └── usuario/               # Módulo de usuarios
├── main.ts                    # Punto de entrada de la aplicación
└── templates/                 # Plantillas (ej. para emails)
```

## 🚀 Inicio rápido

1. Clona el repositorio:

   ```bash
   git clone https://gitlab.felcn.gob.bo/proyectos-base/felcn-base-backend.git base-backend
   cd base-backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus configuraciones.

4. Configura la base de datos (requiere Docker):

   **Opción 1 - Configuración completa automática (Recomendado):**
   ```bash
   npm run db:create
   npm run setup
   ```

   **Opción 2 - Configuración paso a paso:**
   ```bash
   npm run db:create
   mkdir -p database/migrations
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ormconfig-default.ts database/migrations/init
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ormconfig-default.ts
   npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ormconfig-seed.ts
   ```

   > NOTA: El comando `npm run db:create` crea la base de datos y los esquemas. El comando `npm run setup` genera y ejecuta las migraciones de TypeORM para crear las tablas e insertar los datos iniciales (usuarios, roles, módulos, permisos).

5. Inicia el servidor de desarrollo:

   ```bash
   npm run start:dev
   ```

6. Abre la [documentación de la API](http://localhost:3000/api/docs) o ingresa directamente a `http://localhost:3000/api/docs` en el navegador.

> NOTA: Es importante verificar que la variable de entorno `NODE_ENV` no tenga el valor `production` para que la documentacion de la API este disponible.

## 📚 Documentación

- [Instalación y Configuración](INSTALL.md)
- [Arquitectura](/docs/arquitectura.md)
- [Documentación de APIs](/docs/openapi.yaml)
- [Documentación de Permisos](/docs/permisos.md)
- [Documentación de Autenticación](/docs/autenticacion/index.md)

## 🧪 Pruebas

Ejecuta las pruebas con:

```bash
npm run test
```

## 📦 Compilación para producción

```bash
npm run build
```

## 🐳 Docker

Para ejecutar la aplicación en un contenedor Docker:

```bash
docker-compose up -d
```

## 💡 Recomendaciones para usar como base de un nuevo proyecto

Para usar este proyecto como base de un nuevo proyecto, sigue estos pasos:

1. Crea un nuevo proyecto en [Gitlab](https://gitlab.felcn.gob.bo/projects/new) y clónalo en local.

2. Añade este proyecto como otro origen, ejecutando dentro del nuevo proyecto:

   ```bash
   git remote add origin2 git@gitlab.felcn.gob.bo:/proyectos-base/fecln-base-backend.git
   ```

3. Descarga los commits desde el 2.º origen, ejecutando:
   ```bash
   git pull origin2 master --allow-unrelated-histories
   ```

## 🔖 Versionado

Para generar una nueva versión:

1. Actualiza la versión en `package.json`
2. Ejecuta:
   ```bash
   npm run release -- --release-as patch
   ```
3. Publica los tags:
   ```bash
   git push --follow-tags origin master
   ```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o realiza un pull request con tus cambios.

## 👥 Colaboradores

- Eitner Montero
- Erika Camargo

## 📄 Licencia

Este proyecto está bajo la [Licencia LPG-Bolivia](LICENSE).

## 📞 Contacto

Para más información, contacta a: contacto@felcn.gob.bo
>>>>>>> 072c608 (Initial commit - FELCN backend)
