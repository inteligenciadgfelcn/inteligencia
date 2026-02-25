import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradoDto {

  @ApiProperty({
    example: 'Gral.',
    description: 'Abreviatura única del grado',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'La abreviatura es obligatoria' })
  @MaxLength(20, { message: 'La abreviatura no puede tener más de 20 caracteres' })
  abreviatura: string;

  @ApiProperty({
    example: 'General de División',
    description: 'Descripción o nombre completo del grado',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MaxLength(150, { message: 'La descripción no puede tener más de 150 caracteres' })
  descripcion: string;

}