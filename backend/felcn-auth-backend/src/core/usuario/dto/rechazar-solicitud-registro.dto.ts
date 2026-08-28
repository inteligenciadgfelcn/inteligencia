import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from '@/common/validation'

export class RechazarSolicitudRegistroDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comentario?: string
}
