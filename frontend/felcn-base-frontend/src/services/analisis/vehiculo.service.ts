import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
    CreateVehiculoPayload,
    RespuestaApi,
    VehiculoS2i,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const VehiculoS2iService = {
    // ── Vehículos ──────────────────────────────────────────────────────────────

    crearVehiculo(idCaso: string, payload: CreateVehiculoPayload): Promise<RespuestaApi<VehiculoS2i>> {
        return sesionPeticion({
            url: `${BASE}/casos/${idCaso}/vehiculos`,
            method: 'POST',
            body: payload,
            withCredentials: true,
        })
    },

    listarVehiculos(idCaso: string): Promise<RespuestaApi<VehiculoS2i[]>> {
        return sesionPeticion({ url: `${BASE}/casos/${idCaso}/vehiculos`, withCredentials: true })
    },

    eliminarVehiculo(idVehiculo: string): Promise<RespuestaApi<unknown>> {
        return sesionPeticion({
            url: `${BASE}/vehiculos/${idVehiculo}`,
            method: 'DELETE',
            withCredentials: true,
        })
    },
}
