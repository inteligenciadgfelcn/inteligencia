import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface ColorPiel {
  idColorPiel: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getColorPieles(): Promise<ColorPiel[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/color-piel`,
    withCredentials: true,
  })

  return response
}
