# 08 — Gestión de Secretos
## Cómo manejar credenciales de forma segura

---

## Qué es un secreto en este sistema

| Tipo | Ejemplos | Nivel de riesgo |
|------|---------|----------------|
| Contraseñas de base de datos | `DB_PASSWORD` | CRÍTICO |
| JWT secrets | `JWT_SECRET`, `SESSION_SECRET` | CRÍTICO |
| Tokens de terceros | `MSJ_TOKEN`, `OIDC_CLIENT_SECRET` | ALTO |
| Certificados SSL | `privkey.pem` | ALTO |
| Claves SSH privadas | `deploy_felcn_ed25519` | ALTO |
| Variables de entorno de app | `NEXT_PUBLIC_*` | BAJO (son públicas) |

---

## Regla fundamental

> **Ningún secreto va al repositorio git — nunca.**

El `.gitignore` ya excluye `.env` y `docker-compose.yml`. Verificar periódicamente:

```bash
# Buscar si hay credenciales accidentalmente en git
git -C /srv/inteligencia log --all --full-history -- "**/.env"
git -C /srv/inteligencia grep -r "DB_PASSWORD" -- "*.env" 2>/dev/null

# Si aparece algo, usar git-filter-repo para limpiar el historial
# (operación delicada, requiere coordinación con el equipo)
```

---

## Almacenamiento en el servidor

### Estructura de `/opt/felcn/secrets/`

```bash
mkdir -p /opt/felcn/secrets
chmod 700 /opt/felcn/secrets
chown server:server /opt/felcn/secrets
```

```
/opt/felcn/secrets/
├── env-backend-v2          ← .env del backend principal
├── env-auth-backend        ← .env del servicio de auth
├── env-frontend            ← .env del frontend
└── README.txt              ← Quién tiene acceso y cómo rotarlos
```

```bash
# Permisos correctos para cada secreto
chmod 600 /opt/felcn/secrets/*
```

### Desplegar los .env desde secrets

```bash
# Durante el setup (o tras una rotación)
cp /opt/felcn/secrets/env-backend-v2   /srv/inteligencia/backend/felcn-base-backend-v2/.env
cp /opt/felcn/secrets/env-auth-backend /srv/inteligencia/backend/felcn-auth-backend/.env
cp /opt/felcn/secrets/env-frontend     /srv/inteligencia/frontend/felcn-base-frontend/.env
chmod 600 /srv/inteligencia/backend/felcn-base-backend-v2/.env
chmod 600 /srv/inteligencia/backend/felcn-auth-backend/.env
chmod 600 /srv/inteligencia/frontend/felcn-base-frontend/.env
```

---

## Transmisión segura de secretos entre DevOps

**Nunca enviar credenciales por:**
- Email
- Slack / WhatsApp / Telegram
- Tickets de Jira / Trello en texto plano

**Métodos aceptables:**
1. **SCP directo** al servidor: `scp env-backend-v2 server@[IP]:/opt/felcn/secrets/`
2. **Gestor de contraseñas compartido** (Bitwarden, 1Password Teams, Vault)
3. **Archivo cifrado con GPG:**

```bash
# Cifrar para el destinatario
gpg --recipient [EMAIL-DEVOPS] --encrypt env-backend-v2

# El destinatario descifra
gpg --decrypt env-backend-v2.gpg > env-backend-v2
```

---

## Rotación de secretos

Rotar credenciales cuando:
- Un DevOps abandona el equipo
- Se sospecha de una brecha
- Política: cada 6-12 meses en producción

### Proceso de rotación

```bash
# 1. Generar nuevo JWT_SECRET (256 bits en hex)
openssl rand -hex 32

# 2. Generar nueva contraseña de BD
openssl rand -base64 24

# 3. Actualizar en PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '[NUEVA-CONTRASEÑA]';"

# 4. Actualizar /opt/felcn/secrets/
vim /opt/felcn/secrets/env-backend-v2
vim /opt/felcn/secrets/env-auth-backend

# 5. Redeploy con nuevos secretos
cp /opt/felcn/secrets/env-backend-v2 /srv/inteligencia/backend/felcn-base-backend-v2/.env
cp /opt/felcn/secrets/env-auth-backend /srv/inteligencia/backend/felcn-auth-backend/.env
cd /srv/inteligencia && docker compose up -d --force-recreate

# 6. Verificar que los servicios arrancan correctamente
docker compose logs -f --tail 30
```

---

## Backup de secretos

Los secretos deben respaldarse **cifrados**:

```bash
# Backup cifrado de todos los secretos
tar -czf - /opt/felcn/secrets/ /etc/letsencrypt/ /home/server/.ssh/ \
  | gpg --symmetric --cipher-algo AES256 \
  -o /opt/backups/secrets_$(date +%Y%m%d).tar.gz.gpg

chmod 600 /opt/backups/secrets_*.gpg
```

> Guardar la passphrase del backup GPG en un lugar físico seguro (no digital), bajo custodia del responsable de TI.

---

## Checklist de seguridad de secretos

```
[ ] Los .env no están en git (verificar con: git ls-files | grep .env)
[ ] /opt/felcn/secrets/ tiene permisos 700
[ ] Cada archivo .env tiene permisos 600
[ ] Las claves SSH privadas tienen permisos 600
[ ] Los secretos no se envían por canales inseguros
[ ] Existe al menos un backup cifrado de los secretos
[ ] Se documenta quién tiene acceso a los secretos
```

---

## Para producción: considerar un gestor de secretos

Para entornos de producción a largo plazo, evaluar:

| Herramienta | Tipo | Notas |
|------------|------|-------|
| HashiCorp Vault | Self-hosted | Completo, requiere infraestructura |
| AWS Secrets Manager | Cloud | Si se usa AWS |
| Infisical | Self-hosted / Cloud | Open source, fácil de usar |
| SOPS + git | Git-based | Secretos cifrados en git |

**Siguiente paso:** [09-verificacion.md](09-verificacion.md)
