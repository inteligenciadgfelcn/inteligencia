import { PartialType } from '@nestjs/swagger';
import { CreatePersonaImplicadaDto } from './create-personas_implicada.dto';

export class UpdatePersonasImplicadaDto extends PartialType(CreatePersonaImplicadaDto) {}
