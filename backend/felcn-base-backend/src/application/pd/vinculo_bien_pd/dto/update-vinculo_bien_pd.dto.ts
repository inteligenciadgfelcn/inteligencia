import { PartialType } from "@nestjs/swagger/dist";
import { CreateVinculoBienDto } from "./create-vinculo_bien_pd.dto";


export class UpdateVinculoBienDto extends PartialType(CreateVinculoBienDto) {}
