import { IsString, IsOptional, IsNumber, IsDateString, IsNotEmpty } from 'class-validator'

/**
 * DTO para la creación de un nuevo registro de Fiscal.
 */
export class CreateFiscalDto {
  @IsString()
  @IsNotEmpty()
  nombreApellidos: string

  @IsString()
  @IsOptional()
  telefonoCelular?: string = ''

  @IsString()
  @IsOptional()
  telefonoFijo?: string = ''

  @IsDateString()
  @IsNotEmpty()
  fecha: string
}

/**
 * DTO para la creación de un nuevo registro de Jurisdicción.
 */
export class CreateJurisdiccionDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string

  @IsString()
  @IsNotEmpty()
  jurisdiccion: string

  @IsString()
  @IsOptional()
  observacion?: string = ''
}

/**
 * DTO para la creación de un nuevo registro de Control Jurisdiccional.
 */
export class CreateControlJurisdiccionalDto {
  @IsString()
  @IsNotEmpty()
  juzgadoInstruccion: string

  @IsString()
  @IsOptional()
  juzgadoPartido?: string = ''

  @IsString()
  @IsOptional()
  tribunalSentencia?: string = ''

  @IsString()
  @IsOptional()
  juzgadoEjecucion?: string = ''

  @IsDateString()
  @IsNotEmpty()
  fecha: string
}

/**
 * DTO para agregar un servidor policial a un operativo.
 */
export class CreateServidorPolicialDto {
  @IsNumber()
  @IsNotEmpty()
  idGrado: number

  @IsString()
  @IsNotEmpty()
  nombreApellidos: string
}

/**
 * DTO para la actualización de metadatos globales del caso.
 */
export class UpdateMetadatosCasoDto {
  @IsString()
  @IsOptional()
  ianus?: string

  @IsString()
  @IsOptional()
  numeroCasoPerDom?: string

  @IsNumber()
  @IsOptional()
  idEtapaInvestigacion?: number

  @IsString()
  @IsOptional()
  descripcionOperativo?: string
}

/**
 * DTO para agregar un investigador asignado al caso.
 * Origen: btnasignado_Click — FRM-JUR-01.aspx.cs
 */
export class CreateInvestigadorDto {
  @IsNumber()
  @IsNotEmpty()
  idGrado: number

  @IsString()
  @IsNotEmpty()
  nombreApp: string

  @IsString()
  @IsOptional()
  telefonoCelular?: string = ''

  @IsString()
  @IsOptional()
  telefonoFijo?: string = ''

  @IsDateString()
  @IsNotEmpty()
  fecha: string
}
