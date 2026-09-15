import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer';
import {
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator'

export class CreateDetenidoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idOperativo?: number;
  
  @ApiProperty({
    example: '*',
    description: 'Solo en caso de ser licencia de conducir',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  serie?: string = '*';

  @ApiProperty({
    example: '*',
    description: 'otro tipo de documento',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  seccion?: string = '*';

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

  @ApiProperty({ example: 'Ninguna', description: 'Observacion de huellas' })
  @IsString()
  @IsOptional()
  observacionHuella?: string
}
