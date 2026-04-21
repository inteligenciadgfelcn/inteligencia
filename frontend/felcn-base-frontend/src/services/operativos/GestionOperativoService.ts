import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  GestionOperativoCabecera,
  GestionOperativoCabeceraPayload,
  GestionOperativoResumen,
  RespuestaApi,
} from './types'
import type { GestionOperativoItem } from '@/app/operaciones/operativo/gestion-operativo/types'

const { sesionPeticion } = usePeticion()

const BASE = `${Constantes.baseUrl}/gestion-operativo`
const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoService = {
  listar(): Promise<RespuestaApi<GestionOperativoResumen[]>> {
    return sesionPeticion({ url: BASE, withCredentials: true })
  },

  obtenerPorId(id: number): Promise<RespuestaApi<GestionOperativoCabecera>> {
    return sesionPeticion({ url: `${BASE}/${id}`, withCredentials: true })
  },

  crear(
    payload: GestionOperativoCabeceraPayload,
  ): Promise<RespuestaApi<GestionOperativoCabecera>> {
    return sesionPeticion({
      url: BASE,
      method: 'POST',
      body: payload,
      withCredentials: true,
    })
  },

  actualizar(
    id: number,
    payload: GestionOperativoCabeceraPayload,
  ): Promise<RespuestaApi<GestionOperativoCabecera>> {
    return sesionPeticion({
      url: `${BASE}/${id}`,
      method: 'PATCH',
      body: payload,
      withCredentials: true,
    })
  },

  listarNoAprobadosPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos/no-aprobados`,
      withCredentials: true,
    })
  },

  listarAprobadosPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos`,
      withCredentials: true,
    })
  },
}
