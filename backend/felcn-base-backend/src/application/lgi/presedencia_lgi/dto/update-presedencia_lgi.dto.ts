import { PartialType } from '@nestjs/swagger';
import { CreatePresedenciaLgiDto } from './create-presedencia_lgi.dto';

export class UpdatePresedenciaLgiDto extends PartialType(CreatePresedenciaLgiDto) {}
