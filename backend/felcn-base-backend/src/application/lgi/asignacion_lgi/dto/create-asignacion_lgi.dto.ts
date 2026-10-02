import { Type } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAsignacionLgiDto {
  @ApiProperty({
    description: 'ID de la regional o distrital',
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  disId!: number

  @ApiProperty({
    description: 'ID del puesto o grupo seleccionado',
    example: 5,
  })
  @Type(() => Number)
  @IsInt()
  idGrupo!: number

  @ApiProperty({
    description: 'Código del departamento',
    example: 'LP',
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  dptoavId!: string

  @ApiProperty({
    description: 'Responsable del llenado',
    example: 'JUAN PÉREZ',
    maxLength: 70,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  conformeA!: string

  @ApiProperty({
    description: 'Nombre asignado al caso',
    example: 'OPERATIVO CENTINELA',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nombreCaso!: string

  @ApiProperty({
    description: 'Número de caso generado por FELCN',
    example: 'LP-FELCN-1/26',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nroCaso!: string

  @ApiProperty({
    description: 'CUD o número de caso asignado por Fiscalía',
    example: '201102012600123',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nroCasoFis!: string

  @ApiProperty({
    description: 'Nombre del fiscal asignado',
    example: 'MARÍA LÓPEZ',
    maxLength: 70,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  remiteFiscal!: string

  @ApiProperty({
    description: 'Control jurisdiccional',
    example: 'JUZGADO PRIMERO DE INSTRUCCIÓN PENAL',
  })
  @IsString()
  @IsNotEmpty()
  controlJurisdiccional!: string

  @ApiProperty({
    description: 'Fecha de inicio de la investigación',
    example: '2026-09-06',
  })
  @IsNotEmpty()
  @IsDateString()
  fechaInicio!: string

  @ApiProperty({
    description: 'Forma inicio caso',
    example: 'Remision fiscalia',
    maxLength: 70,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  inicioCaso!: string

  @ApiProperty({
    description: 'Codigo servicio',
    example: 'ICIA-1619092026',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigoServicio!: string

  @ApiPropertyOptional({
    description: 'CUD PARALELA',
    example: '201102012600123',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  cudifp!: string
}
