import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

const BASE = `${Constantes.baseUrl}/presedencia-lgi`

export interface OperativoSiiiPrecedente {
  idOperativo: string
  fechaOperativo: string
  numeroCaso: string
  numeroOperativo: string
  numeroInforme: string
  ubicacionInstitucional: string
  ubicacionGeografica: string
  nombreCaso: string
  ianus: string | null
  fiscalSolicitud: string
  asignado: string
  asignadoFiscal: string
  tipoOperativo: string
  tipoRelevancia: string
  categoriaOperativo: string
  planOperacion: string
  tipoDenuncia: string
  tipoPenal: string
  organizacion: string
  alMandoDe: string
  esPositivo: boolean
  esAprehendido: boolean
  esArrestado: boolean
  esIcia: boolean
  esParteDiario: boolean
  esRevisado: boolean
  [key: string]: unknown
}

export interface PresedenciaCasoRow {
  preseId: string
  casosId: string
  nrocasopre: string
  estado: string
  usuario: string
  usuarioActualizacion: string | null
  fechaHoraIng: string
  fechaActualizacion: string | null
  operativosSiii: OperativoSiiiPrecedente[]
}

interface RespuestaPaginada {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: PresedenciaCasoRow[] }
}

export const PresedenciaApi = {
  async listarPorCaso(
    casosId: string | number,
    params: { pagina: number; limite: number }
  ): Promise<{ total: number; filas: PresedenciaCasoRow[] }> {
    const respuesta = await sesionPeticion<RespuestaPaginada>({
      url: `${BASE}/caso/${casosId}`,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  registrar(casosId: string | number, nrocasopre: string): Promise<unknown> {
    return sesionPeticion({
      url: BASE,
      method: 'post',
      body: { casosId: String(casosId), nrocasopre },
      withCredentials: true,
    })
  },

  eliminar(id: string | number): Promise<unknown> {
    return sesionPeticion({
      url: `${BASE}/${id}`,
      method: 'delete',
      withCredentials: true,
    })
  },
}