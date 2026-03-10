import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class CreateFenotipoDetenidoDto {
  @ApiProperty({ example: '1.50', description: '' })
  @IsString()
  @IsOptional()
  estatura?: string

  @ApiProperty({ example: '50', description: '' })
  @IsString()
  @IsOptional()
  pesoCorporal?: string

  @ApiProperty({ example: '50', description: '' })
  @IsString()
  @IsOptional()
  senasParticulares?: string

  @ApiProperty({ example: '50', description: '' })
  @IsString()
  @IsOptional()
  tatuajes?: string

  @ApiProperty({ example: 1, description: 'Id tipo de nariz' })
  @IsString()
  @IsOptional()
  tipoNariz?: number

  @ApiProperty({ example: true, description: 'Id constitucion corporal' })
  @IsBoolean()
  constitucionCorporal?: number

  @ApiProperty({ example: true, description: 'Id color de piel' })
  @IsBoolean()
  idColorPiel?: number

  @ApiProperty({ example: true, description: 'Id color de cabello' })
  @IsBoolean()
  idColorCabello?: number

  @ApiProperty({ example: true, description: 'Id tipo de cabello' })
  @IsBoolean()
  TipoCabello?: number

  @ApiProperty({ example: true, description: 'Id color de ojos' })
  @IsBoolean()
  idColorOjos?: number

  @ApiProperty({ example: true, description: 'Id tipo de ojos' })
  @IsBoolean()
  idTipoOjos?: number
}
