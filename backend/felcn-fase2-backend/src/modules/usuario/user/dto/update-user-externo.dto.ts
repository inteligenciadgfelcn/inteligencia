import { PartialType } from '@nestjs/swagger';
import { CreatePersonaExternoDto } from './create-user-externo.dto';

export class UpdatePersonaExternoDto extends PartialType(
  CreatePersonaExternoDto,
) {}