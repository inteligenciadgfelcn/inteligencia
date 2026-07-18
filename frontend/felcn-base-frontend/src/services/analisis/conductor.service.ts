import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
    ConductorS2i,
    CreateConductorPayload,
    RespuestaApi,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const ConductorS2iService = {
    // Busca la persona en felcn_personas y resuelve (busca o crea) el conductor en felcn_s2i.
    // 404 si la persona no existe en felcn_personas.
    buscarOResolver(documento: string): Promise<RespuestaApi<ConductorS2i>> {
        return sesionPeticion({
            url: `${BASE}/conductores/${documento}`,
            withCredentials: true,
        })
    },

    // Registra manualmente la persona en felcn_personas y resuelve el conductor.
    crear(payload: CreateConductorPayload): Promise<RespuestaApi<ConductorS2i>> {
        return sesionPeticion({
            url: `${BASE}/conductores`,
            method: 'POST',
            body: payload,
            withCredentials: true,
        })
    },
}
