import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface TipoNariz {
  idTipoNariz: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getTiposNariz(): Promise<TipoNariz[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-nariz`,
    withCredentials: true,
  })

  return response
}
