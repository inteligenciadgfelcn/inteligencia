import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateLugarDto {
  @ApiProperty({
    description: 'Descripción del lugar',
    example: 'TERMINAL DE BUSES LA PAZ',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  descripcion: string
}
