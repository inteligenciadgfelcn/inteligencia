import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'


export interface VerificarServicioResponse {
  enServicio: boolean
  codigoServicio?: string
  usuario?: string
  desde?: string
  hasta?: string
  mensaje?: string
}

export async function getNumeroRegistro(
  idDepartment: number,
  idGroup: number
): Promise<string> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/asignaciones/generar-codigo`,
    params: {
      idDepartamento: idDepartment,
      idGrupo: idGroup,
    },
    withCredentials: true,
  })

  return response
}

export async function verificarServicioUsuario(
  numeroPase: string
): Promise<VerificarServicioResponse> {
  const response = await sesionPeticion<VerificarServicioResponse>({
    url: `${Constantes.baseUrl}/servicio/verificar/${numeroPase}`,
    method: 'get',
    withCredentials: true,
  })

  return response
}

export interface ActualizarAsignacionPayload {
  idDepartamento?: string
  idUnidad?: string
  codigoLetra?: string
  numeroCaso?: string
  numeroOperativo?: string
  fechaOperativo?: string
  nombreCaso?: string
  asignacionCaso?: string
  codigoServicio?: string
  fiscalAsignado?: string
}

export async function actualizarAsignacion(
  idAsignacion: string,
  payload: ActualizarAsignacionPayload
) {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/asignaciones/${idAsignacion}`,
    method: 'patch',
    body: payload,
    withCredentials: true,
  })

  return response
}
