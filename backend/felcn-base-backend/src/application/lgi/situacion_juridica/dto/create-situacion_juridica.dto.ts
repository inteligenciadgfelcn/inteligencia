import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsString, MaxLength } from 'class-validator'

export class CreateSituacionJuridicaDto {
  @ApiProperty({
    description: 'Identificador de la persona implicada',
    example: 912,
  })
  @Type(() => Number)
  @IsInt()
  detenidoId!: number

  @ApiProperty({
    description: 'Identificador de la situación jurídica',
    example: 3,
  })
  @Type(() => Number)
  @IsInt()
  situacionLegalId!: number

  @ApiProperty({
    description: 'Fecha de la situación jurídica',
    example: '2026-08-17',
  })
  @IsDateString()
  fecha!: string

  @ApiProperty({
    description: 'Número de resolución',
    example: 'RES-123/2026',
  })
  @IsString()
  @MaxLength(50)
  numeroResolucion!: string

  @ApiProperty({
    description: 'Lugar',
    example: 'La Paz',
  })
  @IsString()
  @MaxLength(100)
  lugar!: string

   @ApiProperty({
    description: 'Autoridad',
    example: 'Juzgado de Instrucción Penal',
  })
  @IsString()
  @MaxLength(150)
  autoridad!: string

  @ApiProperty({
    description: 'Jusgado',
    example: 'Nombre del Juzgado',
  })
  @IsString()
  @MaxLength(100)
  fjt!: string
  
}
