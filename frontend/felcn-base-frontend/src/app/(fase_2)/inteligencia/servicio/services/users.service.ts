import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface Usuario {
  nombreCompleto: string
  numeroPase: string
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


export async function getUsersInteligencia(): Promise<Usuario[]> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/usuarios/unidad/inteligencia`,
    withCredentials: true,
  })

  return response
}
