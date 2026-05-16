import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi } from '@/services/operativos/types'

const BASE_LGI = `${Constantes.baseUrl}/lgi`

export interface AsignacionLgiItem {
  casosId: string
  departamento: string
  distrital: string
  nombreCaso: string
  nroCasoGiaef: string
  nroCaso: string
  nroCasoFis: string
  nroCasoPerDom: string
  ianus: string
  remiteFiscal: string
  remiteFecha: string
  conformeA: string
}

export interface OperativoLgiItem {
  opId: string
  opNroOper: string
  opFechaInf: string
  ubicacion: string
  unidadDistrital: string
  opDescripcion: string
}

export interface BuscarMisCasosLgiParams {
  uniAbrev?: string
  nroCasoGiaef?: string
  nroCaso?: string
  nroCasoFis?: string
  nombreCaso?: string
  nroCasoPerDom?: string
  perdDom?: boolean
  pagina?: number
  limite?: number
}

interface PagedLgiResponse {
  filas: AsignacionLgiItem[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export const LgiService = {
  buscarMisCasos(
    params: BuscarMisCasosLgiParams
  ): Promise<RespuestaApi<PagedLgiResponse>> {
    return sesionPeticion({
      url: `${BASE_LGI}/mis-casos`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },

  listarOperativosPorCaso(
    casosId: string
  ): Promise<RespuestaApi<OperativoLgiItem[]>> {
    return sesionPeticion({
      url: `${BASE_LGI}/asignacion/${casosId}/operativos`,
      method: 'get',
      withCredentials: true,
    })
  },
}
