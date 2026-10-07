import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type { EtapaLgi } from '../types/parametricas-apd.types'

export const EtapasLgiApi = {
  listarEtapas(): Promise<EtapaLgi[]> {
    return sesionPeticion({
      url: `${Constantes.baseUrl}/parametro/etapa`,
      method: 'get',
      withCredentials: true,
    })
  },
}
