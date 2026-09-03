import { PartialType } from '@nestjs/swagger';
import { CreateBienesSecuestradoDto } from './create-bienes_secuestrado.dto';

export class UpdateBieneSecuestradoLgiDto extends PartialType(CreateBienesSecuestradoDto) {}
