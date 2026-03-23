import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks'

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

const { sesionPeticion } = usePeticion()

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
