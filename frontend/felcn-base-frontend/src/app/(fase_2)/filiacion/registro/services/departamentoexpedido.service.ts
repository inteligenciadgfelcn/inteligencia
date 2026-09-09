import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface DepartamentoExpedido {
  idDepartamento: number
  abreviatura: string
}

export async function getDeptExpedidos(): Promise<DepartamentoExpedido[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/departamento/allExtension`,
    withCredentials: true,
  })

  return response
}
