import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  RespuestaApi,
  FabricaRespuesta,
  FabricaPayload,
  RespuestaApiPaginada,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE_OPERATIVO = `${Constantes.baseUrl}/operativos`

export const GestionOperativoLaboratorioService = {
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
