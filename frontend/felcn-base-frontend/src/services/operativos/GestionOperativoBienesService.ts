import { Constantes } from '@/config/Constantes'
import { Servicios } from '@/services'
import type { BienPayload, BienResponse, RespuestaApi, RespuestaApiPaginada } from './types'

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

const buildFormData = (payload: BienPayload) => {
    const formData = new FormData()
    formData.append('idCatalogoTipo', String(payload.idCatalogoTipo))
    formData.append('cantidadBien', String(payload.cantidadBien))
    formData.append('costoAproximado', String(payload.costoAproximado))
    formData.append('costoCuantificado', String(payload.costoCuantificado))
    formData.append('enInvestigacion', String(payload.enInvestigacion))
    if (payload.foto) {
        formData.append('foto', payload.foto)
    }
    console.log([...formData.entries()]);
    return formData
}

export const GestionOperativoBienesService = {
    listar(idOperativo: number, pagina: number = 1, limite: number = 10): Promise<RespuestaApi<RespuestaApiPaginada<BienResponse>>> {
        return Servicios.get({
            url: `${BASE_OPERATIVOS}/${idOperativo}/bienes?pagina=${pagina}&limite=${limite}`,
        })
    },

    crear(idOperativo: number, payload: BienPayload): Promise<RespuestaApi<unknown>> {
        return Servicios.post({
            url: `${BASE_OPERATIVOS}/${idOperativo}/bienes`,
            body: buildFormData(payload),
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    eliminar(idOperativo: number, idBien: number): Promise<RespuestaApi<unknown>> {
        return Servicios.delete({
            url: `${BASE_OPERATIVOS}/${idOperativo}/bienes/${idBien}`,
        })
    },
}
