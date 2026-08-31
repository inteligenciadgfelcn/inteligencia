import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator'

/**
 * DTO para registrar el acto de secuestro de un ítem de bien.
 * Origen: FRM-JUR-03.aspx.cs — btnsecuestro_Click
 */
export class CreateBienSecuestradoDto {
  @IsString()
  @IsNotEmpty()
  fiscal: string

  @IsDateString()
  @IsNotEmpty()
  fechaActoSecuestro: string

  @IsString()
  @IsNotEmpty()
  investigador: string
}

/**
 * DTO para registrar la incautación de un ítem de bien mediante resolución.
 * Origen: FRM-JUR-03.aspx.cs — btnincautado_Click
 */
export class CreateBienIncautadoDto {
  @IsString()
  @IsNotEmpty()
  numeroResolucion: string

  @IsDateString()
  @IsNotEmpty()
  fechaResolucion: string

  @IsString()
  @IsNotEmpty()
  autoridad: string
}

/**
 * DTO para registrar la confiscación de un ítem de bien mediante sentencia judicial.
 * Origen: FRM-JUR-03.aspx.cs — btnconfiscado_Click
 */
export class CreateBienConfiscadoDto {
  @IsString()
  @IsNotEmpty()
  numeroSentenciaJudicial: string

  @IsDateString()
  @IsNotEmpty()
  fechaSentenciaJudicial: string

  @IsString()
  @IsNotEmpty()
  autoridad: string
}

/**
 * DTO para registrar la pérdida de dominio de un ítem de bien.
 * Origen: FRM-JUR-03.aspx.cs — btnperdidadom_Click
 * Nota: en el formulario original txtpdrequerim se insertaba en el campo Autoridad.
 */
export class CreatePerdidaDominioDto {
  @IsString()
  @IsNotEmpty()
  fiscalia: string

  @IsDateString()
  @IsNotEmpty()
  fechaResolucion: string

  @IsString()
  @IsNotEmpty()
  autoridad: string
}

/**
 * DTO para registrar la situación y entrega de un ítem de bien secuestrado.
 * Origen: FRM-JUR-03.aspx.cs — btnentrega_Click
 */
export class CreateSituacionBienDto {
  @IsDateString()
  @IsNotEmpty()
  fechaRequerimiento: string

  @IsString()
  @IsNotEmpty()
  fiscalRequerimiento: string

  @IsNumber()
  @IsNotEmpty()
  idCalidadBien: number

  @IsDateString()
  @IsNotEmpty()
  fechaEntrega: string

  @IsString()
  @IsNotEmpty()
  responsableEntrega: string

  @IsString()
  @IsNotEmpty()
  responsableRecepcion: string

  @IsString()
  @IsNotEmpty()
  institucion: string

  @IsString()
  @IsNotEmpty()
  ubicacion: string
}
