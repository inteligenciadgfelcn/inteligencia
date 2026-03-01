import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import type { Distrital, Grupo, RespuestaAPI, UnidadEstructura } from './types'

const BASE = `${Constantes.baseUrl}/api/estructura`

/**
 * Servicio para los lookups de la Estructura Organizacional.
 *
 * Endpoints cubiertos:
 *  - GET /api/estructura/unidades
 *  - GET /api/estructura/distritales/unidad/:idUnidad
 *  - GET /api/estructura/grupos/distrital/:idDistrital
 */
export const EstructuraService = {
    /** Obtiene todas las unidades de la estructura organizacional */
    obtenerUnidades(): Promise<RespuestaAPI<UnidadEstructura>> {
        return Servicios.get({ url: `${BASE}/unidades` })
    },

    /**
     * Obtiene los distritales de una unidad.
     * @param idUnidad ID de la unidad
     */
    obtenerDistritales(idUnidad: number): Promise<RespuestaAPI<Distrital>> {
        return Servicios.get({ url: `${BASE}/distritales/unidad/${idUnidad}` })
    },

    /**
     * Obtiene los grupos de un distrital.
     * @param idDistrital ID del distrital
     */
    obtenerGrupos(idDistrital: number): Promise<RespuestaAPI<Grupo>> {
        return Servicios.get({ url: `${BASE}/grupos/distrital/${idDistrital}` })
    },
}
