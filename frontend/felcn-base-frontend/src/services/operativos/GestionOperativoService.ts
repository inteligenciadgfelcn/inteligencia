import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type {
    GestionOperativoCabecera,
    GestionOperativoCabeceraPayload,
    GestionOperativoResumen,
    RespuestaApi,
} from './types'

const BASE = `${Constantes.baseUrl}/gestion-operativo`

export const GestionOperativoService = {
    listar(): Promise<RespuestaApi<GestionOperativoResumen[]>> {
        return Servicios.get({ url: BASE })
    },

    obtenerPorId(id: number): Promise<RespuestaApi<GestionOperativoCabecera>> {
        return Servicios.get({ url: `${BASE}/${id}` })
    },

    crear(
        payload: GestionOperativoCabeceraPayload
    ): Promise<RespuestaApi<GestionOperativoCabecera>> {
        return Servicios.post({ url: BASE, body: payload })
    },

    actualizar(
        id: number,
        payload: GestionOperativoCabeceraPayload
    ): Promise<RespuestaApi<GestionOperativoCabecera>> {
        return Servicios.patch({ url: `${BASE}/${id}`, body: payload })
    },
}
