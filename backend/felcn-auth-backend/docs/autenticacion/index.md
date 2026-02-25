# Proyecto Backend Base

## Login con el Proveedor de Ciudadanía

Para la autenticación mediante el Proveedor de Ciudadanía Digital, es requisito indispensable que el cliente, en este caso el Backend Base, tenga configurado el Mecanismo de autenticación en el Módulo de Developer.
Los valores generados y configurados en el Módulo de Developer deberán utilizarse para sustituir los valores por defecto de la _configuración de integración con Ciudadanía Digital_, ubicados en el archivo `.env`, tal como se detalla a continuación.

- `OIDC_ISSUER`=<ISSUES_DEVELOPER>
- `OIDC_CLIENT_ID`=<OIDC_CLIENT_ID>
- `OIDC_CLIENT_SECRET`=<OIDC_CLIENT_SECRET>
- `OIDC_SCOPE`=<OIDC_SCOPE>
- `OIDC_REDIRECT_URI`=<OIDC_REDIRECT_URI>
- `OIDC_POST_LOGOUT_REDIRECT_URI`=<OIDC_POST_LOGOUT_REDIRECT_URI>
- `SESSION_SECRET`=<SESSION_SECRET>

Mas info: https://developer.ciudadaniadigital.bo/docs/empezar/registrar-mecanismo/autenticacion

### Flujo de autenticación OIDC con el Proveedor de Ciudadanía Digital

```mermaid
sequenceDiagram
participant U as Usuario
participant N as Frontend Base
participant SC as Proveedor Ciudadanía(idP)
participant B as Backend Base

    title Flujo OIDC de Autenticación de Ciudadanía Dígital

    U->>N: Inicio de Sesión con Ciudadanía(LoginPage)
    N->>B: Solicitud síncrona (GET /ciudadania-auth)
    B->>B: OidcAuthGuard
    B-->>SC: Redirección al proveedor de identidad
    SC->>U: Redirección al Login del Provedor de identidad
    U-->>SC: (Ya se autenticó/aceptó permisos)
    SC-->>N: Redirección con Parámetros (e.g., ?code=...) a CiudadaníaPage

    activate N
    N->N: mostrarFullScreen()
    N->>N: Obtiene Parámetros (parametros)

    N->>B: Petición a 'autorizarCiudadania' (GET /ciudadania-autorizar?code=...)
    activate B
    B->>B: OidcAuthGuard
    B->>SC: Intercambio OAuth(code=...,client_id, secret_client )
    SC->>B: Retorna un accessToken
    B->>B: Valida el '@Req.user'
    activate B
    B->>B: validarOCrearUsuarioOidc
    alt Existe el usuario en la BD
    B->>B: buscarUsuarioPorCI
    else No existe en la BD
    B->>B: crearConCiudadaniaV2
    end
    deactivate B
    B->>B: generación de accessToken, y refreshToken
    B-->>N: Respuesta: {access_token: '...', Cookie(refresh_token_id)}
    deactivate B

    alt Éxito en la Autorización (data)
        N->>N: ocultarFullScreen()
        N->>N: guardarCookie('token', data.access_token)
        activate N
        N->>B: Carga de Perfil de Usuario (GET /usuario/perfil)
        activate B
        B-->>N: Datos del Usuario
        deactivate B
        N-->>N: Usuario cargado, Contexto actualizado
        deactivate N
        N-->>U: La aplicación se renderiza con el usuario autenticado (Navegación a /)
    else Error en la Autorización (error)
        N->>N: manejarError(mensaje)
        activate N
        N->>N: mostrarFullScreen()
        N-->>U: Alerta({variant: 'error'})
        N->>N: delay(1000)
        N-->>U: La aplicación se redirecciona a(/login)
        N->>N: ocultarFullScreen()
        deactivate N
    end

    deactivate N

```
