import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import {
  AntecedentesResponse,
  AntecedentesSearchParams,
} from '../types/antecedentes.types'

const { sesionPeticion } = usePeticion()

export async function getAntecedentes(
  searchParams: AntecedentesSearchParams
): Promise<AntecedentesResponse> {
  const params: AntecedentesSearchParams = {}

  if (searchParams.ci?.trim()) {
    params.ci = searchParams.ci.trim()
  }

  if (searchParams.nombre?.trim()) {
    params.nombre = searchParams.nombre.trim()
  }

  if (searchParams.apellidoPaterno?.trim()) {
    params.apellidoPaterno = searchParams.apellidoPaterno.trim()
  }

  if (searchParams.apellidoMaterno?.trim()) {
    params.apellidoMaterno = searchParams.apellidoMaterno.trim()
  }

  const response = await sesionPeticion<AntecedentesResponse>({
    url: `${Constantes.baseUrl}/operativo/antecedentes`,
    params,
    withCredentials: true,
  })

  return response
}
