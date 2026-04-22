import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface EstadoCivil {
  idEstadoCivil: number
  descripcion: string
}


export async function getEstadosCiviles(): Promise<EstadoCivil[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/estado-civil`,
    withCredentials: true,
  })

  return response
}
