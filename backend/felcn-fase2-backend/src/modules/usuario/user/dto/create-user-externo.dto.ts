import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreatePersonaExternoDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  nroDocumento: string;

  @ApiProperty({ example: 'CI' })
  @IsString()
  @IsNotEmpty()
  tipoDocumento: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @IsNotEmpty()
  primerApellido: string;

  @ApiProperty({ example: 'Lopez' })
  @IsString()
  segundoApellido: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: '1990-05-10' })
  @IsDateString()
  fechaNacimiento: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsEmail()
  correoElectronico: string;

  @ApiProperty({ example: '67896356' })
  @IsString()
  telefono: string;

  @ApiProperty({
    example: ['1'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
