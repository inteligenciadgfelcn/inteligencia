import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { OperativoPayload, RespuestaApi } from './types'


const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

// ── Tipos del endpoint GET /operativos/casos/usuario/:idUsuario ──────────────

export interface CasoResumen {
    idCaso: string
    numeroOperativo: string
    nombreCaso: string
    fiscalSolicitud: string
    telefonoSolicitud: string
    asignadoCaso: string
    telefonoAsignado: string
    fiscalAsignadoCaso: string
    telefonoFiscal: string
}



export interface CasoOperativoDetalle {
    caso: CasoResumen
    operativo: OperativoPayload | null
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
        idCaso: number,
        payload: OperativoPayload
    ): Promise<RespuestaApi<CasoOperativoDetalle>> {
        return Servicios.patch({
            url: `${BASE_OPERATIVOS}/caso/${idCaso}`,
            body: payload,
        })
    },
}
