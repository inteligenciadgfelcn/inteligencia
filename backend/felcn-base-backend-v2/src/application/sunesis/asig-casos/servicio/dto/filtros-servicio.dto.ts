import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PaginacionQueryDto } from '@/common/dto'

export class FiltrosServicioDto extends PaginacionQueryDto {
  @ApiPropertyOptional({ description: 'Filtrar por usuario login' })
  @IsOptional()
  @IsString()
  usuarioLogin?: string

  @ApiPropertyOptional({ description: 'Filtrar por usuario ejecutor' })
  @IsOptional()
  @IsString()
  usuarioEjecutor?: string
}
