import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface ConstitucionCorporal {
  idConstitucionCorporal: number
  descripcion: string
}


export async function getConstitucionesCorporales(): Promise<
  ConstitucionCorporal[]
> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/constitucion-corporal`,
    withCredentials: true,
  })

  return response
}
