import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface ColorCabello {
  idColorCabello: number
  descripcion: string
}


export async function getColorCabellos(): Promise<ColorCabello[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/color-cabello`,
    withCredentials: true,
  })

  return response
}
