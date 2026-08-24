
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import {
  ApiProperty,
} from '@nestjs/swagger'

export class AsignarInvestigadorDto {
  @ApiProperty({
    description:
      'Número de pase del investigador',
    example: 'INV-0001',
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  numeroPase!: string

  @ApiProperty({
    description:
      'Número de memorándum de asignación',
    example: 'MEMO-001/26',
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  memo!: string

  @ApiProperty({
    description: 'Fecha de asignación',
    example: '2026-08-23T10:30:00-04:00',
    format: 'date-time',
  })
  @IsDateString()
  fechaAsignacion!: string
}