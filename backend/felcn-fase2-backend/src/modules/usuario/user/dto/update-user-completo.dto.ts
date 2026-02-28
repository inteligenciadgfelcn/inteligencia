import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UpdatePersonaExternoDto } from './update-user-externo.dto';

export class UpdateUsuarioCompletoDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ type: UpdatePersonaExternoDto })
  @IsOptional()
  persona?: UpdatePersonaExternoDto;

  @ApiPropertyOptional({ example: ['1'] })
  @IsOptional()
  roles?: string[];
}
