import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type { GestionOperativoItem } from '@/app/operativos/types'


const BASE_OPERATIVOS = `${Constantes.baseUrl}/operativos`

export const OperativoService = {
  listarNoAprobadosPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos/no-aprobados`,
      withCredentials: true,
    })
  },

  listarAprobadosPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos/aprobados`,
      withCredentials: true,
    })
  },

  listarPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos`,
      withCredentials: true,
    })
  },
  listarConCudPorUsuario(): Promise<{ datos: GestionOperativoItem[] }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos/con-cud`,
      withCredentials: true,
    })
  },

  actualizarIanus(idCaso: string, ianus: string): Promise<{ datos: { idCaso: string; ianus: string } }> {
    return sesionPeticion({
      url: `${BASE_OPERATIVOS}/casos/${idCaso}/ianus`,
      method: 'patch',
      body: { ianus },
      withCredentials: true,
    })
  },
}
