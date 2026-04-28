import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface ColorPiel {
  idColorPiel: number
  descripcion: string
}


export async function getColorPieles(): Promise<ColorPiel[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/color-piel`,
    withCredentials: true,
  })

  return response
}
