import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface EstadoCivil {
  idEstadoCivil: number
  descripcion: string
}

const { sesionPeticion } = usePeticion()

export async function getEstadosCiviles(): Promise<EstadoCivil[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/estado-civil`,
    withCredentials: true,
  })

  return response
}
