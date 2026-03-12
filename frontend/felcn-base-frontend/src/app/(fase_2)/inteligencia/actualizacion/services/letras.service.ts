import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks'

export interface LetraInicial {
  idLetra: number
  letra: string
}

const { sesionPeticion } = usePeticion()

export async function getIniciales(): Promise<LetraInicial[]> {
  //   const response = await sesionPeticion({
  //     url: `${Constantes.baseUrl}/departamento/all/pais`,
  //     withCredentials: true,
  //   })

  //   return response
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { idLetra: 1, letra: 'A' },
    { idLetra: 2, letra: 'B' },
    { idLetra: 3, letra: 'C' },
    { idLetra: 4, letra: 'D' },
  ]
}
