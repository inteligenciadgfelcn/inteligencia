import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'
import { Distrital } from './distrital.service'

export interface Grupo {
  id: number
  descripcion: string
  estado: string
  distrital: Partial<Distrital>
}


export async function getGroups(idDistrito: number): Promise<Grupo[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/grupos/all/distrito`,
    params: { idDistrito: idDistrito },
    withCredentials: true,
  })

  return response
}
