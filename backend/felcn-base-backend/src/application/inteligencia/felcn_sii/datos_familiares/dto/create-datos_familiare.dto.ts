import { ApiProperty } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator'

export class CreateDatosFamiliaresDto {
  @ApiProperty({ example: 154541 })
  @IsInt()
  @IsNotEmpty()
  idDetenido: number

  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  nombres: string

  @ApiProperty({ example: 'Perez', required: false })
  @IsString()
  @IsOptional()
  paterno?: string

  @ApiProperty({ example: 'Gomez', required: false })
  @IsString()
  @IsOptional()
  materno?: string

  @ApiProperty({ example: 45, required: false })
  @IsInt()
  @IsOptional()
  edad?: number

  @ApiProperty({ example: 'Av. Blanco Galindo km 5', required: false })
  @IsString()
  @IsOptional()
  direccion?: string

  @ApiProperty({ example: '70707070', required: false })
  @IsString()
  @IsOptional()
  telefono?: string

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  vivo?: boolean

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  implicado?: boolean
}
