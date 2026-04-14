import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator'

export class CreateDetenidoDto {
  @ApiProperty({
    example: '*',
    description: 'Solo en caso de ser licencia de conducir',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  serie?: string

  @ApiProperty({
    example: '*',
    description: 'otro tipo de documento',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  seccion?: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  tieneTarjeta?: boolean

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  estaVivo?: boolean

  @ApiProperty({ example: 'base64imagen', description: 'Foto frontal' })
  @IsString()
  fotoFrente?: string

  @ApiProperty({ example: 'base64imagen', description: 'Foto perfil derecho' })
  @IsString()
  fotoPerfilDerecho?: string

  @ApiProperty({
    example: 'base64imagen',
    description: 'Foto perfil izquierdo',
  })
  @IsString()
  fotoPerfilIzquierdo?: string

  @ApiProperty({ example: 'Sin antecedentes', description: 'Observaciones' })
  @IsString()
  @IsOptional()
  observacionAdicional?: string
}
