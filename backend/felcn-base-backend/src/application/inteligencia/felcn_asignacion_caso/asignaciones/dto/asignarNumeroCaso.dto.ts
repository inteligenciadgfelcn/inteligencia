import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class AsignarNumeroCasoDto {
  @ApiProperty({ example: 'CH-CC-12/26' })
  @IsString()
  @IsNotEmpty()
  nroOperativo: string

  @ApiProperty({ example: 'CH' })
  @IsString()
  @IsNotEmpty()
  abreviatura: string

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  letra: string
}
