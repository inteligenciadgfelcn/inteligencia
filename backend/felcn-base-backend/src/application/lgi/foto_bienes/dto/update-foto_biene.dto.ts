import { PartialType } from '@nestjs/swagger';
import { CreateFotoBieneDto } from './create-foto_biene.dto';

export class UpdateFotoBieneDto extends PartialType(CreateFotoBieneDto) {}
