import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'P-1234' })
  @IsString()
  @IsNotEmpty()
  nroPase: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  idGrado: number;

  @ApiProperty({ example: '22223333' })
  @IsString()
  telefonoCorporativo: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  idGrupo: number;
}
