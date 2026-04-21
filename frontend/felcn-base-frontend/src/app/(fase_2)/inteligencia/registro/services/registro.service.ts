import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

const { sesionPeticion } = usePeticion()

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
