import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
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
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/catalogos/estados-droga/${idTipoDroga}`,
      withCredentials: true,
    })
  },
  obtenerItemsOperativo(
    idItemOperativo: number
  ): Promise<RespuestaApi<ItemCategoriaOperativo[]>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/catalogos/items-operativo/${idItemOperativo}`,
      withCredentials: true,
    })
  },

  obtenerClasesBien(
    idBien: number
  ): Promise<RespuestaApi<CatalogoClaseBien[]>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/catalogos/clases/${idBien}`,
      withCredentials: true,
    })
  },

  obtenerTiposBien(
    idCatalogoClase: number
  ): Promise<RespuestaApi<CatalogoTipoBien[]>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/catalogos/tipos/${idCatalogoClase}`,
      withCredentials: true,
    })
  },

  obtenerCaracteristicasBien(
    idCatalogoClase: number
  ): Promise<RespuestaApi<CatalogoCaracteristica[]>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/catalogos/caracteristicas/${idCatalogoClase}`,
      withCredentials: true,
    })
  },
}
