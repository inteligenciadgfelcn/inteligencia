# Guía para ejecutar las pruebas E2E

## Requisitos previos

Antes de ejecutar las pruebas **E2E (end-to-end)**, se debe de cumplir con los siguientes puntos:

### 1. Configurar el entorno de prueba

Ejecuta el siguiente comando para preparar la base de datos y los datos iniciales (registros mínimos para la correcta ejecución de los tests):

```bash
npm run setup
```

### 2. Crear archivos requeridos

Las pruebas utilizan archivos locales para validar la carga y manejo de recursos.
Se debe crear la siguiente estructura dentro de la carpeta `public`:

```
public/
└── mocks/
    ├── foto_perfil.jpg
    └── archivo.txt
```

**Detalles:**

- `foto_perfil.jpg`: imagen de prueba (puede ser cualquier imagen en los siguientes formatos: jpg|jpeg|png|gif).
- `archivo.txt`: archivo de texto cualquiera (usado para validar carga de archivos no gráficos).

> **[IMPORTANTE]**
>
> - Verifica que ambos archivos existan y sean accesibles antes de ejecutar las pruebas. Si faltan, la ejecución se cancelará automáticamente.
> - Si se cambia los nombres o rutas de los archivos debe actualizarse en las variables siguientes: **`FILE_PATH`**, **`FILE_UPLOADS_PATH`**, **`NAME_FILE_PROFILE_PHOTO`**, **`NAME_FILE_NON_PROFILE_PHOTO`**, según corresponda.

### 3. Servicios externos requeridos

Algunas pruebas dependen de servicios externos, como el **servicio de ciudadanía Digital**. Asegúrate de que este servicio esté disponible y accesible antes de iniciar las pruebas.

> Si el servicio no está operativo, las pruebas relacionadas podrían fallar o quedar en espera.

## Ejecución de pruebas

- Una vez completados los pasos anteriores, ejecuta todas las pruebas E2E con:

  ```bash
  npm run test:e2e
  ```

- Puedes ejecutar una prueba específica usando:

  ```bash
  npm run test:e2e -- nombre-del-archivo.e2e-spec.ts
  ```

- Para ver logs detallados:

  ```bash
  npm run test:e2e -- --verbose

  ```

## Generación de reporte de pruebas e2e(opcional)

El proyecto permite generar reportes automáticos de las pruebas de integración
(E2E) en formato **Markdown(.md)**.

### Precondiciones

Para generar el reporte se debe tener en cuenta lo siguiente:

- Tener instalado en `jq` versión 1.6 o posterior como parte del sistema operativo en el cual se ejecuta el proyecto.

Visite: https://jqlang.org/download/, para más información de su instalación.

### Ejecución de las pruebas y generación del reporte

#### Reporte básico

Para generar el reporte básico, ejecutar el siguiente comando:

```bash
npm run report:basic
```

Este comando ejecuta el script e2e-generate.sh, el cual procesa los resultados de las pruebas E2E y genera un archivo llamado: `docs/e2e-tests/test_e2e_report.md`.

El reporte muestra información del proyecto, un resumen de las métricas adicionales, tiempos de ejecución y las tablas con la decripción de cada prueba agrupada por el primer `describe` de cada prueba. Como se muestra a continuación:

## UsuarioController e2e

| N°  | DESCRIPCIÓN                    | ESTADO      |
| --- | ------------------------------ | ----------- |
| 1   | Debería crear una nueva cuenta | `✅ PASSED` |

#### Reporte extendido

Para generar un reporte más descriptivo de cada prueba, como se muestra a continuación:

## UsuarioController (e2e)

### TI-01 | `POST` : **/api/usuarios/cuenta/ciudadania**

| N°  | CÓDIGO ITEM | DESCRIPCIÓN                                                       | MÉTODO | API                               | CÓDIGO HTTP | ESTADO    |
| --- | ----------- | ----------------------------------------------------------------- | ------ | --------------------------------- | ----------- | --------- |
| 1   | A-016       | Debería crear un nuevo usuario relacionado con Ciudadanía Digital | `POST` | `/api/usuarios/cuenta/ciudadania` | `201`       | ✅ PASSED |

Se debe seguir la siquiente convención dentro de las prueba:

```
describe('nombreController (e2e)', async()=>{
  ....
  describe('[CODIGO-PRUEBA]|[MÉTODO HTTP]|[RUTA]', ()=>{
    it('[CODIGO-ITEM]|Descripción de lo que se espera de la prueba|[CODIGO HTTP]', async()=>{
    })
  })
})
```

Por ejemplo:

```
describe('UsuarioController (e2e)', async()=>{
  ....
  describe('TI-01|GET|/api/usuarios', ()=>{
    it('A-001|Debería de obtener el listado de usuarios|200', async()=>{
    })
    ...
  })
})
```

Para generar este reporte extendido, se utiliza el siguiente comando:

```bash
npm run report:extended
```

## **Flujo Completo (E2E)**

Vease el siguiente documento: [test-e2e-report.md](../../docs/e2e-tests/test-e2e-report.md)

## Recomendaciones adicionales

- Antes de subir cambios, asegúrate de que todas las pruebas E2E pasen correctamente.

- Si bien es opcional, se recomienda mantener actualizado el reporte generado las pruebas(e2e).
