#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Wrapper para eliminar-usuario-cascada.sql contra el Postgres dockerizado de
# dev/staging (deploy/development|staging/docker-compose.yml). Corre parado
# en cualquier lado — copia el .sql adentro del contenedor con `docker cp`,
# así no depende de que el contenedor tenga el repo montado.

usuario="${1:?Uso: eliminar-usuario-cascada.sh <usuario/carnet> [contenedor=postgres] [base=felcn_auth]}"
contenedor="${2:-postgres}"
base="${3:-felcn_auth}"
sqlLocal="$(dirname "${BASH_SOURCE[0]}")/eliminar-usuario-cascada.sql"
sqlRemoto="/tmp/eliminar-usuario-cascada.sql"

echo -e "\n\n >>> Eliminando en cascada al usuario '$usuario' de '$base' (contenedor '$contenedor')...\n"

docker cp "$sqlLocal" "$contenedor:$sqlRemoto"
docker exec -i "$contenedor" psql -U postgres -d "$base" -v usuario="$usuario" -f "$sqlRemoto"
docker exec "$contenedor" rm -f "$sqlRemoto"

echo -e "\n >>> ¡Listo! :)\n"
