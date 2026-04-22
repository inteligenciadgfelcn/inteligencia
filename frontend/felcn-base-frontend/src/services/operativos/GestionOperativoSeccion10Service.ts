import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type { RespuestaApi, SeccionPayload } from './types'

const { sesionPeticion } = usePeticion()
const BASE = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSeccion10Service = {
  obtener(idOperativo: number): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/seccion10`,
      withCredentials: true,
    })
  },

  guardar(
    idOperativo: number,
    payload: SeccionPayload
  ): Promise<RespuestaApi<SeccionPayload>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/seccion10`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
