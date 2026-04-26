import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface TipoDocumento {
  idTipoDocumento: number
  descripcion: string
}


export async function getTiposDocumento(): Promise<TipoDocumento[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-documento`,
    withCredentials: true,
  })

  return response
}
