import { usePeticion } from '@/app/(fase_2)/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface Unidad {
  idUnidad: number
  abreviatura: string
  descripcion: string
  abreviaturaIcia: string
  es_operativa_admin: boolean
  abreviaturaReporte: string
  estado: string
}
const { sesionPeticion } = usePeticion()

export async function getUnities(): Promise<Unidad[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/unidad/allGeneral`,
    withCredentials: true,
  })

  return response
}
