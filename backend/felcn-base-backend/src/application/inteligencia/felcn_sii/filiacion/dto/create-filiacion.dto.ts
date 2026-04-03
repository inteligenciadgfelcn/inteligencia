import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { CreateAliasDetenidoDto } from '../alias_detenido/dto/create-alias_detenido.dto'
import { CreateDetenidoDto } from '../detenido/dto/create-detenido.dto'
import { CreateDocumentoDetenidoDto } from '../documento_detenido/dto/create-documento_detenido.dto'
import { CreateFenotipoDetenidoDto } from '../fenotipo_detenido/dto/create-fenotipo_detenido.dto'
import { CreateProfesionDetenidoDto } from '../profesion_detenido/dto/create-profesion_detenido.dto'
import { CreateArrestadoAuxiliarDto } from '@/application/inteligencia/felcn_siii/operaciones/filiacion/arrestado_auxiliar/dto/create-arrestado_auxiliar.dto'

export class CreateFiliacionDto {
  @ApiProperty({ example: 421, description: 'Id de persona auxiliar' })
  @Type(() => Number)
  @IsNumber()
  idPersona: number

  @ApiProperty({ example: 'Aprehendido', description: 'Estado de persona' })
  @IsString()
  estadoPersona: string

  @ApiProperty({ example: 'BN-C-1/26', description: 'Número de caso' })
  @IsString()
  @MaxLength(50)
  numeroCaso?: string

  @ApiProperty({ example: 'Juan', description: 'Nombres del detenido' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombres: string

  @ApiProperty({ example: 'Perez', description: 'Apellido paterno' })
  @IsString()
  @MaxLength(150)
  apellidoPaterno?: string

  @ApiProperty({ example: 'Lopez', description: 'Apellido materno' })
  @IsString()
  @MaxLength(150)
  apellidoMaterno?: string

  @ApiProperty({
    example: '',
    description: 'Apellido de esposo si corresponde',
  })
  @IsString()
  @MaxLength(150)
  apellidoEsposo?: string

  @ApiProperty({ example: 1, description: 'ID del país' })
  @Type(() => Number)
  @IsNumber()
  idPais?: number

  @ApiProperty({ example: true, description: 'Indica si es masculino' })
  @IsBoolean()
  genero?: boolean

  @ApiProperty({ example: '1996-12-25', description: 'Fecha de nacimiento' })
  @IsDateString()
  fechaNacimiento?: string

  @ApiProperty({ example: 2, description: 'ID del estado civil' })
  @Type(() => Number)
  @IsNumber()
  idEstadoCivil?: number

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección del detenido',
  })
  @IsString()
  @IsOptional()
  direccion?: string

   @ApiProperty({ example: 'Sin antecedentes', description: 'Observaciones' })
  @IsString()
  @IsOptional()
  observacion?: string

  @ApiProperty({ type: CreateDetenidoDto })
  @ValidateNested()
  @Type(() => CreateDetenidoDto)
  detenido: CreateDetenidoDto

  @ApiProperty({ type: CreateAliasDetenidoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAliasDetenidoDto)
  alias?: CreateAliasDetenidoDto

  @ApiProperty({ type: CreateProfesionDetenidoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfesionDetenidoDto)
  profesion?: CreateProfesionDetenidoDto

  @ApiProperty({ type: CreateDocumentoDetenidoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDocumentoDetenidoDto)
  documento?: CreateDocumentoDetenidoDto

  @ApiProperty({ type: CreateFenotipoDetenidoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFenotipoDetenidoDto)
  fenotipo?: CreateFenotipoDetenidoDto

  @ApiProperty({ type: CreateArrestadoAuxiliarDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateArrestadoAuxiliarDto)
  arrestado?: CreateArrestadoAuxiliarDto
}
