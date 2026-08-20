import { Type } from 'class-transformer'
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class AntecedenteSinarapDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  municipioId?: number

  @ApiProperty({ example: 'SINARAP-2026-000001' })
  @IsString()
  codigoUnico: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  detalleIngreso?: string

  @ApiProperty({ example: '2026-06-08T08:30:00.000Z' })
  @IsString()
  fechaHoraIngreso: string

  @ApiProperty({ example: 'Av. Siempre Viva y Calle 2' })
  @IsString()
  lugarHecho: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  detalleHecho?: string

  @ApiProperty({ example: 2 })
  @IsNumber()
  calidadIngresoId: number

  @ApiProperty({ example: '-16.5000,-68.1500' })
  @IsString()
  @IsOptional()
  georeferenciacion?: string

  @ApiProperty({ example: 'CASO-001/2026' })
  @IsString()
  numeroCasoInterno: string

  @ApiProperty({ example: '2026-06-08' })
  @IsString()
  fechaHecho: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  observaciones?: string
}

export class PersonaSinarapDto {
  @ApiProperty({ example: '1234567' })
  @IsString()
  numeroDocumento: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  complemento?: string

  @ApiProperty({ example: 'JUAN CARLOS' })
  @IsString()
  nombres: string

  @ApiProperty({ example: 'PEREZ' })
  @IsString()
  primerApellido: string

  @ApiProperty({ example: 'GOMEZ' })
  @IsString()
  segundoApellido: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  sexoId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  tipoDocumentoId: number

  @ApiProperty({ example: 'La Paz' })
  @IsString()
  lugarNacimiento: string

  @ApiProperty({ example: '1990-04-12' })
  @IsString()
  fechaNacimiento: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fotoPersona?: string

  @ApiProperty({ example: 't' })
  @IsString()
  verificado: string

  @ApiProperty({ example: 'SEGIP' })
  @IsString()
  personaRegistro: string
}

export class DetallePersonaSinarapDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  extencionPaisId?: number

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsOptional()
  extencionDepartamentoId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  profesionId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  estadoCivilId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  nacionalidadId: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  nivelEducacionId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  municipioId?: number

  @ApiProperty({ example: '70000000' })
  @IsString()
  @IsOptional()
  telefono?: string

  @ApiProperty({ example: '70000001' })
  @IsString()
  @IsOptional()
  celular?: string

  @ApiProperty({ example: 'persona@example.com' })
  @IsString()
  @IsOptional()
  correoElectronico?: string

  @ApiProperty({ example: 'Empresa de transporte' })
  @IsString()
  @IsOptional()
  lugarTrabajo?: string

  @ApiProperty({ example: 'Zona Central, calle principal #123' })
  @IsString()
  domicilio: string

  @ApiProperty({ example: '-16.5001,-68.1501' })
  @IsString()
  @IsOptional()
  georeferenciacion?: string

  @ApiProperty({ example: '70' })
  @IsString()
  peso: string

  @ApiProperty({ example: '1.70' })
  @IsString()
  altura: string

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  autoidentificacionId?: number

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  poblacionVulnerableId?: number

  @ApiProperty({ example: 'El Chino' })
  @IsString()
  aliasDenunciado: string

  @ApiProperty({ example: '2028-12-31' })
  @IsString()
  @IsOptional()
  fechaValidezLicencia?: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  parentescoVictimaId?: number

  @ApiProperty({ example: '0.5' })
  @IsString()
  @IsOptional()
  gradoAlcoholico?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fotoFrente?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fotoDerecho?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fotoIzquierdo?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fotoCuerpo?: string
}

export class VehiculoSinarapDto {
  @ApiProperty({ example: 'TERRESTRE' })
  @IsString()
  @IsOptional()
  tipoVehiculo?: string

  @ApiProperty({ example: '1234ABC' })
  @IsString()
  @IsOptional()
  placa?: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  claseId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  servicioId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  colorId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  marcaId?: number

  @ApiProperty({ example: 'VAGONETA' })
  @IsString()
  @IsOptional()
  tipo?: string

  @ApiProperty({ example: 'JAPONESA' })
  @IsString()
  @IsOptional()
  industria?: string

  @ApiProperty({ example: 'LA PAZ' })
  @IsString()
  @IsOptional()
  radicatoria?: string

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @IsOptional()
  modelo?: number

  @ApiProperty({ example: 'CHASIS123456' })
  @IsString()
  @IsOptional()
  chasis?: string

  @ApiProperty({ example: 'MOTOR123456' })
  @IsString()
  @IsOptional()
  motor?: string

  @ApiProperty({ example: 1800 })
  @IsNumber()
  @IsOptional()
  cilindrada?: number

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  foto?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  fotoBase64?: string

  @ApiProperty({ example: 'MANUAL' })
  @IsString()
  @IsOptional()
  tipoRegistro?: string

  @ApiProperty({ example: 'LIC-123456' })
  @IsString()
  @IsOptional()
  licenciaManejo?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  observaciones?: string
}

export class PersonaRegistroSinarapDto {
  @ApiProperty({ type: PersonaSinarapDto })
  @ValidateNested()
  @Type(() => PersonaSinarapDto)
  persona: PersonaSinarapDto

  @ApiProperty({ type: DetallePersonaSinarapDto })
  @ValidateNested()
  @Type(() => DetallePersonaSinarapDto)
  detallePersona: DetallePersonaSinarapDto

  @ApiProperty({ type: [VehiculoSinarapDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehiculoSinarapDto)
  vehiculos: VehiculoSinarapDto[]
}

export class DetalleFuncionarioSinarapDto {
  @ApiProperty({ example: '7654321' })
  @IsString()
  numeroDocumento: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  complemento?: string

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  extencionPaisId?: number

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsOptional()
  extencionDepartamentoId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  gradoId?: number

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  trabajoDepartamentoId?: number

  @ApiProperty({ example: '70000002' })
  @IsString()
  @IsOptional()
  detalleTelefono?: string

  @ApiProperty({ example: 'Oficinas FELCN central' })
  @IsString()
  @IsOptional()
  detalleDomicilio?: string
}

export class DocumentoSinarapDto {
  @ApiProperty({ example: 'PDF' })
  @IsString()
  @IsOptional()
  tipoDocumento?: string

  @ApiProperty({ example: 'Acta de intervencion policial' })
  @IsString()
  @IsOptional()
  descripcion?: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  documentoArchivo?: string
}

export class RegistroSinarapDto {
  @ApiProperty({ type: AntecedenteSinarapDto })
  @ValidateNested()
  @Type(() => AntecedenteSinarapDto)
  antecedente: AntecedenteSinarapDto

  @ApiProperty({ type: [PersonaRegistroSinarapDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonaRegistroSinarapDto)
  personas: PersonaRegistroSinarapDto[]

  @ApiProperty({ type: DetalleFuncionarioSinarapDto, nullable: true })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => DetalleFuncionarioSinarapDto)
  detalleFuncionario?: DetalleFuncionarioSinarapDto | null

  @ApiProperty({ type: [DocumentoSinarapDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentoSinarapDto)
  documentos: DocumentoSinarapDto[]
}
