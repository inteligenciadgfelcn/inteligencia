import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEstadoCivilDto {
    @ApiProperty({
        example: 'Soltero(a)',
        description: 'Descripción de estadio civil',
        required: false,
      })
      @IsOptional()
      @IsString()
      @MaxLength(30)
      descripcion?: string
}
