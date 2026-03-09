import { usePeticion } from '@/app/(fase_2)/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

const { sesionPeticion } = usePeticion()

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
