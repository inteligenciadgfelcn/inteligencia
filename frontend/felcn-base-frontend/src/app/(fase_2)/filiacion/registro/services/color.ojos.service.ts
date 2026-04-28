import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface ColorOjo {
  idColorOjo: number
  descripcion: string
}


export async function getColorOjos(): Promise<ColorOjo[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/color-ojos`,
    withCredentials: true,
  })

  return response
}
