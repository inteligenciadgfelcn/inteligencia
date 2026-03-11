import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi, SeccionPayload } from './types'

const BASE = `${Constantes.baseUrl}/gestion-operativo`

export const GestionOperativoSeccion4Service = {
    obtener(idGestionOperativo: number): Promise<RespuestaApi<SeccionPayload>> {
        return Servicios.get({ url: `${BASE}/${idGestionOperativo}/seccion-4` })
    },

    guardar(
        idGestionOperativo: number,
        payload: SeccionPayload
    ): Promise<RespuestaApi<SeccionPayload>> {
        return Servicios.post({
            url: `${BASE}/${idGestionOperativo}/seccion-4`,
            body: payload,
        })
    },
}
