import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface TipoOjos {
  idTipoOjos: number
  descripcion: string
}


export async function getTiposOjos(): Promise<TipoOjos[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-ojos`,
    withCredentials: true,
  })

  return response
}
