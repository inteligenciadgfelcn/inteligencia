import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type {
    CatalogoCaracteristica,
    CatalogoBien,
    CatalogoClaseBien,
    CatalogoTipoBien,
    EstadoDroga,
    ItemCategoriaOperativo,
    RespuestaApi,
} from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`



export const GestionOperativoCatalogosService = {
    obtenerEstadosDroga(
        idTipoDroga: number
    ): Promise<RespuestaApi<EstadoDroga[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/estados-droga/${idTipoDroga}`,
        })
    },
    obtenerItemsOperativo(
        idItemOperativo: number
    ): Promise<RespuestaApi<ItemCategoriaOperativo[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/items-operativo/${idItemOperativo}`,
        })
    },

  

    obtenerClasesBien(idBien: number): Promise<RespuestaApi<CatalogoClaseBien[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/clases/${idBien}`,
        })
    },

    obtenerTiposBien(idCatalogoClase: number): Promise<RespuestaApi<CatalogoTipoBien[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/tipos/${idCatalogoClase}`,
        })
    },

    obtenerCaracteristicasBien(
        idCatalogoClase: number
    ): Promise<RespuestaApi<CatalogoCaracteristica[]>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/catalogos/caracteristicas/${idCatalogoClase}`,
        })
    },
}
