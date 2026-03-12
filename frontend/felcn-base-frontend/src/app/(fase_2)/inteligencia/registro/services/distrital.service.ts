import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'
import { Unidad } from './unities.service'

export interface Distrital {
  idDistrital: number
  descripcion: string
  estado: string
  unidad: Unidad
}
const { sesionPeticion } = usePeticion()

export async function getDistritales(idUnity: number): Promise<Distrital[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/distrital/all/unidad`,
    params: { idUnidad: idUnity },
    withCredentials: true,
  })
  return response
}
