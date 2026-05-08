# 02 — Acceso SSH
## Claves SSH, hardening y deploy key para GitHub

---

## Visión general

Este documento cubre tres claves SSH distintas con propósitos diferentes:

| Clave | Propósito | Dónde vive |
|-------|-----------|------------|
| Clave del DevOps | Acceder al servidor | En la estación del DevOps |
| Clave del servidor (deploy key) | Clonar el repo desde GitHub | En `/home/server/.ssh/` del servidor |
| Clave de administración (opcional) | Acceso de emergencia | Custodiada por el responsable TI |

---

## 1. Configurar acceso SSH del DevOps al servidor

### En la estación de trabajo del DevOps

```bash
# Generar clave (si no tienes una)
ssh-keygen -t ed25519 -C "devops-felcn@[tu-email]" -f ~/.ssh/felcn_servidor

# Ver la clave pública para registrarla en el servidor
cat ~/.ssh/felcn_servidor.pub
```

### En el servidor (como usuario con sudo)

```bash
# Cambiar al usuario server
su - server

# Crear directorio .ssh con permisos correctos
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Agregar la clave pública del DevOps
echo "ssh-ed25519 AAAA... devops-felcn@email" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> **En producción:** Agregar solo las claves de DevOps autorizados. Documentar quién tiene acceso y revisar periódicamente.

### Verificar acceso antes de continuar

```bash
# Desde la estación del DevOps
ssh -i ~/.ssh/felcn_servidor server@[IP-SERVIDOR]
```

**No continuar con el hardening SSH hasta confirmar que este acceso funciona.**

---

## 2. Hardening de SSH

```bash
# En el servidor, como root/sudo
cat > /etc/ssh/sshd_config.d/99-hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
X11Forwarding no
AllowTcpForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60
EOF

# Verificar sintaxis antes de recargar
sshd -t && echo "OK — sin errores"

# Recargar (sin cortar la sesión actual)
systemctl reload ssh
```

> **CRÍTICO:** Verificar que se puede abrir una NUEVA sesión SSH antes de cerrar la sesión actual. Si algo falla, tienes la sesión abierta para corregirlo.

### Restricción por IP (recomendado en producción)

Si la IP de los DevOps es fija (red de oficina o VPN), agregar:

```bash
# En /etc/ssh/sshd_config.d/99-hardening.conf, agregar:
AllowUsers server@[IP-FIJA-DEVOPS]
```

---

## 3. Deploy Key para GitHub (clonar el repositorio)

Esta clave permite al servidor clonar el repositorio de GitHub **sin usar credenciales personales**.

### Generar la clave en el servidor

```bash
su - server

ssh-keygen -t ed25519 \
  -C "deploy-felcn-[nombre-servidor]" \
  -f ~/.ssh/deploy_felcn_ed25519 \
  -N ""   # Sin passphrase para uso automatizado

# Ver la clave pública
cat ~/.ssh/deploy_felcn_ed25519.pub
```

### Registrar en GitHub como Deploy Key

1. Ir a: `https://github.com/inteligenciadgfelcn/inteligencia`
2. Settings → Deploy keys → Add deploy key
3. Title: `deploy-felcn-[nombre-servidor]` (ej: `deploy-felcn-produccion`)
4. Key: pegar el contenido de `deploy_felcn_ed25519.pub`
5. **Allow write access: NO** — solo lectura es suficiente

> **Por qué deploy key y no clave personal:** Una deploy key está limitada a UN repositorio y puede revocarse sin afectar otras cuentas. Una clave personal da acceso a todos los repositorios del usuario.

### Configurar SSH para usar esta clave con GitHub

```bash
cat >> ~/.ssh/config <<'EOF'

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/deploy_felcn_ed25519
  IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
```

### Verificar autenticación

```bash
ssh -T git@github.com
# Resultado esperado:
# Hi inteligenciadgfelcn! You've successfully authenticated...
```

---

## 4. Resguardo de claves (ver también 08-secretos.md)

```
/home/server/.ssh/
├── authorized_keys           ← Claves públicas de DevOps autorizados
├── deploy_felcn_ed25519      ← PRIVADA — nunca compartir, nunca subir a git
├── deploy_felcn_ed25519.pub  ← Pública — registrada en GitHub
└── config                    ← Configuración SSH del cliente
```

```bash
# Permisos correctos (verificar)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/deploy_felcn_ed25519
chmod 644 ~/.ssh/deploy_felcn_ed25519.pub
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/authorized_keys
```

> **Backup:** Incluir `/home/server/.ssh/` en el backup del servidor. La clave privada nunca debe salir del servidor excepto hacia almacenamiento cifrado.

---

## 5. Verificación final del paso 2

```bash
# Desde estación DevOps — debe conectar sin contraseña
ssh server@[IP-SERVIDOR] "echo 'SSH OK'"

# Desde el servidor — debe autenticar en GitHub
ssh -T git@github.com
```

**Siguiente paso:** [03-seguridad.md](03-seguridad.md)
