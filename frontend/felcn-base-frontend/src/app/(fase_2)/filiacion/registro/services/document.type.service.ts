import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface TipoDocumento {
  idTipoDocumento: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getTiposDocumento(): Promise<TipoDocumento[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-documento`,
    withCredentials: true,
  })

  return response
}
