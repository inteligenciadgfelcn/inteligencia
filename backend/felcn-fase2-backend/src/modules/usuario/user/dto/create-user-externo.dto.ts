import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsDateString } from 'class-validator';

export class CreatePersonaExternoDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  nroDocumento: string;

  @ApiProperty({ example: '12345678' })
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
  nombre: string;

  @ApiProperty({ example: '1990-05-10' })
  @IsDateString()
  fechaNacimiento: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsEmail()
  roles: string[];

  @ApiProperty({ example: '77777777' })
  @IsString()
  telefono: string;
}
