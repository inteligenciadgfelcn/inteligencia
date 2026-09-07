import { Type } from 'class-transformer'
import {
  IsDefined,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger'

import { UpdateBienSecuestradoDto } from './update-bien-secuestrado.dto'
import { UpdateBienIncautadoDto } from './update-bien-incautado.dto'
import { UpdateBienConfiscadoDto } from './update-bien-confiscado.dto'
import { UpdateSituacionBienDto } from './update-situacion-bien.dto'

export type DatosActualizarSituacion =
  | UpdateBienSecuestradoDto
  | UpdateBienIncautadoDto
  | UpdateBienConfiscadoDto
  | UpdateSituacionBienDto

export class UpdateSituacionJuridicaBienDto {
  @ApiProperty({
    description: 'Tipo de situación seleccionada',
    enum: [1, 2, 3, 4, 5],
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
  idTipoSituacionLegalBien?: number

  @ApiPropertyOptional({
    description: 'Nuevo identificador del bien',
    example: 15,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  itembiensecId?: number

  @ApiProperty({
    oneOf: [
      {
        $ref: getSchemaPath(UpdateBienSecuestradoDto),
      },
      {
        $ref: getSchemaPath(UpdateBienIncautadoDto),
      },
      {
        $ref: getSchemaPath(UpdateBienConfiscadoDto),
      },
      {
        $ref: getSchemaPath(UpdateSituacionBienDto),
      },
    ],
  })
  @IsDefined()
  @ValidateNested()
  @Type((opciones) => {
    const objeto = opciones?.object as UpdateSituacionJuridicaBienDto

    switch (Number(objeto.idTipoSituacionLegalBien)) {
      case 1:
        return UpdateBienSecuestradoDto

      case 2:
        return UpdateBienIncautadoDto

      case 3:
        return UpdateBienConfiscadoDto

      case 4:
      case 5:
        return UpdateSituacionBienDto

      default:
        return Object
    }
  })
  datos?: DatosActualizarSituacion

  @ApiPropertyOptional({
    readOnly: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  usuario?: string
}
