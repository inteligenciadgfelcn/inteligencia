import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  Continente,
  Departamento,
  Localidad,
  LookupBasico,
  Pais,
  PlanOperacion,
  Provincia,
  RespuestaAPI,
} from './types'

const BASE = `${Constantes.baseUrl}/siii-lookups`
const BASE_OPERATIVO = `${Constantes.baseUrl}/operativos`
type LookupGenerico = Record<string, unknown>

/**
 * Servicio para los lookups del módulo SIII.
 */
export const SiiiLookupsService = {
  /** Obtiene todos los continentes */
  obtenerContinentes(): Promise<RespuestaAPI<Continente>> {
    return sesionPeticion({ url: `${BASE}/continentes`, withCredentials: true })
  },

  /** Obtiene todos los paises */
  obtenerPaises(): Promise<RespuestaAPI<Pais>> {
    return sesionPeticion({ url: `${BASE}/paises`, withCredentials: true })
  },

  obtenerPaisesPorContinente(
    idContinente: number
  ): Promise<RespuestaAPI<Pais>> {
    return sesionPeticion({ url: `${BASE}/paises/continente/${idContinente}`, withCredentials: true })
  },

  /** Obtiene los paises de destino */
  obtenerPaisesDestino(): Promise<RespuestaAPI<Pais>> {
    return sesionPeticion({ url: `${BASE}/paises-destino`, withCredentials: true })
  },

  /** Obtiene todos los departamentos (incluye datos del país) */
  obtenerDepartamentos(): Promise<RespuestaAPI<Departamento>> {
    return sesionPeticion({ url: `${BASE}/departamentos`, withCredentials: true })
  },

  obtenerDepartamentosPorPais(
    idPais: number
  ): Promise<RespuestaAPI<Departamento>> {
    return sesionPeticion({ url: `${BASE}/departamentos/pais/${idPais}`, withCredentials: true })
  },

  /** Obtiene todas las provincias */
  obtenerTodasLasProvincias(): Promise<RespuestaAPI<Provincia>> {
    return sesionPeticion({ url: `${BASE}/provincias`, withCredentials: true })
  },

  obtenerProvincias(idDepartamento: number): Promise<RespuestaAPI<Provincia>> {
    return sesionPeticion({
      url: `${BASE}/provincias/departamento/${idDepartamento}`,
      withCredentials: true,
    })
  },

  /** Obtiene todas las localidades */
  obtenerTodasLasLocalidades(): Promise<RespuestaAPI<Localidad>> {
    return sesionPeticion({ url: `${BASE}/localidades`, withCredentials: true })
  },

  obtenerLocalidades(idProvincia: number): Promise<RespuestaAPI<Localidad>> {
    return sesionPeticion({
      url: `${BASE}/localidades/provincia/${idProvincia}`,
      withCredentials: true,
    })
  },

  obtenerTiposDroga(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/tipos-droga`, withCredentials: true })
  },

  obtenerTiposOperacion(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/tipos-operacion`, withCredentials: true })
  },

  obtenerTiposPenal(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/tipos-penal`, withCredentials: true })
  },

  obtenerTiposRelevancia(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/tipos-relevancia`, withCredentials: true })
  },

  obtenerTiposPersona(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/tipos-persona`, withCredentials: true })
  },

  obtenerEstadosCiviles(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/estados-civiles`, withCredentials: true })
  },

  obtenerCategoriasOperativo(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/categorias-operativo`, withCredentials: true })
  },

  obtenerTiposDenuncia(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/tipos-denuncia`, withCredentials: true })
  },

  obtenerTiposFabrica(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/tipos-fabrica`, withCredentials: true })
  },

  //TODO: cambiar a parametricas
  obtenerModelosFabrica(
    idTipoFabrica: number
  ): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVO}/catalogos/fabrica-modelos/${idTipoFabrica}`,
      withCredentials: true,
    })
  },

  obtenerTiposDocumento(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/tipos-documento`, withCredentials: true })
  },

  obtenerTiposImplicado(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/tipos-implicado`, withCredentials: true })
  },

  obtenerEstadosSujeto(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/estados-sujeto`, withCredentials: true })
  },

  obtenerPlanesOperaciones(): Promise<RespuestaAPI<PlanOperacion>> {
    return sesionPeticion({ url: `${BASE}/planes-operaciones`, withCredentials: true })
  },

  obtenerFormasTransporte(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/formas-transporte`, withCredentials: true })
  },

  obtenerEtapas(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/etapas`, withCredentials: true })
  },

  obtenerEtapasInvestigacion(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/etapas-investigacion`, withCredentials: true })
  },

  obtenerRecursos(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/recursos`, withCredentials: true })
  },

  obtenerSustanciasSolidasDesc(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/sustancias-solidas-desc`, withCredentials: true })
  },

  obtenerSustanciasLiquidasDesc(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/sustancias-liquidas-desc`, withCredentials: true })
  },

  obtenerCocaProcedencias(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/coca-procedencias`, withCredentials: true })
  },

  obtenerCocaEstados(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/coca-estados`, withCredentials: true })
  },

  obtenerCocaDescripciones(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/coca-descripciones`, withCredentials: true })
  },

  obtenerBienes(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/bienes`, withCredentials: true })
  },

  obtenerCalidadesBien(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/calidades-bien`, withCredentials: true })
  },

  obtenerColoresPiel(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/colores-piel`, withCredentials: true })
  },

  obtenerColoresOjos(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/colores-ojos`, withCredentials: true })
  },

  obtenerColoresCabello(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/colores-cabello`, withCredentials: true })
  },

  obtenerTiposCabello(): Promise<RespuestaAPI<LookupGenerico>> {
    return sesionPeticion({ url: `${BASE}/tipos-cabello`, withCredentials: true })
  },

  obtenerUnidades(): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/unidades`, withCredentials: true })
  },

  obtenerDistritalesPorUnidad(
    idUnidad: number
  ): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/distritales/unidad/${idUnidad}`, withCredentials: true })
  },

  obtenerGruposPorDistrital(
    idDistrital: number
  ): Promise<RespuestaAPI<LookupBasico>> {
    return sesionPeticion({ url: `${BASE}/grupos/distrital/${idDistrital}`, withCredentials: true })
  },
}
