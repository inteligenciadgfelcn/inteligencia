import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type {
  DrogaCasoPayload,
  RespuestaApi,
  RespuestaApiPaginada,
  ResponseDroga,
} from './types'

const { sesionPeticion } = usePeticion()
const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: DrogaCasoPayload) => {
  const formData = new FormData()

  formData.append('idTipoDroga', String(payload.idTipoDroga))
  formData.append('idEstadoDroga', String(payload.idEstadoDroga))
  formData.append('cantidadGramos', String(payload.cantidadGramos))
  formData.append('cantidadUnidades', String(payload.cantidadUnidades))

  if (payload.costo != null) {
    formData.append('costo', String(payload.costo))
  }

  formData.append('idFormaTransporte', String(payload.idFormaTransporte))
  formData.append('idPaisProcedencia', String(payload.idPaisProcedencia))
  formData.append('idPaisDestino', String(payload.idPaisDestino))

  if (payload.observaciones) {
    formData.append('observaciones', payload.observaciones)
  }

  if (payload.pruebaCampo) {
    formData.append('pruebaCampo', payload.pruebaCampo)
  }

  if (payload.pesaje) {
    formData.append('pesaje', payload.pesaje)
  }

  return formData
}

export const GestionOperativoDrogasService = {
  listar(
    idCaso: number,
    pagina: number = 1,
    limite: number = 10
  ): Promise<RespuestaApi<RespuestaApiPaginada<ResponseDroga>>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idCaso}/drogas?pagina=${pagina}&limite=${limite}`,
      withCredentials: true,
    })
  },

  crear(
    idCaso: number,
    payload: DrogaCasoPayload
  ): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idCaso}/drogas`,
      method: 'POST',
      body: buildFormData(payload),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
  },

  eliminar(idCaso: number, idDroga: number): Promise<RespuestaApi<unknown>> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/${idCaso}/drogas/${idDroga}`,
      method: 'DELETE',
      withCredentials: true,
    })
  },

  obtenerFoto(path: string): Promise<Blob> {
    const pathNormalizado = path.replace(/^\/api/, '')
    return sesionPeticion<Blob>({
      url: `${Constantes.baseUrl}${pathNormalizado}`,
      responseType: 'blob',
      withCredentials: true,
    })
  },
}
