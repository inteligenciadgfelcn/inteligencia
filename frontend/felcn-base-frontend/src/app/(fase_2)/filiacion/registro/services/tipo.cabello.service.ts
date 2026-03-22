import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface TipoCabello {
  idTipoCabello: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getTiposCabello(): Promise<TipoCabello[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-cabello`,
    withCredentials: true,
  })

  return response
}
