import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  PersonaImplicadaPayload,
  PersonaImplicadaRow,
  RespuestaCrud,
  RespuestaPaginadaDatos,
} from '../../registro_caso/types/registro-caso.types'
import { RegistroCasoApi } from '../../registro_caso/api/registro-caso.api'
import type { SituacionJuridicaRow } from '../types/personas-investigadas.types'

const BASE_SITUACION_JURIDICA = `${Constantes.baseUrl}/situacion-juridica`

export const PersonasInvestigadasApi = {
  listarPersonas(
    casoId: string | number,
    params: { pagina: number; limite: number; filtro?: string }
  ): Promise<RespuestaPaginadaDatos<PersonaImplicadaRow>> {
    return RegistroCasoApi.listarPersonas(casoId, params)
  },

  crearPersona(dto: PersonaImplicadaPayload): Promise<RespuestaCrud> {
    return RegistroCasoApi.crearPersona(dto)
  },

  actualizarPersona(
    id: number,
    dto: Partial<PersonaImplicadaPayload>
  ): Promise<RespuestaCrud> {
    return RegistroCasoApi.actualizarPersona(id, dto)
  },

  eliminarPersona(id: number): Promise<RespuestaCrud> {
    return RegistroCasoApi.eliminarPersona(id)
  },

  listarSituacionesJuridicasPersona(
    deId: number
  ): Promise<SituacionJuridicaRow[]> {
    return sesionPeticion({
      url: `${BASE_SITUACION_JURIDICA}/persona/${deId}`,
      method: 'get',
      withCredentials: true,
    })
  },
}
