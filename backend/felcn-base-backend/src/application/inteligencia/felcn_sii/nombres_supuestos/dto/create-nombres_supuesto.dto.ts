import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CreateNombresSupuestoDto {
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

  @ApiProperty({ example: 'Gomez', required: false })
  @IsString()
  @IsOptional()
  apellidoEsposo?: string
}
