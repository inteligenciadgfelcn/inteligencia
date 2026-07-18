import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
    CreateTransportePayload,
    RespuestaApi,
    TransporteS2i,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const TransporteS2iService = {
    // Busca el vehículo en felcn_vls y resuelve (busca o crea) el transporte en felcn_s2i.
    // 404 si el vehículo no existe en felcn_vls.
    buscarOResolver(placa: string): Promise<RespuestaApi<TransporteS2i>> {
        return sesionPeticion({
            url: `${BASE}/transporte/${placa}`,
            withCredentials: true,
        })
    },

    // Registra manualmente el transporte en felcn_s2i (sin tocar felcn_vls).
    crear(payload: CreateTransportePayload): Promise<RespuestaApi<TransporteS2i>> {
        return sesionPeticion({
            url: `${BASE}/transporte`,
            method: 'POST',
            body: payload,
            withCredentials: true,
        })
    },
}
