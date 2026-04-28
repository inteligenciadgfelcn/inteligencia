import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

export interface DetenidoDocumento {
  numero: string
  tipo: string
  expedido: string
}

export interface DetenidoFenotipo {
  estatura: string
  peso: string
  senas: string
  nariz: string
  contextura: string
  piel: string
  cabello: string
  tipoCabello: string
  ojos: string
  tipoOjos: string
}

export interface DetenidoProfesion {
  id: string
  descripcion: string
}

export interface DetenidoFamiliares {
  id: number
  nombres: string
  paterno: string
  materno: string
  edad: string
  direccion: string
  telefono: string
  vivo: boolean
  implicado: boolean
  parentezco: string
}

export interface DetenidoNombreSupuesto {
  id: number
  nombres: string
  paterno: string
  materno: string
  apellidoEsposo: string
  cpq: string | null
}

export interface DetenidoDetalle {
  id: number
  nombres: string
  numeroCaso: string
  alias: string[]
  documentos: DetenidoDocumento[]
  fenotipo?: DetenidoFenotipo | null
  profesiones: DetenidoProfesion[]
  datosFamiliares?: DetenidoFamiliares[]
  nombresSupuestos?: DetenidoNombreSupuesto[]
}


export async function getDetenidoById(
  idDetenido: string | number
): Promise<DetenidoDetalle> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/filiacion/detenido/${encodeURIComponent(String(idDetenido))}`,
    withCredentials: true,
  })

  return response
}
