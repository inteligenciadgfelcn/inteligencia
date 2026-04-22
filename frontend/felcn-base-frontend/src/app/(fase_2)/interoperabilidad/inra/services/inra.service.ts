import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

export type InraSearchType = 'TITULO' | 'IDENTIFICACION'

export interface InraMensaje {
  codigo: string
  mensaje: string
  tipo: 'INFORMACION' | 'ERROR'
}

export interface InraBeneficiario {
  nombres: string
  numeroIdentidad: string
  primerApellido: string
  segundoApellido: string
  expedicion: string
  fechaNacimiento: string
  genero: string
  tipoBeneficiario: string
  estadoCivil: string
}

export interface InraTitulo {
  numeroTitulo: string
  fechaTitulo: string
  nombrePredio: string
  superficie: number
  superficieTotal: number
  claseTitulo: string
  calificacion: string
  clasificacion: string
  departamento: string
  provincia: string
  municipio: string
  canton: string
  presidente: string
  director: string
  resolucionTitulacion: string
  fechaResolucionTitulacion: string
  beneficiariosList: InraBeneficiario[]
}

export interface InraResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    mensajes: InraMensaje[]
    cantidadTitulo: number
    respuestaTitulos: InraTitulo[] | null
  }
}


export const buscarInraPorNumeroTitulo = async (
  nroTitulo: string
): Promise<InraResponse> => {
  return sesionPeticion<InraResponse>({
    url: `${Constantes.baseUrl}/interoperabilidad/inra/titulo?numTitulo=${encodeURIComponent(
      nroTitulo
    )}`,
    withCredentials: true,
  })
}

export const buscarInraPorNumeroIdentificacion = async (
  nroIdentificacion: string
): Promise<InraResponse> => {
  return sesionPeticion<InraResponse>({
    url: `${Constantes.baseUrl}/interoperabilidad/inra/identificacion?numeroIdentificacion=${encodeURIComponent(
      nroIdentificacion
    )}`,
    withCredentials: true,
  })
}
