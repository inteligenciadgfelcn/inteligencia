import { mockInvestigaciones } from '../utils/inicio-investigacion.utils'

export const InicioInvestigacionApi = {
  async listarInvestigaciones() {
    return mockInvestigaciones
  },
}
