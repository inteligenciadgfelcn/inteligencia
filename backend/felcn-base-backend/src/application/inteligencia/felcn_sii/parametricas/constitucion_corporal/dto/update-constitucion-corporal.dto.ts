import { PartialType } from '@nestjs/swagger';
import { CreateConstitucionCorporalDto } from './create-constitucion-corporal.dto';

export class UpdateConstitucionCorporalDto extends PartialType(CreateConstitucionCorporalDto) {}
