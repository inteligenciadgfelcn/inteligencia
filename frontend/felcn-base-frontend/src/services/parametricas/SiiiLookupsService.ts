import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import type {
    Continente,
    Departamento,
    Localidad,
    Provincia,
    RespuestaAPI,
} from './types'

const BASE = `${Constantes.baseUrl}/siii-lookups`

/**
 * Servicio para los lookups del módulo SIII.
 *
 * Endpoints cubiertos:
 *  - GET /api/siii-lookups/continentes
 *  - GET /api/siii-lookups/departamentos
 *  - GET /api/siii-lookups/provincias/departamento/:idDepartamento
 *  - GET /api/siii-lookups/localidades/provincia/:idProvincia
 */
export const SiiiLookupsService = {
    /** Obtiene todos los continentes */
    obtenerContinentes(): Promise<RespuestaAPI<Continente>> {
        return Servicios.get({ url: `${BASE}/continentes` })
    },

    /** Obtiene todos los departamentos (incluye datos del país) */
    obtenerDepartamentos(): Promise<RespuestaAPI<Departamento>> {
        return Servicios.get({ url: `${BASE}/departamentos` })
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

    /**
     * Obtiene las localidades de una provincia.
     * @param idProvincia ID de la provincia
     */
    obtenerLocalidades(idProvincia: number): Promise<RespuestaAPI<Localidad>> {
        return Servicios.get({
            url: `${BASE}/localidades/provincia/${idProvincia}`,
        })
    },
}
