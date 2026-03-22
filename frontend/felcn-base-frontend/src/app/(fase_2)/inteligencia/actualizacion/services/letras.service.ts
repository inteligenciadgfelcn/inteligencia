import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks'

export interface LetraInicial {
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getIniciales(): Promise<LetraInicial[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/letra/allGeneral`,
    withCredentials: true,
  })

  return response
}
