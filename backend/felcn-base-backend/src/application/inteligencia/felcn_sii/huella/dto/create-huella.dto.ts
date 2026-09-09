import { IsInt, IsString, IsNotEmpty, Min, Max } from 'class-validator'

export class CreateHuellaDto {
  @IsInt()
  idPersona: number

  @IsString()
  @IsNotEmpty()
  dedo: string

  @IsString()
  @IsNotEmpty()
  imagen: string

  @IsString()
  @IsNotEmpty()
  wsq: string

  @IsInt()
  @Min(0)
  @Max(100)
  calidad: number
}
