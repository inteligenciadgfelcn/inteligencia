import { ApiHideProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DeletePersonasIdentificadaDto {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  usuarioActualizacion?: string;
}