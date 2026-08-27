// CRUD de usuarios

export interface RolCRUDType {
  id: string
  rol: string
  nombre: string
}

export interface UsuarioRolCRUDType {
  fechaCreacion: Date
  usuarioCreacion: string
  fechaActualizacion: Date
  usuarioActualizacion?: string
  id: string
  estado: string
  rol: RolCRUDType
}

export interface PersonaCRUDType {
  nombres: string
  primerApellido: string
  segundoApellido: string
  tipoDocumento: string
  nroDocumento: string
  fechaNacimiento: string
  telefono?: string
}

export interface UsuarioCRUDType {
  id: string
  usuario: string
  ciudadaniaDigital: boolean
  correoElectronico: string
  estado: string
  intentos?: number
  fechaBloqueo?: string | null
  usuarioRol: UsuarioRolCRUDType[]
  persona: PersonaCRUDType
  /** Fecha en que el usuario completó por única vez su Estructura FELCN. `null`/ausente = pendiente. */
  fechaPerfilCompletado?: string | null
  grupo?: {
    id: number
    descripcion: string
    distrital?: {
      id: number
      descripcion: string
      unidad?: {
        id: number
        abreviatura: string
        descripcion: string
      }
    }
  } | null
}

// Crear usuario

export interface CrearPersonaType {
  nombres: string
  primerApellido: string
  segundoApellido: string
  nroDocumento: string
  fechaNacimiento: string
  telefono: string
}

export interface CrearEditarUsuarioType {
  id?: string
  usuario?: string
  persona: CrearPersonaType
  ciudadaniaDigital: boolean
  roles: string[]
  estado: string
  correoElectronico: string
}

/// Tipo rol transversal

export interface RolType {
  id: string
  rol: string
  nombre: string
}
