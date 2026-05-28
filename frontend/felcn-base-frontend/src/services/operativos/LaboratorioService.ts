import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  RespuestaApi,
  FabricaRespuesta,
  FabricaPayload,
  RespuestaApiPaginada,
} from './types'

const BASE_OPERATIVO = `${Constantes.baseUrl}/operativos`

export const LaboratorioService = {
  listar(
    idOperativo: number,
    page: number = 1,
    limit: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<FabricaRespuesta>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVO}/${idOperativo}/fabricas?pagina=${page}&limite=${limit}`,
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    id: number
  ): Promise<RespuestaApi<FabricaRespuesta>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVO}/${idOperativo}/fabricas/${id}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: FabricaPayload
  ): Promise<RespuestaApi<FabricaRespuesta>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVO}/${idOperativo}/fabricas`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },
}
