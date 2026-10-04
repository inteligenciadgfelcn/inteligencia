import { Type } from 'class-transformer'
import { IsDefined, IsIn, IsInt, ValidateNested } from 'class-validator'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'

import { CreateBienSecuestadoDto } from './create-bien-secuestrado.dto'
import { CreateBienIncautadoDto } from './create-bien-incautado.dto'
import { CreateBienConfiscadoDto } from './create-bien-confiscado.dto'

export type DatosSituacionJuridica =
  | CreateBienSecuestadoDto
  | CreateBienIncautadoDto
  | CreateBienConfiscadoDto

export class CreateSituacionJuridicaBienDto {
  @ApiProperty({
    example: 15,
  })
  @Type(() => Number)
  @IsInt()
  itembiensecId: number

  @ApiProperty({
    example: 1,
    enum: [1, 2, 3],
  })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2, 3])
  idTipoSituacionLegalBien: number

  @ApiProperty({
    oneOf: [
      {
        $ref: getSchemaPath(CreateBienSecuestadoDto),
      },
      {
        $ref: getSchemaPath(CreateBienIncautadoDto),
      },
      {
        $ref: getSchemaPath(CreateBienConfiscadoDto),
      },
    ],
  })
  @IsDefined()
  @ValidateNested()
  @Type((opciones) => {
    const objeto = opciones?.object as CreateSituacionJuridicaBienDto

    switch (objeto.idTipoSituacionLegalBien) {
      case 1:
        return CreateBienSecuestadoDto

      case 2:
        return CreateBienIncautadoDto

      case 3:
        return CreateBienConfiscadoDto

      default:
        return Object
    }
  })
  datos: DatosSituacionJuridica
}
