import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePresedenciaLgiDto {
  @ApiProperty({
    description: 'ID del caso',
    example: '98',
  })
  @IsString()
  @IsNotEmpty()
  casosId!: string

  @ApiProperty({
    description: 'Número del caso de presedencia',
    example: 'LP-LB-2/26',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nrocasopre!: string
}