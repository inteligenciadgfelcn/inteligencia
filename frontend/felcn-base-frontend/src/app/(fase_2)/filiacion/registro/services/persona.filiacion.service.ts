import { sesionPeticion } from '@/utils/peticion'
import { Constantes } from '@/config/Constantes'

export interface PersonaFiliacion {
  id_persona_auxiliar: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  apellido_esposo: string
  pais: string
  genero: string
  tipo_documento: string
  numero_documento: string
  fecha_nacimiento: string
  lugar_operativo: string
  direccion: string
  estado: string
  enviado: number
}


export async function getPersonaFiliacion(
  idPersona: string | number
): Promise<PersonaFiliacion> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/filiacion/persona/${encodeURIComponent(idPersona)}`,
    withCredentials: true,
  })

  return response
}
