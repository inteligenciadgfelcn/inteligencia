import { PartialType } from '@nestjs/swagger';
import { CreateDistritalDto } from './create-distritale.dto';

export class UpdateDistritalDto extends PartialType(CreateDistritalDto) {}
