#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Manejo de argumentos: base de datos a respaldar y nombre del contenedor de Postgres
baseDatos="${1:?Uso: pg-backup.sh <base_de_datos> [contenedor=postgres]}"
dockerContainer="${2:-postgres}"
archivoSalida="${baseDatos}-$(date +%Y%m%d-%H%M%S).sql.gz"

echo -e "\n\n >>> Creando backup de '$baseDatos' desde el contenedor '$dockerContainer'...\n"

# A diferencia de las versiones anteriores de este script (Postgres nativo en el host),
# acá el contenedor ya trae pg_dump — no hace falta copiar nada adentro, se ejecuta
# directo con `docker exec` y se saca la salida por stdout.
docker exec -i "$dockerContainer" pg_dump -U postgres "$baseDatos" | gzip > "$archivoSalida"

echo -e "\n >>> ¡Backup creado con éxito! ($archivoSalida) :)\n"
