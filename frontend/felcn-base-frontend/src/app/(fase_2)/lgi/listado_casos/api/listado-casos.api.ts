import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  ListadoCasosParams,
  ListadoCasosResponse,
} from '../types/listado-casos.types'

const BASE = `${Constantes.baseUrl}/asignacion-lgi`

interface RespuestaListado {
  finalizado: boolean
  mensaje: string
  datos: ListadoCasosResponse
}

export const ListadoCasosApi = {
  async listarCasos(params: ListadoCasosParams): Promise<ListadoCasosResponse> {
    const respuesta = await sesionPeticion<RespuestaListado>({
      url: BASE,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  eliminarCaso(id: string | number): Promise<string> {
    return sesionPeticion<string>({
      url: `${BASE}/${id}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}
