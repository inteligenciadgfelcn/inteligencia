import { Constantes } from '@/config/Constantes';
import { sesionPeticion } from '@/utils/peticion';
import type {
  InvestigadoresCasoResponse,
  InvestigadoresGeneralResponse,
  AsignarInvestigadorPayload,
  SepararInvestigadorPayload,
} from '../types/investigadores.types';

const BASE = `${Constantes.baseUrl}/investigadores`;

export const InvestigadoresApi = {
  listarPorCaso(casoId: string | number): Promise<InvestigadoresCasoResponse> {
    return sesionPeticion({
      url: `${BASE}/caso/${casoId}`,
      method: 'get',
      withCredentials: true,
    });
  },

  buscarGenerales(params: {
    pagina: number;
    limite: number;
    filtro?: string;
  }): Promise<InvestigadoresGeneralResponse> {
    return sesionPeticion({
      url: `${BASE}/general`,
      method: 'get',
      params,
      withCredentials: true,
    });
  },

  asignarInvestigador(
    casoId: string | number,
    payload: AsignarInvestigadorPayload
  ): Promise<{ message: string }> {
    return sesionPeticion({
      url: `${BASE}/asignar-investigador/${casoId}`,
      method: 'post',
      body: payload,
      withCredentials: true,
    });
  },

  separarInvestigador(
    investigadorId: string | number,
    payload: SepararInvestigadorPayload
  ): Promise<{ message: string }> {
    return sesionPeticion({
      url: `${BASE}/${investigadorId}/separar`,
      method: 'patch',
      body: payload,
      withCredentials: true,
    });
  },
};
