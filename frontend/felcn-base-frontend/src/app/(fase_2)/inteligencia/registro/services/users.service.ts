import { usePeticion } from '@/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface Usuario {
  usuario: string
  nombres: string
  telefono: string
  telefonoFijo: string
  rol: string
  estado: string
  grado: Grado
  grupo: Grupo
}

export interface Grado {
  idGrado: number
  abreviatura: string
  descripcion: string
  estado: string
}

export interface Grupo {
  idGrupo: number
  descripcion: string
  estado: string
}

const { sesionPeticion } = usePeticion()

export async function getUsersByGroup(idGroup: number): Promise<Usuario[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/usuarios/grupo/${idGroup}`,
    withCredentials: true,
  })

  return response
}
