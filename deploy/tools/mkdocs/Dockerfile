# Imagen mínima para buildear el sitio de documentación (docs/ -> site/) sin
# depender de una instalación local de `uv`/`mkdocs` en el host (la que se usa
# hoy en servertest es un `uv tool install`, no reproducible en otro servidor
# sin repetir ese paso a mano). Mismas versiones que la instalación real
# (confirmado 30/08/2026): mkdocs 1.6.1, mkdocs-material 9.7.7. El plugin
# `search` es parte del núcleo de mkdocs, no necesita paquete aparte.
FROM python:3.13-slim

RUN pip install --no-cache-dir mkdocs==1.6.1 mkdocs-material==9.7.7

WORKDIR /docs
ENTRYPOINT ["mkdocs"]
CMD ["build"]
