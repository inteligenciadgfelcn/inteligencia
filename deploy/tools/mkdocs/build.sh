#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Corre parado en cualquier lado — resuelve la raíz del repo solo (2 niveles
# arriba de deploy/tools/mkdocs/), así no importa desde dónde se invoque.
raizRepo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

echo -e "\n\n >>> Buildeando la imagen de mkdocs...\n"
docker build -t felcn-mkdocs "$raizRepo/deploy/tools/mkdocs"

echo -e "\nGenerando site/ desde docs/...\n"
# mkdocs.yml usa docs_dir/site_dir relativos a su propia ubicación (raíz del
# repo) — se monta la raíz completa en /docs para que esas rutas relativas
# resuelvan igual que corriendo `mkdocs build` nativo desde ahí.
docker run --rm -v "$raizRepo:/docs" felcn-mkdocs build

echo -e "\n >>> ¡Listo! Sitio generado en $raizRepo/site/\n"
