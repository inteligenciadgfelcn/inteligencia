import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateGradoDto {
  @ApiProperty({ example: 'Lic.' })
  @IsString()
  @MaxLength(50)
  abrev: string;

  @ApiProperty({ example: 'Licenciado' })
  @IsString()
  @MaxLength(255)
  descripcion: string;
}