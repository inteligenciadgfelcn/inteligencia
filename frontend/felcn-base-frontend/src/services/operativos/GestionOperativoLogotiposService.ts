import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { LogotipoCasoPayload, RespuestaApi } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`



const buildFormData = (payload: LogotipoCasoPayload) => {
  const formData = new FormData()

  formData.append('imagen', payload.imagen)
  formData.append('descripcionLogo', payload.descripcionLogo)
  formData.append('organizacion', payload.organizacion)
  if (payload.fotografia) {
    formData.append('fotografia', payload.fotografia)
  }

  if (payload.blanco) {
    formData.append('blanco', payload.blanco)
  }

  if (payload.observacion) {
    formData.append('observacion', payload.observacion)
  }

  return formData
}

export const GestionOperativoLogotiposService = {
  listar(idCaso: number, idDroga: number): Promise<RespuestaApi<unknown[]>> {
    return Servicios.get({
      url: `${BASE_OPERATIVOS}/caso/${idCaso}/drogas/${idDroga}/logotipos`,
    })
  },

  crear(
    idCaso: number,
    idDroga: number,
    payload: LogotipoCasoPayload
  ): Promise<RespuestaApi<unknown>> {
    return Servicios.post({
      url: `${BASE_OPERATIVOS}/caso/${idCaso}/drogas/${idDroga}/logotipos`,
      body: buildFormData(payload),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  eliminar(
    idCaso: number,
    idDroga: number,
    idLogotipo: number
  ): Promise<RespuestaApi<unknown>> {
    return Servicios.delete({
      url: `${BASE_OPERATIVOS}/caso/${idCaso}/drogas/${idDroga}/logotipos/${idLogotipo}`,
    })
  },
}
