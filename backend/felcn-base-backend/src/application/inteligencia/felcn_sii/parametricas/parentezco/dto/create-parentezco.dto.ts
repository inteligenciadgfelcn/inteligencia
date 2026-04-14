import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateParentezcoDto {
  @ApiProperty({
    example: 'Padre',
    description: 'Descripción de parentezco',
  })
  @IsString()
  @MaxLength(50)
  descripcion: string
}
