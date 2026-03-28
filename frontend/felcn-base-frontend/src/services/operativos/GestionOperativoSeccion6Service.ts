import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi, SeccionPayload } from './types'

const BASE = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSeccion6Service = {
  obtener(idOperativo: number): Promise<RespuestaApi<SeccionPayload>> {
    return Servicios.get({
      url: `${BASE}/${idOperativo}/seccion6`,
    })
  },

  guardar(
    idOperativo: number,
    payload: SeccionPayload
  ): Promise<RespuestaApi<SeccionPayload>> {
    return Servicios.post({
      url: `${BASE}/${idOperativo}/seccion6`,
      body: payload,
    })
  },
}
