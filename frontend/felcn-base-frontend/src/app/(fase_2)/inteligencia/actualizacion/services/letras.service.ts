import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

export interface LetraInicial {
  descripcion: string
}


export async function getIniciales(): Promise<LetraInicial[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/letra/allGeneral`,
    withCredentials: true,
  })

  return response
}
