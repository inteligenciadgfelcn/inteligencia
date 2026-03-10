import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsDateString, IsOptional } from 'class-validator'

export class CreateDocumentoDetenidoDto {
  @ApiProperty({ example: 2, description: 'ID del tipo de docuemnto' })
  @Type(() => Number)
  @IsNumber()
  idTipoDocumento?: number

  @ApiProperty({ example: '56325696', description: 'Numero de docuemnto' })
  @Type(() => Number)
  @IsNumber()
  numeroDocumento?: number

  @ApiProperty({ example: 'LA PAZ', description: '' })
  @IsDateString()
  @IsOptional()
  expedido?: Date
}
