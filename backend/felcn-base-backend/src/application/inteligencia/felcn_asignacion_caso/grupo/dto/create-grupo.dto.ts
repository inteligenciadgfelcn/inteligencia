import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreateGrupoDto {
  @ApiProperty({
    example: 'Grupo Operativo',
    description: 'Descripción del grupo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  descripcion: string

  @ApiProperty({
    example: 1,
    description: 'ID de la distrital a la que pertenece el grupo',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idDistrital: number
}
