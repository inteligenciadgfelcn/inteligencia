import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsInt, IsNumberString, IsOptional } from "@/common/validation"

export class CreateVinculoBienDto {
  @ApiPropertyOptional({
    example: 123,
    description: "ID del detenido auxiliar",
  })
  @IsOptional()
  @IsInt()
  idDetenidoAuxiliar?: number

  @ApiPropertyOptional({
    example: 456,
    description: "ID del vínculo",
  })
  @IsOptional()
  @IsInt()
  idVinculo?: number

  @ApiPropertyOptional({
    example: 1,
    description: "ID del tipo de vínculo",
  })
  @IsOptional()
  @IsInt()
  idTipoVinculo?: number

  @ApiPropertyOptional({
    example: "789",
    description: "ID del ítem de bien secuestrado",
  })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  idItemBienSecuestrado?: string
}
