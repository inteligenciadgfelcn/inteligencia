#!/bin/bash

set -e -o errtrace
trap "echo -e '\n\nERROR: Ocurrió un error mientras se ejecutaba el script :(\n\n'" ERR

# Corre EN EL HOST, disparado por un timer de systemd (mismo patrón que el
# certbot.timer nativo ya documentado) — no adentro de un contenedor con
# docker.sock montado, para no darle a un contenedor de renovación acceso al
# socket de Docker (superficie de ataque innecesaria, ver antecedente del
# cryptominer de julio/2026 en la memoria de este proyecto).

echo -e "\n\n >>> Renovando certificados (Let's Encrypt, webroot)...\n"
docker compose run --rm certbot renew --webroot -w /var/www/certbot \
  || { echo -e "\n\nERROR: Falló la renovación de certificados\n\n"; exit 1; }

echo -e "\nRecargando nginx...\n"
docker compose exec nginx nginx -s reload \
  || { echo -e "\n\nERROR: Falló el reload de nginx\n\n"; exit 1; }

echo -e "\n >>> ¡Certificados renovados y nginx recargado! :)\n"
