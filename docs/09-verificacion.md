# 09 — Checklist de Verificación
## Validación completa antes de dar el sistema como operativo

---

## Instrucciones

Ejecutar cada verificación en orden. Marcar con [x] cuando pase.
Si alguna falla, volver al documento correspondiente antes de continuar.

---

## Bloque 1 — Sistema base

```bash
# Ejecutar todo junto y revisar resultados
echo "=== Sistema Operativo ==="
uname -r && cat /etc/debian_version

echo "=== Servicios base ==="
systemctl is-active docker nginx postgresql fail2ban

echo "=== Usuario y grupos ==="
id server
groups server | grep -E "docker|sudo"
```

```
[ ] OS: Debian 13 (Trixie)
[ ] Docker: active
[ ] Nginx: active
[ ] PostgreSQL: active
[ ] Fail2ban: active
[ ] Usuario 'server' en grupos: sudo, docker
```

---

## Bloque 2 — Seguridad y red

```bash
echo "=== Firewall ==="
sudo ufw status

echo "=== SSH ==="
sshd -T | grep -E "permitrootlogin|passwordauthentication|maxauthtries"

echo "=== Puertos abiertos ==="
ss -tlnp | grep -E "22|80|443|5432|3015|3016|3017"
```

```
[ ] UFW: active
[ ] Puertos abiertos al exterior: solo 22, 80, 443
[ ] PermitRootLogin: no
[ ] PasswordAuthentication: no
[ ] MaxAuthTries: 3
[ ] Puerto 5432 NO visible desde el exterior (solo en 127.0.0.1)
[ ] Puertos 3015, 3016, 3017 NO visibles desde el exterior (solo en 127.0.0.1)
```

---

## Bloque 3 — Base de datos

```bash
echo "=== PostgreSQL ==="
pg_isready -h localhost

echo "=== Bases de datos ==="
sudo -u postgres psql -c "\l" | grep -E "felcn|asignacion|sii|sospechoso"

echo "=== Schemas en felcn_auth_v3 ==="
sudo -u postgres psql -d felcn_auth_v3 -c "\dn"
```

```
[ ] PostgreSQL acepta conexiones en localhost
[ ] Base de datos felcn_auth_v3: existe
[ ] Base de datos a_felcn_asignacion_caso: existe
[ ] Base de datos a_felcn_sii: existe
[ ] Base de datos felcn_siii: existe
[ ] Base de datos a_felcn_sospechoso: existe
[ ] Schemas en felcn_auth_v3: usuarios, parametricas, proyecto, usuario, parametro, felcn_estructura
```

---

## Bloque 4 — Docker y contenedores

```bash
echo "=== Contenedores ==="
docker compose -f /srv/inteligencia/docker-compose.yml ps

echo "=== Health checks ==="
curl -sf http://localhost:3015/api/health && echo "OK backend-v2" || echo "FAIL backend-v2"
curl -sf http://localhost:3016/api/health && echo "OK auth-backend" || echo "FAIL auth-backend"
curl -sf http://localhost:3017 > /dev/null && echo "OK frontend" || echo "FAIL frontend"
```

```
[ ] base-backend-v2: Up
[ ] auth-backend: Up
[ ] base-frontend: Up
[ ] Backend v2 responde en :3015
[ ] Auth backend responde en :3016
[ ] Frontend responde en :3017
[ ] Volumen logs_data: existe
[ ] Red felcn-network: existe
```

---

## Bloque 5 — Nginx y SSL

```bash
echo "=== Nginx ==="
nginx -t

echo "=== Certificado ==="
certbot certificates

echo "=== Redirección HTTP → HTTPS ==="
curl -I http://desarrollo.felcn.gob.bo 2>/dev/null | head -3

echo "=== HTTPS ==="
curl -sf https://desarrollo.felcn.gob.bo/ > /dev/null && echo "OK frontend HTTPS"
curl -sf https://desarrollo.felcn.gob.bo/felcn/api/health && echo "OK backend-v2 HTTPS"
curl -sf https://desarrollo.felcn.gob.bo/felcn/auth/api/health && echo "OK auth HTTPS"
```

```
[ ] nginx -t: OK (sin errores)
[ ] Certificado SSL: válido, más de 30 días para vencer
[ ] HTTP redirige a HTTPS (301)
[ ] HTTPS frontend: responde
[ ] HTTPS backend-v2 API: responde
[ ] HTTPS auth API: responde
[ ] Header HSTS: presente
[ ] Header X-Frame-Options: presente
```

---

## Bloque 6 — Secretos y archivos sensibles

```bash
echo "=== .env no en git ==="
git -C /srv/inteligencia ls-files | grep "\.env" && echo "PROBLEMA: .env en git" || echo "OK: .env no en git"

echo "=== Permisos de secretos ==="
stat -c "%a %n" /srv/inteligencia/backend/felcn-base-backend-v2/.env
stat -c "%a %n" /srv/inteligencia/backend/felcn-auth-backend/.env
stat -c "%a %n" /srv/inteligencia/frontend/felcn-base-frontend/.env
stat -c "%a %n" /opt/felcn/secrets/
stat -c "%a %n" /home/server/.ssh/deploy_felcn_ed25519
```

```
[ ] Ningún .env en git
[ ] .env backend-v2: permisos 600
[ ] .env auth-backend: permisos 600
[ ] .env frontend: permisos 600
[ ] /opt/felcn/secrets/: permisos 700
[ ] Clave SSH privada: permisos 600
```

---

## Bloque 7 — Backups y auto-arranque

```bash
echo "=== Backup PostgreSQL ==="
ls -la /opt/backups/postgres/ | tail -5

echo "=== Cron backup ==="
crontab -l | grep backup

echo "=== Auto-arranque Docker ==="
systemctl is-enabled docker

echo "=== Renovación SSL ==="
systemctl is-active certbot.timer
```

```
[ ] Existe al menos un backup de PostgreSQL
[ ] Cron de backup: activo a las 02:00
[ ] Docker: enabled (arranca con el sistema)
[ ] certbot.timer: active (renovación automática SSL)
```

---

## Resultado final

Si todos los checks pasan → **el sistema está listo para operar**.

Si algún check falla → volver al documento correspondiente:

| Bloque | Documento |
|--------|-----------|
| 1 — Sistema base | [01-servidor-base.md](01-servidor-base.md) |
| 2 — Seguridad | [02-acceso-ssh.md](02-acceso-ssh.md) + [03-seguridad.md](03-seguridad.md) |
| 3 — Base de datos | [04-postgresql.md](04-postgresql.md) |
| 4 — Docker | [06-docker.md](06-docker.md) |
| 5 — Nginx/SSL | [07-nginx-ssl.md](07-nginx-ssl.md) |
| 6 — Secretos | [08-secretos.md](08-secretos.md) |
| 7 — Backups | [04-postgresql.md](04-postgresql.md) + [06-docker.md](06-docker.md) |
