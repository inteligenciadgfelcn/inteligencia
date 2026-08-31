#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Vuelve un servidor tipo `deploy/development/` (laptop de developer o el
# servidor compartido .23) a un estado "recién clonado" — pensado para
# practicar el levantamiento completo desde cero las veces que haga falta,
# sin reinstalar el sistema operativo ni Docker/git/ufw/fail2ban cada vez
# (eso queda cubierto por docs/07-servidor-nuevo-desde-cero.md Fases 1/2/5,
# que no hace falta repetir).
#
# Alcance (decisión 30/08/2026, servidor de prueba 172.16.76.22): SOLO Docker
# (contenedores, volúmenes nombrados, imágenes, build cache) + el clone del
# repo. NO toca el sistema operativo, Docker Engine en sí, UFW ni fail2ban —
# esos quedan instalados y configurados, listos para el próximo clone.
#
# Script puntual para el ejercicio de práctica en el servidor de prueba
# 172.16.76.22 (bare metal, sin snapshot de hipervisor disponible) — no forma
# parte de la guía general de servidores nuevos. En una VM con snapshot
# disponible, preferir el snapshot (más rápido y no depende de que este
# script cubra todo correctamente).
#
# Uso: bash reset-servidor-dev.sh [ruta-del-repo-clonado]
# Por defecto asume /srv/inteligencia (la convención usada en todo el resto
# de la documentación).

repoPath="${1:-/srv/inteligencia}"

if [ ! -d "$repoPath" ]; then
  echo -e "\n>>> '$repoPath' no existe, nada que resetear (ya está en cero).\n"
  exit 0
fi

# Este script vive dentro de $repoPath y termina borrándolo — si se ejecuta
# desde ahí mismo, bash puede fallar a mitad de camino leyendo su propio
# archivo ya borrado (confirmado real: el rm -rf final no llegó a correr).
# Se copia a /tmp y se re-ejecuta desde ahí antes de tocar nada.
scriptRealPath="$(readlink -f "$0")"
if [[ "$scriptRealPath" == "$repoPath"/* ]]; then
  tmpCopy="$(mktemp /tmp/reset-servidor-dev.XXXXXX.sh)"
  cp "$scriptRealPath" "$tmpCopy"
  chmod +x "$tmpCopy"
  exec bash "$tmpCopy" "$repoPath"
fi

echo -e "\n\n >>> Reseteando el entorno Docker de '$repoPath' a cero...\n"
echo -e "Esto borra TODOS los datos de las bases de datos, imágenes construidas\ny el propio clone del repo. Los únicos datos que sobreviven son los backups\nque estén fuera de '$repoPath' (nunca deben vivir dentro del repo, ver\ndocs/13-migracion-y-restauracion-bd.md §4).\n"
read -r -p "Escribir 'si' para confirmar: " confirmacion
if [ "$confirmacion" != "si" ]; then
  echo -e "\nCancelado, no se tocó nada.\n"
  exit 1
fi

if [ -f "$repoPath/deploy/development/docker-compose.yml" ]; then
  echo -e "\n>>> Bajando stack de desarrollo (contenedores + volúmenes)...\n"
  (cd "$repoPath/deploy/development" && docker compose down -v --remove-orphans) || true
fi

if [ -f "$repoPath/deploy/tools/registry/docker-compose.registry.yml" ]; then
  echo -e "\n>>> Bajando registry + UI (contenedores + volúmenes)...\n"
  (cd "$repoPath/deploy/tools/registry" && docker compose -f docker-compose.registry.yml down -v --remove-orphans) || true
fi

echo -e "\n>>> Borrando imágenes construidas localmente (development-*, registries locales, build intermedio de migraciones)...\n"
docker images --format '{{.Repository}}:{{.Tag}}' \
  | grep -E '^(development-|172\.|registry\.sunesis|auth-backend-migrate)' \
  | xargs -r docker rmi -f || true

echo -e "\n>>> Limpiando build cache y capas huérfanas de Docker...\n"
docker builder prune -af || true
docker image prune -af || true

echo -e "\n>>> Cerrando sesión del registry local (~/.docker/config.json)...\n"
docker logout 172.16.76.22 2>/dev/null || true

echo -e "\n>>> Borrando el clone del repo ('$repoPath', incluye todos los .env reales)...\n"
rm -rf "$repoPath"

echo -e "\n >>> ¡Listo! Servidor en cero — Docker/git/ufw/fail2ban siguen instalados.\n     Siguiente paso: docs/07-servidor-nuevo-desde-cero.md sección 8 (git clone) en adelante.\n"
