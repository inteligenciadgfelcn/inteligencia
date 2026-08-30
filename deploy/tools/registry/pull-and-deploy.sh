#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Corre en staging o producción, parado junto al docker-compose.yml de ese
# servidor (con `image: registry.sunesis-dev.felcn.gob.bo/felcn-*:<TAG>`, ver
# docs/templates/docker-compose.prod.yml). Nunca hace `docker build` ni clona
# el código fuente — solo baja imágenes ya construidas en dev.

tag="${1:?Uso: pull-and-deploy.sh <tag>}"

echo -e "\n\n >>> Desplegando tag '$tag'...\n"

export TAG="$tag"
docker compose pull || { echo -e "\n\nERROR: Falló el pull de las imágenes\n\n"; exit 1; }
docker compose up -d || { echo -e "\n\nERROR: Falló el 'up' del compose\n\n"; exit 1; }

echo -e "\n >>> ¡Desplegado! :)\n"
