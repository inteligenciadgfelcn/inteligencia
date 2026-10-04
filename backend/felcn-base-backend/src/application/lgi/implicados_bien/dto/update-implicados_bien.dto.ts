import { PartialType } from '@nestjs/swagger';
import { CreateImplicadosBienDto } from './create-implicados_bien.dto';

export class UpdateImplicadosBienDto extends PartialType(CreateImplicadosBienDto) {}
