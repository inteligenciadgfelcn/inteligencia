import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

export interface LookupDepartamento {
  idDepartamento: number
  abreviatura: string
  descripcion: string
  estado: string
}

export interface LookupUnidad {
  id: number
  abreviatura: string
  descripcion: string
}

export interface LookupDistrital {
  id: number
  descripcion: string
  estado: string
  idUnidad: number
  unidad: string
}

export interface LookupGrupo {
  id: number
  descripcion: string
  estado: string
  idDistrital: number
  distrital: string
  idUnidad: number
  unidad: string
}

export interface LookupPais {
  idPais: number
  descripcion: string
  estado: string
}

export interface LookupEstadoCivil {
  idEstadoCivil: number
  descripcion: string
}

export const PersonasLookupsService = {
  obtenerDepartamentos(): Promise<LookupDepartamento[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/departamento/all/pais`,
      withCredentials: true,
    })
  },

  obtenerUnidades(): Promise<LookupUnidad[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/unidad/allGeneral`,
      withCredentials: true,
    })
  },

  obtenerDistritales(idUnidad: number): Promise<LookupDistrital[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/distrital/all/unidad`,
      params: { idUnidad },
      withCredentials: true,
    })
  },

  obtenerGrupos(idDistrito: number): Promise<LookupGrupo[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/grupos/all/distrito`,
      params: { idDistrito },
      withCredentials: true,
    })
  },

  obtenerPaises(): Promise<LookupPais[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/pais/allGeneral`,
      withCredentials: true,
    })
  },

  obtenerEstadosCiviles(): Promise<LookupEstadoCivil[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/estado-civil`,
      withCredentials: true,
    })
  },
}