# Migración a Ciudadanía Digital Oficial (AGETIC)

Guía paso a paso para reemplazar el `fake-ciudadania-api` de desarrollo por el servicio real
de [Ciudadanía Digital](https://ciudadaniadigital.gob.bo/) provisto por AGETIC.

---

## 1. Registrar la aplicación en el Portal Developer de Ciudadanía Digital

URL: **https://developer.ciudadaniadigital.bo**

1. Crear una cuenta de desarrollador (o usar la cuenta institucional).
2. Ir a **Mis Aplicaciones → Nueva Aplicación**.
3. Completar los datos de la aplicación:
   - **Nombre**: nombre del sistema (ej. `FELCN - Sistema de Autenticación`)
   - **URL de redirección (redirect_uri)**: URL pública del auth-backend
     ```
     https://<dominio-produccion>/api/ciudadania-autorizar
     ```
   - **URL de post-logout**: URL del frontend
     ```
     https://<dominio-frontend>/
     ```
   - **Scopes solicitados**: `openid profile email fecha_nacimiento celular`
4. Una vez aprobada la aplicación, el portal entrega:
   - `OIDC_ISSUER` (URL del proveedor, ej. `https://account.ciudadaniadigital.gob.bo`)
   - `OIDC_CLIENT_ID`
   - `OIDC_CLIENT_SECRET`

> Para entornos de preproducción/test, usar el issuer de pruebas:
> `https://account-idetest.agcs.agetic.gob.bo`

---

## 2. Variables de entorno a cambiar en `felcn-auth-backend`

### Estado con el fake (desarrollo)

```env
OIDC_ISSUER=http://<IP-servidor-fake>:3001
OIDC_CLIENT_ID=fake-ciudadania-client
OIDC_CLIENT_SECRET=fake-ciudadania-secret
OIDC_SCOPE=openid profile email fecha_nacimiento celular
OIDC_REDIRECT_URI=http://<IP-servidor-A>:3000/api/ciudadania-autorizar
OIDC_POST_LOGOUT_REDIRECT_URI=http://<IP-frontend>:8080/
SESSION_SECRET=<secreto-local>
# FAKE_CIUDADANIA_INTERNAL_URL=http://...   ← solo si estaba activa
```

### Estado con el real (producción / preproducción)

```env
# [CAMBIAR] Issuer oficial — obtenido del Portal Developer
OIDC_ISSUER=https://account.ciudadaniadigital.gob.bo

# [CAMBIAR] Client ID registrado en el Portal Developer
OIDC_CLIENT_ID=<client-id-del-portal>

# [CAMBIAR] Client Secret registrado en el Portal Developer
OIDC_CLIENT_SECRET=<client-secret-del-portal>

# Scopes — verificar con el portal cuáles fueron aprobados
OIDC_SCOPE=openid profile email fecha_nacimiento celular

# [CAMBIAR] URL pública del auth-backend (HTTPS obligatorio en producción)
OIDC_REDIRECT_URI=https://<dominio>/api/ciudadania-autorizar

# [CAMBIAR] URL del frontend tras logout
OIDC_POST_LOGOUT_REDIRECT_URI=https://<dominio-frontend>/

# [CAMBIAR] Secreto fuerte para sesiones (mínimo 32 caracteres aleatorios)
SESSION_SECRET=<secreto-aleatorio-seguro>

# ELIMINAR esta línea — solo era para el fake
# FAKE_CIUDADANIA_INTERNAL_URL=...
```

---

## 3. Checklist de migración

### Pre-migración

- [ ] Aplicación registrada y aprobada en https://developer.ciudadaniadigital.bo
- [ ] `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET` obtenidos del portal
- [ ] La `redirect_uri` registrada en el portal coincide **exactamente** con `OIDC_REDIRECT_URI` del `.env`
- [ ] El dominio del auth-backend tiene HTTPS válido (requerido por el proveedor real)
- [ ] `SESSION_SECRET` generado con entropía suficiente: `openssl rand -hex 32`

### Cambios en `.env`

- [ ] `OIDC_ISSUER` apunta al issuer oficial (no al fake)
- [ ] `OIDC_CLIENT_ID` y `OIDC_CLIENT_SECRET` del portal (no los del fake)
- [ ] `OIDC_REDIRECT_URI` usa HTTPS y dominio de producción
- [ ] `OIDC_POST_LOGOUT_REDIRECT_URI` usa HTTPS y dominio de producción
- [ ] `SESSION_SECRET` es un valor seguro (no el placeholder ni el valor de desarrollo)
- [ ] `FAKE_CIUDADANIA_INTERNAL_URL` eliminado o comentado

### Post-migración

- [ ] Auth-backend reiniciado con las nuevas variables
- [ ] Discovery OIDC accesible: `GET <OIDC_ISSUER>/.well-known/openid-configuration`
- [ ] Flujo completo probado: login → redirect → callback → JWT emitido
- [ ] Logout probado: `POST /api/ciudadania-logout` → redirect al frontend
- [ ] El fake (`fake-ciudadania-api`) fue detenido/eliminado del servidor de desarrollo
- [ ] Schema `fake_ciudadania` eliminado de la BD si ya no se necesita:
  ```sql
  DROP SCHEMA fake_ciudadania CASCADE;
  ```

---

## 4. Diferencias entre el fake y el real

| Aspecto | Fake (desarrollo) | Real (AGETIC) |
|---|---|---|
| Protocolo | HTTP | HTTPS (obligatorio) |
| Usuarios | Seed en BD local | Ciudadanos bolivianos reales |
| OTP | Impreso en logs | Enviado por SMS/email al ciudadano |
| Registro | No requerido | Aplicación aprobada en portal developer |
| JWKS | Generado localmente | JWKS del proveedor oficial |
| `sub` | UUID generado por el fake | UUID del ciudadano en AGETIC |
| Disponibilidad | Controlada (propio servidor) | Depende del uptime de AGETIC |

---

## 5. Campos que devuelve `/me` (userinfo)

El `oidc.strategy.ts` espera exactamente esta estructura. El proveedor real de AGETIC
debe devolver los mismos campos para que la integración funcione sin cambios de código:

```json
{
  "sub": "<uuid-ciudadano>",
  "profile": {
    "documento_identidad": {
      "tipo_documento": "CI",
      "numero_documento": "1234567",
      "complemento": ""
    },
    "nombre": {
      "nombres": "Juan Carlos",
      "primer_apellido": "Pérez",
      "segundo_apellido": "Mamani"
    }
  },
  "fecha_nacimiento": "15/06/1985",
  "email": "juan.perez@email.com",
  "celular": "72345678"
}
```

> Si el proveedor real devuelve una estructura diferente, el archivo a modificar es:
> `src/core/authentication/strategies/oidc.strategy.ts` → método `validate()`.

---

## 6. Scopes aprobados por AGETIC

Confirmar con el Portal Developer que los siguientes scopes estén aprobados para la aplicación:

| Scope | Datos que entrega |
|---|---|
| `openid` | `sub` (obligatorio) |
| `profile` | `profile.documento_identidad`, `profile.nombre` |
| `email` | `email` |
| `fecha_nacimiento` | `fecha_nacimiento` (formato `DD/MM/YYYY`) |
| `celular` | `celular` |

Si algún scope no está disponible, el sistema lanzará un error en `validate()` indicando
el campo faltante.

---

## 7. Entornos de AGETIC

| Entorno | OIDC_ISSUER |
|---|---|
| Pruebas (idep) | `https://account-idetest.agcs.agetic.gob.bo` |
| Producción | `https://account.ciudadaniadigital.gob.bo` *(confirmar con AGETIC)* |

> Verificar siempre la URL exacta en el correo/portal de AGETIC al registrar la aplicación,
> ya que puede cambiar con nuevas versiones del proveedor.

---

## 8. Referencia de archivos clave

| Archivo | Propósito |
|---|---|
| `src/core/authentication/strategies/oidc.strategy.ts` | Mapeo userinfo → usuario interno |
| `src/core/authentication/guards/oidc-auth.guard.ts` | Guard OIDC + auditoría |
| `src/core/authentication/oidc.client.ts` | Inicialización del cliente openid-client |
| `src/core/usuario/service/usuario.service.ts` | `crearConCiudadaniaV2()` — alta de usuario vía OIDC |
| `.env` | Variables de entorno (nunca commitear con valores reales) |

---

*Ver también:*
- `docs/autenticacion/apis-ciudadania-digital.md` — descripción de los endpoints OIDC
- `docs/autenticacion/flujo-oidc-autenticacion-ciudadania-digital.mmd` — diagrama de secuencia
- `backend/fake-ciudadania-api/README.md` — despliegue del fake en servidor separado
