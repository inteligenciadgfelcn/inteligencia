import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsDateString, IsOptional, IsString } from 'class-validator'

export class CreateDocumentoDetenidoDto {
  @ApiProperty({ example: 2, description: 'ID del tipo de documento' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  idTipoDocumento?: number

  @ApiProperty({ example: '56325696', description: 'Numero de documento' })
  @IsString()
  @IsOptional()
  numeroDocumento?: string

  @ApiProperty({ example: 'LA PAZ', description: 'Expedido' })
  @IsString()
  @IsOptional()
  expedido?: string

  @ApiProperty({ example: 'Contrastado con el segip' , description: 'Si fue verificado con el SEGIP' })
  @IsString()
  contrastadoSegip?: string
}
