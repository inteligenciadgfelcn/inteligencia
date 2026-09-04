import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min, IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateSituacionJuridicaBienDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @Min(1)
  itembiensecId: number

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(1)
  catjurId: number

  @ApiProperty({
    example: 'Bien bajo custodia',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  descripcion: string
}
