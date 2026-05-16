import { IsString, IsOptional, IsNumber, IsDateString, IsNotEmpty } from 'class-validator'

/**
 * DTO para registrar una situación legal de un implicado.
 * Origen: FRM-JUR-02.aspx.cs — btnsituacion_Click
 */
export class CreateSituacionDto {
  @IsNumber()
  @IsNotEmpty()
  idSituacionLegal: number

  @IsString()
  @IsNotEmpty()
  nroResolucion: string

  @IsString()
  @IsNotEmpty()
  lugar: string

  @IsDateString()
  @IsNotEmpty()
  fecha: string

  @IsString()
  @IsNotEmpty()
  autoridad: string

  @IsString()
  @IsNotEmpty()
  fjt: string
}

/**
 * DTO para registrar una etapa del proceso de un implicado.
 * Origen: FRM-JUR-02.aspx.cs — btnguardaetapa_Click
 */
export class CreateEtapaProcesoDto {
  @IsNumber()
  @IsNotEmpty()
  idEstado: number

  @IsString()
  @IsNotEmpty()
  nroResolucion: string

  @IsString()
  @IsNotEmpty()
  lugar: string

  @IsDateString()
  @IsNotEmpty()
  fecha: string

  @IsString()
  @IsNotEmpty()
  autoridad: string

  @IsString()
  @IsNotEmpty()
  fjt: string
}
