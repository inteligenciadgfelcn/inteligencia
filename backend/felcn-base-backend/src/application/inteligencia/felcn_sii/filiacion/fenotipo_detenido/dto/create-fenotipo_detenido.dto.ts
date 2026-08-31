import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator'

export class CreateFenotipoDetenidoDto {
  @ApiProperty({ example: '1.50' })
  @IsString()
  @IsOptional()
  estatura?: string

  @ApiProperty({ example: '50' })
  @IsString()
  @IsOptional()
  pesoCorporal?: string

  @ApiProperty({ example: 'Cicatriz en rostro' })
  @IsString()
  @IsOptional()
  senasParticulares?: string

  @ApiProperty({ example: 'Brazo derecho' })
  @IsString()
  @IsOptional()
  tatuajes?: string

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  tipoNariz?: number

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  constitucionCorporal?: number

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idColorPiel?: number

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idColorCabello?: number

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idTipoCabello?: number

  @ApiProperty({ example: 6 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idColorOjos?: number

  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idTipoOjos?: number
}
