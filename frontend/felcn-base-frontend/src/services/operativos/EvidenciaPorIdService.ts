import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi, SeccionPayload } from './types'

const BASE = `${Constantes.baseUrl}/operativos`

export const EvidenciaPorIdService = {
  obtener(idOperativo: number): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/evidencia-por-id`,
      withCredentials: true,
    })
  },

  guardar(
    idOperativo: number,
    payload: SeccionPayload
  ): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/evidencia-por-id`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
