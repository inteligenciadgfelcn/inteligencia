import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator'

export class CreateOperativoDto {
  @ApiProperty({ description: 'ID del caso', example: '1' })
  @IsNotEmpty()
  @IsString()
  idCaso: string

  @ApiProperty({ description: 'ID tipo de relevancia', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTipoRelevancia: number

  @ApiProperty({ description: 'Número del operativo', example: 'OP-2024-001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numeroOperativo: string

  @ApiPropertyOptional({ description: 'ID tipo de denuncia', example: 1 })
  @IsOptional()
  @IsNumber()
  idTipoDenuncia?: number

  @ApiPropertyOptional({ description: 'ID tipo penal', example: 1 })
  @IsOptional()
  @IsNumber()
  idTipoPenal?: number

  @ApiProperty({ description: 'Fecha del operativo', example: '2024-01-15T14:30:00Z' })
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

  @ApiProperty({ description: 'Lugar del operativo', example: 'Zona Sur, Calle 21' })
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

  @ApiProperty({ description: 'Grados coordenada X (latitud)', example: 16 })
  @IsNotEmpty()
  @IsNumber()
  gradosX: number

  @ApiProperty({ description: 'Minutos coordenada X', example: 30 })
  @IsNotEmpty()
  @IsNumber()
  minX: number

  @ApiProperty({ description: 'Segundos coordenada X', example: 15.5 })
  @IsNotEmpty()
  @IsNumber()
  segX: number

  @ApiProperty({ description: 'Grados coordenada Y (longitud)', example: 68 })
  @IsNotEmpty()
  @IsNumber()
  gradosY: number

  @ApiProperty({ description: 'Minutos coordenada Y', example: 9 })
  @IsNotEmpty()
  @IsNumber()
  minY: number

  @ApiProperty({ description: 'Segundos coordenada Y', example: 30.2 })
  @IsNotEmpty()
  @IsNumber()
  segY: number

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
