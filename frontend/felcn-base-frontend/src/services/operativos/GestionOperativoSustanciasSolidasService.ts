import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoSustanciasSolidasService = {
    listar(idCaso: number): Promise<RespuestaApi<any[]>> {
        return Servicios.get({ url: `${BASE_OPERATIVOS}/caso/${idCaso}/sustancias-solidas` })
    },

    eliminar(idCaso: number, id: number): Promise<RespuestaApi<any>> {
        return Servicios.delete({ url: `${BASE_OPERATIVOS}/caso/${idCaso}/sustancias-solidas/${id}` })
    },

    crear(idCaso: number,
        payload: any
    ): Promise<RespuestaApi<any>> {
        return Servicios.post({ url: `${BASE_OPERATIVOS}/caso/${idCaso}/sustancias-solidas`, body: payload })
    },
}
