import { PartialType } from '@nestjs/swagger';
import { CreateImplicadoLgiDto } from './create-implicado.dto';

export class UpdateImplicadoLgiDto extends PartialType(CreateImplicadoLgiDto) {}
