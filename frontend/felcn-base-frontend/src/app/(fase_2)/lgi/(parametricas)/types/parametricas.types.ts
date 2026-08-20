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
