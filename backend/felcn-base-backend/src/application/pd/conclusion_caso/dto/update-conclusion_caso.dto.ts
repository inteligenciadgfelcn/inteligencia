import { PartialType, OmitType } from "@nestjs/swagger";
import { CreateConclusionPdDto } from "./create-conclusion_caso.dto";


export class UpdateConclusionPdDto extends PartialType(
  OmitType(CreateConclusionPdDto, ['casosId'] as const)
) {}