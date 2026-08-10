import { PartialType } from '@nestjs/swagger';
import { CreateAsignacionLgiDto } from './create-asignacion_lgi.dto';

export class UpdateAsignacionLgiDto extends PartialType(CreateAsignacionLgiDto) {}
