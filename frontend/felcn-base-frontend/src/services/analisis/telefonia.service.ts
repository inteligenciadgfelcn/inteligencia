import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  CreateTelefonoPayload,
  RespuestaApi,
  TelefonoS2i,
} from './types'

const BASE = `${Constantes.baseUrl}/s2i`

export const TelefoniaS2iService = {
  // ── Teléfonos ──────────────────────────────────────────────────────────────

  crearTelefono(idCaso: string, payload: CreateTelefonoPayload): Promise<RespuestaApi<TelefonoS2i>> {
    return sesionPeticion({
      url: `${BASE}/casos/${idCaso}/telefonos`,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  listarTelefonos(idCaso: string): Promise<RespuestaApi<TelefonoS2i[]>> {
    return sesionPeticion({ url: `${BASE}/casos/${idCaso}/telefonos`, withCredentials: true })
  },

  eliminarTelefono(idTelefono: string): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE}/telefonos/${idTelefono}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },
}
