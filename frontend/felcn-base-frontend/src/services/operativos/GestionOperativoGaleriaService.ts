import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { GaleriaPayload, GaleriaResponse, RespuestaApi, RespuestaApiPaginada } from './types'

const BASE = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: GaleriaPayload): FormData => {
    const fd = new FormData()
    fd.append('descripcion', payload.descripcion)
    fd.append('idTipoTamano', String(payload.idTipoTamano))
    if (payload.foto) fd.append('foto', payload.foto)
    return fd
}

export const GestionOperativoGaleriaService = {
    listar(
        idOperativo: number,
        pagina: number = 1,
        limite: number = 10
    ): Promise<RespuestaApi<RespuestaApiPaginada<GaleriaResponse>>> {
        return Servicios.get({
            url: `${BASE}/${idOperativo}/galeria?pagina=${pagina}&limite=${limite}`,
        })
    },

    crear(
        idOperativo: number,
        payload: GaleriaPayload
    ): Promise<RespuestaApi<GaleriaResponse>> {
        return Servicios.post({
            url: `${BASE}/${idOperativo}/galeria`,
            body: buildFormData(payload),
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    eliminar(idOperativo: number, idGaleria: number): Promise<RespuestaApi<unknown>> {
        return Servicios.delete({
            url: `${BASE}/${idOperativo}/galeria/${idGaleria}`,
        })
    },

    obtenerFoto(path: string): Promise<Blob> {
        if (!path) return Promise.reject(new Error('Path no proporcionado'))
        const pathNormalizado = path.replace(/^\/api/, '')
        return Servicios.get<Blob>({
            url: `${Constantes.baseUrl}${pathNormalizado}`,
            responseType: 'blob',
        })
    },
}
