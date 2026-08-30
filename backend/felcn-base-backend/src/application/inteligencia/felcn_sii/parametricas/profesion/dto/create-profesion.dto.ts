import { IsString, MaxLength } from "@/common/validation";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class CreateProfesionDto {

  @ApiProperty({
    example: 'ACERRADERO',
    description: 'Descripción de profesión',
    required: false,
  })
  @IsString()
  @MaxLength(70)
  descripcion?: string

  @ApiProperty({
    example: true,
    description: 'Marcar si ocupa profesión',
    required: false,
  })
  @IsBoolean()
  ocupa_profesion?: boolean
}