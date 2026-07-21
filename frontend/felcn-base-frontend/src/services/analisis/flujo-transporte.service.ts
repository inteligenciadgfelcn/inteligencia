import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
    ColorSugeridoS2i,
    CreateFlujoTransportePayload,
    FlujoTransporteS2i,
    RespuestaApi,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const FlujoTransporteS2iService = {
    // Registra el flujo de transporte (viaje) vinculando conductor, transporte, lugar y color.
    crear(
        payload: CreateFlujoTransportePayload
    ): Promise<RespuestaApi<FlujoTransporteS2i>> {
        return sesionPeticion({
            url: `${BASE}/flujo-transporte`,
            method: 'POST',
            body: payload,
            withCredentials: true,
        })
    },

    // Sugiere los id_color evaluando parametricas.regla_color contra documento y/o placa
    // (acumula los colores de todas las reglas activas que apliquen).
    colorSugerido(
        documento?: string,
        placa?: string
    ): Promise<RespuestaApi<ColorSugeridoS2i>> {
        const params = new URLSearchParams()
        if (documento) params.set('documento', documento)
        if (placa) params.set('placa', placa)
        const query = params.toString()
        return sesionPeticion({
            url: `${BASE}/flujo-transporte/color-sugerido${query ? `?${query}` : ''}`,
            withCredentials: true,
        })
    },
}
