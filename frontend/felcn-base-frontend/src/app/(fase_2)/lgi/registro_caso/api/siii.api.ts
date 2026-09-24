import { Constantes } from '@/config/Constantes';
import { sesionPeticion } from '@/utils/peticion';
import type { PersonaSiiiRow, BienSiiiRow, PaginatedResult, RespuestaPaginadaSiii, CasoSiiiRow, RespuestaCasoSiii, ConsultaSiiiQueryDto, RespuestaBusquedaAvanzada, ResultadoBusquedaAvanzada } from '../types/siii.types';

const BASE_SIII = `${Constantes.baseUrl}/informacion-siii`;

export const SiiiApi = {
  async listarPersonas(
    idOperativo: string | number,
    params: { pagina: number; limite: number }
  ): Promise<PaginatedResult<PersonaSiiiRow>> {
    const respuesta = await sesionPeticion<RespuestaPaginadaSiii<PersonaSiiiRow>>({
      url: `${BASE_SIII}/${idOperativo}/personas`,
      method: 'get',
      params: { pagina: params.pagina, limite: params.limite },
      withCredentials: true,
    });
    return {
      filas: respuesta.datos.filas,
      total: respuesta.datos.page.totalElements,
    };
  },

  async listarBienes(
    idOperativo: string | number,
    params: { pagina: number; limite: number }
  ): Promise<PaginatedResult<BienSiiiRow>> {
    const respuesta = await sesionPeticion<RespuestaPaginadaSiii<BienSiiiRow>>({
      url: `${BASE_SIII}/${idOperativo}/bienes`,
      method: 'get',
      params: { pagina: params.pagina, limite: params.limite },
      withCredentials: true,
    });
    return {
      filas: respuesta.datos.filas,
      total: respuesta.datos.page.totalElements,
    };
  },

  async obtenerCaso(nroCaso: string): Promise<CasoSiiiRow> {
    const respuesta = await sesionPeticion<RespuestaCasoSiii>({
      url: `${BASE_SIII}/caso`,
      method: 'get',
      params: { numeroCaso: nroCaso },
      withCredentials: true,
    });
    return respuesta.datos.filas;
  },

  async buscarAvanzado(
    filtro: ConsultaSiiiQueryDto
  ): Promise<ResultadoBusquedaAvanzada[]> {
    const params: Record<string, string> = {};
    Object.entries(filtro).forEach(([key, value]) => {
      const valor = value?.trim();
      if (valor) params[key] = valor;
    });
    const respuesta = await sesionPeticion<RespuestaBusquedaAvanzada>({
      url: `${BASE_SIII}/avanzado`,
      method: 'get',
      params,
      withCredentials: true,
    });
    return respuesta.datos.filas;
  },
};