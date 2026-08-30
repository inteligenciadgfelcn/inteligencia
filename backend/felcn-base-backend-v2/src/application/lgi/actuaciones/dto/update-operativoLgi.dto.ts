import { PartialType } from '@nestjs/swagger';
import { CreateOperativoLgiDto } from './create-operativoLgi.dto';

export class UpdateOperativoLgiDto extends PartialType(CreateOperativoLgiDto) {}
