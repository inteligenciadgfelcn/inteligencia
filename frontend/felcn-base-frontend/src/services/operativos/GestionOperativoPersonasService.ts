import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  PersonaPayload,
  PersonaResponse,
  RespuestaApi,
  RespuestaApiPaginada,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: PersonaPayload): FormData => {
  const fd = new FormData()
  fd.append('nombres', payload.nombres)
  fd.append('apellidoPaterno', payload.apellidoPaterno)
  fd.append('apellidoMaterno', payload.apellidoMaterno)
  if (payload.apellidoCasada)
    fd.append('apellidoCasada', payload.apellidoCasada)
  fd.append('genero', String(payload.genero)) // "true" | "false"
  fd.append('idTipoDocumento', String(payload.idTipoDocumento))
  fd.append('nroDocumento', payload.nroDocumento)
  fd.append('fechaNacimiento', payload.fechaNacimiento)
  fd.append('direccion', payload.direccion)
  fd.append('estado', payload.estado) // string enum exacto
  if (payload.idPais != null) fd.append('idPais', String(payload.idPais))
  if (payload.fotoFrente) fd.append('fotoFrente', payload.fotoFrente)
  if (payload.fotoDocumento) fd.append('fotoDocumento', payload.fotoDocumento)
  if (payload.fotoPerfilIzquierdo)
    fd.append('fotoPerfilIzquierdo', payload.fotoPerfilIzquierdo)
  return fd
}

export const GestionOperativoPersonasService = {
  listar(
    idOperativo: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<PersonaResponse>>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/personas?pagina=${pagina}&limite=${limite}`,
      withCredentials: true,
    })
  },

  crear(
    idOperativo: number,
    payload: PersonaPayload
  ): Promise<RespuestaApi<PersonaResponse>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/personas`,
      method: 'POST',
      body: buildFormData(payload),
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
  },

  eliminar(
    idOperativo: number,
    idPersona: number
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/${idOperativo}/personas/${idPersona}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  obtenerFoto(path: string): Promise<Blob> {
    const pathNormalizado = path.replace(/^\/api/, '')
    return sesionPeticion<Blob>({
      url: `${Constantes.baseUrl}${pathNormalizado}`,
      responseType: 'blob',
      withCredentials: true,
    })
  },
}
