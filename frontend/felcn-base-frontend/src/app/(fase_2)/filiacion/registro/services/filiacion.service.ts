import { sesionPeticion } from '@/utils/peticion'
import { DataTableParams } from '@/services'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'
import { Constantes } from '@/config/Constantes'

export interface PersonasFiliacionResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: FiliacionPersonaTable[]
  }
}

export interface RegistroFiliacionBody {
  idPersona: number
  estadoPersona: string
  numeroCaso: string
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoEsposo: string
  idPais: number
  genero: boolean
  fechaNacimiento: string
  idEstadoCivil: number
  direccion: string
  observacion: string
  detenido: {
    serie: string
    seccion: string
    tieneTarjeta: boolean
    estaVivo: boolean
    fotoFrente: string
    fotoPerfilDerecho: string
    fotoPerfilIzquierdo: string
    observacionAdicional: string
  }
  alias: {
    alias: string
  }
  profesion: {
    idProfesion: number
  }
  documento: {
    idTipoDocumento: number
    numeroDocumento: string
    expedido: string
    contrastadoSegip: string
  }
  fenotipo: {
    estatura: string
    pesoCorporal: string
    senasParticulares: string
    tatuajes: string
    tipoNariz: number
    constitucionCorporal: number
    idColorPiel: number
    idColorCabello: number
    idTipoCabello: number
    idColorOjos: number
    idTipoOjos: number
  }
  arrestado: {
    idOperativo: number
    lugarOperativo: string
    lugarNacimiento: string
    fotoDedoIzquierdo: string
    fotoDedoDerecho: string
  }
}

export interface RegistroFiliacionResponse {
  finalizado?: boolean
  mensaje?: string
  idDetenido: number
  datos?: unknown
}


export async function getPersonasFiliacionPorCaso(
  params: DataTableParams,
  nroCaso: string | number,
  /// Filiado (1), No Filiado (0)
  statusFiliacion: number
): Promise<PersonasFiliacionResponse> {
  const queryParams = {
    ...params,
    caso: nroCaso,
    filiado: statusFiliacion,
  }

  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/filiacion/personas`,
    params: queryParams,
    withCredentials: true,
  })

  return response
}

export async function postRegistroFiliacion(
  body: RegistroFiliacionBody
): Promise<RegistroFiliacionResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/filiacion`,
    method: 'POST',
    body,
    withCredentials: true,
  })

  return response
}
