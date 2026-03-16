import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  MaxLength,
  IsEnum,
} from 'class-validator'
import { EstadoPersonaAuxiliar } from '../entity/detenido-auxiliar.entity'

export class CreateDetenidoDto {
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

  @ApiProperty({ description: 'ID tipo de documento', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTipoDocumento: number

  @ApiProperty({ description: 'Número de documento', example: '5432198-1A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  nroDocumento: string

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1985-05-15',
  })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string

  @ApiProperty({
    description: 'Género (true = Masculino, false = Femenino)',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  genero: boolean

  @ApiProperty({ description: 'Dirección', example: 'Av. 6 de Agosto #123' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  direccion: string

  @ApiProperty({
    description: 'Estado de la persona en el operativo',
    example: EstadoPersonaAuxiliar.APREHENDIDO,
    enum: EstadoPersonaAuxiliar,
  })
  @IsNotEmpty()
  @IsEnum(EstadoPersonaAuxiliar)
  estado: EstadoPersonaAuxiliar
}
