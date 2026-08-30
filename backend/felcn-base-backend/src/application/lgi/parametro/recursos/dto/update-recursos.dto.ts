import { PartialType } from '@nestjs/swagger';
import { CreateRecursosDto } from './create-recursos.dto';

export class UpdateRecursosDto extends PartialType(CreateRecursosDto) {}
