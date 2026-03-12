import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface ColorCabello {
  idColorCabello: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getColorCabellos(): Promise<ColorCabello[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/color-cabello`,
    withCredentials: true,
  })

  return response
}
