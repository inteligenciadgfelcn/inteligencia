import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  RespuestaApi,
  SustanciaLiquidaPayload,
  SustanciaLiquidaRespuesta,
  RespuestaApiPaginada,
} from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSustanciasLiquidasService = {
  listar(
    idOperativo: number,
    page: number = 1,
    limit: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<SustanciaLiquidaRespuesta>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-liquidas?pagina=${page}&limite=${limit}`,
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    id: number
  ): Promise<RespuestaApi<SustanciaLiquidaRespuesta>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-liquidas/${id}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: SustanciaLiquidaPayload
  ): Promise<RespuestaApi<SustanciaLiquidaRespuesta>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-liquidas`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
