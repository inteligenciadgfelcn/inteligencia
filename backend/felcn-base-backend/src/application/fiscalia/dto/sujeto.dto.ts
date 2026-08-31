import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTOs de sujetos del caso (3.7 / 3.8).
 * persona_natural XOR persona_juridica (validado en el servicio).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class PersonaNaturalDto {
  @ApiProperty({
    example: 1,
    description: 'Con segip, Sin segip, NN, Contra-autores',
  })
  @IsInt()
  @IsNotEmpty()
  tipo_identidad_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tipo_documento_id: number

  @ApiProperty({ example: '1234567' })
  @IsString()
  @IsNotEmpty()
  numero_documento: string

  @ApiPropertyOptional({ example: 'Juan' })
  @IsString()
  @IsOptional()
  nombres?: string

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsString()
  @IsOptional()
  primer_apellido?: string

  @ApiPropertyOptional({ example: 'Mamani' })
  @IsString()
  @IsOptional()
  segundo_apellido?: string

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsDateString()
  @IsOptional()
  fecha_nacimiento?: string

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  sexo?: boolean

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  genero_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  autoidentificacion_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  estado_civil_id?: number

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsArray()
  @IsOptional()
  idiomas_id?: number[]

  @ApiPropertyOptional({ example: 'Comerciante' })
  @IsString()
  @IsOptional()
  profesion?: string

  @ApiPropertyOptional({ example: '70000000' })
  @IsString()
  @IsOptional()
  celular?: string

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  celular_pais_id?: number

  @ApiPropertyOptional({ example: 'persona@correo.bo' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  nivel_educacion_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  grupo_vulnerable_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  grado_discapacidad_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  nacionalidad_id?: number

  @ApiPropertyOptional({ example: 20101 })
  @IsInt()
  @IsOptional()
  nacimiento_municipio_id?: number

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  es_ciudadano_digital?: boolean

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  esta_fallecido?: boolean

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  esta_desaparecido?: boolean
}

export class PersonaJuridicaDto {
  @ApiProperty({ example: 'Empresa S.R.L.' })
  @IsString()
  @IsNotEmpty()
  razon_social: string

  @ApiProperty({ example: '1023456789' })
  @IsString()
  @IsNotEmpty()
  nit: string

  @ApiPropertyOptional({ example: '22222222' })
  @IsString()
  @IsOptional()
  telefono?: string

  @ApiPropertyOptional({ example: 'empresa@correo.bo' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ example: '-16.500000' })
  @IsString()
  @IsOptional()
  latitud?: string

  @ApiPropertyOptional({ example: '-68.150000' })
  @IsString()
  @IsOptional()
  longitud?: string

  @ApiProperty({ example: 20101 })
  @IsInt()
  @IsNotEmpty()
  municipio_id: number

  @ApiPropertyOptional({ example: 'Calle Comercio Nro. 100' })
  @IsString()
  @IsOptional()
  direccion?: string
}

export class SujetoItemDto {
  @ApiProperty({ example: 1, description: 'Primary key del sujeto en el MP' })
  @IsInt()
  @IsNotEmpty()
  mp_caso_persona_id: number

  @ApiProperty({ example: [1], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  tipo_sujeto_id: number[]

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  parentesco_victima_id?: number

  @ApiPropertyOptional({ type: PersonaNaturalDto })
  @ValidateNested()
  @Type(() => PersonaNaturalDto)
  @IsOptional()
  persona_natural?: PersonaNaturalDto

  @ApiPropertyOptional({ type: PersonaJuridicaDto })
  @ValidateNested()
  @Type(() => PersonaJuridicaDto)
  @IsOptional()
  persona_juridica?: PersonaJuridicaDto

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  reserva_identidad?: boolean

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  es_querellante?: boolean
}

export class CrearSujetosDto {
  @ApiProperty({ type: [SujetoItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SujetoItemDto)
  sujetos: SujetoItemDto[]
}

export class ActualizarSujetoDto {
  @ApiProperty({ example: [1], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  tipo_sujeto_id: number[]

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  parentesco_victima_id?: number

  @ApiPropertyOptional({ type: PersonaNaturalDto })
  @ValidateNested()
  @Type(() => PersonaNaturalDto)
  @IsOptional()
  persona_natural?: PersonaNaturalDto

  @ApiPropertyOptional({ type: PersonaJuridicaDto })
  @ValidateNested()
  @Type(() => PersonaJuridicaDto)
  @IsOptional()
  persona_juridica?: PersonaJuridicaDto

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  es_querellante?: boolean

  @ApiPropertyOptional({
    example: 0,
    description: '0 para dar de baja al sujeto',
  })
  @IsIn([0, 1])
  @IsOptional()
  estado?: number
}

export class CrearAbogadoItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  mp_caso_persona_abogado_id: number

  @ApiProperty({ example: 'RPA-1234' })
  @IsString()
  @IsNotEmpty()
  codigo_rpa: string

  @ApiProperty({ example: '1234567' })
  @IsString()
  @IsNotEmpty()
  ci: string

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsNotEmpty()
  nombres: string

  @ApiPropertyOptional({ example: 'Quispe' })
  @IsString()
  @IsOptional()
  primer_apellido?: string

  @ApiPropertyOptional({ example: 'Condori' })
  @IsString()
  @IsOptional()
  segundo_apellido?: string

  @ApiProperty({ example: '1985-03-20' })
  @IsDateString()
  @IsNotEmpty()
  fecha_nacimiento: string
}

export class CrearAbogadosDto {
  @ApiProperty({ type: [CrearAbogadoItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CrearAbogadoItemDto)
  abogados: CrearAbogadoItemDto[]
}

export class ActualizarAbogadoDto {
  @ApiProperty({ example: 0, description: '0 para dar de baja al abogado' })
  @IsIn([0, 1])
  @IsNotEmpty()
  estado: number

  @ApiPropertyOptional({ example: 'Renuncia del abogado' })
  @IsString()
  @IsOptional()
  motivo_baja?: string
}

export class SituacionJuridicaItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  mp_caso_persona_situacion_juridica_id: number

  @ApiProperty({
    example: 1,
    description: 'Catálogo de situaciones jurídicas',
  })
  @IsInt()
  @IsNotEmpty()
  situacion_juridica_id: number

  @ApiProperty({ example: '2026-07-01T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string
}

export class CrearSituacionesJuridicasDto {
  @ApiProperty({ type: [SituacionJuridicaItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SituacionJuridicaItemDto)
  situaciones_juridicas: SituacionJuridicaItemDto[]
}

export class CrearDomicilioDto {
  @ApiProperty({
    example: 1,
    description: 'Primary key del domicilio en el MP',
  })
  @IsInt()
  @IsNotEmpty()
  mp_persona_domicilio_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  pais_id: number

  @ApiPropertyOptional({ example: 20101 })
  @IsInt()
  @IsOptional()
  municipio_id?: number

  @ApiPropertyOptional({ example: 'Av. Buenos Aires Nro. 100' })
  @IsString()
  @IsOptional()
  direccion?: string

  @ApiPropertyOptional({ example: '-16.500000' })
  @IsString()
  @IsOptional()
  latitud?: string

  @ApiPropertyOptional({ example: '-68.150000' })
  @IsString()
  @IsOptional()
  longitud?: string
}
