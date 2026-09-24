import { ApiProperty } from '@nestjs/swagger'

export class ConsultaSiiiQueryDto {

  @ApiProperty({ required: false, description: 'Código de servicio (parcial)', example: 'SERV-01' })
  codigoServicio?: string

  @ApiProperty({ required: false, description: 'Fecha inicio (YYYY-MM-DD)', example: '2025-01-01' })
  fechaInicio?: string

  @ApiProperty({ required: false, description: 'Fecha fin (YYYY-MM-DD)', example: '2025-12-31' })
  fechaFin?: string

  @ApiProperty({ required: false, description: 'Número de caso (parcial)', example: 'FELCN-2025' })
  numeroCaso?: string

  @ApiProperty({ required: false, description: 'Nombre del caso (parcial)', example: 'Operación Luz' })
  nombreCaso?: string

  @ApiProperty({ required: false, description: 'Nombres de la persona implicada (parcial)', example: 'Juan' })
  nombresPersona?: string

  @ApiProperty({ required: false, description: 'Apellido paterno de la persona (parcial)', example: 'Pérez' })
  apellidoPaterno?: string

  @ApiProperty({ required: false, description: 'Apellido materno de la persona (parcial)', example: 'López' })
  apellidoMaterno?: string

  @ApiProperty({ required: false, description: 'Número de documento de la persona (parcial)', example: '12345678' })
  nroDocumento?: string
}

export interface RespuestaAvanzadaCompleta {
  filas: ResultadoConsultaAvanzada[]
}

export interface ResultadoConsultaAvanzada {
  idOperativo: string
  fechaOperativo: string
  numeroCaso: string
  numeroOperativo: string
  numeroInforme: string
  ubicacionInstitucional: string
  ubicacionGeografica: string
  nombreCaso: string
  ianus: string
  fiscalSolicitud: string
  asignado: string
  asignadoFiscal: string
  tipoOperativo: string
  tipoRelevancia: string
  colorRelevancia: string
  categoriaOperativo: string
  planOperacion: string
  tipoDenuncia: string | null
  tipoPenal: string | null
  organizacion: string
  alMandoDe: string
  clanFamiliar: string | null
  esPositivo: boolean
  esAprehendido: boolean
  esArrestado: boolean
  esIcia: boolean
  esParteDiario: boolean
  esRevisado: boolean
  coordX: number
  coordY: number
  personasImplicadas: string

  detalleBienes: Array<{
    idItemBienSecuestrado: string
    tipoBien: string
    cantidad: number
    costoAproximado: number
    costoCuantificado: number
    enInvestigacion: boolean
    caracteristicas: Array<{
      idCatalogoCaracteristica: number
      descripcion: string
    }>
    esSecuestrado: boolean
    esIncautado: boolean
    esConfiscado: boolean
  }>

  costoTotalAproximadoBienes: number
  costoTotalCuantificadoBienes: number
}
