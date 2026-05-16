import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/asignaciones-ingreso`

export interface AsignacionIngresoItem {
  idCaso: string
  unidad: string
  distrital: string
  grupo: string
  numeroCaso: string
  numeroCasoPerDom: string
  nroOperativo: string
  nombreCaso: string
  fechaOperativo: string | null
  asignadoCaso: string
  fiscalAsignadoCaso: string
}

export interface RespuestaListado {
  finalizado: boolean
  mensaje?: string
  datos: {
    total: number
    filas: AsignacionIngresoItem[]
  } | AsignacionIngresoItem[]
  total?: number
}

export interface ParamsSinRegistrar {
  idDistrital: number
  limite?: number
  pagina?: number
}

export interface ParamsPorNumero {
  idDistrital: number
  nroCaso: string
  limite?: number
  pagina?: number
}

export interface ParamsPorNombre {
  idDistrital: number
  nombreCaso: string
  limite?: number
  pagina?: number
}

export interface ParamsPorFecha {
  idDistrital: number
  desde: string
  hasta: string
  limite?: number
  pagina?: number
}

export const AsignacionesIngresoService = {
  sinRegistrar(params: ParamsSinRegistrar) {
    return sesionPeticion<RespuestaListado>({
      url: `${BASE}/sin-registrar`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  porNumero(params: ParamsPorNumero) {
    return sesionPeticion<RespuestaListado>({
      url: `${BASE}/por-numero`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  porNombre(params: ParamsPorNombre) {
    return sesionPeticion<RespuestaListado>({
      url: `${BASE}/por-nombre`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  porFecha(params: ParamsPorFecha) {
    return sesionPeticion<RespuestaListado>({
      url: `${BASE}/por-fecha`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },
}
