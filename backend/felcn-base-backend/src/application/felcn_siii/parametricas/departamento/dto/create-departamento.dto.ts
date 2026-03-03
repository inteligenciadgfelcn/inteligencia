import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateDepartamentoDto {
  @ApiProperty({
    example: 'La Paz',
    description: 'Nombre del departamento',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  descripcion: string

  @ApiProperty({
    example: 1,
    description: 'ID del país al que pertenece el departamento',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idPais: number
}
