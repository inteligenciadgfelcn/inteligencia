export interface DistritalLgi {
  id: number
  descripcion: string
  estado: string
  idUnidad: number
  unidad: string
}

export interface GrupoLgi {
  id: number
  descripcion: string
  estado: string
  idDistrito: number
  distrital: string
}

export interface CatalogoLgi {
  id: number
  descripcion: string
  [key: string]: unknown
}

export interface DepartamentoLgi {
  dpto_id: string
  pa_id: string
  descripcion: string
}

export interface TipoDocumentoLgi {
  td_id: string
  descripcion: string
}

export interface PaisLgi {
  pa_id: string
  cont_id: string
  descripcion: string
}

export interface EstadoCivilLgi {
  ec_id: string
  descripcion: string
}

export interface ProfesionLgi {
  prof_id: string
  descripcion: string
  prof_ocup: boolean
}
