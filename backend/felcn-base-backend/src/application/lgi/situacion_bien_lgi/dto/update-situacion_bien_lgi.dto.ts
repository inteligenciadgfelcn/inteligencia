import { PartialType } from '@nestjs/swagger';
import { CreateSituacionBienDto } from './create-situacion-bien.dto';

export class UpdateSituacionBienLgiDto extends PartialType(CreateSituacionBienDto) {}
