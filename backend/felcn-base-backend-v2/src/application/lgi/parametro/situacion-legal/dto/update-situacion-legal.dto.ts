import { PartialType } from '@nestjs/swagger';
import { CreateSituacionLegalDto } from './create-situacion-legal.dto';

export class UpdateSituacionLegalDto extends PartialType(CreateSituacionLegalDto) {}
