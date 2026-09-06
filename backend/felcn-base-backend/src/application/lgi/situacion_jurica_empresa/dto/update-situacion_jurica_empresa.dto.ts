import { PartialType } from '@nestjs/swagger';
import { CreateSituacionJuridicaEmpresaDto } from './create-situacion_jurica_empresa.dto';

export class UpdateSituacionJuricaEmpresaDto extends PartialType(CreateSituacionJuridicaEmpresaDto) {}
