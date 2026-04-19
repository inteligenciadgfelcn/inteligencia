import { PartialType } from '@nestjs/swagger';
import { CreateEstadoCivilDto } from './create-estado_civil.dto';

export class UpdateEstadoCivilDto extends PartialType(CreateEstadoCivilDto) {}
