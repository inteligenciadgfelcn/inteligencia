import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface NombresSupuestosPayload {
  idDetenido: number
  nombres: string
  paterno: string
  materno: string
  apellidoEsposo: string
}

export interface NombresSupuestosItem {
  idNombresSupuestos: number
  nombres: string
  paterno: string
  materno: string
  apellidoEsposo: string
}

export async function registerNombresSupuestos(
  payload: NombresSupuestosPayload
): Promise<any> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/nombres-supuestos`,
    method: 'post',
    body: payload,
    withCredentials: true,
  })

  return response
}

export async function listNombresSupuestos(
  idDetenido: number
): Promise<NombresSupuestosItem[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/nombres-supuestos/detenido`,
    params: { idDetenido },
    withCredentials: true,
  })

  return response
}
