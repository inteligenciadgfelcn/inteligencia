import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi, FabricaRespuesta, FabricaPayload, RespuestaApiPaginada } from './types'

const BASE_OPERATIVO = `${Constantes.baseUrl}/operativos`

export const GestionOperativoLaboratorioService = {
    listar(idOperativo: number, page: number = 1, limit: number = 10): Promise<RespuestaApi<RespuestaApiPaginada<FabricaRespuesta>>> {
        return Servicios.get({ url: `${BASE_OPERATIVO}/${idOperativo}/fabricas?pagina=${page}&limite=${limit}` })
    },

    eliminar(idOperativo: number, id: number): Promise<RespuestaApi<FabricaRespuesta>> {
        return Servicios.delete({ url: `${BASE_OPERATIVO}/${idOperativo}/fabricas/${id}` })
    },

    crear(idOperativo: number,
        payload: FabricaPayload
    ): Promise<RespuestaApi<FabricaRespuesta>> {
        return Servicios.post({ url: `${BASE_OPERATIVO}/${idOperativo}/fabricas`, body: payload })
    },
}
