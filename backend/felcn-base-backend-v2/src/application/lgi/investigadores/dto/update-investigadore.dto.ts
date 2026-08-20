import { PartialType } from '@nestjs/swagger';
import { CreateInvestigadoreDto } from './create-investigadore.dto';

export class UpdateInvestigadoreDto extends PartialType(CreateInvestigadoreDto) {}
