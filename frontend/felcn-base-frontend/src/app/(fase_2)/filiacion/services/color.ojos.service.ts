import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface ColorOjo {
  idColorOjo: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getColorOjos(): Promise<ColorOjo[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/color-ojos`,
    withCredentials: true,
  })

  return response
}
