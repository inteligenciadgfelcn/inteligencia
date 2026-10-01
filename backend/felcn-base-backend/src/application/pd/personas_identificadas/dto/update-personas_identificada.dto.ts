import { PartialType } from '@nestjs/swagger';
import { CreatePersonasIdentificadaDto } from './create-personas_identificada.dto';

export class UpdatePersonasIdentificadaDto extends PartialType(CreatePersonasIdentificadaDto) {}
