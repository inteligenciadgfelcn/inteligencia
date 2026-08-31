import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateAliasDetenidoDto {
  @ApiProperty({ example: 'NANO', description: 'Alias' })
  @IsString()
  @MaxLength(150)
  alias: string
}
