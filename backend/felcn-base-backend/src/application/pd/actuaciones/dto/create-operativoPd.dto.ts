import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateOperativoPdDto {
  @ApiProperty({
    example: 95,
    description: 'Identificador del caso',
  })
  @Type(() => Number)
  @IsInt()
  casosId!: number

  @ApiProperty({
    example: 'INF-001-2026',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  opNrooper!: string

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  idTipoInforme!: number

  @ApiPropertyOptional({
    example: 'Informe de actuación de otro tipo',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  otroInforme?: string

   @ApiProperty({
    example: 'Lugar del operativo',
  })
  @IsString()
  @IsNotEmpty()
  opLugar!: string

  @ApiProperty({
    example: 'Descripción detallada del operativo realizado',
  })
  @IsString()
  @IsNotEmpty()
  opDescripcion!: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo PDF, DOC o DOCX. Tamaño máximo: 10 MB',
  })
  archivo!: Express.Multer.File
}
