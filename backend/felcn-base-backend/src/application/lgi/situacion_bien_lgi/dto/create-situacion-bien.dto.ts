import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateSituacionBienDto {
  @ApiProperty({
    description: 'ID del bien secuestrado',
    example: '150',
    type: String,
  })
  @IsNotEmpty()
  @IsNumberString({ no_symbols: true })
  itemBienSecId: string

  @ApiProperty({
    description: 'Nombre del fiscal requirente',
    example: 'Dra. María Pérez',
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  fiscalRequirente: string

  @ApiProperty({
    description:
      'Calidad del bien: 1 Custodio, 2 Depositario, 3 Administrador, ' +
      '4 Devolución, 5 Entrega a DIRCABI',
    example: '5',
    enum: ['1', '2', '3', '4', '5'],
    type: String,
  })
  @IsString()
  @IsIn(['1', '2', '3', '4', '5'])
  calbId: string

  @ApiProperty({
    description: 'Fecha y hora de entrega del bien',
    example: '2026-10-04T14:30:00',
    type: String,
  })
  @IsNotEmpty()
  @IsDateString()
  fechaEntrega: string

  @ApiProperty({
    description: 'Nombre del responsable de recepción',
    example: 'Juan López',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  responsableRecepcion: string

  @ApiPropertyOptional({
    description:
      'Institución receptora. Solo aplica cuando calbId es "5" ' +
      '(Entrega a DIRCABI)',
    example: 'DIRCABI La Paz',
    maxLength: 150,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  institucion?: string | null

  @ApiPropertyOptional({
    description:
      'Ubicación del bien. Solo aplica cuando calbId es "5" ' +
      '(Entrega a DIRCABI)',
    example: 'Depósito de DIRCABI, La Paz',
    maxLength: 150,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ubicacion?: string | null

  @ApiPropertyOptional({
    description: 'ID del tipo de documento',
    example: 1,
    nullable: true,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  idTipoDocumento?: number | null

  @ApiPropertyOptional({
    description: 'Número de documento del responsable de recepción',
    example: '1234567',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  numeroDocumento?: string | null
}