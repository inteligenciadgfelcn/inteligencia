import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

export interface AntecedenteSinarap {
  municipioId?: number
  codigoUnico: string
  detalleIngreso?: string
  fechaHoraIngreso: string
  lugarHecho: string
  detalleHecho?: string
  calidadIngresoId: number
  georeferenciacion?: string
  numeroCasoInterno: string
  fechaHecho: string
  observaciones?: string
}

export interface PersonaSinarap {
  numeroDocumento: string
  complemento?: string
  nombres: string
  primerApellido: string
  segundoApellido: string
  sexoId: number
  tipoDocumentoId: number
  lugarNacimiento: string
  fechaNacimiento: string
  fotoPersona?: string
  verificado: string
  personaRegistro: string
}

export interface DetallePersonaSinarap {
  extencionPaisId?: number
  extencionDepartamentoId?: number
  profesionId: number
  estadoCivilId: number
  nacionalidadId: number
  nivelEducacionId?: number
  municipioId?: number
  telefono?: string
  celular?: string
  correoElectronico?: string
  lugarTrabajo?: string
  domicilio: string
  georeferenciacion?: string
  peso: string
  altura: string
  autoidentificacionId?: number
  poblacionVulnerableId?: number
  aliasDenunciado: string
  fechaValidezLicencia?: string
  parentescoVictimaId?: number
  gradoAlcoholico?: string
  fotoFrente?: string
  fotoDerecho?: string
  fotoIzquierdo?: string
  fotoCuerpo?: string
}

export interface VehiculoSinarap {
  tipoVehiculo?: string
  placa?: string
  claseId?: number
  servicioId?: number
  colorId?: number
  marcaId?: number
  tipo?: string
  industria?: string
  radicatoria?: string
  modelo?: number
  chasis?: string
  motor?: string
  cilindrada?: number
  foto?: string
  fotoBase64?: string
  tipoRegistro?: string
  licenciaManejo?: string
  observaciones?: string
}

export interface PersonaRegistroSinarap {
  persona: PersonaSinarap
  detallePersona: DetallePersonaSinarap
  vehiculos: VehiculoSinarap[]
}

export interface DetalleFuncionarioSinarap {
  numeroDocumento: string
  complemento?: string
  extencionPaisId?: number
  extencionDepartamentoId?: number
  gradoId?: number
  trabajoDepartamentoId?: number
  detalleTelefono?: string
  detalleDomicilio?: string
}

export interface DocumentoSinarap {
  tipoDocumento?: string
  descripcion?: string
  documentoArchivo?: string
}

export interface PayloadSinarap {
  antecedente: AntecedenteSinarap
  personas: PersonaRegistroSinarap[]
  detalleFuncionario?: DetalleFuncionarioSinarap | null
  documentos: DocumentoSinarap[]
}

export interface SinarapRegistroResponse {
  finalizado: boolean
  mensaje: string
  datos?: unknown
}

export async function postRegistroSinarap(
  body: PayloadSinarap
): Promise<SinarapRegistroResponse> {
  const response = await sesionPeticion({
    url: `${Constantes.baseUrl}/interoperabilidad/sinarap/registro`,
    method: 'POST',
    body,
    withCredentials: true,
  })

  return response
}