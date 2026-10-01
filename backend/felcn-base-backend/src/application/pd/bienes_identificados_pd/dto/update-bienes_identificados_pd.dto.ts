import { PartialType } from '@nestjs/swagger';
import { CreateBienesIdentificadosPdDto } from './create-bienes_identificados_pd.dto';

export class UpdateBienesIdentificadosPdDto extends PartialType(CreateBienesIdentificadosPdDto) {}
