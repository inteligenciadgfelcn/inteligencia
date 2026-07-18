import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { CreateLugarPayload, LugarS2i, RespuestaApi } from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const LugarS2iService = {
    // Busca lugares por coincidencia parcial de descripción (mínimo 2 caracteres).
    buscar(q: string): Promise<RespuestaApi<LugarS2i[]>> {
        return sesionPeticion({
            url: `${BASE}/lugares?q=${encodeURIComponent(q)}`,
            withCredentials: true,
        })
    },

    // Registra un nuevo lugar (el backend reutiliza uno existente si la descripción ya está registrada).
    crear(payload: CreateLugarPayload): Promise<RespuestaApi<LugarS2i>> {
        return sesionPeticion({
            url: `${BASE}/lugares`,
            method: 'POST',
            body: payload,
            withCredentials: true,
        })
    },
}
