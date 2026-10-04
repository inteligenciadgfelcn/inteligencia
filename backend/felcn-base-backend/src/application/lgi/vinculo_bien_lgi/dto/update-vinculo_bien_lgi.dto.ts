import { PartialType } from '@nestjs/swagger';
import { CreateVinculoBienLgiDto } from './create-vinculo_bien_lgi.dto';

export class UpdateVinculoBienLgiDto extends PartialType(CreateVinculoBienLgiDto) {}
