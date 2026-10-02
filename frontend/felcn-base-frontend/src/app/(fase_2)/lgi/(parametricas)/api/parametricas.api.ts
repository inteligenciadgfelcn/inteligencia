import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  CatalogoLgi,
  DepartamentoLgi,
  DistritalLgi,
  EstadoCivilLgi,
  GrupoLgi,
  InicioCasoLgi,
  PaisLgi,
  ProfesionLgi,
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

  async listarPaises(): Promise<PaisLgi[]> {
    const respuesta = await sesionPeticion<any
      // finalizado: boolean
      // datos?: Array<{ id: number | string; descripcion: string }>
      // datos?: Array<any>
    >({
      url: `${Constantes.baseUrl}/pais/allGeneral`,
      method: 'get',
      withCredentials: true,
    })

    console.log(respuesta[0]);
    

    return (respuesta ?? []).map((pais) => ({
      idPais: String(pais.idPais),
      cont_id: '',
      descripcion: pais.descripcion,
    }))
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

  listarEstadosCiviles(): Promise<EstadoCivilLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allEstadoCivil`,
      method: 'get',
      withCredentials: true,
    })
  },

  listarProfesiones(): Promise<ProfesionLgi[]> {
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

  listarIniciosCaso(): Promise<InicioCasoLgi[]> {
    return sesionPeticion({
      url: `${BASE}/allIncioCaso`,
      method: 'get',
      withCredentials: true,
    })
  },
}
