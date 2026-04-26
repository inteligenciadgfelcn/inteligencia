import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'

export interface CreateResponse {
  mensaje?: string
  servicio: Servicio
}

interface Servicio {
  codigoServicio: string
  usuarioPrincipal: string
  usuarioEmergencia: string
  fechaIngreso: Date
  fechaSalida: Date
  estado: string
}

export interface CreateServiceBody {
  usuarioPrincipal: string
  usuarioEmergencia: string
  fechaIngreso: string
  fechaSalida: string
}

export interface GenerateServiceBody {
  fechaIngreso: string
  fechaSalida: string
}


export async function postServicio(
  body: CreateServiceBody
): Promise<CreateResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/servicio`,
    method: 'POST',
    body: body,
    withCredentials: true,
  })

  if (response.mensaje) {
    return {
      mensaje: response.mensaje,
      servicio: response.servicio,
    }
  } else {
    return {
      servicio: response,
    }
  }
}

export async function postGenerarServicio(
  body: GenerateServiceBody
): Promise<string> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/servicio/generar-codigo-servicio`,
    method: 'GET',
    params: body,
    withCredentials: true,
  })

  return response
}
