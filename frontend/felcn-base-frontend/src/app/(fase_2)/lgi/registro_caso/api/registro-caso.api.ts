import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'
import type {
  DatosGeneralesPayload,
  PersonaImplicadaPayload,
  PersonaImplicadaRow,
  RespuestaCrud,
  RespuestaPaginadaDatos,
  SituacionJuridicaPayload,
  SituacionLegalCatalogo,
} from '../types/registro-caso.types'

const BASE_ASIGNACION = `${Constantes.baseUrl}/asignacion-lgi`
const BASE_PERSONAS = `${Constantes.baseUrl}/personas-implicadas`
const BASE_SITUACION_JURIDICA = `${Constantes.baseUrl}/situacion-juridica`
const BASE_SITUACION_LEGAL = `${Constantes.baseUrl}/parametro/situacion-legal`

interface RespuestaPaginada<T> {
  finalizado: boolean
  mensaje: string
  datos: RespuestaPaginadaDatos<T>
}

export const RegistroCasoApi = {
  crearDatosGenerales(dto: DatosGeneralesPayload): Promise<RespuestaCrud> {
    return sesionPeticion({
      url: `${BASE_ASIGNACION}/crear-datosGenerales`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  actualizarDatosGenerales(
    id: string | number,
    dto: Partial<DatosGeneralesPayload>
  ): Promise<{ message: string }> {
    return sesionPeticion({
      url: `${BASE_ASIGNACION}/${id}`,
      method: 'patch',
      body: dto,
      withCredentials: true,
    })
  },

  generarNumero(codigoDepartamento: string, letra: string): Promise<string> {
    return sesionPeticion({
      url: `${BASE_ASIGNACION}/generar-numero`,
      method: 'post',
      body: { codigoDepartamento, letra },
      withCredentials: true,
    })
  },

  async listarPersonas(
    casoId: string | number,
    params: { pagina: number; limite: number; filtro?: string }
  ): Promise<RespuestaPaginadaDatos<PersonaImplicadaRow>> {
    const respuesta = await sesionPeticion<
      RespuestaPaginada<PersonaImplicadaRow>
    >({
      url: `${BASE_PERSONAS}/caso/${casoId}`,
      method: 'get',
      params,
      withCredentials: true,
    })
    return respuesta.datos
  },

  crearPersona(dto: PersonaImplicadaPayload): Promise<RespuestaCrud> {
    return sesionPeticion({
      url: `${BASE_PERSONAS}/crear-persona-implicada`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  actualizarPersona(
    id: number,
    dto: Partial<PersonaImplicadaPayload>
  ): Promise<RespuestaCrud> {
    return sesionPeticion({
      url: `${BASE_PERSONAS}/${id}`,
      method: 'patch',
      body: dto,
      withCredentials: true,
    })
  },

  eliminarPersona(id: number): Promise<RespuestaCrud> {
    return sesionPeticion({
      url: `${BASE_PERSONAS}/${id}/eliminar`,
      method: 'patch',
      withCredentials: true,
    })
  },

  registrarSituacionJuridica(
    dto: SituacionJuridicaPayload
  ): Promise<RespuestaCrud> {
    return sesionPeticion({
      url: `${BASE_SITUACION_JURIDICA}/crear-situacion-juridica`,
      method: 'post',
      body: dto,
      withCredentials: true,
    })
  },

  listarSituacionesLegales(): Promise<SituacionLegalCatalogo[]> {
    return sesionPeticion({
      url: BASE_SITUACION_LEGAL,
      method: 'get',
      withCredentials: true,
    })
  },
}
