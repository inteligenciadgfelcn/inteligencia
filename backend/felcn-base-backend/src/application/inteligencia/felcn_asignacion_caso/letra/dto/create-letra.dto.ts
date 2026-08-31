import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateLetraDto {
  @ApiProperty({
    example: 'A',
    description: 'Letra identificadora para generación de número de caso',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  descripcion: string
}
