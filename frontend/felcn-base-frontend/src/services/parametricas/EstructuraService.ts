import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import type { Distrital, Grado, Grupo, RespuestaAPI, UnidadEstructura } from './types'

const BASE = `${Constantes.authUrl}/lookups`

export const EstructuraService = {
    obtenerGrados(): Promise<RespuestaAPI<Grado>> {
        return Servicios.get({ url: `${BASE}/grados` })
    },

    obtenerUnidades(): Promise<RespuestaAPI<UnidadEstructura>> {
        return Servicios.get({ url: `${BASE}/unidades` })
    },

    obtenerDistritales(idUnidad: number): Promise<RespuestaAPI<Distrital>> {
        return Servicios.get({ url: `${BASE}/distritales/unidad/${idUnidad}` })
    },

    obtenerGrupos(idDistrital: number): Promise<RespuestaAPI<Grupo>> {
        return Servicios.get({ url: `${BASE}/grupos/distrital/${idDistrital}` })
    },
}
