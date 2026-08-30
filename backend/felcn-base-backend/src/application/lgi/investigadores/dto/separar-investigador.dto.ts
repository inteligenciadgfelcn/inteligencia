import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import {
  ApiHideProperty,
  ApiProperty,
} from '@nestjs/swagger'

export class SepararInvestigadorDto {
  @ApiProperty({
    description: 'Fecha de separación',
    example: '2026-08-30T15:00:00-04:00',
    format: 'date-time',
  })
  @IsDateString()
  fechaSeparacion!: string

  @ApiHideProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  usuarioActualizacion!: string
}