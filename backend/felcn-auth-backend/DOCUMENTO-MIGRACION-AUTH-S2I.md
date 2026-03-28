# Documento de Migracion: Sistema de Autenticacion y Autorizacion SUNESIS

## Modulo S2i - Base de Datos felcn_s2i

**Version:** 1.0
**Fecha:** 2026-02-28
**Sistema Original:** ASP.NET WebForms
**Sistema Destino:** NestJS + PostgreSQL

---

## INDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura del Sistema Original](#2-arquitectura-del-sistema-original)
3. [Modelo de Datos](#3-modelo-de-datos)
4. [Sistema de Autenticacion](#4-sistema-de-autenticacion)
5. [Sistema de Autorizacion](#5-sistema-de-autorizacion)
6. [Logica de Negocio por Formulario](#6-logica-de-negocio-por-formulario)
7. [Mapeo a APIs NestJS](#7-mapeo-a-apis-nestjs)
8. [Guia de Implementacion](#8-guia-de-implementacion)
9. [Vulnerabilidades a Corregir](#9-vulnerabilidades-a-corregir)

---

## 1. RESUMEN EJECUTIVO

### 1.1 Alcance de la Migracion

Este documento cubre la migracion del sistema de autenticacion y autorizacion del modulo S2i, que incluye:

| Componente | Descripcion | Prioridad |
|------------|-------------|-----------|
| **Autenticacion** | Login, sesiones, encriptacion de passwords | CRITICA |
| **Usuarios** | CRUD de usuarios, activacion, habilitacion | CRITICA |
| **Roles** | Definicion de roles y sus formularios | ALTA |
| **Menus** | Estructura de navegacion por usuario | ALTA |
| **Formularios/Permisos** | Control de acceso granular a paginas | CRITICA |
| **Auditoria** | Registro de cambios en el sistema | MEDIA |
| **Estructura Organizacional** | Grados, Unidades, Distritales, Grupos | ALTA |

### 1.2 Estadisticas del Sistema Actual

| Metrica | Cantidad |
|---------|----------|
| Tablas en BD | 10 |
| Archivos C# (App_Code) | 7 |
| Formularios ASPX | 5+ |
| Stored Procedures | 1 (Validate_User) |

---

## 2. ARQUITECTURA DEL SISTEMA ORIGINAL

### 2.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ASP.NET WebForms                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   Login.aspx    │    │ PaginaPrin.master│   │   Forms/*.aspx          │  │
│  │   Login.aspx.cs │    │ (Menu dinamico)  │   │   (Formularios)         │  │
│  └────────┬────────┘    └────────┬─────────┘   └───────────┬─────────────┘  │
│           │                      │                         │                 │
│           ▼                      ▼                         ▼                 │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         App_Code/                                       │ │
│  │  ┌──────────────────┐  ┌───────────────────┐  ┌─────────────────────┐  │ │
│  │  │ SistemaUsuarios.cs│  │RegistroUsuarios.cs│  │  Formularios.cs    │  │ │
│  │  │ - Verificar()    │  │ - InsertRegistro() │  │  - Verificar()     │  │ │
│  │  │ - InsertUsuario()│  │ - InsertFormularios│  │    (autorizacion)  │  │ │
│  │  │ - delete*()      │  │ - InsertUsuario    │  │                    │  │ │
│  │  │                  │  │   Formularios()   │  │                    │  │ │
│  │  └──────────────────┘  └───────────────────┘  └─────────────────────┘  │ │
│  │                                                                         │ │
│  │  ┌──────────────────┐  ┌───────────────────┐  ┌─────────────────────┐  │ │
│  │  │  Servicio.cs     │  │ValoresGlobales.cs │  │   Seguridad.cs     │  │ │
│  │  │ - grado()        │  │ - connectionstring │  │   - Encriptar()   │  │ │
│  │  │ - CodigoUnidad() │  │ - connectionstring2│  │   - DesEncriptar()│  │ │
│  │  │ - NombreUsuario()│  │ - connectionstring3│  │                    │  │ │
│  │  └──────────────────┘  └───────────────────┘  └─────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │     SQL Server (FELCN-S2I)     │
                    │  Host: 72.60.156.246:1433      │
                    │                                │
                    │  Tablas:                       │
                    │  - Users                       │
                    │  - Grados                      │
                    │  - Menu                        │
                    │  - ChildMenu                   │
                    │  - Roles                       │
                    │  - Formularios                 │
                    │  - Unidades                    │
                    │  - Distritales                 │
                    │  - Grupos                      │
                    │  - GuardarProce (Auditoria)    │
                    │  - Equipo                      │
                    └────────────────────────────────┘
```

### 2.2 Flujo de Autenticacion

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Usuario │────▶│  Login.aspx  │────▶│ ValidateUser()  │────▶│  SP:         │
│          │     │              │     │                 │     │Validate_User │
└──────────┘     └──────────────┘     └─────────────────┘     └──────┬───────┘
                                                                      │
                 ┌──────────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │   Resultado:   │
        │  -1: Error pwd │──────▶ Mostrar error
        │  -2: No activo │
        │  Nombre: OK    │──────▶ FormsAuthentication.RedirectFromLoginPage()
        └────────────────┘               │
                                         ▼
                                ┌──────────────────┐
                                │ Session["userName"]│
                                │ Cookie Auth      │
                                └────────┬─────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │  Default.aspx    │
                                │ (Pagina principal)│
                                └──────────────────┘
```

### 2.3 Flujo de Autorizacion (Verificacion de Permisos)

```
┌──────────────────┐     ┌─────────────────────────────┐
│ Page_Load() en   │     │                             │
│ cualquier .aspx  │────▶│ Formularios.Verificar(      │
│                  │     │   usuario,                  │
│                  │     │   "nombre-formulario.aspx"  │
│                  │     │ )                           │
└──────────────────┘     └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │  SELECT COUNT(Id)            │
                         │  FROM ChildMenu              │
                         │  WHERE ChildUrl = @form      │
                         │  AND usuario = @user         │
                         └──────────────┬───────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
           ┌────────────────┐                     ┌────────────────┐
           │  COUNT > 0     │                     │  COUNT = 0     │
           │  Return "SI"   │                     │  Return "NO"   │
           └───────┬────────┘                     └───────┬────────┘
                   │                                       │
                   ▼                                       ▼
           ┌────────────────┐                     ┌────────────────┐
           │ Cargar pagina  │                     │ Redirect a     │
           │ inicia()       │                     │ Default3.aspx  │
           │                │                     │ (Sin permisos) │
           └────────────────┘                     └────────────────┘
```

---

## 3. MODELO DE DATOS

### 3.1 Diagrama Entidad-Relacion

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MODELO DE DATOS S2I                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐                │
│  │   Grados    │         │   Unidades  │         │   Roles     │                │
│  ├─────────────┤         ├─────────────┤         ├─────────────┤                │
│  │ Gr_Id (PK)  │         │ Uni_Id (PK) │         │Roles_Id(PK) │                │
│  │ Descripcion │         │Uni_Descripcion        │ Descripcion │                │
│  └──────┬──────┘         │ Uni_Abrev   │         │ Icono       │                │
│         │                └──────┬──────┘         └──────┬──────┘                │
│         │                       │                       │                       │
│         │                       │                       │                       │
│         │                ┌──────▼──────┐                │                       │
│         │                │ Distritales │         ┌──────▼──────┐                │
│         │                ├─────────────┤         │ Formularios │                │
│         │                │ Dis_Id (PK) │         ├─────────────┤                │
│         │                │Dis_Descripcion        │Forms_Id(PK) │                │
│         │                │ Uni_Id (FK) │         │Roles_Id(FK) │                │
│         │                └──────┬──────┘         │ Descripcion │                │
│         │                       │                │ Url         │                │
│         │                       │                └─────────────┘                │
│         │                ┌──────▼──────┐                                        │
│         │                │   Grupos    │                                        │
│         │                ├─────────────┤                                        │
│         │                │ Grp_Id (PK) │                                        │
│         │                │ Descripcion │                                        │
│         │                │ Dis_Id (FK) │                                        │
│         │                └──────┬──────┘                                        │
│         │                       │                                               │
│         │         ┌─────────────┘                                               │
│         │         │                                                             │
│         ▼         ▼                                                             │
│  ┌─────────────────────┐                                                        │
│  │       Users         │                                                        │
│  ├─────────────────────┤         ┌─────────────┐                               │
│  │ UserId (PK)         │         │    Menu     │                               │
│  │ Username (email)    │◄────────┤─────────────┤                               │
│  │ Usuario (pase)      │    FK   │ Id (PK)     │                               │
│  │ Password (AES)      │         │ ParentMenu  │                               │
│  │ NombreApp           │         │ ParentUrl   │                               │
│  │ Email               │         │ Icono       │                               │
│  │ TelefonoCel         │         │ Usuario (FK)│──────┐                        │
│  │ TelefonoCorp        │         │ CreatedDate │      │                        │
│  │ Gr_Id (FK)──────────┼────┐    │ UserCreate  │      │                        │
│  │ Grp_Id (FK)─────────┼──┐ │    └──────┬──────┘      │                        │
│  │ Habilitado          │  │ │           │             │                        │
│  │ CreatedDate         │  │ │           │             │                        │
│  │ UserCreate          │  │ │    ┌──────▼──────┐      │                        │
│  │ LastLoginDate       │  │ │    │  ChildMenu  │      │                        │
│  └─────────────────────┘  │ │    ├─────────────┤      │                        │
│                           │ │    │ Id (PK)     │      │                        │
│                           │ │    │ParentId(FK) │◄─────┘                        │
│                           │ │    │ ChildMenu   │                               │
│                           │ │    │ ChildUrl    │                               │
│                           │ │    │ usuario(FK) │───────────────────────────────┼─┐
│                           │ │    │ CreatedDate │                               │ │
│                           │ │    │ UserCreate  │                               │ │
│                           │ │    └─────────────┘                               │ │
│                           │ │                                                   │ │
│                           │ └────────────────────────────────────────────────┐ │ │
│                           │                                                  │ │ │
│                           └───────────────────────────────────────────────┐  │ │ │
│                                                                           │  │ │ │
│  ┌─────────────────────┐                                                  │  │ │ │
│  │    GuardarProce     │         ┌─────────────┐                          │  │ │ │
│  │    (Auditoria)      │         │   Equipo    │                          │  │ │ │
│  ├─────────────────────┤         ├─────────────┤                          │  │ │ │
│  │ Id (PK)             │         │ Id (PK)     │                          │  │ │ │
│  │ BasedeDatos         │         │ Username(FK)│◄─────────────────────────┼──┼─┘ │
│  │ Tabla               │         │ TipoU_Id    │ (1=PC, 2=Celular)        │  │   │
│  │ Accion              │         │ Macaddress  │                          │  │   │
│  │ ContenidoAnt        │         │ Nombreequipo│                          │  │   │
│  │ ContenidoAct        │         │ IpProveedor │                          │  │   │
│  │ ContenidoEnc        │         │ IpCliente   │                          │  │   │
│  │ fechahoraing        │         └─────────────┘                          │  │   │
│  │ Usuario             │◄─────────────────────────────────────────────────┼──┘   │
│  └─────────────────────┘                                                  │      │
│                                                                           │      │
│  NOTA: Las relaciones Usuario en Menu/ChildMenu/Equipo son por Username,  │      │
│        no por UserId (desnormalizacion del sistema original)              │      │
│                                                                           │      │
└───────────────────────────────────────────────────────────────────────────┴──────┘
```

### 3.2 Definicion de Tablas

#### 3.2.1 Tabla: Users

```sql
CREATE TABLE Users (
    UserId          INT PRIMARY KEY IDENTITY(1,1),
    Username        NVARCHAR(50) NOT NULL UNIQUE,  -- Email del usuario
    Usuario         NCHAR(15) NOT NULL,            -- Numero de pase
    Password        NVARCHAR(50) NOT NULL,         -- Encriptado AES
    NombreApp       NVARCHAR(200),                 -- Nombre completo con grado
    Email           NVARCHAR(50),                  -- Correo electronico
    TelefonoCel     NVARCHAR(20),                  -- Telefono celular
    TelefonoCorp    NVARCHAR(20),                  -- Telefono corporativo
    Gr_Id           INT FOREIGN KEY REFERENCES Grados(Gr_Id),
    Grp_Id          INT FOREIGN KEY REFERENCES Grupos(Grp_Id),
    Habilitado      INT DEFAULT 1,                 -- 1=Activo, 0=Inactivo
    CreatedDate     DATETIME,
    UserCreate      NVARCHAR(50),                  -- Usuario que creo
    LastLoginDate   DATETIME
);
```

**Referencia ASP.NET:** `App_Code/SistemaUsuarios.cs:37-87`

#### 3.2.2 Tabla: Grados

```sql
CREATE TABLE Grados (
    Gr_Id           INT PRIMARY KEY,
    Descripcion     VARCHAR(50) NOT NULL
);

-- Datos ejemplo:
-- 1: "Gral."
-- 2: "Cnl."
-- 3: "Tcnl."
-- 4: "My."
-- 5: "Cap."
-- 6: "Tte."
-- 7: "Sbtte."
-- 8: "Sgto."
-- 9: "Cabo"
-- 10: "Pol."
```

**Referencia ASP.NET:** `Forms/FRM-AD-02.aspx.cs:34-53`

#### 3.2.3 Tabla: Unidades

```sql
CREATE TABLE Unidades (
    Uni_Id          INT PRIMARY KEY,
    Uni_Descripcion VARCHAR(100) NOT NULL,
    Uni_Abrev       VARCHAR(20)
);
```

**Referencia ASP.NET:** `Forms/FRM-AD-02.aspx.cs:54-73`

#### 3.2.4 Tabla: Distritales

```sql
CREATE TABLE Distritales (
    Dis_Id          INT PRIMARY KEY,
    Dis_Descripcion VARCHAR(100) NOT NULL,
    Uni_Id          INT FOREIGN KEY REFERENCES Unidades(Uni_Id)
);
```

**Referencia ASP.NET:** `Forms/FRM-AD-02.aspx.cs:74-95`

#### 3.2.5 Tabla: Grupos

```sql
CREATE TABLE Grupos (
    Grp_Id          INT PRIMARY KEY,
    Descripcion     VARCHAR(100) NOT NULL,
    Dis_Id          INT FOREIGN KEY REFERENCES Distritales(Dis_Id)
);
```

**Referencia ASP.NET:** `Forms/FRM-AD-02.aspx.cs:96-115`

#### 3.2.6 Tabla: Roles

```sql
CREATE TABLE Roles (
    Roles_Id        INT PRIMARY KEY IDENTITY(1,1),
    Descripcion     VARCHAR(100) NOT NULL,
    Icono           VARCHAR(35)
);
```

**Referencia ASP.NET:** `Forms/FRM-AD-02.aspx.cs:116-135`

#### 3.2.7 Tabla: Formularios (Definicion de Forms por Rol)

```sql
CREATE TABLE Formularios (
    Forms_Id        INT PRIMARY KEY IDENTITY(1,1),
    Roles_Id        INT FOREIGN KEY REFERENCES Roles(Roles_Id),
    Descripcion     VARCHAR(100) NOT NULL,
    Url             VARCHAR(50) NOT NULL  -- Ej: "FRM-AD-01.aspx"
);
```

**Referencia ASP.NET:** `Forms/FRM-AD-02.aspx.cs:173-183`

#### 3.2.8 Tabla: Menu (Menus Padre por Usuario)

```sql
CREATE TABLE Menu (
    Id              INT PRIMARY KEY IDENTITY(1,1),
    ParentMenu      NCHAR(50) NOT NULL,    -- Nombre del menu
    ParentUrl       NCHAR(10) DEFAULT '#', -- URL (siempre #)
    Icono           NCHAR(35),             -- Nombre archivo icono
    Usuario         NVARCHAR(50) NOT NULL, -- Username del usuario
    CreatedDate     DATETIME,
    UserCreate      NVARCHAR(50)
);
```

**Referencia ASP.NET:** `App_Code/RegistroUsuarios.cs:45-78`

#### 3.2.9 Tabla: ChildMenu (Submenus/Permisos por Usuario)

```sql
CREATE TABLE ChildMenu (
    Id              INT PRIMARY KEY IDENTITY(1,1),
    ParentId        INT FOREIGN KEY REFERENCES Menu(Id),
    ChildMenu       NCHAR(50) NOT NULL,    -- Nombre del formulario
    ChildUrl        NCHAR(20) NOT NULL,    -- URL del formulario
    usuario         NVARCHAR(50) NOT NULL, -- Username del usuario
    CreatedDate     DATETIME,
    UserCreate      NVARCHAR(50)
);
```

**Referencia ASP.NET:** `App_Code/RegistroUsuarios.cs:80-109`

#### 3.2.10 Tabla: GuardarProce (Auditoria)

```sql
CREATE TABLE GuardarProce (
    Id              INT PRIMARY KEY IDENTITY(1,1),
    BasedeDatos     NCHAR(25),      -- Base de datos afectada
    Tabla           NCHAR(25),      -- Tabla afectada
    Accion          NCHAR(25),      -- INSERT, UPDATE, DELETE
    ContenidoAnt    NTEXT,          -- Valor anterior
    ContenidoAct    NTEXT,          -- Valor nuevo
    ContenidoEnc    NTEXT,          -- Valor encriptado
    fechahoraing    DATETIME,
    Usuario         NCHAR(15)       -- Usuario que hizo el cambio
);
```

**Referencia ASP.NET:** `App_Code/RegistroUsuarios.cs:8-43`

#### 3.2.11 Tabla: Equipo (Dispositivos del Usuario)

```sql
CREATE TABLE Equipo (
    Id              INT PRIMARY KEY IDENTITY(1,1),
    Username        NVARCHAR(50) NOT NULL,  -- FK a Users.Username
    TipoU_Id        INT NOT NULL,           -- 1=Equipo, 2=Celular
    Macaddress      NVARCHAR(50),
    Nombreequipo    NVARCHAR(50),
    IpProveedor     NVARCHAR(15),
    IpCliente       NVARCHAR(15)
);
```

**Referencia ASP.NET:** `App_Code/RegistroUsuarios.cs:110-138`

---

## 4. SISTEMA DE AUTENTICACION

### 4.1 Archivo: Login.aspx.cs

**Ubicacion:** `SUNESIS/Login.aspx.cs`

#### 4.1.1 Metodo: ValidateUser()

```csharp
// Lineas 11-48 de Login.aspx.cs

protected void ValidateUser(object sender, EventArgs e)
{
    string userName;
    string constr = ValoresGlobales.connectionstring;

    using (SqlConnection con = new SqlConnection(constr))
    {
        using (SqlCommand cmd = new SqlCommand("Validate_User"))
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserName", LoginUsergnosys.UserName);
            cmd.Parameters.AddWithValue("@Password", Encrypt(LoginUsergnosys.Password));
            cmd.Connection = con;
            con.Open();
            userName = Convert.ToString(cmd.ExecuteScalar());
            con.Close();
        }

        if (!string.IsNullOrEmpty(userName) && userName != "-1" && userName != "-2")
        {
            // Login exitoso
            FormsAuthentication.RedirectFromLoginPage(
                LoginUsergnosys.UserName,
                LoginUsergnosys.RememberMeSet
            );
            Session["userName"] = userName;
        }
        else
        {
            switch (Convert.ToInt32(userName))
            {
                case -1:
                    LoginUsergnosys.FailureText = "El pase o contrasena son Incorrectos";
                    break;
                case -2:
                    LoginUsergnosys.FailureText = "La cuenta no ha sido activada";
                    break;
            }
        }
    }
}
```

**Logica de Negocio:**
1. Recibe username (numero de pase) y password del formulario
2. Encripta la contrasena con AES antes de enviar a la BD
3. Llama al Stored Procedure `Validate_User`
4. El SP retorna:
   - **Nombre del usuario**: Login exitoso
   - **-1**: Usuario o contrasena incorrectos
   - **-2**: Cuenta no activada
5. Si es exitoso, crea cookie de autenticacion y redirige

#### 4.1.2 Metodo: Encrypt()

```csharp
// Lineas 50-72 de Login.aspx.cs

private string Encrypt(string clearText)
{
    string EncryptionKey = "#F3LW38ic1a$";  // CLAVE HARDCODEADA
    byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);

    using (Aes encryptor = Aes.Create())
    {
        // Salt fijo
        byte[] salt = new byte[] {
            0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d,
            0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
        };

        Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, salt);
        encryptor.Key = pdb.GetBytes(32);  // AES-256
        encryptor.IV = pdb.GetBytes(16);

        using (MemoryStream ms = new MemoryStream())
        {
            using (CryptoStream cs = new CryptoStream(
                ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
            {
                cs.Write(clearBytes, 0, clearBytes.Length);
                cs.Close();
            }
            clearText = Convert.ToBase64String(ms.ToArray());
        }
    }
    return clearText;
}
```

**Especificacion de Encriptacion:**
- **Algoritmo:** AES-256
- **Key Derivation:** PBKDF2 (Rfc2898DeriveBytes)
- **Salt:** Fijo (0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76)
- **Clave:** `#F3LW38ic1a$` (DEBE MIGRARSE A VARIABLE DE ENTORNO)
- **Output:** Base64

### 4.2 Stored Procedure: Validate_User

```sql
-- Stored Procedure estimado (no se encontro el codigo fuente)
-- Reconstruido segun el comportamiento del codigo C#

CREATE PROCEDURE Validate_User
    @UserName NVARCHAR(50),
    @Password NVARCHAR(50)
AS
BEGIN
    DECLARE @Result NVARCHAR(200)
    DECLARE @Habilitado INT

    -- Verificar credenciales
    SELECT @Result = NombreApp, @Habilitado = Habilitado
    FROM Users
    WHERE Username = @UserName AND Password = @Password

    IF @Result IS NULL
    BEGIN
        -- Usuario o contrasena incorrectos
        SET @Result = '-1'
    END
    ELSE IF @Habilitado = 0
    BEGIN
        -- Cuenta no activada/habilitada
        SET @Result = '-2'
    END

    SELECT @Result
END
```

### 4.3 Configuracion de Autenticacion (web.config)

```xml
<authentication mode="Forms">
    <forms
        defaultUrl="~/Forms/Default.aspx"
        loginUrl="~/Login.aspx"
        slidingExpiration="true"
        timeout="2880"/>  <!-- 48 horas -->
</authentication>
```

---

## 5. SISTEMA DE AUTORIZACION

### 5.1 Archivo: Formularios.cs

**Ubicacion:** `App_Code/Formularios.cs`

#### 5.1.1 Metodo: Verificar()

```csharp
// Archivo completo: App_Code/Formularios.cs

public static class Formularios
{
    public static string Verificar(string _cadenaUsuario, string _cadenaCodForm)
    {
        string result = string.Empty;
        string retorna = string.Empty;

        // VULNERABILIDAD: SQL Injection
        string SQL2 = "SELECT COUNT(Id) AS NReg FROM ChildMenu " +
                      "WHERE (RTRIM(ChildUrl) = N'" + _cadenaCodForm.Trim() + "') " +
                      "AND (RTRIM(usuario) = N'" + _cadenaUsuario.Trim() + "')";

        SqlConnection SqlConnrev = new SqlConnection(ValoresGlobales.connectionstring);
        DataTable dt2 = new DataTable();
        SqlConnrev.Open();
        SqlCommand cmdrev2 = new SqlCommand(SQL2);
        cmdrev2.CommandType = CommandType.Text;
        cmdrev2.Connection = SqlConnrev;
        SqlDataAdapter sdrev2 = new SqlDataAdapter(cmdrev2);
        sdrev2.Fill(dt2);

        for (int i = 0; i < dt2.Rows.Count; i++)
        {
            retorna = dt2.Rows[i][0].ToString();
        }
        SqlConnrev.Close();

        if (Convert.ToInt32(retorna.Trim()) > 0)
        {
            result = "SI";  // Tiene permiso
        }
        else
        {
            result = "NO";  // No tiene permiso
        }
        return result;
    }
}
```

**Logica de Negocio:**
1. Recibe el username y el codigo del formulario
2. Busca en la tabla `ChildMenu` si existe una fila con ese usuario y formulario
3. Si COUNT > 0, retorna "SI" (tiene acceso)
4. Si COUNT = 0, retorna "NO" (sin acceso)

#### 5.1.2 Uso en Formularios ASPX

```csharp
// Ejemplo en Forms/FRM-AD-02.aspx.cs:14-27

public partial class Forms_FRM_AD_02 : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            // Verificar si el usuario tiene acceso a este formulario
            if (Formularios.Verificar(usuariolog.Trim(), "FRM-AD-02.aspx") == "SI")
            {
                inicia();  // Cargar el formulario
            }
            else
            {
                Response.Redirect("~/Default3.aspx");  // Sin permisos
            }
        }
    }
}
```

### 5.2 Archivo: PaginaPrin.master.cs (Menu Dinamico)

**Ubicacion:** `PaginaPrin.master.cs`

#### 5.2.1 Metodo: GetParantMenu()

```csharp
// Lineas 104-121 de PaginaPrin.master.cs

public List<MenuParant> GetParantMenu()
{
    List<MenuParant> objmenu = new List<MenuParant>();
    DataTable _objdt = new DataTable();

    // VULNERABILIDAD: SQL Injection
    string querystring = "select * from Menu WHERE (usuario = N'" +
                         u.ToString().Trim() + "');";

    SqlConnection _objcon = new SqlConnection(ValoresGlobales.connectionstring);
    SqlDataAdapter _objda = new SqlDataAdapter(querystring, _objcon);
    _objcon.Open();
    _objda.Fill(_objdt);

    if (_objdt.Rows.Count > 0)
    {
        for (int i = 0; i < _objdt.Rows.Count; i++)
        {
            objmenu.Add(new MenuParant {
                Id = (int)_objdt.Rows[i]["Id"],
                MenuName = _objdt.Rows[i]["ParentMenu"].ToString(),
                Url = _objdt.Rows[i]["ParentUrl"].ToString(),
                Icono = _objdt.Rows[i]["Icono"].ToString().Trim()
            });
        }
    }
    return objmenu;
}
```

**Logica de Negocio:**
1. Obtiene el username del contexto HTTP
2. Busca todos los menus padre asignados a ese usuario
3. Retorna lista de menus con Id, Nombre, URL e Icono

#### 5.2.2 Metodo: GetChildMenu()

```csharp
// Lineas 122-139 de PaginaPrin.master.cs

public List<MenuChild> GetChildMenu()
{
    List<MenuChild> objmenu = new List<MenuChild>();
    DataTable _objdt = new DataTable();

    // VULNERABILIDAD: SQL Injection
    string querystring = "select * from ChildMenu WHERE (usuario = N'" +
                         u.ToString().Trim() + "') ORDER BY ChildUrl;";

    SqlConnection _objcon = new SqlConnection(ValoresGlobales.connectionstring);
    SqlDataAdapter _objda = new SqlDataAdapter(querystring, _objcon);
    _objcon.Open();
    _objda.Fill(_objdt);

    if (_objdt.Rows.Count > 0)
    {
        for (int i = 0; i < _objdt.Rows.Count; i++)
        {
            objmenu.Add(new MenuChild {
                PairantId = (int)_objdt.Rows[i]["ParentId"],
                ChildName = _objdt.Rows[i]["ChildMenu"].ToString(),
                ChildUrl = _objdt.Rows[i]["ChildUrl"].ToString()
            });
        }
    }
    return objmenu;
}
```

**Logica de Negocio:**
1. Obtiene todos los submenus (formularios) asignados al usuario
2. Los ordena por ChildUrl (codigo del formulario)
3. Cada submenu tiene el ParentId para vincularlo al menu padre

### 5.3 Clases de Modelo para Menus

```csharp
// Lineas 141-153 de PaginaPrin.master.cs

public class MenuParant
{
    public int Id { get; set; }
    public string MenuName { get; set; }
    public string Icono { get; set; }
    public string Url { get; set; }
}

public class MenuChild
{
    public int PairantId { get; set; }
    public string ChildName { get; set; }
    public string ChildUrl { get; set; }
}
```

---

## 6. LOGICA DE NEGOCIO POR FORMULARIO

### 6.1 FRM-AD-02.aspx - Asignacion de Formularios a Usuarios

**Ubicacion:** `Forms/FRM-AD-02.aspx.cs`
**Proposito:** Asignar permisos (formularios) a usuarios

#### 6.1.1 Flujo de Asignacion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FRM-AD-02: Asignacion de Formularios                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. BUSQUEDA DE USUARIO                                                      │
│     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐           │
│     │  Por Grado    │     │  Por Unidad   │     │  Por Nombre   │           │
│     │  (ddlgrado)   │     │  (ddlgrupo)   │     │  (txtnombres) │           │
│     └───────┬───────┘     └───────┬───────┘     └───────┬───────┘           │
│             │                     │                     │                    │
│             └─────────────────────┼─────────────────────┘                    │
│                                   ▼                                          │
│                          ┌────────────────┐                                  │
│                          │ CuadroUsuarios │  (GridView con usuarios)        │
│                          │ SELECT Users   │                                  │
│                          │ JOIN Grados,   │                                  │
│                          │ Unidades, etc  │                                  │
│                          └───────┬────────┘                                  │
│                                  │                                           │
│                                  ▼                                           │
│  2. SELECCION DE USUARIO                                                     │
│     ┌────────────────────────────────────────────────────────────┐          │
│     │ Usuario seleccionado: lblusuario.Text = Username           │          │
│     └────────────────────────────────────┬───────────────────────┘          │
│                                          │                                   │
│                                          ▼                                   │
│  3. SELECCION DE ROL                                                         │
│     ┌────────────────┐                                                       │
│     │   ddlroles     │  SELECT Roles_Id, Descripcion FROM Roles             │
│     └───────┬────────┘                                                       │
│             │                                                                │
│             ▼                                                                │
│  4. CARGA DE FORMULARIOS DEL ROL                                             │
│     ┌─────────────────────────────────────────────────────────────┐         │
│     │ SELECT Forms_Id, Descripcion, Url                           │         │
│     │ FROM Formularios WHERE Roles_Id = @rol_seleccionado         │         │
│     └────────────────────────────────┬────────────────────────────┘         │
│                                      │                                       │
│                                      ▼                                       │
│  5. SELECCION DE FORMULARIOS (CheckBox en GridView)                          │
│     ┌─────────────────────────────────────────────────────────────┐         │
│     │ Gridforms: Lista de formularios con checkbox                │         │
│     │ [x] FRM-AD-01.aspx - Administracion de Usuarios             │         │
│     │ [ ] FRM-AD-02.aspx - Asignacion de Formularios              │         │
│     │ [x] FRM-AD-03.aspx - Gestion de Roles                       │         │
│     └────────────────────────────────┬────────────────────────────┘         │
│                                      │                                       │
│                                      ▼                                       │
│  6. GUARDAR ASIGNACION (btnguardaform_Click)                                 │
│     ┌─────────────────────────────────────────────────────────────┐         │
│     │ Para cada formulario seleccionado:                          │         │
│     │                                                             │         │
│     │ a) Verificar si ya existe Menu para este rol/usuario:       │         │
│     │    SELECT COUNT(Id) FROM Menu                               │         │
│     │    WHERE ParentMenu = @rol AND Usuario = @user              │         │
│     │                                                             │         │
│     │ b) Si NO existe Menu:                                       │         │
│     │    INSERT INTO Menu (ParentMenu, Icono, Usuario, ...)       │         │
│     │    -> Retorna Menu.Id                                       │         │
│     │                                                             │         │
│     │ c) Verificar si ya existe el formulario para el usuario:    │         │
│     │    SELECT COUNT(Id) FROM ChildMenu                          │         │
│     │    WHERE usuario = @user AND ChildUrl = @form               │         │
│     │                                                             │         │
│     │ d) Si NO existe ChildMenu:                                  │         │
│     │    INSERT INTO ChildMenu (ParentId, ChildMenu, ChildUrl,    │         │
│     │                           usuario, CreatedDate, UserCreate)  │         │
│     └─────────────────────────────────────────────────────────────┘         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 6.1.2 Metodos Principales

**Busqueda de Usuarios por Grado:**
```csharp
// Lineas 356-369

private void MuestraGrados(string valorid)
{
    string ConsulCasos = @"
        SELECT
            Users.Username AS U1,
            Grados.Descripcion AS U2,
            Users.NombreApp AS U3,
            Users.TelefonoCel AS U4,
            Users.TelefonoCorp AS U5,
            Unidades.Uni_Descripcion AS U6,
            Distritales.Dis_Descripcion AS U7,
            Grupos.Descripcion AS U8,
            (CASE WHEN (Users.Habilitado = 1) THEN 'SI' ELSE 'NO' END) AS U9
        FROM Distritales
        INNER JOIN Grupos ON Distritales.Dis_Id = Grupos.Dis_Id
        INNER JOIN Unidades ON Distritales.Uni_Id = Unidades.Uni_Id
        INNER JOIN Users ON Grupos.Grp_Id = Users.Grp_Id
        INNER JOIN Grados ON Users.Gr_Id = Grados.Gr_Id
        WHERE (Users.Gr_Id = @valorid)
        ORDER BY Users.Gr_Id";
    // ...
}
```

**Guardar Asignacion:**
```csharp
// Lineas 184-241

protected void btnguardaform_Click(object sender, EventArgs e)
{
    // Recorrer formularios seleccionados
    foreach (GridViewRow row in Gridforms.Rows)
    {
        CheckBox check = row.FindControl("chkSeleccion") as CheckBox;
        if (check.Checked)
        {
            // Verificar si ya existe el menu para el rol
            if (valorguardado(LblContForm.Text, lblusuario.Text) == "SI")
            {
                // Obtener ID del menu existente
                valoridformulario = valoridform(LblContForm.Text, usuariolog);
            }
            else
            {
                // Crear nuevo menu
                valoridmenu = RegistroUsuarios.InsertFormularios(
                    LblContForm.Text,    // Nombre del rol
                    LblIconoForm.Text,   // Icono
                    lblusuario.Text,     // Usuario
                    usuariolog           // Admin que asigna
                );
            }

            // Verificar si el formulario ya esta asignado
            if (existeform(lblusuario.Text, row.Cells[2].Text) == "NO")
            {
                // Insertar nuevo permiso
                RegistroUsuarios.InsertUsuarioFormularios(
                    valoridformulario,   // ID del menu padre
                    row.Cells[1].Text,   // Nombre del formulario
                    row.Cells[2].Text,   // URL del formulario
                    lblusuario.Text,     // Usuario
                    usuariolog           // Admin que asigna
                );
            }
        }
    }
}
```

### 6.2 Archivo: SistemaUsuarios.cs

**Ubicacion:** `App_Code/SistemaUsuarios.cs`

#### 6.2.1 Metodo: InsertUsuario()

```csharp
// Lineas 37-87

public static void InsertUsuario(
    string usuariosis,      // Email/Username
    string pase,            // Numero de pase
    string contrasena,      // Password (ya encriptado)
    int grado,              // FK a Grados
    string datosgral,       // Nombre completo
    string NroCel,          // Telefono celular
    string Nrocorp,         // Telefono corporativo
    int grupo,              // FK a Grupos
    string adminusuario     // Usuario admin que crea
)
{
    DateTime ahora = DateTime.Now;
    SqlConnection con = new SqlConnection(ValoresGlobales.connectionstring);
    SqlCommand cmd = new SqlCommand();

    cmd.CommandText = @"
        INSERT INTO users (
            Username, Usuario, Password, Gr_Id, NombreApp,
            Email, TelefonoCel, TelefonoCorp, Grp_Id,
            Habilitado, CreatedDate, UserCreate, LastLoginDate
        ) VALUES (
            @Username, @Usuario, @Password, @Gr_Id, @NombreApp,
            @Email, @TelefonoCel, @TelefonoCorp, @Grp_Id,
            @Habilitado, @CreatedDate, @UserCreate, @LastLoginDate
        )";

    // ... parametros ...

    // Habilitado = 1 por defecto (activo)
    cmd.Parameters.Add(new SqlParameter("@Habilitado", SqlDbType.Int) { Value = 1 });
}
```

#### 6.2.2 Metodos de Eliminacion

```csharp
// Eliminar usuario
public static void deleteusuario(string usuariosis)
{
    string sql = "Delete Users Where UserId = " + usuariosis;
    // NOTA: Elimina por UserId, no por Username
}

// Eliminar menus del usuario
public static void deletemenu(string usuariosis)
{
    string sql = "Delete Menu Where (Usuario = N'" + usuariosis + "')";
    // Elimina por Username
}

// Eliminar permisos (child menus) del usuario
public static void deleteChildM(string usuariosis)
{
    string sql = "Delete ChildMenu Where (usuario = N'" + usuariosis + "')";
    // Elimina por Username
}
```

### 6.3 Archivo: RegistroUsuarios.cs

**Ubicacion:** `App_Code/RegistroUsuarios.cs`

#### 6.3.1 Metodo: InsertRegistro() - Auditoria

```csharp
// Lineas 8-43

public static void InsertRegistro(
    string basedatos,       // Nombre de la BD
    string atabla,          // Nombre de la tabla
    string taccion,         // Tipo de accion (INSERT, UPDATE, DELETE)
    string conti,           // Contenido anterior
    string conta,           // Contenido actual
    string conten,          // Contenido encriptado
    string usuariosis       // Usuario que realizo la accion
)
{
    DateTime ahora = DateTime.Now;
    SqlCommand cmd = new SqlCommand();
    cmd.CommandText = @"
        INSERT INTO GuardarProce (
            BasedeDatos, Tabla, Accion,
            ContenidoAnt, ContenidoAct, ContenidoEnc,
            fechahoraing, Usuario
        ) VALUES (
            @BasedeDatos, @Tabla, @Accion,
            @ContenidoAnt, @ContenidoAct, @ContenidoEnc,
            @fechahoraing, @Usuario
        )";
    // ...
}
```

#### 6.3.2 Metodo: InsertFormularios() - Crear Menu Padre

```csharp
// Lineas 45-78

public static string InsertFormularios(
    string textodescrip,    // Nombre del menu (ej: "Administracion")
    string ingicono,        // Nombre del archivo de icono
    string ingusuario,      // Username del usuario
    string usuariosis       // Admin que crea
)
{
    // INSERT INTO Menu ... SELECT Scope_Identity();
    // Retorna el ID del nuevo menu creado
}
```

#### 6.3.3 Metodo: InsertUsuarioFormularios() - Crear Permiso

```csharp
// Lineas 80-109

public static void InsertUsuarioFormularios(
    string idformprin,      // ID del menu padre
    string textodescrip,    // Nombre del formulario
    string urlpagina,       // URL del formulario
    string ingusuario,      // Username del usuario
    string usuariosis       // Admin que crea
)
{
    // INSERT INTO ChildMenu (ParentId, ChildMenu, ChildUrl, usuario, ...)
}
```

---

## 7. MAPEO A APIs NestJS

### 7.1 Estructura de Modulos Propuesta

```
src/application/sunesis/s2i/
├── s2i.module.ts
├── auth/                           # AUTENTICACION
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── permissions.decorator.ts
│   └── dto/
│       ├── login.dto.ts
│       └── token-response.dto.ts
│
├── usuario/                        # USUARIOS
│   ├── usuario.module.ts
│   ├── usuario.controller.ts
│   ├── usuario.service.ts
│   ├── usuario.repository.ts
│   ├── entity/
│   │   └── usuario.entity.ts
│   └── dto/
│       ├── crear-usuario.dto.ts
│       ├── actualizar-usuario.dto.ts
│       └── usuario-response.dto.ts
│
├── rol/                            # ROLES
│   ├── rol.module.ts
│   ├── rol.controller.ts
│   ├── rol.service.ts
│   ├── entity/
│   │   ├── rol.entity.ts
│   │   └── formulario-rol.entity.ts
│   └── dto/
│       ├── crear-rol.dto.ts
│       └── asignar-formulario.dto.ts
│
├── menu/                           # MENUS Y PERMISOS
│   ├── menu.module.ts
│   ├── menu.controller.ts
│   ├── menu.service.ts
│   ├── entity/
│   │   ├── menu.entity.ts
│   │   └── menu-hijo.entity.ts
│   └── dto/
│       ├── crear-menu.dto.ts
│       └── asignar-permiso.dto.ts
│
├── estructura/                     # ESTRUCTURA ORGANIZACIONAL
│   ├── estructura.module.ts
│   ├── estructura.controller.ts
│   ├── estructura.service.ts
│   └── entity/
│       ├── grado.entity.ts
│       ├── unidad.entity.ts
│       ├── distrital.entity.ts
│       └── grupo.entity.ts
│
└── auditoria/                      # AUDITORIA
    ├── auditoria.module.ts
    ├── auditoria.service.ts
    ├── auditoria.interceptor.ts
    └── entity/
        └── auditoria-cambio.entity.ts
```

### 7.2 Endpoints REST Propuestos

#### 7.2.1 Autenticacion

| Metodo | Endpoint | Descripcion | ASP.NET Original |
|--------|----------|-------------|------------------|
| POST | `/api/auth/login` | Login con credenciales | `Login.aspx.cs:ValidateUser()` |
| POST | `/api/auth/refresh` | Renovar token JWT | N/A (sesiones) |
| POST | `/api/auth/logout` | Cerrar sesion | `Salir.aspx` |
| GET | `/api/auth/me` | Perfil del usuario actual | `Session["userName"]` |

#### 7.2.2 Usuarios

| Metodo | Endpoint | Descripcion | ASP.NET Original |
|--------|----------|-------------|------------------|
| GET | `/api/usuarios` | Listar usuarios | `FRM-AD-02:MuestraGrados()` |
| GET | `/api/usuarios/:id` | Obtener usuario | N/A |
| GET | `/api/usuarios/buscar` | Buscar por filtros | `FRM-AD-02:MuestraDatos()` |
| POST | `/api/usuarios` | Crear usuario | `SistemaUsuarios.InsertUsuario()` |
| PATCH | `/api/usuarios/:id` | Actualizar usuario | N/A |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | `SistemaUsuarios.deleteusuario()` |
| PATCH | `/api/usuarios/:id/habilitar` | Habilitar/deshabilitar | Campo `Habilitado` |

#### 7.2.3 Roles

| Metodo | Endpoint | Descripcion | ASP.NET Original |
|--------|----------|-------------|------------------|
| GET | `/api/roles` | Listar roles | `FRM-AD-02:ListaRoles()` |
| GET | `/api/roles/:id` | Obtener rol | N/A |
| GET | `/api/roles/:id/formularios` | Formularios del rol | `FRM-AD-02:ListaMuestras()` |
| POST | `/api/roles` | Crear rol | N/A |
| PATCH | `/api/roles/:id` | Actualizar rol | N/A |
| POST | `/api/roles/:id/formularios` | Agregar formulario al rol | N/A |

#### 7.2.4 Menus y Permisos

| Metodo | Endpoint | Descripcion | ASP.NET Original |
|--------|----------|-------------|------------------|
| GET | `/api/menus` | Listar menus del usuario actual | `PaginaPrin:GetParantMenu()` |
| GET | `/api/menus/:id/hijos` | Submenus de un menu | `PaginaPrin:GetChildMenu()` |
| GET | `/api/usuarios/:id/menus` | Menus de un usuario | `PaginaPrin.master.cs` |
| POST | `/api/usuarios/:id/permisos` | Asignar permisos | `RegistroUsuarios.InsertUsuarioFormularios()` |
| DELETE | `/api/usuarios/:id/permisos/:permisoId` | Eliminar permiso | `FRM-AD-02:deletemenu()` |
| GET | `/api/permisos/verificar` | Verificar acceso a formulario | `Formularios.Verificar()` |

#### 7.2.5 Estructura Organizacional

| Metodo | Endpoint | Descripcion | ASP.NET Original |
|--------|----------|-------------|------------------|
| GET | `/api/estructura/grados` | Listar grados | `FRM-AD-02:Grados()` |
| GET | `/api/estructura/unidades` | Listar unidades | `FRM-AD-02:unidades()` |
| GET | `/api/estructura/unidades/:id/distritales` | Distritales por unidad | `ddlunidad_SelectedIndexChanged` |
| GET | `/api/estructura/distritales/:id/grupos` | Grupos por distrital | `ddldistrital_SelectedIndexChanged` |

### 7.3 Entidades TypeORM

#### 7.3.1 Usuario Entity

```typescript
// src/application/sunesis/s2i/usuario/entity/usuario.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Grado } from '../../estructura/entity/grado.entity';
import { Grupo } from '../../estructura/entity/grupo.entity';
import { Menu } from '../../menu/entity/menu.entity';

@Entity('users')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
  username: string;  // Email

  @Column({ name: 'usuario', type: 'char', length: 15 })
  numeroPase: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;  // Hash bcrypt en nueva implementacion

  @Column({ name: 'nombre_app', type: 'varchar', length: 200, nullable: true })
  nombreCompleto: string;

  @Column({ name: 'email', type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ name: 'telefono_cel', type: 'varchar', length: 20, nullable: true })
  telefonoCelular: string;

  @Column({ name: 'telefono_corp', type: 'varchar', length: 20, nullable: true })
  telefonoCorporativo: string;

  @ManyToOne(() => Grado)
  @JoinColumn({ name: 'gr_id' })
  grado: Grado;

  @Column({ name: 'gr_id' })
  gradoId: number;

  @ManyToOne(() => Grupo)
  @JoinColumn({ name: 'grp_id' })
  grupo: Grupo;

  @Column({ name: 'grp_id' })
  grupoId: number;

  @Column({ name: 'habilitado', type: 'boolean', default: true })
  habilitado: boolean;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ name: 'user_create', type: 'varchar', length: 50, nullable: true })
  creadoPor: string;

  @Column({ name: 'last_login_date', type: 'timestamp', nullable: true })
  ultimoAcceso: Date;

  @OneToMany(() => Menu, menu => menu.usuario)
  menus: Menu[];
}
```

#### 7.3.2 Menu Entity

```typescript
// src/application/sunesis/s2i/menu/entity/menu.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { MenuHijo } from './menu-hijo.entity';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_menu', type: 'varchar', length: 50 })
  nombre: string;

  @Column({ name: 'parent_url', type: 'varchar', length: 10, default: '#' })
  url: string;

  @Column({ name: 'icono', type: 'varchar', length: 35, nullable: true })
  icono: string;

  @Column({ name: 'usuario', type: 'varchar', length: 50 })
  usuarioUsername: string;

  @ManyToOne(() => Usuario, usuario => usuario.menus)
  @JoinColumn({ name: 'usuario', referencedColumnName: 'username' })
  usuario: Usuario;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ name: 'user_create', type: 'varchar', length: 50, nullable: true })
  creadoPor: string;

  @OneToMany(() => MenuHijo, hijo => hijo.menuPadre)
  hijos: MenuHijo[];
}
```

#### 7.3.3 MenuHijo Entity (Permisos)

```typescript
// src/application/sunesis/s2i/menu/entity/menu-hijo.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from './menu.entity';

@Entity('child_menu')
export class MenuHijo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id' })
  menuPadreId: number;

  @ManyToOne(() => Menu, menu => menu.hijos)
  @JoinColumn({ name: 'parent_id' })
  menuPadre: Menu;

  @Column({ name: 'child_menu', type: 'varchar', length: 50 })
  nombre: string;

  @Column({ name: 'child_url', type: 'varchar', length: 20 })
  urlFormulario: string;

  @Column({ name: 'usuario', type: 'varchar', length: 50 })
  usuarioUsername: string;

  @Column({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ name: 'user_create', type: 'varchar', length: 50, nullable: true })
  creadoPor: string;
}
```

#### 7.3.4 Rol Entity

```typescript
// src/application/sunesis/s2i/rol/entity/rol.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FormularioRol } from './formulario-rol.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'roles_id' })
  id: number;

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ name: 'icono', type: 'varchar', length: 35, nullable: true })
  icono: string;

  @OneToMany(() => FormularioRol, formulario => formulario.rol)
  formularios: FormularioRol[];
}
```

#### 7.3.5 FormularioRol Entity

```typescript
// src/application/sunesis/s2i/rol/entity/formulario-rol.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';

@Entity('formularios')
export class FormularioRol {
  @PrimaryGeneratedColumn({ name: 'forms_id' })
  id: number;

  @Column({ name: 'roles_id' })
  rolId: number;

  @ManyToOne(() => Rol, rol => rol.formularios)
  @JoinColumn({ name: 'roles_id' })
  rol: Rol;

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ name: 'url', type: 'varchar', length: 50 })
  url: string;
}
```

### 7.4 Servicios Clave

#### 7.4.1 AuthService

```typescript
// src/application/sunesis/s2i/auth/auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida credenciales del usuario
   * Equivalente a: Login.aspx.cs:ValidateUser() + SP:Validate_User
   */
  async validateUser(username: string, password: string): Promise<any> {
    const usuario = await this.usuarioService.findByUsername(username);

    if (!usuario) {
      throw new UnauthorizedException('El pase o contrasena son incorrectos');
    }

    if (!usuario.habilitado) {
      throw new UnauthorizedException('La cuenta no ha sido activada');
    }

    // Comparar password con bcrypt (nueva implementacion)
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('El pase o contrasena son incorrectos');
    }

    // Actualizar ultimo acceso
    await this.usuarioService.updateUltimoAcceso(usuario.userId);

    return usuario;
  }

  /**
   * Genera token JWT
   */
  async login(usuario: any) {
    const payload = {
      sub: usuario.userId,
      username: usuario.username,
      nombreCompleto: usuario.nombreCompleto,
      gradoId: usuario.gradoId,
      grupoId: usuario.grupoId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        userId: usuario.userId,
        username: usuario.username,
        nombreCompleto: usuario.nombreCompleto,
      }
    };
  }
}
```

#### 7.4.2 PermisoService

```typescript
// src/application/sunesis/s2i/menu/permiso.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuHijo } from './entity/menu-hijo.entity';

@Injectable()
export class PermisoService {
  constructor(
    @InjectRepository(MenuHijo)
    private menuHijoRepository: Repository<MenuHijo>,
  ) {}

  /**
   * Verifica si un usuario tiene acceso a un formulario
   * Equivalente a: Formularios.Verificar()
   *
   * @param username - Username del usuario
   * @param codigoFormulario - Codigo del formulario (ej: "FRM-AD-02.aspx")
   * @returns true si tiene acceso, false si no
   */
  async verificarAcceso(username: string, codigoFormulario: string): Promise<boolean> {
    const count = await this.menuHijoRepository.count({
      where: {
        usuarioUsername: username,
        urlFormulario: codigoFormulario,
      }
    });

    return count > 0;
  }

  /**
   * Obtiene todos los permisos (formularios) de un usuario
   * Equivalente a: PaginaPrin.master.cs:GetChildMenu()
   */
  async obtenerPermisosUsuario(username: string): Promise<MenuHijo[]> {
    return this.menuHijoRepository.find({
      where: { usuarioUsername: username },
      order: { urlFormulario: 'ASC' },
      relations: ['menuPadre'],
    });
  }

  /**
   * Asigna un formulario a un usuario
   * Equivalente a: RegistroUsuarios.InsertUsuarioFormularios()
   */
  async asignarPermiso(
    menuPadreId: number,
    nombre: string,
    urlFormulario: string,
    username: string,
    creadoPor: string,
  ): Promise<MenuHijo> {
    // Verificar si ya existe
    const existe = await this.menuHijoRepository.findOne({
      where: {
        usuarioUsername: username,
        urlFormulario: urlFormulario
      }
    });

    if (existe) {
      return existe; // Ya tiene el permiso
    }

    const permiso = this.menuHijoRepository.create({
      menuPadreId,
      nombre,
      urlFormulario,
      usuarioUsername: username,
      creadoPor,
    });

    return this.menuHijoRepository.save(permiso);
  }

  /**
   * Elimina un permiso de un usuario
   * Equivalente a: FRM-AD-02:deletemenu()
   */
  async eliminarPermiso(permisoId: number): Promise<void> {
    await this.menuHijoRepository.delete(permisoId);
  }
}
```

#### 7.4.3 Guard de Permisos

```typescript
// src/application/sunesis/s2i/auth/guards/permissions.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermisoService } from '../../menu/permiso.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permisoService: PermisoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      return true; // No requiere permisos especificos
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Verificar si tiene al menos uno de los permisos requeridos
    for (const permission of requiredPermissions) {
      const hasPermission = await this.permisoService.verificarAcceso(
        user.username,
        permission
      );

      if (hasPermission) {
        return true;
      }
    }

    throw new ForbiddenException('No tiene permisos para acceder a este recurso');
  }
}
```

#### 7.4.4 Decorator de Permisos

```typescript
// src/application/sunesis/s2i/auth/decorators/permissions.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator para requerir permisos especificos
 * Uso: @RequirePermissions('FRM-AD-01.aspx', 'FRM-AD-02.aspx')
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

---

## 8. GUIA DE IMPLEMENTACION

### 8.1 Orden de Implementacion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORDEN DE IMPLEMENTACION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FASE 1: INFRAESTRUCTURA BASE                                                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1.1 Configurar conexion a BD PostgreSQL (felcn_s3i)                   │  │
│  │ 1.2 Crear entidades de estructura: Grado, Unidad, Distrital, Grupo    │  │
│  │ 1.3 Migrar datos de estructura organizacional                          │  │
│  │ 1.4 Crear endpoints de estructura (GET /api/estructura/*)              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  FASE 2: USUARIOS                                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2.1 Crear entidad Usuario                                             │  │
│  │ 2.2 Implementar UsuarioService (CRUD)                                 │  │
│  │ 2.3 Migrar usuarios existentes (actualizar passwords a bcrypt)        │  │
│  │ 2.4 Crear endpoints de usuarios                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  FASE 3: AUTENTICACION                                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3.1 Configurar Passport + JWT                                         │  │
│  │ 3.2 Implementar AuthService (login, validacion)                       │  │
│  │ 3.3 Crear AuthController (/api/auth/*)                                │  │
│  │ 3.4 Implementar JwtAuthGuard                                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  FASE 4: ROLES Y FORMULARIOS                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4.1 Crear entidades Rol y FormularioRol                               │  │
│  │ 4.2 Migrar datos de roles y formularios                               │  │
│  │ 4.3 Implementar RolService                                            │  │
│  │ 4.4 Crear endpoints de roles                                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  FASE 5: MENUS Y PERMISOS                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 5.1 Crear entidades Menu y MenuHijo                                   │  │
│  │ 5.2 Migrar menus y permisos existentes                                │  │
│  │ 5.3 Implementar PermisoService                                        │  │
│  │ 5.4 Implementar PermissionsGuard                                      │  │
│  │ 5.5 Crear endpoints de menus y permisos                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│  FASE 6: AUDITORIA                                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 6.1 Crear entidad AuditoriaCambio                                     │  │
│  │ 6.2 Implementar AuditoriaInterceptor                                  │  │
│  │ 6.3 Configurar interceptor global                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Migracion de Passwords

El sistema actual usa AES para encriptar passwords. Para la migracion se recomienda:

```typescript
// Script de migracion de passwords

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// Funcion para desencriptar password actual (AES del sistema legacy)
function decryptLegacyPassword(encryptedPassword: string): string {
  const encryptionKey = '#F3LW38ic1a$';
  const salt = Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]);

  // Derivar key e IV usando PBKDF2
  const keyIv = crypto.pbkdf2Sync(encryptionKey, salt, 1000, 48, 'sha1');
  const key = keyIv.slice(0, 32);
  const iv = keyIv.slice(32, 48);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(Buffer.from(encryptedPassword, 'base64'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // El password original esta en Unicode (UTF-16LE)
  return decrypted.toString('utf16le');
}

// Proceso de migracion
async function migratePasswords() {
  const usuarios = await usuarioRepository.find();

  for (const usuario of usuarios) {
    try {
      // 1. Desencriptar password legacy
      const plainPassword = decryptLegacyPassword(usuario.password);

      // 2. Re-encriptar con bcrypt
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // 3. Actualizar en BD
      await usuarioRepository.update(usuario.userId, {
        password: hashedPassword
      });

      console.log(`Usuario ${usuario.username} migrado exitosamente`);
    } catch (error) {
      console.error(`Error migrando usuario ${usuario.username}:`, error);
    }
  }
}
```

### 8.3 Ejemplo de Controlador Completo

```typescript
// src/application/sunesis/s2i/usuario/usuario.controller.ts

import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsuarioService } from './usuario.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { BuscarUsuarioDto } from './dto/buscar-usuario.dto';

@ApiTags('S2I - Usuarios')
@ApiBearerAuth()
@Controller('api/usuarios')
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  /**
   * Listar usuarios con filtros
   * Equivalente a: FRM-AD-02:MuestraGrados(), MuestraUnidades(), MuestraDatos()
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-01.aspx', 'FRM-AD-02.aspx')
  @ApiOperation({ summary: 'Listar usuarios con filtros' })
  async listar(@Query() filtros: BuscarUsuarioDto) {
    return this.usuarioService.buscar(filtros);
  }

  /**
   * Obtener usuario por ID
   */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-01.aspx')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async obtener(@Param('id') id: number) {
    return this.usuarioService.findById(id);
  }

  /**
   * Crear nuevo usuario
   * Equivalente a: SistemaUsuarios.InsertUsuario()
   */
  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-01.aspx')
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  async crear(
    @Body() dto: CrearUsuarioDto,
    @CurrentUser() adminUser: any,
  ) {
    return this.usuarioService.crear(dto, adminUser.username);
  }

  /**
   * Actualizar usuario
   */
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-01.aspx')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async actualizar(
    @Param('id') id: number,
    @Body() dto: ActualizarUsuarioDto,
  ) {
    return this.usuarioService.actualizar(id, dto);
  }

  /**
   * Eliminar usuario
   * Equivalente a: SistemaUsuarios.deleteusuario(), deletemenu(), deleteChildM()
   */
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-01.aspx')
  @ApiOperation({ summary: 'Eliminar usuario y sus permisos' })
  async eliminar(@Param('id') id: number) {
    return this.usuarioService.eliminar(id);
  }

  /**
   * Habilitar/Deshabilitar usuario
   */
  @Patch(':id/habilitar')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-01.aspx')
  @ApiOperation({ summary: 'Cambiar estado de habilitacion' })
  async toggleHabilitado(
    @Param('id') id: number,
    @Body('habilitado') habilitado: boolean,
  ) {
    return this.usuarioService.toggleHabilitado(id, habilitado);
  }

  /**
   * Obtener menus/permisos del usuario
   */
  @Get(':id/menus')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('FRM-AD-02.aspx')
  @ApiOperation({ summary: 'Obtener menus y permisos del usuario' })
  async obtenerMenus(@Param('id') id: number) {
    return this.usuarioService.obtenerMenus(id);
  }
}
```

---

## 9. VULNERABILIDADES A CORREGIR

### 9.1 SQL Injection

**Archivos Afectados:**
- `App_Code/Formularios.cs:11`
- `App_Code/SistemaUsuarios.cs:12`
- `App_Code/RegistroUsuarios.cs:143, 171, 199`
- `PaginaPrin.master.cs:108, 126`
- `Forms/FRM-AD-02.aspx.cs:79, 101, 156-177, 247, 258, 287, 309, 360, 372, 386`

**Solucion en NestJS:**
- Usar siempre parametros con TypeORM
- Nunca concatenar strings en queries

```typescript
// MAL (vulnerable)
const query = `SELECT * FROM users WHERE username = '${username}'`;

// BIEN (seguro)
const user = await this.userRepository.findOne({
  where: { username }
});
```

### 9.2 Credenciales Hardcodeadas

**Archivos Afectados:**
- `App_Code/ValoresGlobales.cs` - Connection strings con passwords
- `Login.aspx.cs:52` - Clave de encriptacion `#F3LW38ic1a$`

**Solucion:**
```typescript
// .env
DB_S2I_HOST=localhost
DB_S2I_PORT=5432
DB_S2I_USERNAME=postgres
DB_S2I_PASSWORD=secreto
DB_S2I_DATABASE=felcn_s3i

JWT_SECRET=un-secreto-muy-largo-y-seguro
ENCRYPTION_KEY=otra-clave-segura
```

### 9.3 Encriptacion Debil

**Archivo Afectado:**
- `App_Code/Seguridad.cs` - Usa Base64 (NO es encriptacion)

**Solucion:**
```typescript
// Usar bcrypt para passwords
import * as bcrypt from 'bcrypt';

const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

### 9.4 Sesion de 48 Horas

**Archivo Afectado:**
- `web.config` - timeout="2880"

**Solucion:**
```typescript
// Usar tokens JWT con expiracion razonable
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '8h' },  // 8 horas
})
```

---

## ANEXOS

### A. Mapeo Completo ASP.NET -> NestJS

| Archivo ASP.NET | Funcion | Archivo NestJS Equivalente |
|-----------------|---------|---------------------------|
| `Login.aspx.cs:ValidateUser()` | Autenticacion | `auth/auth.service.ts:validateUser()` |
| `Login.aspx.cs:Encrypt()` | Encriptacion password | Eliminar, usar bcrypt |
| `Formularios.cs:Verificar()` | Verificar permiso | `menu/permiso.service.ts:verificarAcceso()` |
| `SistemaUsuarios.cs:InsertUsuario()` | Crear usuario | `usuario/usuario.service.ts:crear()` |
| `SistemaUsuarios.cs:deleteusuario()` | Eliminar usuario | `usuario/usuario.service.ts:eliminar()` |
| `RegistroUsuarios.cs:InsertFormularios()` | Crear menu | `menu/menu.service.ts:crearMenu()` |
| `RegistroUsuarios.cs:InsertUsuarioFormularios()` | Asignar permiso | `menu/permiso.service.ts:asignarPermiso()` |
| `RegistroUsuarios.cs:InsertRegistro()` | Auditoria | `auditoria/auditoria.interceptor.ts` |
| `PaginaPrin.master.cs:GetParantMenu()` | Obtener menus | `menu/menu.service.ts:obtenerMenusUsuario()` |
| `PaginaPrin.master.cs:GetChildMenu()` | Obtener submenus | `menu/permiso.service.ts:obtenerPermisosUsuario()` |

### B. Formularios Identificados

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| FRM-AD-01.aspx | Administracion de Usuarios | CRUD de usuarios |
| FRM-AD-02.aspx | Asignacion de Formularios | Asignar permisos a usuarios |
| FRM-AD-03.aspx | Gestion de Roles | Administrar roles |
| FRM-CA-01.aspx | Perfil del Usuario | Ver perfil |
| FRM-CA-02.aspx | Busqueda de Casos | Buscar casos |
| FRM-ING-C0.aspx | Ingreso de Casos 0 | Crear caso paso 0 |
| FRM-ING-C1.aspx | Ingreso de Casos 1 | Crear caso paso 1 |
| FRM-ING-C2.aspx | Ingreso de Casos 2 | Crear caso paso 2 |
| FRM-OP-ING.aspx | Ingreso de Operativos | Crear operativo |
| FRM-OP-UP.aspx | Actualizacion de Operativos | Editar operativo |
| FRM-OP-ACT.aspx | Actividades de Operativos | Actividades |
| FRM-OP-PT.aspx | Puntos de Operativos | Puntos |

---

**Documento generado para la migracion del sistema SUNESIS - FELCN**
**Modulo S2i - Autenticacion y Autorizacion**
