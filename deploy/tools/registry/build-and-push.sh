#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Corre parado en la raíz del repo (junto a docker-compose.yml) — en el servidor
# dev (.23) o en CUALQUIER otra máquina con Docker instalado, el repo clonado
# (git clone + la rama correspondiente) y red hacia el registry: no es un
# requisito técnico estar parado en .23, solo la ubicación más cómoda porque
# ya tiene el código y Docker. Buildea las 3 imágenes de la app y las sube al
# registry propio. Requiere haber hecho `docker login <registryHost>` una vez
# antes, con las credenciales de htpasswd (ver crear-htpasswd.sh) — quedan en
# ~/.docker/config.json, no se pasan por acá.

registryHost="${REGISTRY_HOST:-registry.sunesis-dev.felcn.gob.bo}"
tag="${1:-$(git rev-parse --short HEAD)}"

echo -e "\n\n >>> Build y push de las imágenes con tag '$tag' hacia '$registryHost'...\n"

declare -A servicios=(
  [felcn-auth-backend]=./backend/felcn-auth-backend
  [felcn-base-backend]=./backend/felcn-base-backend
  [felcn-base-frontend]=./frontend/felcn-base-frontend
)

for nombre in "${!servicios[@]}"; do
  contexto="${servicios[$nombre]}"
  imagen="$registryHost/$nombre:$tag"

  echo -e "\n --- Build: $imagen (contexto: $contexto) ---\n"
  docker build -t "$imagen" "$contexto" || { echo -e "\n\nERROR: Falló el build de $nombre\n\n"; exit 1; }

  echo -e "\nPush: $imagen\n"
  docker push "$imagen" || { echo -e "\n\nERROR: Falló el push de $nombre\n\n"; exit 1; }
done

echo -e "\n >>> ¡Build y push completos! Tag: $tag :)\n"
