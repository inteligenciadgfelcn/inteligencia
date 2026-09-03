import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateVinculoDto {
  @ApiProperty({ example: 'Descripcion' })
  @IsString()
  @MaxLength(80)
  descripcion: string
}
