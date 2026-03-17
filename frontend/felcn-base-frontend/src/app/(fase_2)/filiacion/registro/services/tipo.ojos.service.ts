import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface TipoOjos {
  idTipoOjos: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getTiposOjos(): Promise<TipoOjos[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-ojos`,
    withCredentials: true,
  })

  return response
}
