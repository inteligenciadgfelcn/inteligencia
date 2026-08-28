import { ApiProperty } from '@nestjs/swagger'
import { Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumberInRangeConstraint,
  IsNumberString,
  IsString,
  NombreApellido,
  NroDocumento,
  ValidateIf,
} from '@/common/validation'

export class CompletarSolicitudRegistroDto {
  @ApiProperty({ description: 'Token firmado recibido en el correo del paso 1' })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({ example: 'MARIELA' })
  @IsNotEmpty()
  @NombreApellido()
  nombres: string

  @ApiProperty({ example: 'ALCAZAR' })
  @IsString()
  @ValidateIf((o) => !o.segundoApellido)
  @NombreApellido()
  primerApellido?: string

  @ApiProperty({ example: 'ALMARAZ' })
  @ValidateIf((o) => !o.primerApellido)
  @NombreApellido()
  segundoApellido?: string

  @ApiProperty({ example: '4192299' })
  @IsNotEmpty()
  @NroDocumento()
  @Transform(({ value }) => value?.trim())
  nroDocumento: string

  @ApiProperty({ example: '1995-05-04' })
  @IsDateString()
  fechaNacimiento: string

  @ApiProperty({ example: '71234567' })
  @IsNotEmpty()
  @IsNumberString()
  @Validate(IsNumberInRangeConstraint, [60000000, 79999999])
  telefono: string

  @ApiProperty({ example: 1, description: 'ID del grado policial/militar' })
  @IsNotEmpty()
  @IsInt()
  idGrado: number

  @ApiProperty({ example: 'P-001234' })
  @IsNotEmpty()
  @IsString()
  numeroPase: string
}
