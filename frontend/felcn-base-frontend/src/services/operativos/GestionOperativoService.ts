import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type {
    GestionOperativoCabecera,
    GestionOperativoCabeceraPayload,
    GestionOperativoResumen,
    RespuestaApi,
} from './types'
import type { GestionOperativoItem } from '@/app/operaciones/operativo/gestion-operativo/types'

const BASE = `${Constantes.baseUrl}/gestion-operativo`
const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

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

    listarNoAprobadosPorUsuario(
        usuario: string
    ): Promise<RespuestaApi<GestionOperativoItem[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/casos/no-aprobados/usuario/${usuario}`,
        })
    },

    listarAprobadosPorUsuario(
        usuario: string
    ): Promise<RespuestaApi<GestionOperativoItem[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/casos/usuario/${usuario}`,
        })
    },
}
