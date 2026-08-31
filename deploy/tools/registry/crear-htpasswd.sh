#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Manejo de argumentos: usuario a crear/agregar en el htpasswd del registry
usuario="${1:?Uso: crear-htpasswd.sh <usuario>}"
archivoHtpasswd="$(dirname "$0")/htpasswd"

echo -e "\n\n >>> Creando credencial de registry para '$usuario'...\n"

# La contraseña se pide acá, en el bash del host (con eco apagado), y se le
# pasa al contenedor por stdin con `-Bi` (bcrypt, lee la contraseña de stdin
# sin pedir confirmación por tty) — no queda en el historial de la shell ni
# en la lista de procesos, y no depende de que el contenedor tenga una tty
# real (que `-n` sin `-b` sí necesita, y falla en scripts no interactivos).
read -r -s -p "Contraseña para '$usuario': " contrasena
echo

if [ -f "$archivoHtpasswd" ]; then
  echo -e "\nYa existe $archivoHtpasswd, se agrega el usuario.\n"
  printf '%s' "$contrasena" | docker run --rm -i httpd:alpine htpasswd -Bni "$usuario" >> "$archivoHtpasswd"
else
  echo -e "\nCreando $archivoHtpasswd nuevo.\n"
  printf '%s' "$contrasena" | docker run --rm -i httpd:alpine htpasswd -Bni "$usuario" > "$archivoHtpasswd"
fi

echo -e "\n >>> Credencial creada. Reiniciar el contenedor 'registry' para que la tome:\n"
echo -e "    docker compose -f docker-compose.registry.yml restart registry\n"
