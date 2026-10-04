import { IsInt, IsNumberString, IsOptional } from "@/common/validation"

export class CreateVinculoBienLgiDto {
  @IsOptional()
  @IsInt()
  idDetenidoAuxiliar?: number

  @IsOptional()
  @IsInt()
  idVinculo?: number

  @IsOptional()
  @IsInt()
  idTipoVinculo?: number

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  idItemBienSecuestrado?: string
}
