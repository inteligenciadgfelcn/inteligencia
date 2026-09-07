import { Type } from 'class-transformer'
import { IsDefined, IsIn, IsInt, ValidateNested } from 'class-validator'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'

import { CreateBienSecuestadoDto } from './create-bien-secuestrado.dto'
import { CreateBienIncautadoDto } from './create-bien-incautado.dto'
import { CreateBienConfiscadoDto } from './create-bien-confiscado.dto'
import { CreateSituacionBienDto } from './create-situacion-bien.dto'

export type DatosSituacionJuridica =
  | CreateBienSecuestadoDto
  | CreateBienIncautadoDto
  | CreateBienConfiscadoDto
  | CreateSituacionBienDto

export class CreateSituacionJuridicaBienDto {
  @ApiProperty({
    example: 15,
  })
  @Type(() => Number)
  @IsInt()
  itembiensecId: number

  @ApiProperty({
    example: 1,
    enum: [1, 2, 3, 4, 5],
  })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
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
      {
        $ref: getSchemaPath(CreateSituacionBienDto),
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

      case 4:
      case 5:
        return CreateSituacionBienDto

      default:
        return Object
    }
  })
  datos: DatosSituacionJuridica
}
