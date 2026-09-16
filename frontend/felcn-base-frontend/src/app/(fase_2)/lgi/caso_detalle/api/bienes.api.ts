import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  BienCatalogo,
  BienSecuestradoRow,
  CalidadBien,
  CaracteristicaCatalogo,
  CaracteristicaPayload,
  ClaseBien,
  SituacionJuridicaBienPayload,
  TipoBien,
  TipoSituacionBien,
  TipoVinculo,
  Vinculo,
} from '../types/bienes.types'

const BASE_BIENES = `${Constantes.baseUrl}/bienes-secuestrados`
const BASE_SITUACION = `${Constantes.baseUrl}/situacion-juridica-bien`
const BASE_CARACTERISTICAS = `${Constantes.baseUrl}/caracteristicas-bienes`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

interface RespuestaPaginada<T> {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: T[] }
}

export const BienesApi = {
  listarBienes(): Promise<BienCatalogo[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allBienes`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarClasesBien(idBien: number): Promise<ClaseBien[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allClaseBien/${idBien}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarTiposClase(idClase: number): Promise<TipoBien[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allTipoClase/${idClase}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarCaracteristicasClase(idClase: number): Promise<CaracteristicaCatalogo[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allCaracteristicasClase/${idClase}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarVinculos(): Promise<Vinculo[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allVinculo`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarTiposVinculo(idVinculo: number): Promise<TipoVinculo[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/tipo/${idVinculo}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarTiposSituacionBien(): Promise<TipoSituacionBien[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allTipoSitucionBien`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarSituacionesLegalesBien(): Promise<CalidadBien[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allSituacionlegalBien`,
      method: 'get',
      withCredentials: true,
    })
  },

  async listarPorOperativo(
    opId: number,
    params: { pagina: number; limite: number; filtro?: string }
  ): Promise<{ total: number; filas: BienSecuestradoRow[] }> {
    const respuesta = await sesionPeticion<
      RespuestaPaginada<BienSecuestradoRow>
    >({
      url: `${BASE_BIENES}/operativo/${opId}`,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  async crearBien(formData: FormData): Promise<BienSecuestradoRow> {
    const respuesta = await sesionPeticion<{
      datos?: BienSecuestradoRow
    } & Partial<BienSecuestradoRow>>({
      url: BASE_BIENES,
      method: 'post',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
    return respuesta.datos ?? (respuesta as BienSecuestradoRow)
  },

  registrarSituacionJuridica(
    payload: SituacionJuridicaBienPayload
  ): Promise<unknown> {
    return sesionPeticion({
      url: BASE_SITUACION,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  registrarCaracteristica(
    payload: CaracteristicaPayload
  ): Promise<unknown> {
    return sesionPeticion({
      url: BASE_CARACTERISTICAS,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  eliminarBien(id: number): Promise<unknown> {
    return sesionPeticion({
      url: `${BASE_BIENES}/${id}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}