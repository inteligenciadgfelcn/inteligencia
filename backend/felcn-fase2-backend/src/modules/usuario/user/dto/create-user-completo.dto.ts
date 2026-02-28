import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { CreatePersonaExternoDto } from './create-user-externo.dto';

export class CreateUsuarioCompletoDto extends CreatePersonaExternoDto {
  @ApiProperty({ example: 'P-1234' })
  @IsString()
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
