import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi } from './types'

const BASE = `${Constantes.baseUrl}/casos-paralelos`

export interface InvestigacionParalelaPayload {
  idCaso: string
  idOperativo: string
  delitoPrecedente: string
  detalleDelitoPrecedente: string
  informeInteligencia: string
  fechaEnvioFiscalia: string
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
}
