import { Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import {
  ApiProperty,
} from '@nestjs/swagger'

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
  cudIfp!: string

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
    maxLength: 70,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  controlJurisdiccional!: string
}