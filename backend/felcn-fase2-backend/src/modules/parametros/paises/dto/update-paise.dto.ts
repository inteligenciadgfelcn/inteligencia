import { PartialType } from '@nestjs/swagger';
import { CreatePaisDto } from './create-paise.dto';

export class UpdatePaisDto extends PartialType(CreatePaisDto) {}
