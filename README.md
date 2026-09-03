# Sistema Nacional de Inteligencia de la FELCN — Fase 1

Monorepo del Sistema Nacional de Inteligencia de la Fuerza Especial de Lucha
Contra el Narcotráfico (FELCN), desarrollado en el marco del **Proyecto BOLEU1**
de la Oficina de las Naciones Unidas contra la Droga y el Delito (UNODC), para
la Dirección General de la FELCN (DG-FELCN).

## Estructura

| Ruta | Proyecto |
|---|---|
| `backend/felcn-auth-backend/` | Backend de autenticación y autorización (NestJS + TypeORM) |
| `backend/felcn-base-backend/` | Backend de lógica de negocio (NestJS + TypeORM + PostgreSQL) |
| `frontend/felcn-base-frontend/` | Frontend institucional (Next.js + React + TypeScript) |
| `deploy/` | Compose, scripts y configuración de despliegue (dev, staging, producción) |
| `docs/` | Documentación técnica, funcional y de usuario |

## Autoría — Fase 1

- **Ing. Erika Carmiña Camargo Salvatierra** — `erikacamargo936@gmail.com`
- **Ing. Eitner Montero** — `eitnermontero@gmail.com`

Ver [`AUTHORS.md`](AUTHORS.md) para el detalle. La historia de contribuciones
completa se conserva en el control de versiones.

## Documentación

La documentación completa se publica en el portal `/docs` de cada servidor y se
mantiene en [`docs/`](docs/).

## Licencia

Licencia Pública General de Bolivia (LPG-Bolivia).
