import { PartialType } from '@nestjs/swagger';
import { CreateBienDto } from './create-biene.dto';

export class UpdateBieneDto extends PartialType(CreateBienDto) {}
