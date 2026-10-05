import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import { RegistroCasoApi } from '../../registro_caso/api/registro-caso.api'
import type {
  RespuestaPaginadaDatos,
  PersonaImplicadaRow,
} from '../../registro_caso/types/registro-caso.types'
import type {
  BienCatalogo,
  BienSecuestradoRow,
  CalidadBien,
  CaracteristicaCatalogo,
  CaracteristicaPayload,
  ClaseBien,
  SituacionBienPayload,
  SituacionJuridicaBienPayload,
  TipoBien,
  TipoDocumento,
  TipoSituacionBien,
  TipoVinculo,
  Vinculo,
  VinculoBienPayload,
  VinculoBienRow,
} from '../types/bienes.types'

const BASE_BIENES = `${Constantes.baseUrl}/bienes-secuestrados`
const BASE_SITUACION = `${Constantes.baseUrl}/situacion-juridica-bien`
const BASE_SITUACION_BIEN = `${Constantes.baseUrl}/situacion-bien-lgi`
const BASE_CARACTERISTICAS = `${Constantes.baseUrl}/caracteristicas-bienes`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`
const BASE_VINCULO_BIEN = `${Constantes.baseUrl}/vinculo-bien-lgi`

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

  listarCaracteristicasClase(
    idClase: number
  ): Promise<CaracteristicaCatalogo[]> {
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
      url: `${BASE_PARAMETRICAS}/allTipoSituacionBien`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarSituacionBien(): Promise<CalidadBien[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allSituacionBien`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarTiposDocumento(): Promise<TipoDocumento[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allTipoDocumento`,
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
    const respuesta = await sesionPeticion<
      {
        datos?: BienSecuestradoRow
      } & Partial<BienSecuestradoRow>
    >({
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

  registrarSituacionBien(payload: SituacionBienPayload): Promise<unknown> {
    return sesionPeticion({
      url: BASE_SITUACION_BIEN,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  registrarCaracteristica(payload: CaracteristicaPayload): Promise<unknown> {
    return sesionPeticion({
      url: BASE_CARACTERISTICAS,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  listarVinculosBien(idItemBienSecuestrado: string): Promise<VinculoBienRow[]> {
    return sesionPeticion({
      url: `${BASE_VINCULO_BIEN}/bien/${idItemBienSecuestrado}`,
      method: 'get',
      withCredentials: true,
    })
  },

  crearVinculoBien(payload: VinculoBienPayload): Promise<VinculoBienRow> {
    return sesionPeticion({
      url: BASE_VINCULO_BIEN,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  listarPersonasImplicadas(
    casoId: number,
    params: { pagina: number; limite: number; filtro?: string }
  ): Promise<RespuestaPaginadaDatos<PersonaImplicadaRow>> {
    return RegistroCasoApi.listarPersonas(casoId, params)
  },

  eliminarBien(id: number): Promise<unknown> {
    return sesionPeticion({
      url: `${BASE_BIENES}/${id}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}
