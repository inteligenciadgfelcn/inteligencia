import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  CatalogoLgi,
  DepartamentoLgi,
  DistritalLgi,
  GrupoLgi,
  TipoDocumentoLgi,
} from '../types/parametricas.types'

const BASE = `${Constantes.baseUrl}/parametricas-lgi`

export const ParametricasLgiApi = {
  listarDistritales(): Promise<DistritalLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allDistrito`,
      method: 'get',
      withCredentials: true,
    })
  },

  obtenerDistrital(id: number): Promise<DistritalLgi> {
    return sesionPeticion({
      url: `${BASE}/distrito/${id}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarGrupos(idDistrito: number): Promise<GrupoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/grupo/${idDistrito}`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarPaises(): Promise<CatalogoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allPais`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarDepartamentos(): Promise<DepartamentoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allDepartamento`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarSituacionesJuridicas(): Promise<CatalogoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allSituacionJuridica`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarEstadosCiviles(): Promise<CatalogoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allEstadoCivil`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarProfesiones(): Promise<CatalogoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allProfesion`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarTiposDocumento(): Promise<TipoDocumentoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allTipoDocumento`,
      method: 'get',
      withCredentials: true,
    })
  },
}
