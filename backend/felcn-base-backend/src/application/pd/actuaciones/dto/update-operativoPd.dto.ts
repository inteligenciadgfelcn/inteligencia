import { PartialType } from '@nestjs/swagger';
import { CreateOperativoPdDto } from './create-operativoPd.dto';

export class UpdateOperativoPdDto extends PartialType(CreateOperativoPdDto) {}
