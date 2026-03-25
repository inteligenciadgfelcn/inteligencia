// ─── Respuesta genérica del API ────────────────────────────────────────────────
export interface RespuestaAPI<T> {
  finalizado: boolean
  mensaje: string
  datos: T[]
}

// ─── siii-lookups ──────────────────────────────────────────────────────────────

export interface Continente {
  id: number
  descripcion: string
}

export interface Pais {
  id: number
  idContinente: number
  descripcion: string
  continente: LookupBasico
}

export interface Departamento {
  id: number
  idPais: number
  descripcion: string
  pais: Pais
}

export interface Provincia {
  id: number
  idDepartamento: number
  descripcion: string
  departamento: Pick<Departamento, 'id' | 'idPais' | 'descripcion'>
}

export interface Localidad {
  id: number
  idProvincia: number
  descripcion: string
  provincia: Pick<Provincia, 'id' | 'idDepartamento' | 'descripcion'>
}

export interface LookupBasico {
  id: number | string
  descripcion: string
}

export interface PlanOperacion {
  id: number
  nombre: string
  gestion: string
}

// ─── asig-lookups ──────────────────────────────────────────────────────────────

export interface UnidadAsig {
  idUnidad: string
  descripcion: string
}

// ─── estructura ────────────────────────────────────────────────────────────────

export interface Grado {
  id: number
  descripcion: string
  abreviatura: string
}

export interface UnidadEstructura {
  id: number
  descripcion: string
  [key: string]: unknown
}

export interface Distrital {
  id: number
  idUnidad: number
  descripcion: string
  [key: string]: unknown
}

export interface Grupo {
  id: number
  idDistrital: number
  descripcion: string
  [key: string]: unknown
}
