import { usePeticion } from '@/hooks'
import {
  CasoResumen,
  CategoriaOperativo,
  EstadoPersona,
  Grupo,
  IdItemOperativo,
  Municipio,
  Pais,
  Provincia,
  RegistroCompletoPayload,
  RegistroResponse,
  Distrito,
  TipoDocumento,
  Unidad,
} from '../types/registro.types'
import { peticionFormatoMetodo } from '@/services/Servicios'
import { Constantes } from '@/config/Constantes'

type Fetcher = (params: peticionFormatoMetodo) => Promise<unknown>

const USE_FAKE_DATA = true

const paisesFake: Pais[] = [
  { id: 1, descripcion: 'BOLIVIA' },
  { id: 2, descripcion: 'PERU' },
  { id: 3, descripcion: 'ARGENTINA' },
]

const tiposDocumentoFake: TipoDocumento[] = [
  { id: 1, descripcion: 'CEDULA DE IDENTIDAD' },
  { id: 2, descripcion: 'PASAPORTE' },
  { id: 3, descripcion: 'LICENCIA DE CONDUCIR' },
]

const estadosFake: EstadoPersona[] = [
  { id: 1, descripcion: 'APREHENDIDO' },
  { id: 2, descripcion: 'INVESTIGADO' },
  { id: 3, descripcion: 'LIBERADO' },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const { sesionPeticion } = usePeticion()

export const buscarCasoPorNumero = async (
  nroCaso: string
): Promise<CasoResumen> => {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/operativo/registro/${encodeURIComponent(nroCaso)}`,
    withCredentials: true,
  })
  return response
}

export async function getProvincias(
  codeDepartamento: string
): Promise<Provincia[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/provincia/departamento/${codeDepartamento}`,
    withCredentials: true,
  })
  return response
}

export async function getMunicipios(idProvincia: number): Promise<Municipio[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/localidad/provincia/${idProvincia}`,
    withCredentials: true,
  })
  return response
}

export async function getCategoriasOperativo(): Promise<CategoriaOperativo[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/categoria-operativo`,
    withCredentials: true,
  })
  return response
}

export async function getItemsCategoria(
  idCategoria: number
): Promise<IdItemOperativo[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/item-operativo/categoria/${idCategoria}`,
    withCredentials: true,
  })
  return response
}

export async function getUnidades(): Promise<Unidad[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/unidad/allGeneral`,
    withCredentials: true,
  })
  return response
}

export async function getDistritos(idUnidad: number): Promise<Distrito[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/distrito/unidad/${idUnidad}`,
    withCredentials: true,
  })
  return response
}

export async function getGrupos(idDistrito: number): Promise<Grupo[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/grupo-sospechoso/distrital/${idDistrito}`,
    withCredentials: true,
  })
  return response
}

export const obtenerCatalogoPersona = async (sesionPeticion?: Fetcher) => {
  if (USE_FAKE_DATA || !sesionPeticion) {
    await sleep(200)
    return {
      paises: paisesFake,
      tiposDocumento: tiposDocumentoFake,
      estados: estadosFake,
    }
  }

  const response = await sesionPeticion({
    url: '/api/catalogos/persona',
    method: 'get',
  })

  return response as {
    paises: Pais[]
    tiposDocumento: TipoDocumento[]
    estados: EstadoPersona[]
  }
}

export const guardarRegistroOperativo = async (
  payload: RegistroCompletoPayload,
  sesionPeticion?: Fetcher
): Promise<RegistroResponse> => {
  if (USE_FAKE_DATA || !sesionPeticion) {
    await sleep(350)
    return {
      idRegistro: `REG-${Date.now()}`,
      mensaje: `Registro guardado para ${payload.nroCaso}`,
    }
  }

  const response = await sesionPeticion({
    url: '/api/registro-operativo',
    method: 'post',
    body: payload,
  })

  return response as RegistroResponse
}
