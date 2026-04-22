import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface Unidad {
  id: number
  abreviatura: string
  descripcion: string
  abreviaturaIcia: string
  es_operativa_admin: boolean
  abreviaturaReporte: string
  estado: string
}

export async function getUnities(): Promise<Unidad[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/unidad/allGeneral`,
    withCredentials: true,
  })

  return response
}
