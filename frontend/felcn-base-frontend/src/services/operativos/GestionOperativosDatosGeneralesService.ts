import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { CasoResumen, OperativoPayload, OperativoResponse, RespuestaApi } from './types'


const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

// ── Tipos del endpoint GET /operativos/casos/usuario/:idUsuario ──────────────





export interface CasoOperativoDetalle {
    caso: CasoResumen
    operativos: OperativoResponse[]
}

// ── Servicio ─────────────────────────────────────────────────────────────────

export const GestionOperativosDatosGeneralesService = {

    obtenerPorUsuario(
        idUsuario: number
    ): Promise<RespuestaApi<CasoOperativoDetalle>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/caso/${idUsuario}`,
        })
    },

    crearOperativo(
        idCaso: number,
        payload: OperativoPayload
    ): Promise<RespuestaApi<CasoOperativoDetalle>> {
        return Servicios.post({
            url: `${BASE_OPERATIVOS}/caso/${idCaso}`,
            body: payload,
        })
    },
    actualizarOperativo(
        idOperativo: number,
        payload: OperativoPayload
    ): Promise<RespuestaApi<CasoOperativoDetalle>> {
        return Servicios.patch({
            url: `${BASE_OPERATIVOS}/${idOperativo}`,
            body: payload,
        })
    },
}
