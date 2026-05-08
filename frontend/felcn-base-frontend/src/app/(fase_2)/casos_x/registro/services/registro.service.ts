import { sesionPeticion as defaultFetcher } from '@/utils/peticion'
import {
  CasoResumen,
  CategoriaOperativo,
  Departamento,
  EstadoPersona,
  Grupo,
  IdItemOperativo,
  Municipio,
  Pais,
  Provincia,
  Distrito,
  RegistroCompletoPayload,
  TipoDocumento,
  Unidad,
  Detenido,
} from '../types/registro.types'
import { peticionFormatoMetodo } from '@/services/Servicios'
import { Constantes } from '@/config/Constantes'
import { DataTableParams } from '@/services'

type Fetcher = (params: peticionFormatoMetodo) => Promise<unknown>

export const buscarCasoPorNumero = async (
  nroCaso: string
): Promise<CasoResumen> => {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/operativo/registro/${encodeURIComponent(nroCaso)}`,
    withCredentials: true,
  })
  return response
}

export async function getProvincias(
  codeDepartamento: string
): Promise<Provincia[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/provincia/departamento/${codeDepartamento}`,
    withCredentials: true,
  })
  return response
}

export async function getMunicipios(idProvincia: number): Promise<Municipio[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/localidad/provincia/${idProvincia}`,
    withCredentials: true,
  })
  return response
}

export async function getCategoriasOperativo(): Promise<CategoriaOperativo[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/categoria-operativo`,
    withCredentials: true,
  })
  return response
}

export async function getItemsCategoria(
  idCategoria: number
): Promise<IdItemOperativo[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/item-operativo/categoria/${idCategoria}`,
    withCredentials: true,
  })
  return response
}

export async function getUnidades(): Promise<Unidad[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/unidad/allGeneral`,
    withCredentials: true,
  })
  return response
}

export async function getDistritos(idUnidad: number): Promise<Distrito[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/distrito/unidad/${idUnidad}`,
    withCredentials: true,
  })
  return response
}

export async function getGrupos(idDistrito: number): Promise<Grupo[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/grupo-sospechoso/distrital/${idDistrito}`,
    withCredentials: true,
  })
  return response
}

export async function getPaises(): Promise<Pais[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/pais/allGeneral`,
    withCredentials: true,
  })
  return response
}

export async function getTiposDocumentos(): Promise<TipoDocumento[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/tipo-documento`,
    withCredentials: true,
  })
  return response
}

export async function getEstadosPersona(): Promise<EstadoPersona[]> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/estado-sospechoso`,
    withCredentials: true,
  })
  return response
}

export async function getDetenidos(
  params: DataTableParams
): Promise<DetenidosResponse> {
  const response = await defaultFetcher({
    url: `${Constantes.baseUrl}/detenido`,
    params: params,
    withCredentials: true,
  })
  return response
}

export async function obtenerCatalogoGeografico(
  fetcher: Fetcher = defaultFetcher
): Promise<{ departamentos: Departamento[]; provincias: Provincia[]; municipios: Municipio[] }> {
  const [departamentos, provincias, municipios] = await Promise.all([
    fetcher({ url: `${Constantes.baseUrl}/departamento/all/pais`, withCredentials: true }) as Promise<Departamento[]>,
    fetcher({ url: `${Constantes.baseUrl}/provincia/allGeneral`, withCredentials: true }) as Promise<Provincia[]>,
    fetcher({ url: `${Constantes.baseUrl}/localidad/allGeneral`, withCredentials: true }) as Promise<Municipio[]>,
  ])
  return { departamentos, provincias, municipios }
}

export async function obtenerCatalogoPersona(
  fetcher: Fetcher = defaultFetcher
): Promise<{ paises: Pais[]; tiposDocumento: TipoDocumento[]; estados: EstadoPersona[] }> {
  const [paises, tiposDocumento, estados] = await Promise.all([
    fetcher({ url: `${Constantes.baseUrl}/pais/allGeneral`, withCredentials: true }) as Promise<Pais[]>,
    fetcher({ url: `${Constantes.baseUrl}/tipo-documento`, withCredentials: true }) as Promise<TipoDocumento[]>,
    fetcher({ url: `${Constantes.baseUrl}/estado-sospechoso`, withCredentials: true }) as Promise<EstadoPersona[]>,
  ])
  return { paises, tiposDocumento, estados }
}

export async function guardarRegistroOperativo(
  payload: RegistroCompletoPayload,
  fetcher: Fetcher = defaultFetcher
): Promise<unknown> {
  const response = await fetcher({
    url: `${Constantes.baseUrl}/operativo`,
    method: 'post',
    body: payload,
    withCredentials: true,
  })
  return response
}

export interface DetenidosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: Detenido[]
  }
}
