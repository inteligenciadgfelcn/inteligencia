#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Manejo de argumentos: archivo .gz a restaurar, base de datos destino, contenedor
archivoBackup="${1:?Uso: pg-restore.sh <archivo.sql.gz> <base_de_datos> [contenedor=postgres]}"
baseDatos="${2:?Uso: pg-restore.sh <archivo.sql.gz> <base_de_datos> [contenedor=postgres]}"
dockerContainer="${3:-postgres}"

echo -e "\n\n >>> Restaurando '$archivoBackup' en la base '$baseDatos' del contenedor '$dockerContainer'...\n"
echo -e "\nLa base '$baseDatos' debe existir vacía (la crea 01-crear-bases.sql al iniciar el contenedor).\n"
sleep 2;

echo -e "\nRestaurando...\n"
gunzip -c "$archivoBackup" | docker exec -i "$dockerContainer" psql -U postgres -v ON_ERROR_STOP=1 "$baseDatos" \
  || { echo -e "\n\nERROR: Falló la restauración de '$baseDatos'\n\n"; exit 1; }

echo -e "\n >>> ¡Base de datos '$baseDatos' restaurada con éxito! :)\n"
