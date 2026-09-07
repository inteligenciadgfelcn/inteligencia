import { Transform, Type } from 'class-transformer'

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePersonasJuridicaDto {
  @ApiProperty({
    description: 'Identificador del operativo',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  opId: number

  @ApiProperty({
    description: 'Nombre o razón social de la empresa',
    example: 'Empresa Nacional S.R.L.',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string

  @ApiProperty({
    description: 'Número de Identificación Tributaria',
    example: '123456789',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nit: string

  @ApiProperty({
    description: 'Matrícula de comercio',
    example: 'MATRÍCULA-123456',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  matricula: string

  @ApiProperty({
    description: 'Representante legal',
    example: 'Juan Pérez López',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  representante: string

  @ApiPropertyOptional({
    description: 'Observaciones',
    example: 'Empresa vinculada al operativo',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  observaciones?: string | null

  @ApiPropertyOptional({
    description: 'Propietarios o socios',
    example: 'Juan Pérez; María López',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  propietarioSocio?: string | null

  @ApiPropertyOptional({
    description: 'Beneficiarios finales',
    example: 'Carlos Pérez López',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  beneficiariosFinales?: string | null

  @ApiPropertyOptional({
    description: 'Capital social declarado',
    example: '1500000.00',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  capitalSocial?: string | null

  @ApiPropertyOptional({
    description: 'Dirección de la empresa',
    example: 'Av. Arce N.º 1234, La Paz',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  direccion?: string | null

  @ApiPropertyOptional({
    description: 'Latitud de ubicación',
    example: '-16.5000',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  latitud?: string | null

  @ApiPropertyOptional({
    description: 'Longitud de ubicación',
    example: '-68.1500',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  longitud?: string | null

  @ApiPropertyOptional({
    description: 'Identificador del tipo de vínculo',
    example: '1',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  idTipoVinculo?: string | null

  @ApiPropertyOptional({
    description: 'Indica si la empresa fue sometida a pericia',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true
    }

    if (value === false || value === 'false' || value === 0 || value === '0') {
      return false
    }

    return value
  })
  @IsBoolean()
  pericia?: boolean = false

  @ApiPropertyOptional({
    description: 'Resultado de la pericia',
    example: 'La documentación fue verificada',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  resultado?: string | null

  @ApiPropertyOptional({
    description: 'Documento de respaldo de la empresa',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  documento?: any

  @ApiPropertyOptional({
    description: 'Imagen o logotipo de la empresa',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  imagen?: any
}
