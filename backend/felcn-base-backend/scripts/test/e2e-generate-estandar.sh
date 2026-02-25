#!/bin/bash

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

USER_NAME=$(whoami)
HOST_NAME=$(hostname)
PROJECT_NAME="CORE - AGETIC NESTJS BACKEND BASE"

# Directorios de salida
REPORT_DIR="./docs/e2e-tests"
LOG_DIR="$REPORT_DIR/logs"
mkdir -p "$REPORT_DIR"

# Archivos de salida
MARKDOWN_TABLE="$REPORT_DIR/test-e2e-report.md"
rm -f "$MARKDOWN_TABLE"
JSON_REPORT="$(realpath "$REPORT_DIR/test_report_$TIMESTAMP.json")"

# Inicio e impresión en consola
echo "========================================="
echo " INICIANDO PRUEBAS DE INTEGRACIÓN "
echo " Proyecto: $PROJECT_NAME"
echo " Fecha: $(date)"
echo " Usuario: $USER_NAME@$HOST_NAME"
echo "========================================="

START_TIME=$(date +%s)

npm run test:e2e -- --json --outputFile="$JSON_REPORT"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

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

  rm -f /tmp/test_data_$$_*.txt
  
  jq -r '.testResults[] | .assertionResults[] | 
    select(.status != null) | 
    @json' "$JSON_REPORT" | while IFS= read -r test; do
    
    CONTROLLER=$(echo "$test" | jq -r '.ancestorTitles[0] // "Sin Controlador"')
    
    TITLE=$(echo "$test" | jq -r '.title // "N/A"')
    STATUS=$(echo "$test" | jq -r '.status // "N/A"' | tr '[:lower:]' '[:upper:]')
    FULL_NAME=$(echo "$test" | jq -r '.fullName // "N/A"')
    
    ANCESTOR_TITLES=$(echo "$test" | jq -r '.ancestorTitles[]' 2>/dev/null)
    
    CODIGO_PRUEBA="N/A"
    GRUPO_SECUNDARIO="N/A"
    while IFS= read -r ancestor; do
      if [[ $ancestor =~ (TI-[0-9]+) ]]; then
        CODIGO_PRUEBA="${BASH_REMATCH[1]}"
        break
      fi
    done <<< "$ANCESTOR_TITLES"
    
    if [ "$CODIGO_PRUEBA" = "N/A" ]; then
      GRUPO_SECUNDARIO=$(echo "$test" | jq -r '.ancestorTitles[1] // .ancestorTitles[0] // "Sin Grupo"')
      CODIGO_PRUEBA="$GRUPO_SECUNDARIO"
    fi
    
    CODIGO_ITEM="N/A"
    if [[ $TITLE =~ ^([A-Z]+-[0-9]+)\| ]]; then
      CODIGO_ITEM="${BASH_REMATCH[1]}"
    fi
    
    METHOD="N/A"
    if [[ $FULL_NAME =~ (GET|POST|PUT|DELETE|PATCH) ]]; then
      METHOD="${BASH_REMATCH[1]}"
    fi
    
    API="N/A"
    if [[ $FULL_NAME =~ (/api/[a-zA-Z0-9/_-]+) ]]; then
      API="${BASH_REMATCH[1]}"
    fi
    
    DESCRIPTION="N/A"
    if [[ $TITLE =~ \|([^|]+)\| ]]; then
      DESCRIPTION=$(echo "${BASH_REMATCH[1]}" | xargs)
    elif [[ $TITLE =~ \|(.+)$ ]]; then
      DESCRIPTION=$(echo "${BASH_REMATCH[1]}" | xargs)
    else
      DESCRIPTION="$TITLE"
    fi

    CODIGO_HTTP="N/A"
    if [[ $TITLE =~ \|([0-9]{3})$ ]]; then
      CODIGO_HTTP=$(echo "${BASH_REMATCH[1]}" | xargs)
    fi

  
    if [ "$STATUS" = "PASSED" ]; then
      STATUS_FORMATTED="✅ PASSED"
    elif [ "$STATUS" = "FAILED" ]; then
      STATUS_FORMATTED="❌ FAILED"
    else
      STATUS_FORMATTED="⏭️ SKIPPED"
    fi
    
    SAFE_CONTROLLER=$(echo "$CONTROLLER" | sed 's/[^a-zA-Z0-9]/_/g')
    SAFE_CODIGO=$(echo "$CODIGO_PRUEBA" | sed 's/[^a-zA-Z0-9-]/_/g')
    
    TEMP_FILE="/tmp/test_data_$$_${SAFE_CONTROLLER}_${SAFE_CODIGO}.txt"
    echo "$CONTROLLER|$CODIGO_PRUEBA|$CODIGO_ITEM|$DESCRIPTION|$METHOD|$API|$CODIGO_HTTP|$STATUS_FORMATTED" >> "$TEMP_FILE"
  done
  

  declare -A controllers_list
  for file in /tmp/test_data_$$_*.txt; do
    [ -f "$file" ] || continue
    CONTROLLER=$(head -n 1 "$file" | cut -d'|' -f1)
    controllers_list["$CONTROLLER"]=1
  done
  
  for CONTROLLER in "${!controllers_list[@]}"; do
    echo "" >> "$MARKDOWN_TABLE"
    echo "## $CONTROLLER" >> "$MARKDOWN_TABLE"
    echo "" >> "$MARKDOWN_TABLE"
    
    SAFE_CONTROLLER=$(echo "$CONTROLLER" | sed 's/[^a-zA-Z0-9]/_/g')
    
    declare -A codigos_list
    for file in /tmp/test_data_$$_${SAFE_CONTROLLER}_*.txt; do
      [ -f "$file" ] || continue
     
      CODIGO=$(head -n 1 "$file" | cut -d'|' -f2)
      codigos_list["$CODIGO"]=1
    done
    
    for CODIGO in "${!codigos_list[@]}"; do
      SAFE_CODIGO=$(echo "$CODIGO" | sed 's/[^a-zA-Z0-9-]/_/g')
      TEMP_FILE="/tmp/test_data_$$_${SAFE_CONTROLLER}_${SAFE_CODIGO}.txt"
      
      if [ -f "$TEMP_FILE" ]; then
       
        first_line=$(head -n 1 "$TEMP_FILE")
        HEADER_METHOD=$(echo "$first_line" | cut -d'|' -f5)
        HEADER_API=$(echo "$first_line" | cut -d'|' -f6)
        
       
        if [[ $CODIGO =~ ^TI-[0-9]+$ ]]; then
       
          echo "### $CODIGO | \`$HEADER_METHOD\` : **$HEADER_API**" >> "$MARKDOWN_TABLE"
          echo "" >> "$MARKDOWN_TABLE"
          echo "| N° | CÓDIGO ITEM | DESCRIPCIÓN | CÓDIGO HTTP | ESTADO |" >> "$MARKDOWN_TABLE"
          echo "| -- | ----------- | ----------- | ----------- | ------ |" >> "$MARKDOWN_TABLE"
          
          counter=1
          while IFS='|' read -r _ _ CODIGO_ITEM DESCRIPTION _ _ CODIGO_HTTP STATUS_FORMATTED; do
            echo "| $counter | $CODIGO_ITEM | $DESCRIPTION | \`$CODIGO_HTTP\` | $STATUS_FORMATTED |" >> "$MARKDOWN_TABLE"
            counter=$((counter + 1))
          done < "$TEMP_FILE"
        else
       
          if [ "$HEADER_METHOD" != "N/A" ] && [ "$HEADER_API" != "N/A" ]; then
            echo "###  $CODIGO | \`$HEADER_METHOD\` : **$HEADER_API**" >> "$MARKDOWN_TABLE"
          else
            echo "###  $CODIGO" >> "$MARKDOWN_TABLE"
          fi
          echo "" >> "$MARKDOWN_TABLE"
          echo "| N° | CÓDIGO ITEM | DESCRIPCIÓN | MÉTODO | API | CÓDIGO HTTP | ESTADO |" >> "$MARKDOWN_TABLE"
          echo "| -- | ----------- | ----------- | ------ | --- | ----------- | ------ |" >> "$MARKDOWN_TABLE"
          
          counter=1
          while IFS='|' read -r _ _ CODIGO_ITEM DESCRIPTION METHOD API CODIGO_HTTP STATUS_FORMATTED; do
            echo "| $counter | $CODIGO_ITEM | $DESCRIPTION | \`$METHOD\` | \`$API\` | \`$CODIGO_HTTP\` | $STATUS_FORMATTED |" >> "$MARKDOWN_TABLE"
            counter=$((counter + 1))
          done < "$TEMP_FILE"
        fi
        
        echo "" >> "$MARKDOWN_TABLE"
      fi
    done
    
    unset codigos_list
  done
  
  rm -f /tmp/test_data_$$_*.txt
  rm -f "$JSON_REPORT"
fi


# Resultado final (Impresión en la consola)
if [ "$FAILED" != "0" ] && [ "$FAILED" != "N/A" ]; then
  echo "❌ Algunas pruebas fallaron."
  exit 1
else
  echo "✅ Todas las pruebas pasaron correctamente."
  exit 0
fi