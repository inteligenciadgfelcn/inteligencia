import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { RespuestaApi, SeccionPayload } from './types'

const BASE = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSeccion6Service = {
  obtener(idOperativo: number): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/seccion6`,
      withCredentials: true,
    })
  },

  guardar(
    idOperativo: number,
    payload: SeccionPayload
  ): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/seccion6`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
