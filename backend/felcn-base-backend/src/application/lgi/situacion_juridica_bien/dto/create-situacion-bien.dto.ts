import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSituacionBienDto {

  @ApiProperty({
    description: 'Fecha del requerimiento',
    example: '2026-09-06',
  })
  @IsDateString()
  fechaRequerimiento: string

  @ApiPropertyOptional({
    description: 'Fiscal requirente',
    example: 'Juan Pérez López',
    maxLength: 300,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  fiscalRequirente?: string | null

  @ApiPropertyOptional({
    description: 'Identificador de la calidad del bien',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  calbId?: number | null

  @ApiPropertyOptional({
    description: 'Fecha de entrega',
    example: '2026-09-06T15:30:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  fechaEntrega?: string | null

  @ApiProperty({
    description: 'Responsable de la entrega',
    example: 'Carlos Mamani Quispe',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  responsableEntrega: string

  @ApiProperty({
    description: 'Responsable de la recepción',
    example: 'María Condori Flores',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  responsableRecepcion: string

  @ApiProperty({
    description: 'Institución que recibe el bien',
    example: 'DIRECCIÓN GENERAL DE LA FELCN',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  institucion: string

  @ApiPropertyOptional({
    description: 'Ubicación actual del bien',
    example: 'Depósito central',
    maxLength: 150,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ubicacion?: string | null

  @ApiPropertyOptional({
    description: 'Fecha y hora de ingreso',
    example: '2026-09-06T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  fechaHoraIngreso?: string

  @ApiPropertyOptional({
    description: 'Usuario que registra la información',
    example: 'admin',
    maxLength: 15,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  usuario?: string
}
