# 04 — PostgreSQL
## Configuración, bases de datos, schemas y restore

---

## Consideración de arquitectura

```
┌─────────────────────────────────────────────┐
│  DESARROLLO / STAGING                       │
│  PostgreSQL puede estar en servidor externo │
│  Conexión por IP con credenciales           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  PRODUCCIÓN                                 │
│  PostgreSQL debe estar en:                  │
│  a) El mismo servidor (localhost)           │
│  b) Red privada / VPN — nunca IP pública    │
│  Puerto 5432 NUNCA abierto en firewall      │
└─────────────────────────────────────────────┘
```

---

## 1. Configurar contraseña del usuario postgres

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '[CONTRASEÑA-SEGURA]';"
```

> Guardar esta contraseña en `/opt/felcn/secrets/` (ver [08-secretos.md](08-secretos.md))

---

## 2. Crear usuario de aplicación (recomendado en producción)

En producción, la aplicación no debe conectarse como `postgres` (superusuario).

```bash
sudo -u postgres psql <<'SQL'
-- Usuario de aplicación con permisos limitados
CREATE USER felcn_app WITH PASSWORD '[CONTRASEÑA-APP]';

-- Permisos mínimos necesarios
-- (se asignan por base de datos en el paso siguiente)
SQL
```

---

## 3. Crear bases de datos y schemas

Ejecutar el script `docs/scripts/db/02-crear-bases.sql`:

```bash
sudo -u postgres psql -f /srv/inteligencia/docs/scripts/db/01-crear-usuarios.sql
sudo -u postgres psql -f /srv/inteligencia/docs/scripts/db/02-crear-bases.sql
sudo -u postgres psql -f /srv/inteligencia/docs/scripts/db/03-crear-schemas.sql
```

Bases de datos que el sistema necesita:

| Base de datos | Uso |
|--------------|-----|
| `felcn_auth_v3` | Autenticación, usuarios, parámetros, estructura |
| `a_felcn_asignacion_caso` | Asignación de casos |
| `a_felcn_sii` | Sistema de Inteligencia I |
| `felcn_siii` | Sistema de Inteligencia III |
| `a_felcn_sospechoso` | Registro de sospechosos |

---

## 4. Restaurar desde dumps (método estándar)

Si se transfieren dumps desde otro servidor:

```bash
# Transferir los dumps al servidor (desde la estación del DevOps)
scp /ruta/local/*.dump server@[IP-SERVIDOR]:/opt/backups/postgres/

# En el servidor — restaurar cada base
sudo -u postgres pg_restore \
  --verbose \
  --clean \
  --if-exists \
  -d felcn_auth_v3 \
  /opt/backups/postgres/felcn_auth_v3.dump

# Repetir para cada base de datos
```

O usar el script de restore incluido:

```bash
bash /srv/inteligencia/docs/scripts/db/restore.sh /opt/backups/postgres/
```

---

## 5. Configurar acceso remoto (solo para desarrollo/staging)

> **En producción:** Omitir esta sección. PostgreSQL solo debe ser accesible localmente.

Para que el DevOps pueda conectarse desde su estación durante el desarrollo:

### 5a. listen_addresses

```bash
# Editar postgresql.conf
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" \
  /etc/postgresql/17/main/postgresql.conf
```

### 5b. Agregar regla en pg_hba.conf

```bash
sudo tee -a /etc/postgresql/17/main/pg_hba.conf <<'EOF'

# Acceso remoto — solo IPs autorizadas del equipo de desarrollo
# REMOVER esta línea en producción
host    all    postgres    [IP-DEVOPS]/32    scram-sha-256
EOF
```

### 5c. Abrir puerto en UFW (solo para desarrollo)

```bash
# Restringir a la IP del DevOps, nunca abrir a 0.0.0.0
ufw allow from [IP-DEVOPS] to any port 5432 comment 'PostgreSQL DevOps'
```

### 5d. Reiniciar PostgreSQL

```bash
sudo systemctl restart postgresql
pg_isready -h [IP-SERVIDOR] -p 5432
```

### Conectar desde la estación del DevOps

```bash
psql -h [IP-SERVIDOR] -p 5432 -U postgres -d felcn_auth_v3
```

---

## 6. Backup automático

```bash
mkdir -p /opt/backups/postgres

cat > /opt/backups/backup-postgres.sh <<'SCRIPT'
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/opt/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
DATABASES=(felcn_auth_v3 a_felcn_asignacion_caso a_felcn_sii felcn_siii a_felcn_sospechoso)

mkdir -p "$BACKUP_DIR"

for DB in "${DATABASES[@]}"; do
  pg_dump -U postgres -Fc "$DB" \
    > "$BACKUP_DIR/${DB}_${TIMESTAMP}.dump"
  echo "[OK] $DB respaldada"
done

# Globals (usuarios, roles)
pg_dumpall -U postgres --globals-only \
  | gzip > "$BACKUP_DIR/globals_${TIMESTAMP}.sql.gz"

# Eliminar backups viejos
find "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "[OK] Backup completo: $TIMESTAMP"
SCRIPT

chmod +x /opt/backups/backup-postgres.sh

# Instalar cron diario a las 02:00
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/backup-postgres.sh >> /opt/backups/backup.log 2>&1") \
  | crontab -
```

---

## 7. Verificación final del paso 4

```bash
# PostgreSQL activo
pg_isready -h localhost

# Listar bases de datos creadas
sudo -u postgres psql -c "\l"

# Verificar schemas en felcn_auth_v3
sudo -u postgres psql -d felcn_auth_v3 -c "\dn"
```

**Siguiente paso:** [05-proyecto.md](05-proyecto.md)
