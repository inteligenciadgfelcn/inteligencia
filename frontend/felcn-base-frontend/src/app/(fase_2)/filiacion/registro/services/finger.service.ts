import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

export interface RegisterFingerBody {
  personaId: string
  imagen: string
  calidad: number
  dedo: string
}

export interface RegistroFiliacionResponse {
  ok: boolean
  ruta: string
}


export async function postRegistroHuella(
  body: RegisterFingerBody
): Promise<RegistroFiliacionResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/huellas/guardar`,
    method: 'POST',
    body,
    withCredentials: true,
  })

  return response
}
