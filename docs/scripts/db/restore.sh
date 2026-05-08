#!/bin/bash
set -euo pipefail

# Script de restore de bases de datos FELCN desde dumps
# Uso: bash restore.sh /ruta/a/directorio/de/dumps
# Ejemplo: bash restore.sh /opt/backups/postgres/

DUMP_DIR="${1:?Uso: bash restore.sh /ruta/dumps}"
DATABASES=(felcn_auth_v3 a_felcn_asignacion_caso a_felcn_sii felcn_siii a_felcn_sospechoso)

log()  { echo "[$(date '+%H:%M:%S')] $*"; }
ok()   { echo "  [OK]  $*"; }
fail() { echo "  [FAIL] $*" >&2; exit 1; }

log "Iniciando restore desde: $DUMP_DIR"

# Verificar que el directorio existe
[ -d "$DUMP_DIR" ] || fail "Directorio no encontrado: $DUMP_DIR"

for DB in "${DATABASES[@]}"; do
  # Buscar dump más reciente para esta base
  DUMP_FILE=$(ls -t "$DUMP_DIR/${DB}"_*.dump 2>/dev/null | head -1)

  if [ -z "$DUMP_FILE" ]; then
    echo "  [SKIP] No se encontró dump para: $DB"
    continue
  fi

  log "Restaurando $DB desde $(basename "$DUMP_FILE")..."

  # Crear la base si no existe
  sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='$DB'" \
    | grep -q 1 || sudo -u postgres createdb "$DB"

  # Restore
  sudo -u postgres pg_restore \
    --verbose \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    -d "$DB" \
    "$DUMP_FILE" 2>&1 | grep -E "^pg_restore|error|warning" || true

  ok "$DB restaurada"
done

# Restaurar globals (usuarios, roles) si existe
GLOBALS_FILE=$(ls -t "$DUMP_DIR"/globals_*.sql.gz 2>/dev/null | head -1)
if [ -n "$GLOBALS_FILE" ]; then
  log "Restaurando globals desde $(basename "$GLOBALS_FILE")..."
  zcat "$GLOBALS_FILE" | sudo -u postgres psql -q
  ok "Globals restaurados"
fi

log "Restore completado"
