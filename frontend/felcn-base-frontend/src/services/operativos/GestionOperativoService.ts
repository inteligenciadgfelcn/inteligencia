import { Constantes } from '@/config/Constantes'
import { usePeticion } from '@/hooks/usePeticion'
import type { GestionOperativoItem } from '@/app/operaciones/operativo/gestion-operativo/types'

const { sesionPeticion } = usePeticion()

const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const GestionOperativoService = {
  listarNoAprobadosPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos/no-aprobados`,
      withCredentials: true,
    })
  },

  listarAprobadosPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos`,
      withCredentials: true,
    })
  },
}
