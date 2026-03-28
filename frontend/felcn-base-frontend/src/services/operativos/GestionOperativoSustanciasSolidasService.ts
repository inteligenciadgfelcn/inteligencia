import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi, SustanciaSolidaPayload, SustanciaSolidaRespuesta, RespuestaApiPaginada } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSustanciasSolidasService = {
    listar(idOperativo: number, page: number = 1, limit: number = 10): Promise<RespuestaApi<RespuestaApiPaginada<SustanciaSolidaRespuesta>>> {
        return Servicios.get({ url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-solidas?pagina=${page}&limite=${limit}` })
    },

    eliminar(idOperativo: number, id: number): Promise<RespuestaApi<SustanciaSolidaRespuesta>> {
        return Servicios.delete({ url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-solidas/${id}` })
    },

    crear(idOperativo: number,
        payload: SustanciaSolidaPayload
    ): Promise<RespuestaApi<SustanciaSolidaRespuesta>> {
        return Servicios.post({ url: `${BASE_OPERATIVOS}/${idOperativo}/sustancias-solidas`, body: payload })
    },
}
