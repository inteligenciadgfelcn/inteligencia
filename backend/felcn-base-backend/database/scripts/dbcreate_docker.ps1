$ErrorActionPreference = "Stop"
$dockerContainer = if ($args[0]) { $args[0] } else { "pg16" }

Write-Host "`n`n >>> Creando Base de datos en $dockerContainer...`n" -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "`nReiniciando el contenedor $dockerContainer...`n" -ForegroundColor Yellow
docker restart "$dockerContainer"
Start-Sleep -Seconds 2

Write-Host "`nPreparando script de creación...`n" -ForegroundColor Yellow
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
docker cp "$scriptDir\dbcreate.sql" "$dockerContainer:/tmp/dbcreate.sql"
Start-Sleep -Seconds 2

Write-Host "`nEjecutando script de creación...`n" -ForegroundColor Yellow
Write-Host "`n========== dbcreate.sql =========`n" -ForegroundColor Gray
docker exec "$dockerContainer" bash -c "cat /tmp/dbcreate.sql"
Write-Host "`n---------------------------------`n" -ForegroundColor Gray
docker exec "$dockerContainer" bash -c "psql -U postgres -f /tmp/dbcreate.sql"
Start-Sleep -Seconds 2

Write-Host "`n [Éxito]: Base de datos creada en el contenedor $dockerContainer`n" -ForegroundColor Green
