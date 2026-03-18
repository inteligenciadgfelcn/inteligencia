interface Usuario {
  estado: string
  id: string
  usuario: string
  ciudadaniaDigital: boolean
  correoElectronico: string
  fechaCreacion: string
  usuarioRol: {
    estado: string
    transaccion: string
    usuarioCreacion: string
    fechaCreacion: string
    usuarioModificacion: string | null
    fechaModificacion: string
    id: string
    idRol: string
    idUsuario: string
    rol: {
      id: string
      rol: string
    }
  }[]
  persona: {
    nombres: string
    primerApellido: string
    segundoApellido: string
    tipoDocumento: string
    nroDocumento: string
    fechaNacimiento: string
  }
}

export interface UsuariosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Usuario[]
  }
}

interface Parametro {
  estado: string
  id: string
  codigo: string
  nombre: string
  grupo: string
  descripcion: string
}

export interface ParametrosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Parametro[]
  }
}

interface Modulo {
  estado: string
  id: string
  label: string
  url: string
  nombre: string
  fechaCreacion: string
  propiedades: {
    orden: number
    descripcion: string
    icono?: string
  }
  modulo: { id: string } | null
}

export interface ModulosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Modulo[]
  }
}

interface Rol {
  estado: string
  id: string
  rol: string
  nombre: string
  descripcion: string
  fechaCreacion: string
}

export interface RolesResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Rol[]
  }
}

interface Politica {
  sujeto: string
  objeto: string
  accion: string
  app: string
}

export interface PoliticasResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Politica[]
  }
}
