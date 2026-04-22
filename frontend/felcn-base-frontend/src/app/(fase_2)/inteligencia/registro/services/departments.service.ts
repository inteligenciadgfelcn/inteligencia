import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface Departamento {
  idDepartamento: number
  abreviatura: string
  descripcion: string
  estado: string
}


export async function getDepartments(): Promise<Departamento[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/departamento/all/pais`,
    withCredentials: true,
  })

  return response
}
