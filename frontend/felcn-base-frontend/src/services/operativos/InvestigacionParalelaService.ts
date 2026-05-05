import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi } from './types'

const BASE = `${Constantes.baseUrl}/casos-paralelos`

export interface InvestigacionParalelaPayload {
  idCaso: string
  idDepartamentoCaso: string
  abreviaturaUnidad: string
  idDistrital: number
  idGrupo: number
  delito: string
  numeroCaso: string
  asignadoCaso: string
  fiscalAsignadoCaso: string
  idOperativo: string
  delitoPrecedente: string
  informe: string
  fechaEnvioInvestigacionParalela: string
  resultado: boolean
  fechaRespuestaInvestigacionParalela?: string
  respuestaInvestigacionParalela: boolean
}

export const InvestigacionParalelaService = {
  guardar(payload: InvestigacionParalelaPayload): Promise<RespuestaApi<any>> {
    return sesionPeticion({
      url: `${BASE}`,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },
  listar(params?: any): Promise<RespuestaApi<[any[], number]>> {
    return sesionPeticion({
      url: `${BASE}`,
      method: 'get',
      params,
      withCredentials: true,
    })
  },
  buscarPorUnidadYResultado(
    unidad: string,
    resultado: boolean,
    params?: any
  ): Promise<RespuestaApi<[any[], number]>> {
    return sesionPeticion({
      url: `${BASE}/buscar-por-unidad-resultado`,
      method: 'get',
      params: { unidad, resultado, ...params },
      withCredentials: true,
    })
  },
}
