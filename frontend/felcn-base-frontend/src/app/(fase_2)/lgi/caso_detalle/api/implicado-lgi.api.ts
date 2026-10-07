import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type {
  ImplicadoPayload,
  ImplicadoRow,
  TipoDocumentoLgi,
  TipoImplicado,
} from '../types/implicado-lgi.types'

const BASE_IMPLICADO = `${Constantes.baseUrl}/implicado-lgi`
const BASE_PARAMETRICAS = `${Constantes.baseUrl}/parametricas-lgi`

export const ImplicadoLgiApi = {
  listarTiposImplicado(): Promise<TipoImplicado[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allTipoImplicado`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarTiposDocumento(): Promise<TipoDocumentoLgi[]> {
    return sesionPeticion({
      url: `${BASE_PARAMETRICAS}/allTipoDocumento`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarPorOperativoYEmpresa(
    operativoId: number | string,
    empresaId: number | string
  ): Promise<ImplicadoRow[]> {
    return sesionPeticion({
      url: BASE_IMPLICADO,
      method: 'get',
      params: {
        operativoId: String(operativoId),
        empresaId: String(empresaId),
      },
      withCredentials: true,
    })
  },

  listarPorOperativo(operativoId: number | string): Promise<ImplicadoRow[]> {
    return sesionPeticion({
      url: `${BASE_IMPLICADO}/operativo/${operativoId}`,
      method: 'get',
      withCredentials: true,
    })
  },

  crearImplicado(payload: ImplicadoPayload): Promise<ImplicadoRow> {
    return sesionPeticion({
      url: BASE_IMPLICADO,
      method: 'post',
      body: payload,
      withCredentials: true,
    })
  },

  actualizarImplicado(
    id: string | number,
    payload: Partial<ImplicadoPayload>
  ): Promise<ImplicadoRow> {
    return sesionPeticion({
      url: `${BASE_IMPLICADO}/${id}`,
      method: 'patch',
      body: payload,
      withCredentials: true,
    })
  },

  eliminarImplicado(id: string | number): Promise<unknown> {
    return sesionPeticion({
      url: `${BASE_IMPLICADO}/${id}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}
