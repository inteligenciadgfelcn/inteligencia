import { IsString } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, MaxLength } from 'class-validator'

export class CreateArrestadoAuxiliarDto {
  @ApiProperty({ example: 4, description: 'Id de operativo' })
  @Type(() => Number)
  @IsNumber()
  idOperativo: number

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Lugar de operativo',
  })
  @IsString()
  lugarOperativo?: string

  @ApiProperty({ example: 'Los pinos', description: 'Lugar de nacimiento' })
  @IsString()
  @MaxLength(20)
  lugarNacimiento?: string

  @ApiProperty({ example: 'base64imagen', description: 'Foto dedo izquierdo' })
  @IsString()
  @IsOptional()
  fotoDedoIzquierdo?: string

  @ApiProperty({ example: 'base64imagen', description: 'Foto dedo derecho' })
  @IsString()
  @IsOptional()
  fotoDedoDerecho?: string
}
