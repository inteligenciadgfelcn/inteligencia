import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi, SustanciaLiquidaPayload, SustanciaLiquidaRespuesta } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSustanciasLiquidasService = {
    listar(idCaso: number): Promise<RespuestaApi<SustanciaLiquidaRespuesta[]>> {
        return Servicios.get({ url: `${BASE_OPERATIVOS}/caso/${idCaso}/sustancias-liquidas` })
    },

    eliminar(idCaso: number, id: number): Promise<RespuestaApi<SustanciaLiquidaRespuesta>> {
        return Servicios.delete({ url: `${BASE_OPERATIVOS}/caso/${idCaso}/sustancias-liquidas/${id}` })
    },

    crear(idCaso: number,
        payload: SustanciaLiquidaPayload
    ): Promise<RespuestaApi<SustanciaLiquidaRespuesta>> {
        return Servicios.post({ url: `${BASE_OPERATIVOS}/caso/${idCaso}/sustancias-liquidas`, body: payload })
    },
}
