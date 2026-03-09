import { usePeticion } from '@/app/(fase_2)/hooks/usePeticion'
import { Constantes } from '@/config/Constantes'

export interface Usuario {
  usuario: string
  nombres: string
  telefono: string
  telefonoFijo: string
  rol: string
  estado: string
  grado: Grado
}

export interface Grado {
  idGrado: number
  abreviatura: string
  descripcion: string
  estado: string
}

const { sesionPeticion } = usePeticion()

export async function getUsersInteligencia(): Promise<Usuario[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/usuarios/unidad/inteligencia`,
    withCredentials: true,
  })

  return response
}
