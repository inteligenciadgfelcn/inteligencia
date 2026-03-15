import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi, SustanciaLiquidaPayload, SustanciaLiquidaRespuesta, RespuestaApiPaginada } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSustanciasLiquidasService = {
    listar(idOperativo: number, page: number = 1, limit: number = 10): Promise<RespuestaApi<RespuestaApiPaginada<SustanciaLiquidaRespuesta>>> {
        return Servicios.get({ url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-liquidas?pagina=${page}&limite=${limit}` })
    },

    eliminar(idOperativo: number, id: number): Promise<RespuestaApi<SustanciaLiquidaRespuesta>> {
        return Servicios.delete({ url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-liquidas/${id}` })
    },

    crear(idOperativo: number,
        payload: SustanciaLiquidaPayload
    ): Promise<RespuestaApi<SustanciaLiquidaRespuesta>> {
        return Servicios.post({ url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-liquidas`, body: payload })
    },
}
