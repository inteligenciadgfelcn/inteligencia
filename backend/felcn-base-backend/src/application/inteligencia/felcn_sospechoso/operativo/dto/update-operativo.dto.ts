import { PartialType } from '@nestjs/swagger';
import { CreateOperativoDto } from './create-operativo.dto';

export class UpdateOperativoDto extends PartialType(CreateOperativoDto) {}
