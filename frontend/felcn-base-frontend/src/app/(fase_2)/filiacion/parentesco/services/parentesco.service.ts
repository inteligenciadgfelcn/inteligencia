import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface Parentesco {
  idParentezco: number
  descripcion: string
  estado: string
}

export async function getParentescos(): Promise<Parentesco[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/parentezco/allGeneral`,
    withCredentials: true,
  })

  return response
}

export interface DatosFamiliaresPayload {
  idDetenido: number
  idParentezco: number
  nombres: string
  paterno: string
  materno: string
  edad: number | string
  direccion: string
  telefono: string
  vivo: boolean
  implicado: boolean
}

export interface DatosFamiliaresItem {
  idDatosFamiliares: number
  nombres: string
  paterno: string
  materno: string
  edad: string
  direccion: string
  telefono: string
  vivo: boolean
  implicado: boolean
  parentezco?: {
    descripcion: string
  }
}

export async function registerDatosFamiliares(
  payload: DatosFamiliaresPayload
): Promise<any> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/datos-familiares`,
    method: 'post',
    body: payload,
    withCredentials: true,
  })

  return response
}

export async function listDatosFamiliares(
  idDetenido: number
): Promise<DatosFamiliaresItem[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/datos-familiares/detenido`,
    params: { idDetenido },
    withCredentials: true,
  })

  return response
}
