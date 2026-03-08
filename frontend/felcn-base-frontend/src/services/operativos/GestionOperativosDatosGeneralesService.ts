import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { RespuestaApi } from './types'


const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

// ── Tipos del endpoint GET /operativos/casos/usuario/:idUsuario ──────────────

export interface CasoResumen {
    idCaso: string
    numeroOperativo: string
    nombreCaso: string
    fiscalSolicitud: string
    telefonoSolicitud: string
    asignadoCaso: string
    telefonoAsignado: string
    fiscalAsignadoCaso: string
    telefonoFiscal: string
}

export interface OperativoDetalle {
    id: string
    idCaso: string
    numeroOperativo: string
    idTipoRelevancia: number
    idTipoDenuncia: number
    idTipoPenal: number
    fechaOperativo: string
    idDepartamento: number
    idProvincia: number
    idLocalidad: number
    lugar: string
    idCategoriaOperativo: number
    idItemOperativo: number
    idUnidad: number
    idDistrital: number
    idGrupo: number
    mando: string
    gradosX: number
    minX: number
    segX: number
    coordX: number
    gradosY: number
    minY: number
    segY: number
    coordY: number
    idPlanOperacion: number
    breveDetalle: string
    descripcion: string
    idTipoOperacion: number
    organizacion: string
    clanFamiliar: string
    esRevisado: boolean
    esPositivo: boolean
    esAprehendido: boolean
    esArrestado: boolean
    esIcia: boolean
    esParteDiario: boolean
    fechaHoraIngreso: string
    usuario: string
}

export interface CasoOperativoDetalle {
    caso: CasoResumen
    operativo: OperativoDetalle
}

// ── Tipos del endpoint POST /operativos/caso/:idCaso ────────────────────────

export interface OperativoPayload {
    numeroOperativo: string
    idTipoRelevancia: number
    idTipoDenuncia: number
    idTipoPenal: number
    fechaOperativo: string
    idDepartamento: number
    idProvincia: number
    idLocalidad: number
    lugar: string
    idCategoriaOperativo: number
    idItemOperativo: number
    idUnidad: number
    idDistrital: number
    idGrupo: number
    mando: string
    coordX: number
    coordY: number
    idPlanOperacion: number
    breveDetalle: string
    descripcion: string
    idTipoOperacion: number
    organizacion: string
    clanFamiliar: string
}

// ── Servicio ─────────────────────────────────────────────────────────────────

export const GestionOperativosDatosGeneralesService = {

    obtenerPorUsuario(
        idUsuario: number
    ): Promise<RespuestaApi<CasoOperativoDetalle>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/caso/${idUsuario}`,
        })
    },

    crearOperativo(
        idCaso: number,
        payload: OperativoPayload
    ): Promise<RespuestaApi<OperativoDetalle>> {
        return Servicios.post({
            url: `${BASE_OPERATIVOS}/caso/${idCaso}`,
            body: payload,
        })
    },
}
