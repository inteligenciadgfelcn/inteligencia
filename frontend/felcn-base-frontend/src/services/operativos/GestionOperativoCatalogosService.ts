import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { EstadoDroga, ItemCategoriaOperativo, RespuestaApi } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`



export const GestionOperativoCatalogosService = {
    obtenerEstadosDroga(
        idTipoDroga: number
    ): Promise<RespuestaApi<EstadoDroga[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/estados-droga/${idTipoDroga}`,
        })
    },
    obtenerItemsOperativo(
        idItemOperativo: number
    ): Promise<RespuestaApi<ItemCategoriaOperativo[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/items-operativo/${idItemOperativo}`,
        })
    },
}
