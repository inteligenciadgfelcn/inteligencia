import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  PersonaJuridicaRow,
  SituacionJuridicaEmpresaPayload,
  TipoSituacionJuridicaEmpresa,
  TipoVinculo,
  Vinculo,
} from '../types/personas-juridicas.types'

const BASE_PJ = `${Constantes.baseUrl}/personas-juridicas`
const BASE_SIT_EMP = `${Constantes.baseUrl}/situacion-juridica-empresa`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

interface RespuestaPaginada<T> {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: T[] }
}

export const PersonasJuridicasApi = {
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

  listarTiposSituacionJuridicaEmpresa(): Promise<
    TipoSituacionJuridicaEmpresa[]
  > {
    return sesionPeticion({
      url: `${BASE_SIT_EMP}/tipos`,
      method: 'get',
      withCredentials: true,
    })
  },

  async listarPorOperativo(
    opId: number,
    params: { pagina: number; limite: number; filtro?: string }
  ): Promise<{ total: number; filas: PersonaJuridicaRow[] }> {
    const respuesta = await sesionPeticion<
      RespuestaPaginada<PersonaJuridicaRow>
    >({
      url: `${BASE_PJ}/operativo/${opId}`,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  async crearPersonaJuridica(
    formData: FormData
  ): Promise<PersonaJuridicaRow> {
    const respuesta = await sesionPeticion<
      { datos?: PersonaJuridicaRow } & Partial<PersonaJuridicaRow>
    >({
      url: BASE_PJ,
      method: 'post',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
    return respuesta.datos ?? (respuesta as PersonaJuridicaRow)
  },

  async actualizarPersonaJuridica(
    empId: number,
    formData: FormData
  ): Promise<PersonaJuridicaRow> {
    const respuesta = await sesionPeticion<
      { datos?: PersonaJuridicaRow } & Partial<PersonaJuridicaRow>
    >({
      url: `${BASE_PJ}/${empId}`,
      method: 'patch',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
    return respuesta.datos ?? (respuesta as PersonaJuridicaRow)
  },

  eliminarPersonaJuridica(empId: number): Promise<unknown> {
    return sesionPeticion({
      url: `${BASE_PJ}/${empId}`,
      method: 'delete',
      withCredentials: true,
    })
  },

  registrarSituacionJuridicaEmpresa(
    payload: SituacionJuridicaEmpresaPayload
  ): Promise<unknown> {
    return sesionPeticion({
      url: BASE_SIT_EMP,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },
}