import { PartialType } from '@nestjs/swagger';
import { CreateDatosFamiliareDto } from './create-datos_familiare.dto';

export class UpdateDatosFamiliareDto extends PartialType(CreateDatosFamiliareDto) {}
