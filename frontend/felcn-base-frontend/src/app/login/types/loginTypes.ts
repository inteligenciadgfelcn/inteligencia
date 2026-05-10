// Form Login

export interface LoginType {
  usuario: string
  contrasena: string
}

export interface idRolType {
  idRol: string
}

/// Usuario que iniciar sesión

export interface PropiedadesType {
  icono?: string
  descripcion?: string
  orden: number
}

export type SubModuloType = {
  id: string
  label: string
  url: string
  nombre: string
  propiedades: PropiedadesType
  estado: string
}

export type ModuloType = {
  icon: any
  id: string
  label: string
  url: string
  nombre: string
  propiedades: PropiedadesType
  estado: string
  subModulo: SubModuloType[]
}

export interface RoleType {
  idRol: string
  rol: string
  nombre: string
  modulos: ModuloType[]
}

export interface PersonaType {
  nombres: string
  primerApellido: string
  segundoApellido: string
  tipoDocumento: string
  nroDocumento: string
  fechaNacimiento: string
  telefono?: string | null
}

export interface UnidadType {
  id: number
  abreviatura: string
  descripcion: string
}

export interface DistritalType {
  id: number
  descripcion: string
  unidad: UnidadType
}

export interface GrupoType {
  id: number
  descripcion: string
  distrital: DistritalType
}

export interface UsuarioType {
  access_token: string
  id: string
  usuario: string
  ciudadaniaDigital: boolean
  correoElectronico: string
  estado: string
  roles: RoleType[]
  persona: PersonaType
  idRol: string
  numeroPase: string
  urlFoto?: string | null
  idGrupo?: number | null
  grupo?: GrupoType | null
}

export interface PoliticaType {
  sujeto: string
  objeto: string
  accion: string
}
