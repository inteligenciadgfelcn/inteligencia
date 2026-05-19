import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi, SeccionPayload } from './types'

const BASE = `${Constantes.baseUrl}/operativos`

export const PersonasPorIdService = {
  obtener(idOperativo: number): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/personas-por-id`,
      withCredentials: true,
    })
  },

  guardar(
    idOperativo: number,
    payload: SeccionPayload
  ): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/personas-por-id`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
