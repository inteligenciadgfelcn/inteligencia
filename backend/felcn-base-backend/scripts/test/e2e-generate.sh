#!/bin/bash
#  Fecha y hora
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Usuario y entorno
USER_NAME=$(whoami)
HOST_NAME=$(hostname)
PROJECT_NAME="CORE - AGETIC NESTJS BACKEND BASE"
PID=$$

# Directorios de salida
REPORT_DIR="./docs/e2e-tests"
LOG_DIR="$REPORT_DIR/logs"
mkdir -p "$REPORT_DIR"

#  Archivos de salida

MARKDOWN_TABLE="$REPORT_DIR/test-e2e-report.md"
rm -f "$MARKDOWN_TABLE"
JSON_REPORT="$(realpath "$REPORT_DIR/test_report_$TIMESTAMP.json")"

echo "Ruta actual: $(pwd)"
echo "Generando reportes en: $REPORT_DIR"

#  Impresión en consola del inicio de las pruebas
echo "========================================="
echo " INICIANDO PRUEBAS DE INTEGRACIÓN "
echo " Proyecto: $PROJECT_NAME"
echo " Fecha: $(date)"
echo " Usuario: $USER_NAME@$HOST_NAME"
echo "========================================="

START_TIME=$(date +%s)

# Ejecucción de las pruebas
npm run test:e2e -- --json --outputFile="$JSON_REPORT"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Métricas de las pruebas
if [ -f "$JSON_REPORT" ]; then
  TOTAL_TESTS=$(jq '.numTotalTests' "$JSON_REPORT")
  PASSED=$(jq '.numPassedTests' "$JSON_REPORT")
  FAILED=$(jq '.numFailedTests' "$JSON_REPORT")
  SKIPPED=$(jq '.numPendingTests' "$JSON_REPORT")
else
  TOTAL_TESTS="N/A"
  PASSED="N/A"
  FAILED="N/A"
  SKIPPED="N/A"
fi

# Encabezado del reporte
echo "# Reporte de Pruebas de Integración" > "$MARKDOWN_TABLE"
echo "" >> "$MARKDOWN_TABLE"
echo "**Proyecto:** $PROJECT_NAME" >> "$MARKDOWN_TABLE"
echo "**Fecha:** $(date)" >> "$MARKDOWN_TABLE"
echo "**Duración:** ${DURATION}s" >> "$MARKDOWN_TABLE"
echo "" >> "$MARKDOWN_TABLE"
echo "## Resumen" >> "$MARKDOWN_TABLE"
echo "- **Total de pruebas:** $TOTAL_TESTS" >> "$MARKDOWN_TABLE"
echo "- **Aprobadas:** $PASSED" >> "$MARKDOWN_TABLE"
echo "- **Fallidas:** $FAILED" >> "$MARKDOWN_TABLE"
echo "- **Omitidas:** $SKIPPED" >> "$MARKDOWN_TABLE"
echo "" >> "$MARKDOWN_TABLE"


if [ -f "$JSON_REPORT" ]; then

  rm -f /tmp/test_*_"$PID".txt 2>/dev/null


  while IFS= read -r test; do

    CONTROLLER=$(echo "$test" | jq -r '.ancestorTitles[0] // "Sin Controlador"')
    TITLE=$(echo "$test" | jq -r '.title // "N/A"')
    STATUS=$(echo "$test" | jq -r '.status // "N/A"' | tr '[:lower:]' '[:upper:]')
    FULL_NAME=$(echo "$test" | jq -r '.fullName // "N/A"')

      DESCRIPTION=$(echo "$TITLE" | tr '|$;:*%()#&/\"' ' ')

    case "$STATUS" in
      PASSED) STATUS_FORMATTED="\`✅ PASSED\`" ;;
      FAILED) STATUS_FORMATTED="\`❌ FAILED\`" ;;
      *)      STATUS_FORMATTED="\`⏭️ SKIPPED\`" ;;
    esac

    SAFE_CONTROLLER=$(echo "$CONTROLLER" | tr '[:space:]/' '_' | sed 's/[^a-zA-Z0-9_-]/_/g')
    TEMP_FILE="/tmp/test_${SAFE_CONTROLLER}_${PID}.txt"


    echo "$DESCRIPTION|$STATUS_FORMATTED" >> "$TEMP_FILE"
  done < <(jq -c '.testResults[] | .assertionResults[] | select(.status != null)' "$JSON_REPORT")

  for temp_file in /tmp/test_*_"$PID".txt; do
    [ -f "$temp_file" ] || continue

    filename=$(basename "$temp_file")

    CONTROLLER_NAME=${filename#test_}
    CONTROLLER_NAME=${CONTROLLER_NAME%_"$PID".txt}
    CONTROLLER_NAME=$(echo "$CONTROLLER_NAME" | tr '_' ' ')

    echo "" >> "$MARKDOWN_TABLE"
    echo "## $CONTROLLER_NAME" >> "$MARKDOWN_TABLE"
    echo "" >> "$MARKDOWN_TABLE"
    echo "| N° | DESCRIPCIÓN | ESTADO |" >> "$MARKDOWN_TABLE"
    echo "| -- |-------------|--------|" >> "$MARKDOWN_TABLE"

    counter=1
    while IFS='|' read -r DESCRIPTION STATUS_FORMATTED; do
      [ -z "$DESCRIPTION" ] && continue
      echo "| $counter | $DESCRIPTION | $STATUS_FORMATTED |" >> "$MARKDOWN_TABLE"
      counter=$((counter + 1))
    done < "$temp_file"


    rm -f "$temp_file"
    rm -f "$JSON_REPORT"

  done
fi

# Información de la ejecución de las pruebas (consola)
if [ "$FAILED" != "0" ] && [ "$FAILED" != "N/A" ]; then
  echo "❌ Algunas pruebas fallaron."
  exit 1
else
  echo "✅ Todas las pruebas pasaron correctamente."
  exit 0
fi
