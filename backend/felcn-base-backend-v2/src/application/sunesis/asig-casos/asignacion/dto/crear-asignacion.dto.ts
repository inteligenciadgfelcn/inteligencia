import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator'

export class CrearAsignacionDto {
  @ApiProperty({ description: 'ID del departamento', maxLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  idDepartamento: string

  @ApiProperty({ description: 'ID de la unidad', maxLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  idUnidad: string

  @ApiProperty({ description: 'Código de letra', maxLength: 3 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  codigoLetra: string

  @ApiProperty({ description: 'Número de caso', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numeroCaso: string

  @ApiProperty({ description: 'Número de operativo', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numeroOperativo: string

  @ApiPropertyOptional({ description: 'Fecha del operativo' })
  @IsOptional()
  @IsDateString()
  fechaOperativo?: string

  @ApiProperty({ description: 'Nombre del caso', maxLength: 30 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  nombreCaso: string

  @ApiProperty({ description: 'Asignación del caso', maxLength: 70 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  asignacionCaso: string

  @ApiProperty({ description: 'Código de servicio', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  codigoServicio: string

  @ApiProperty({ description: 'Fiscal asignado', maxLength: 70 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  fiscalAsignado: string
}
