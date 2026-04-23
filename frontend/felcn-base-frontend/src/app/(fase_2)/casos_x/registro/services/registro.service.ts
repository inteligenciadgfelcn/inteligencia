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
  Distrito,
  TipoDocumento,
  Unidad,
} from '../types/registro.types'
import { peticionFormatoMetodo } from '@/services/Servicios'
import { Constantes } from '@/config/Constantes'

type Fetcher = (params: peticionFormatoMetodo) => Promise<unknown>

const USE_FAKE_DATA = true

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

export async function getPaises(): Promise<Pais[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/pais/allGeneral`,
    withCredentials: true,
  })
  return response
}

export async function getTiposDocumentos(): Promise<TipoDocumento[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/tipo-documento`,
    withCredentials: true,
  })
  return response
}

export async function getEstadosPersona(): Promise<EstadoPersona[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/estado-sospechoso`,
    withCredentials: true,
  })
  return response
}
