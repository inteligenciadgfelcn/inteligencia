import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface Profesion {
  idProfesion: string
  descripcion: string
  ocupaProfesion: boolean
}


export async function getProfesiones(): Promise<Profesion[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/profesion`,
    withCredentials: true,
  })

  return response
}
