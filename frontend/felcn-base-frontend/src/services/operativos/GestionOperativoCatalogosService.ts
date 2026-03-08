import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

type CatalogoOperativoItem = Record<string, unknown>

export const GestionOperativoCatalogosService = {
    obtenerEstadosDroga(
        idTipoDroga: number
    ): Promise<RespuestaApi<CatalogoOperativoItem[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/estados-droga/${idTipoDroga}`,
        })
    },
}
