import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
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
        return Servicios.get({ url: `${BASE}/continentes` })
    },

    /** Obtiene todos los paises */
    obtenerPaises(): Promise<RespuestaAPI<Pais>> {
        return Servicios.get({ url: `${BASE}/paises` })
    },

    /**
     * Obtiene los paises por continente.
     * @param idContinente ID del continente
     */
    obtenerPaisesPorContinente(idContinente: number): Promise<RespuestaAPI<Pais>> {
        return Servicios.get({ url: `${BASE}/paises/continente/${idContinente}` })
    },

    /** Obtiene los paises de destino */
    obtenerPaisesDestino(): Promise<RespuestaAPI<Pais>> {
        return Servicios.get({ url: `${BASE}/paises-destino` })
    },

    /** Obtiene todos los departamentos (incluye datos del país) */
    obtenerDepartamentos(): Promise<RespuestaAPI<Departamento>> {
        return Servicios.get({ url: `${BASE}/departamentos` })
    },

    /**
     * Obtiene los departamentos por pais.
     * @param idPais ID del pais
     */
    obtenerDepartamentosPorPais(idPais: number): Promise<RespuestaAPI<Departamento>> {
        return Servicios.get({ url: `${BASE}/departamentos/pais/${idPais}` })
    },

    /** Obtiene todas las provincias */
    obtenerTodasLasProvincias(): Promise<RespuestaAPI<Provincia>> {
        return Servicios.get({ url: `${BASE}/provincias` })
    },

    /**
     * Obtiene las provincias de un departamento.
     * @param idDepartamento ID del departamento
     */
    obtenerProvincias(idDepartamento: number): Promise<RespuestaAPI<Provincia>> {
        return Servicios.get({
            url: `${BASE}/provincias/departamento/${idDepartamento}`,
        })
    },

    /** Obtiene todas las localidades */
    obtenerTodasLasLocalidades(): Promise<RespuestaAPI<Localidad>> {
        return Servicios.get({ url: `${BASE}/localidades` })
    },

    /**
     * Obtiene las localidades de una provincia.
     * @param idProvincia ID de la provincia
     */
    obtenerLocalidades(idProvincia: number): Promise<RespuestaAPI<Localidad>> {
        return Servicios.get({
            url: `${BASE}/localidades/provincia/${idProvincia}`,
        })
    },

    obtenerTiposDroga(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/tipos-droga` })
    },

    obtenerTiposOperacion(): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/tipos-operacion` })
    },

    obtenerTiposPenal(): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/tipos-penal` })
    },

    obtenerTiposRelevancia(): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/tipos-relevancia` })
    },

    obtenerTiposPersona(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/tipos-persona` })
    },

    obtenerEstadosCiviles(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/estados-civiles` })
    },

    obtenerCategoriasOperativo(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/categorias-operativo` })
    },

    obtenerTiposDenuncia(): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/tipos-denuncia` })
    },

    obtenerTiposFabrica(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/tipos-fabrica` })
    },

    //TODO: cambiar a parametricas
    obtenerModelosFabrica(idTipoFabrica: number): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE_OPERATIVO}/catalogos/fabrica-modelos/${idTipoFabrica}` })
    },

    obtenerTiposDocumento(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/tipos-documento` })
    },

    obtenerTiposImplicado(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/tipos-implicado` })
    },

    obtenerPlanesOperaciones(): Promise<RespuestaAPI<PlanOperacion>> {
        return Servicios.get({ url: `${BASE}/planes-operaciones` })
    },

    obtenerFormasTransporte(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/formas-transporte` })
    },

    obtenerEtapas(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/etapas` })
    },

    obtenerEtapasInvestigacion(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/etapas-investigacion` })
    },

    obtenerRecursos(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/recursos` })
    },

    obtenerSustanciasSolidasDesc(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/sustancias-solidas-desc` })
    },

    obtenerSustanciasLiquidasDesc(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/sustancias-liquidas-desc` })
    },

    obtenerCocaProcedencias(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/coca-procedencias` })
    },

    obtenerCocaEstados(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/coca-estados` })
    },

    obtenerCocaDescripciones(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/coca-descripciones` })
    },

    obtenerBienes(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/bienes` })
    },

    obtenerCalidadesBien(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/calidades-bien` })
    },

    obtenerColoresPiel(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/colores-piel` })
    },

    obtenerColoresOjos(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/colores-ojos` })
    },

    obtenerColoresCabello(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/colores-cabello` })
    },

    obtenerTiposCabello(): Promise<RespuestaAPI<LookupGenerico>> {
        return Servicios.get({ url: `${BASE}/tipos-cabello` })
    },

    obtenerUnidades(): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/unidades` })
    },

    /**
     * Obtiene los distritales por unidad.
     * @param idUnidad ID de la unidad
     */
    obtenerDistritalesPorUnidad(
        idUnidad: number
    ): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/distritales/unidad/${idUnidad}` })
    },

    /**
     * Obtiene los grupos por distrital.
     * @param idDistrital ID del distrital
     */
    obtenerGruposPorDistrital(
        idDistrital: number
    ): Promise<RespuestaAPI<LookupBasico>> {
        return Servicios.get({ url: `${BASE}/grupos/distrital/${idDistrital}` })
    },
}
