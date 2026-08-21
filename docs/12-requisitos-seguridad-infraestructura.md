# 12 — Requisitos de seguridad e infraestructura (staging y producción)

Checklist estándar de lo que el área de infraestructura/seguridad debe **mantener** en cualquier servidor que aloje esta plataforma (staging, producción o cualquier otro que se sume) — no es una guía de instalación (eso es [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md)), es la lista de condiciones que tienen que seguir siendo verdad **todo el tiempo**, con revisión periódica, no solo el día de la instalación.

Cada punto está atado a un incidente real detectado en `servertest` — no son recomendaciones genéricas de un checklist estándar de internet.

## 1. Red / Firewall

- [ ] **Entrante**: solo 22/tcp (SSH), 80/tcp, 443/tcp abiertos al exterior. Todo lo demás (backends, Postgres, Redis) debe escuchar solo en `127.0.0.1` o en la red interna de Docker — nunca expuesto directo a internet. *(Ver [00-arquitectura.md](./00-arquitectura.md) — la mayoría de los servicios ya siguen este patrón; `base-backend-v2` es la excepción conocida que escucha en `0.0.0.0`, pendiente de revisar si es intencional.)*
- [ ] **Saliente**: UFW permite todo saliente por defecto, pero **confirmar que realmente llega** a cada dependencia externa — no alcanza con que la regla exista:
  - SMTP (`SMTP_HOST`/`SMTP_PORT` del `.env` de `auth-backend`, típicamente 587/465). *Incidente real: en `servertest` este puerto quedó bloqueado (`EHOSTUNREACH`) sin que nada lo hiciera evidente — la app respondía éxito igual y el correo de activación nunca salía.*
  - AGETIC / Ciudadanía Digital (`OIDC_ISSUER` del `.env`).
  - GitHub (para `git clone`/`pull` con la clave de deploy).
  - Ninguna otra dependencia externa hoy (agosto 2026) — si en el futuro algún componente necesita interoperar con otro host externo, documentar acá la IP/puerto exacto cuando se defina; hasta entonces no hay nada que abrir.
- [ ] Reglas de UFW auditadas contra lo que documenta [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 1 — no reglas agregadas "a mano" sin quedar documentadas acá.

## 2. Accesos SSH

- [ ] **`PasswordAuthentication` se mantiene habilitado a propósito** — decisión ya tomada para este proyecto. *Incidente real: en `servertest` se deshabilitó como parte de un hardening estándar y tuvo que revertirse; no repetir el intento en ningún servidor nuevo.*
- [ ] `PermitRootLogin no`.
- [ ] Una cuenta por persona, nunca accesos compartidos/genéricos. Revocar acceso (deshabilitar cuenta + sacar del grupo `docker`/`developers`) el mismo día que alguien deja de necesitarlo — no dejarlo pendiente.
- [ ] Claves SSH: cada desarrollador con su propia clave; la clave usada para clonar el repo (deploy key) es **dedicada al servidor**, no la clave personal de ningún admin.
- [ ] fail2ban activo con el jail de `sshd` (`fail2ban-client status sshd`).

## 3. Sistema operativo

- [ ] **Headless, sin entorno de escritorio** — no negociable. *Incidente real: `servertest` tuvo una caída total (29/07/2026) por una sesión GNOME + Firefox activa en la consola física, rastreada a un cuelgue del driver gráfico (i915), compitiendo con el rol de servidor.* Verificar periódicamente, no solo en la instalación: `systemctl get-default` debe ser `multi-user.target`, `loginctl list-sessions` sin sesiones GUI en `seat0`.
- [ ] Actualizaciones de seguridad del SO aplicadas con una cadencia definida (no "cuando alguien se acuerda") — `apt update && apt upgrade` regular, idealmente con `unattended-upgrades` para parches de seguridad.
- [ ] UFW y fail2ban con `systemctl is-enabled` en `enabled` (sobreviven a un reinicio).

## 4. TLS / Certificados

- [ ] Certificado Let's Encrypt vigente, renovación automática confirmada activa: `systemctl list-timers | grep certbot`.
- [ ] `certbot renew --dry-run` corrido y sin errores — no asumir que "como no dio error hasta ahora, va a seguir funcionando".
- [ ] Certificados no viven dentro de ninguna imagen Docker (si nginx llegara a dockerizarse en algún momento) — siempre en filesystem persistente del host o volumen nombrado.

## 5. Base de datos

- [ ] `scram-sha-256` como método de auth en `pg_hba.conf` — nunca `trust`, nunca `md5`. Confirmar después de cualquier reinstalación de Postgres, no solo la primera vez.
- [ ] **Backup automatizado, y probado de verdad** (no solo "el cron existe"). *Incidente real: en `servertest` el backup diario llevaba roto desde el 1 de mayo de 2026 — el cron corría, pero fallaba en la primera línea por un permiso de archivo de log y nunca llegaba a hacer `pg_dump`. Nadie lo notó hasta que se auditó explícitamente.* Verificación mínima recurrente: confirmar que el archivo de dump más reciente existe y tiene una fecha de menos de 24-48h, no solo que el log del cron "no tiene errores".
- [ ] Retención definida y aplicada (ej. 30 días) — no dumps acumulándose sin límite ni desapareciendo antes de lo esperado.
- [ ] Backups fuera del servidor que respaldan, o al menos fuera de cualquier volumen que se borre junto con los datos originales.
- [ ] Restauración probada al menos una vez por ambiente (no asumir que un backup que nunca se restauró realmente sirve).

## 6. Docker / Contenedores

- [ ] Todos los servicios de aplicación con `restart: unless-stopped`.
- [ ] Límites de logging configurados en `/etc/docker/daemon.json` (`max-size`, `max-file`) — sin esto, los logs de un contenedor con mucho tráfico pueden llenar el disco del host sin avisar.
- [ ] Ningún puerto de servicio interno (backend, Postgres si se dockeriza, Redis) expuesto más allá de `127.0.0.1` salvo lo que nginx necesite.
- [ ] Imágenes construidas a partir de código commiteado y revisado — recordar que el build context de Docker toma el disco tal cual está, no `git HEAD`; un `git status` sucio antes de un build de producción puede desplegar código que nadie revisó.

## 7. Secretos y variables de entorno

- [ ] Ningún `.env` real llega a git — confirmar `.gitignore` de cada proyecto antes de cualquier clonado nuevo.
- [ ] Todos los secretos (`JWT_SECRET`, `SESSION_SECRET`, `OIDC_CLIENT_SECRET`, `*_PASSWORD`, `*_TOKEN`) rotados al pasar a un servidor nuevo — nunca reutilizados entre dev/staging/producción. *Incidente real: hubo una clave de API real commiteada en texto plano en un `.env.sample` — ver [04-variables-de-entorno.md](./04-variables-de-entorno.md) §6.*
- [ ] `ADMIN_INITIAL_PASSWORD` del seed de usuarios: contraseña fuerte real, nunca un valor trivial. *Incidente real: el seed usaba `'123'` hardcodeado hasta que se corrigió — ver [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).*
- [ ] `04-variables-de-entorno.md` refleja **todas** las variables reales de cada `.env.sample`/`.env.example`, sin variables fantasma ni faltantes — auditar de nuevo si se agregan variables nuevas al código.

## 8. Monitoreo

- [ ] Estado de los contenedores (`docker ps`, sin reinicios en loop) revisado con regularidad, no solo reactivamente cuando alguien reporta que algo no anda.
- [ ] Logs de aplicación (`auth-backend`, `base-backend-v2`) accesibles y revisados ante cualquier reporte de "no me llegó el correo" / "no puedo entrar" — el patrón real de esta plataforma es que este tipo de fallo (SMTP) es silencioso: la app responde éxito igual.
- [ ] `fail2ban-client status` revisado periódicamente — jails activos y realmente baneando (no solo "instalado").

## 9. Diferencias explícitas entre staging y producción

Hoy (agosto 2026) staging y dev comparten la misma configuración de Ciudadanía Digital (AGETIC demo) — ver [00-arquitectura.md](./00-arquitectura.md) §4 y [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 4. Esto es temporal:

- [ ] **Cuando AGETIC/FELCN entregue credenciales de producción**: `OIDC_ISSUER`, `OIDC_CLIENT_ID`/`SECRET` y `OIDC_REDIRECT_URI` propios para el dominio de producción, registrados en [Ciudadanía Digital Developer](https://developer.ciudadaniadigital.bo/) — no reutilizar las credenciales demo de dev/staging.
- [ ] **Datos**: decidir explícitamente si producción arranca con datos reales migrados o desde cero — no asumir que lo que sirvió para poblar staging (ver `backups/*/README.md` de cada migración) es automáticamente lo correcto para producción.
- [ ] **Secretos**: producción con su propio juego completo de secretos rotados (sección 7) — nunca los mismos que staging.
- [ ] Cualquier otra diferencia que surja (SLA de backup, monitoreo más estricto, etc.) debe agregarse acá explícitamente cuando se defina, para que este documento siga siendo la fuente de verdad de "qué es distinto entre ambientes".

## 10. Referencia rápida — de dónde sale cada requisito

| Sección | Detalle / incidente real | Doc relacionado |
|---|---|---|
| Firewall saliente / SMTP | `EHOSTUNREACH` en `servertest`, correo de activación nunca salía | [07](./07-servidor-nuevo-desde-cero.md) §9 |
| SSH password auth | Se deshabilitó y hubo que revertir | [07](./07-servidor-nuevo-desde-cero.md) §1 |
| Headless | Caída total 29/07/2026 por sesión GNOME activa | [07](./07-servidor-nuevo-desde-cero.md) §7 |
| Backup Postgres | Roto desde el 1/05/2026, nadie lo notó | [03](./03-base-de-datos.md) §9.2 |
| Secretos commiteados | API key real en `.env.sample` | [04](./04-variables-de-entorno.md) §6 |
| Contraseña hardcodeada | Seed con `'123'` | [08](./08-runbook-reset-y-admin-inicial.md) |
| Variables sin documentar/fantasma | `URL_FRONTEND` faltante, `IOP_SEGIP`/Alertín inexistentes | [04](./04-variables-de-entorno.md) |
