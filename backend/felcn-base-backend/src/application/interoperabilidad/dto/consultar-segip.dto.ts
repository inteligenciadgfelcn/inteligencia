import { IsNotEmpty, IsOptional, IsString } from '@/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class ConsultarSegipDto {
  @ApiProperty({
    description: 'Cedula de identidad',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  ced: string

  @ApiProperty({
    description: 'Complemento',
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  com?: string

  @ApiProperty({
    description: 'Nombres',
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  nom?: string

  @ApiProperty({
    description: 'Apellido paterno',
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  pat?: string

  @ApiProperty({
    description: 'Apellido materno',
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  mat?: string
}
