# Instalación de la Base de Datos

## Para entornos de `producción`

Se recomienda instalar PostgreSQL ^16 de forma nativa (sin docker). Ver [PostgreSQL Downloads](https://www.postgresql.org/download/)

Las instrucciones y comandos utilizados para crear desde cero la Base de Datos del proyecto se encuentra en el archivo [dbcreate.sql](./dbcreate.sql).

## Para entornos de `desarrollo` (con docker)

Crea una instancia de postgres
```bash
docker run --name pg16 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:16.0
```

```bash
# Ejemplo 1: bash dbcreate_docker.sh <dockerContainer>
bash dbcreate_docker.sh pg16
```

Donde: `pg16` es el nombre del contenedor.

## Para entornos de `desarrollo` (Con postgres nativo)

Se requiere tener instalado postgres a nivel del sistema operativo con la siguiente configuración:

```bash
# Archivo /etc/postgresql/16/main/pg_hba.conf
local   all     postgres                    md5
```

Para la creacion de la base de datos se debe ejecutar el siguiente comando:

```bash
psql -U postgres -f dbcreate.sql
```

Si el anterior comando falla intente con desde la raiz del proyecto backend:

```bash
sudo -u postgres psql -f database/scripts/dbcreate.sql
```

Para conectarse a la base de datos desde la terminal debe ejecutar

```bash
sudo -u postgres psql -d database_db
```