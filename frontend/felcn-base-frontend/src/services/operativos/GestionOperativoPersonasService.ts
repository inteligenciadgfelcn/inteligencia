import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { PersonaPayload, PersonaResponse, RespuestaApi, RespuestaApiPaginada } from './types'

const BASE = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: PersonaPayload): FormData => {
    const fd = new FormData()
    fd.append('nombres', payload.nombres)
    fd.append('apellidoPaterno', payload.apellidoPaterno)
    fd.append('apellidoMaterno', payload.apellidoMaterno)
    if (payload.apellidoCasada) fd.append('apellidoCasada', payload.apellidoCasada)
    fd.append('genero', String(payload.genero))          // "true" | "false"
    fd.append('idTipoDocumento', String(payload.idTipoDocumento))
    fd.append('nroDocumento', payload.nroDocumento)
    fd.append('fechaNacimiento', payload.fechaNacimiento)
    fd.append('direccion', payload.direccion)
    fd.append('estado', payload.estado)                  // string enum exacto
    if (payload.idPais != null) fd.append('idPais', String(payload.idPais))
    if (payload.fotoFrente) fd.append('fotoFrente', payload.fotoFrente)
    if (payload.fotoDocumento) fd.append('fotoDocumento', payload.fotoDocumento)
    if (payload.fotoPerfilIzquierdo) fd.append('fotoPerfilIzquierdo', payload.fotoPerfilIzquierdo)
    return fd
}

export const GestionOperativoPersonasService = {
    listar(
        idOperativo: number,
        pagina: number = 1,
        limite: number = 10,
    ): Promise<RespuestaApi<RespuestaApiPaginada<PersonaResponse>>> {
        return Servicios.get({
            url: `${BASE}/${idOperativo}/personas?pagina=${pagina}&limite=${limite}`,
        })
    },

    crear(
        idOperativo: number,
        payload: PersonaPayload,
    ): Promise<RespuestaApi<PersonaResponse>> {
        return Servicios.post({
            url: `${BASE}/${idOperativo}/personas`,
            body: buildFormData(payload),
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    eliminar(idOperativo: number, idPersona: number): Promise<RespuestaApi<unknown>> {
        return Servicios.delete({
            url: `${BASE}/${idOperativo}/personas/${idPersona}`,
        })
    },

    obtenerFoto(path: string): Promise<Blob> {
        const pathNormalizado = path.replace(/^\/api/, '')
        return Servicios.get<Blob>({
            url: `${Constantes.baseUrl}${pathNormalizado}`,
            responseType: 'blob',
        })
    },
}
