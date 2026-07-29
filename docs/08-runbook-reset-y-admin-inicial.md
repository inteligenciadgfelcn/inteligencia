# 08 — Runbook: reset a cero + usuario Admin inicial

Procedimiento para dejar un ambiente (dev, staging o el servidor nuevo en producción) en un estado limpio y funcional. Corrige la práctica anterior de `npm run setup`, que sembraba usuarios con contraseña hardcodeada `'123'` (ver hallazgo en [03-base-de-datos.md](./03-base-de-datos.md) sección 8).

## Qué se implementó (ya aplicado en el código)

`database/seeds/1611171041790-usuario.ts` (felcn-auth-backend) **ya no usa una contraseña hardcodeada**. Ahora:

- Lee `ADMIN_INITIAL_PASSWORD` de las variables de entorno.
- Si no está seteada → el seed **falla explícitamente** (no hay valor por defecto).
- Si está seteada pero es débil → también falla. La validación usa `TextService.validateLevelPassword()`, la misma función (zxcvbn) que ya usa el resto de la aplicación para exigir fortaleza de contraseña — no se inventó un chequeo nuevo.
- Si pasa la validación, esa contraseña se usa para los usuarios que crea este seed (`ADMINISTRADOR`, `ADMINISTRADOR-TECNICO`, `TECNICO`), reemplazando el `'123'` fijo.

Esto ya resuelve el problema central: **es imposible que quede una contraseña conocida (`'123'`) en ningún ambiente**, incluida producción — el seed se niega a correr sin una contraseña fuerte real.

## Decisión de alcance: no se separaron los usuarios de prueba del usuario Admin

La propuesta original (antes de mirar el código) era partir esto en dos seeds — uno solo para un usuario `ADMIN` único, y otro gateado a dev/staging para los usuarios ficticios (`ADMINISTRADOR-TECNICO`, `TECNICO`, personas con correos `yopmail.com`). Al revisar el código se encontró que **`database/seeds/1611516017924-usuario-rol.ts` asigna roles a estos 3 usuarios usando ids literales (`'1'`, `'2'`, `'3'`) que dependen del orden exacto de inserción de este seed**, no de una referencia real (hay líneas comentadas de `TextService.textToUuid(...)` que sugieren que ese mapeo por id literal ya es fragil/posiblemente vestigial). Sacar o reordenar usuarios del array sin verificar primero cómo funciona esa asignación de roles en la práctica (con una base de datos real, corriendo la migración) podía romper silenciosamente los roles del ambiente.

Por eso se optó por el cambio mínimo y seguro: **mismos 3 usuarios, mismo orden, solo cambia el origen de la contraseña**. `ADMINISTRADOR` sigue siendo, en la práctica, el usuario Admin fuerte que pidieron para iniciar la app en cualquier ambiente — ya no hace falta un seed nuevo separado para eso.

Separar los usuarios de prueba de la producción (para que `ADMINISTRADOR-TECNICO`/`TECNICO` con datos ficticios nunca se siembren fuera de dev) sigue siendo deseable, pero requiere primero entender/arreglar la asignación de roles por id literal en `1611516017924-usuario-rol.ts` — queda como tarea de código separada, no incluida en este cambio.

## 1. Cómo usarlo

```bash
cd backend/felcn-auth-backend

# Reset del esquema (destructivo — nunca contra datos reales que se quieran conservar)
npm run schema:drop
npm run migrations:run

# Seed — ahora exige contraseña fuerte, ya no hay '123'
ADMIN_INITIAL_PASSWORD='<contraseña fuerte real>' npm run seeds:run
```

Si `ADMIN_INITIAL_PASSWORD` falta o es débil, `seeds:run` falla con un error explícito en vez de sembrar una contraseña insegura.

`.env.sample` ya documenta la variable con un comentario explicando que es obligatoria y no debe commitearse con un valor real.

## 2. Pendiente (no implementado, requiere trabajo aparte)

1. Entender/arreglar la asignación de roles por id literal en `1611516017924-usuario-rol.ts` antes de intentar separar los usuarios de prueba del seed de producción.
2. Una vez resuelto lo anterior: gatear `ADMINISTRADOR-TECNICO`/`TECNICO` (datos ficticios) detrás de una variable tipo `SEED_DATOS_PRUEBA=true`, para que nunca se siembren en producción.
3. Forzar cambio de contraseña del usuario `ADMINISTRADOR` en su primer login, para que el valor puesto en `ADMIN_INITIAL_PASSWORD` no quede siendo la definitiva para siempre — evaluar si el modelo `Usuario` ya soporta un flag de este tipo antes de diseñarlo.
