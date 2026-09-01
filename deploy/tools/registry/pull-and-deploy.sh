#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Corre en staging o producción, parado junto al docker-compose.yml de ese
# servidor (con `image: registry.sunesis-dev.felcn.gob.bo/felcn-*:<TAG>`, ver
# deploy/staging/docker-compose.yml o deploy/production/docker-compose.yml).
# Nunca hace `docker build` ni clona el código fuente — solo baja imágenes ya
# construidas en dev.

tag="${1:?Uso: pull-and-deploy.sh <tag>}"

echo -e "\n\n >>> Desplegando tag '$tag'...\n"

# Persistir TAG en .env, no solo exportarlo para esta corrida — un `export`
# suelto solo vive en esta sesión de shell. Sin esto, cualquier operación
# posterior que vuelva a leer `.env` sin pasar por este script (reinicio del
# host, un `docker compose up -d`/`restart` manual de otro servicio, un timer
# de systemd) revierte en silencio al TAG viejo que quedó guardado ahí.
# Hallazgo real (01/09/2026): el pull/up de abajo sí toma el `.env`
# actualizado, y `docker compose config` confirma el tag correcto, no depende
# de ninguna variable exportada.
if [ -f .env ] && grep -q '^TAG=' .env; then
  sed -i "s/^TAG=.*/TAG=$tag/" .env
else
  echo "TAG=$tag" >> .env
fi

export TAG="$tag"
docker compose pull || { echo -e "\n\nERROR: Falló el pull de las imágenes\n\n"; exit 1; }
docker compose up -d || { echo -e "\n\nERROR: Falló el 'up' del compose\n\n"; exit 1; }

echo -e "\n >>> ¡Desplegado! (.env actualizado a TAG=$tag) :)\n"
