import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  RespuestaApi,
  SustanciaSolidaPayload,
  SustanciaSolidaRespuesta,
  RespuestaApiPaginada,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSustanciasSolidasService = {
  listar(
    idOperativo: number,
    page: number = 1,
    limit: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<SustanciaSolidaRespuesta>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-solidas?pagina=${page}&limite=${limit}`,
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    id: number
  ): Promise<RespuestaApi<SustanciaSolidaRespuesta>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-solidas/${id}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: SustanciaSolidaPayload
  ): Promise<RespuestaApi<SustanciaSolidaRespuesta>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-solidas`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
