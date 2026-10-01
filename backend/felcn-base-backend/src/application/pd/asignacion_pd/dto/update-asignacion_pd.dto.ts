import { PartialType } from '@nestjs/swagger';
import { CreateAsignacionPdDto } from './create-asignacion_pd.dto';

export class UpdateAsignacionPdDto extends PartialType(CreateAsignacionPdDto) {}
