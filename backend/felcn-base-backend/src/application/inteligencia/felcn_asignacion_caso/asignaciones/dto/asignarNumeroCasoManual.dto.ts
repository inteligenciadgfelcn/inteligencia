import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class AsignarNumeroCasoManualDto {
  @ApiProperty({ example: 'CH-CC-12/26' })
  @IsString()
  @IsNotEmpty()
  nroOperativo: string

  @ApiProperty({ example: 'CH-A-13/26' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nroCaso: string
}
