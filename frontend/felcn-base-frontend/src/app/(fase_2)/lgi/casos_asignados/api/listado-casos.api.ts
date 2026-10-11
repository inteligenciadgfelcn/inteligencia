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
      url: `${BASE}/caso/investigador`,
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

  exportarCasoIntegral(idCaso: number): Promise<Blob> {
    return sesionPeticion<Blob>({
      url: `${Constantes.baseUrl}/reportes-lgi/export/pdf/caso-integral/${idCaso}`,
      method: 'get',
      responseType: 'blob',
      headers: { accept: 'application/pdf' },
      withCredentials: true,
    })
  },
}
