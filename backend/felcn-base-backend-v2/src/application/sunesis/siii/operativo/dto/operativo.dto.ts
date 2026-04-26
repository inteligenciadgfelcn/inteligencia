import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator'

/**
 * DTO unificado para crear y actualizar operativo.
 * idCaso proviene de la URL. numeroOperativo es ingresado por el usuario (txtnroinf).
 */
export class OperativoDto {
  @ApiProperty({
    description: 'Número de informe del operativo (ingresado por el usuario)',
    example: 'IC-042/2026',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numeroInforme: string

  @ApiProperty({ description: 'ID tipo de relevancia', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTipoRelevancia: number

  @ApiPropertyOptional({ description: 'ID tipo de denuncia', example: 1 })
  @IsOptional()
  @IsNumber()
  idTipoDenuncia?: number

  @ApiPropertyOptional({ description: 'ID tipo penal', example: 1 })
  @IsOptional()
  @IsNumber()
  idTipoPenal?: number

  @ApiProperty({
    description: 'Fecha del operativo',
    example: '2024-01-15T14:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  fechaOperativo: string

  @ApiProperty({ description: 'ID departamento', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idDepartamento: number

  @ApiProperty({ description: 'ID provincia', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idProvincia: number

  @ApiProperty({ description: 'ID localidad', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idLocalidad: number

  @ApiProperty({
    description: 'Lugar del operativo',
    example: 'Zona Sur, Calle 21',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lugar: string

  @ApiProperty({ description: 'ID categoría operativo', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idCategoriaOperativo: number

  @ApiProperty({ description: 'ID item operativo (subcategoría)', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idItemOperativo: number

  @ApiProperty({ description: 'ID unidad', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idUnidad: number

  @ApiProperty({ description: 'ID distrital', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idDistrital: number

  @ApiProperty({ description: 'ID grupo', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idGrupo: number

  @ApiProperty({ description: 'Oficial al mando', example: 'CAP. JUAN PEREZ' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  mando: string

  @ApiProperty({
    description: 'Coordenada X (latitud decimal negativa). El frontend convierte DMS si el usuario ingresa manualmente.',
    example: -17.395972,
  })
  @IsNotEmpty()
  @IsNumber()
  coordX: number

  @ApiProperty({
    description: 'Coordenada Y (longitud decimal negativa). El frontend convierte DMS si el usuario ingresa manualmente.',
    example: -66.156139,
  })
  @IsNotEmpty()
  @IsNumber()
  coordY: number

  @ApiProperty({ description: 'ID plan de operaciones', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idPlanOperacion: number

  @ApiPropertyOptional({ description: 'Breve detalle del operativo' })
  @IsOptional()
  @IsString()
  breveDetalle?: string

  @ApiProperty({ description: 'Descripción del operativo' })
  @IsNotEmpty()
  @IsString()
  descripcion: string

  @ApiProperty({ description: 'ID tipo de operación', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTipoOperacion: number

  @ApiProperty({ description: 'Organización', example: 'NARCOTRAFICANTES' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  organizacion: string

  @ApiPropertyOptional({ description: 'Clan familiar' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  clanFamiliar?: string
}
