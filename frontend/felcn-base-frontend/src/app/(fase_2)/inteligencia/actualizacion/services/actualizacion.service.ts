import { usePeticion } from '@/hooks'
import { CasoActualizacionTable } from '../types/caso.actualizacion.table'
import { Constantes } from '@/config/Constantes'
import { DataTableParams } from '@/services'

export interface OpertaivosResponse {
  finalizado: boolean
  mensaje: string
  datos: Datos
}

export interface NroCasoResponse {
  message: string
  nroCaso: string
}

interface Datos {
  total: number
  filas: CasoActualizacionTable[]
}
const { sesionPeticion } = usePeticion()

export const getActualizacionData = async (
  registrados: boolean,
  params: DataTableParams
): Promise<OpertaivosResponse> => {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/asignaciones/operativos`,
    params: {
      ...params,
      registrados: registrados ? 'true' : 'false',
      codigoServicio: 'ICIA-2122032026', // TODO: Obtener el código del servicio desde la configuración o contexto adecuado
    },
    withCredentials: true,
  })
  return response
}

export const generateNroCaso = async (
  codigoDepartamento: string,
  letra: string
): Promise<string> => {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/asignaciones/generar-numero`,
    method: 'POST',
    body: {
      codigoDepartamento: codigoDepartamento,
      letra: letra,
    },
    withCredentials: true,
  })
  return response
}

export const saveAssignNroCaso = async (
  nroOperativo: string,
  codigoDepartamento: string,
  letra: string
): Promise<NroCasoResponse> => {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/asignaciones/asignar-numero-caso`,
    method: 'POST',
    body: {
      nroOperativo: nroOperativo,
      abreviatura: codigoDepartamento,
      letra: letra,
    },
    withCredentials: true,
  })
  return response
}
