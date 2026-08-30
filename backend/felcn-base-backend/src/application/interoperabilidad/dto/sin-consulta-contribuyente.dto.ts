import { IsOptional, IsString } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class SinConsultaContribuyenteDto {
  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  nitConsulta?: string

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  entidad?: string

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  usuario?: string

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  nombre?: string

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  documento?: string

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  motivo?: string

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  numeroProceso?: string
}
