import { PartialType } from '@nestjs/swagger';
import { CreatePersonasImplicadasPdDto } from './create-personas_implicadas_pd.dto';

export class UpdatePersonasImplicadasPdDto extends PartialType(CreatePersonasImplicadasPdDto) {}
