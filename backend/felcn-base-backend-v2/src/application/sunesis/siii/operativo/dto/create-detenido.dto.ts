import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator'

export class CreateDetenidoDto {
  @ApiProperty({ description: 'Número de caso', example: 'CASO-2024-001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  numeroCaso: string

  @ApiProperty({ description: 'Nombres', example: 'JUAN CARLOS' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombres: string

  @ApiProperty({ description: 'Apellido paterno', example: 'PEREZ' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  apellidoPaterno: string

  @ApiPropertyOptional({ description: 'Apellido materno', example: 'GARCIA' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellidoMaterno?: string

  @ApiPropertyOptional({ description: 'Apellido de esposo', example: '' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellidoEsposo?: string

  @ApiProperty({ description: 'ID país (nacionalidad)', example: 70 })
  @IsNotEmpty()
  @IsNumber()
  idPais: number

  @ApiProperty({ description: 'Es masculino', example: true })
  @IsNotEmpty()
  @IsBoolean()
  esMasculino: boolean

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1985-05-15',
  })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string

  @ApiProperty({ description: 'ID estado civil', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idEstadoCivil: number

  @ApiPropertyOptional({ description: 'Serie del documento', example: 'LP' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  serie?: string

  @ApiPropertyOptional({ description: 'Sección del documento', example: 'A' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  seccion?: string

  @ApiProperty({ description: 'Dirección', example: 'Av. 6 de Agosto #123' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  direccion: string

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString()
  observaciones?: string
}
