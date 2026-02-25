# Frontend Base - NextJS y MUI

![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![MUI](https://img.shields.io/badge/MUI-6.1-blue?style=flat-square&logo=mui)

Frontend Base es una plantilla para el desarrollo de aplicaciones web, diseñada para ser compatible con
el [Backend Base](https://gitlab.felcn.gob.bo/proyectos-base/felcn-base-backend) creado con
NestJS.

## 🚀 Características

- ⚡️ **Next.js 15** con App Router para un rendimiento óptimo
- 🎨 **Material-UI (MUI) v6** + **Mantine** para componentes UI elegantes y responsivos
- 🔒 Sistema de autenticación robusto con JWT y renovación automática
- 🛡️ **Control de acceso granular** con Casbin (ABAC) para autorización
- 🌍 **Internacionalización completa** con soporte para 16 idiomas
- 📝 Gestión de formularios eficiente con **React Hook Form** + **Zod**
- 🗺️ **Mapas interactivos** con Leaflet y herramientas de dibujo
- 🔄 **Gestión de estado avanzada** con Redux Toolkit y React Query
- 🌐 Cliente HTTP Axios con interceptores y manejo de errores
- 📊 **Storybook** para documentación de componentes
- 🧪 Configuración de pruebas e2e con **Playwright**
- 🔍 SEO optimizado y rutas dinámicas
- 🌙 **Modo oscuro integrado** con theming personalizable
- 📈 Integración con **Matomo** para análisis web
- 🔐 **Protección XSS** y sanitización de datos
- 📱 **Diseño responsivo** con detección de dispositivos móviles

## 🛠️ Tecnologías principales

### Core Framework
- [Next.js 15.2.4](https://nextjs.org) - Framework React con App Router
- [React 18.3.1](https://reactjs.org) - Biblioteca de interfaz de usuario
- [TypeScript 5.7.2](https://www.typescriptlang.org) - Lenguaje con tipado estático

### UI & Styling
- [Material-UI (MUI) v6.1](https://mui.com) - Sistema de componentes principal
- [Mantine 7.17](https://mantine.dev) - Biblioteca complementaria de componentes
- [Tailwind CSS 3.4](https://tailwindcss.com) - Framework CSS utility-first

### Estado y Datos
- [Redux Toolkit 2.11](https://redux-toolkit.js.org) - Gestión de estado global
- [TanStack React Query 5.62](https://tanstack.com/query) - Gestión de estado servidor
- [Zustand 4.5](https://github.com/pmndrs/zustand) - Estado local liviano

### Formularios y Validación
- [React Hook Form 7.54](https://react-hook-form.com) - Gestión de formularios
- [Zod 3.23](https://zod.dev) - Validación de esquemas TypeScript

### Seguridad y Autenticación
- [Casbin 5.36](https://casbin.org) - Control de acceso (ABAC)
- [Axios 1.8](https://axios-http.com) - Cliente HTTP con interceptores

### Mapas y Geolocalización
- [Leaflet 1.9](https://leafletjs.com) - Mapas interactivos
- [React Leaflet 4.2](https://react-leaflet.js.org) - Integración con React

### Internacionalización
- [i18next 22.4](https://www.i18next.com) - Framework de internacionalización
- [react-i18next 12.1](https://react.i18next.com) - Integración con React

### Desarrollo y Testing
- [Storybook 8.6](https://storybook.js.org) - Documentación de componentes
- [Playwright 1.49](https://playwright.dev) - Testing end-to-end
- [ESLint](https://eslint.org) + [Prettier 3.4](https://prettier.io) - Calidad de código

## 📁 Estructura del proyecto

```
src/
├── app/                    # Rutas y componentes de página (Next.js 15 App Router)
├── components/             # Componentes reutilizables
├── config/                 # Configuraciones globales
├── context/                # Contextos de React (Auth, Alertas, etc.)
├── hooks/                  # Hooks personalizados
├── services/               # Servicios para comunicación con el backend
├── themes/                 # Configuración de temas (claro/oscuro)
├── types/                  # Tipos y interfaces globales
└── utils/                  # Utilidades y helpers
```

## 🚀 Inicio rápido

1. Clona el repositorio:
   ```bash
   git clone https://gitlab.fecln.gob.bo/proyectos-base/felcn-base-frontend.git mi-proyecto
   cd mi-proyecto
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.sample .env
   ```
   Edita el archivo `.env` con los valores correspondientes a tu entorno.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:8080](http://localhost:8080) en tu navegador.

## 🎨 Personalización del diseño

Modifica los archivos en `src/themes/` para personalizar los temas claro y oscuro:

```typescript
// src/themes/light-theme.ts o dark-theme.ts
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    // ... otras personalizaciones
  },
});

export default lightTheme;
```

## 📚 Documentación de componentes

Genera la documentación de componentes con Storybook:

```bash
npm run storybook
```

## 🧪 Pruebas

Ejecuta las pruebas e2e con Playwright:

```bash
npm run test:e2e
```

Para generar tests:

```bash
npm run test:codegen
```

## 📦 Compilación para producción

```bash
npm run build
```

## 💡 Recomendaciones para usar como base de un nuevo proyecto

Para usar este proyecto como base de un nuevo proyecto, debe seguir los siguientes pasos:

- Crear nuevo proyecto en [Gitlab](https://gitlab.felcn.gob.bo/projects/new) y clonarlo en local
- Añadir este proyecto como otro origen, ejecutar dentro del nuevo proyecto:

```
git remote add origin2 git@gitlab.felcn.gob.bo:/proyectos-base/felcn-base-frontend.git
```

- Descargar los commits desde el 2.º origen, ejecutar

```
git pull origin2 master --allow-unrelated-histories
```

## 🔖 Versionado

Para generar una nueva versión:

1. Actualiza la versión en `package.json`
2. Ejecuta:
   ```bash
   npm run release
   ```
3. Publica los tags:
   ```bash
   git push --follow-tags origin master
   ```

