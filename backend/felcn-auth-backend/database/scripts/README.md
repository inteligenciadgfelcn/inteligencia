# Instalación de la Base de Datos

## Para entornos de `producción`

Se recomienda instalar PostgreSQL ^16 de forma nativa (sin docker). Ver [PostgreSQL Downloads](https://www.postgresql.org/download/)

Las instrucciones y comandos utilizados para crear desde cero la Base de Datos del proyecto se encuentra en el archivo [dbcreate.sql](./dbcreate.sql).

## Para entornos de `desarrollo` (con docker)

Levanta los servicios con docker-compose (desde la raíz del proyecto):
```bash
docker-compose up -d
```

Luego ejecuta el script de creación de la base de datos en el contenedor:
```bash
# Ejemplo 1: bash dbcreate_docker.sh <dockerContainer>
bash database/scripts/dbcreate_docker.sh postgres16
```

Donde: `postgres16` es el nombre del contenedor definido en `docker-compose.yml`.

## Para entornos de `desarrollo` (Con postgres nativo)

Se requiere tener instalado postgres a nivel del sistema operativo con la siguiente configuración:

```bash
# Archivo /etc/postgresql/16/main/pg_hba.conf
local   all     postgres                    md5
```

Para la creación de la base de datos se debe ejecutar el siguiente comando:

```bash
psql -U postgres -f database/scripts/dbcreate.sql
```

Si el anterior comando falla intente con:

```bash
sudo -u postgres psql -f database/scripts/dbcreate.sql
```

Para conectarse a la base de datos desde la terminal:

```bash
sudo -u postgres psql -d auth
```

## Schemas creados

| Schema | Descripción |
|---|---|
| `proyecto` | Schema por defecto de TypeORM |
| `usuario` | Usuarios, personas, roles, módulos, sesiones, tokens |
| `parametro` | Parámetros generales del sistema |
| `felcn_estructura` | Estructura organizacional FELCN (grado, unidad, distrital, grupo) |
