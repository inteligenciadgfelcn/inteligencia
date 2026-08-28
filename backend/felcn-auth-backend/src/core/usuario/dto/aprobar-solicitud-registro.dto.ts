import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsNotEmpty, IsOptional } from '@/common/validation'

export class AprobarSolicitudRegistroDto {
  @ApiProperty({ example: ['3'] })
  @IsNotEmpty()
  @IsArray()
  roles: string[]

  @ApiProperty({ example: 1, required: false, description: 'Grupo organizacional a asignar' })
  @IsOptional()
  @IsInt()
  idGrupo?: number
}
