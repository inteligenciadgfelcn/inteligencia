import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import {
  FiltrosVariablesCruzadas,
  FormatoExportacion,
  RespuestaBuscarVariablesCruzadas,
} from '../types/personasReporte.types'

const BASE = `${Constantes.baseUrl}/reporte`

export const PersonasReporteService = {
  buscar(
    filtros: FiltrosVariablesCruzadas,
    pagina: number,
    limite: number
  ): Promise<RespuestaBuscarVariablesCruzadas> {
    return sesionPeticion({
      url: `${BASE}/variables-cruzadas/buscar`,
      method: 'post',
      params: { pagina, limite },
      body: filtros,
      withCredentials: true,
    })
  },

  async exportar(
    formato: FormatoExportacion,
    filtros: FiltrosVariablesCruzadas
  ): Promise<void> {
    const extension = formato === 'excel' ? 'xlsx' : formato
    const blob = await sesionPeticion<Blob>({
      url: `${BASE}/variables-cruzadas/export/${formato}`,
      method: 'post',
      body: filtros,
      responseType: 'blob',
      withCredentials: true,
    })

    const objectUrl = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = objectUrl
    enlace.download = `variables-cruzadas.${extension}`
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    URL.revokeObjectURL(objectUrl)
  },
}