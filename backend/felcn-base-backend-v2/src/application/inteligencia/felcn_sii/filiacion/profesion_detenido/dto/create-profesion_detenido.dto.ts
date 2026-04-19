import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class CreateProfesionDetenidoDto {
  @ApiProperty({ example: 1, description: 'ID del profesión' })
  @Type(() => Number)
  @IsNumber()
  idProfesion?: number
}
