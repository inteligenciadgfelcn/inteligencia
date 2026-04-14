import { PartialType } from '@nestjs/swagger'
import { CreateTipoCabelloDto } from './create-tipo_cabello.dto'

export class UpdateTipoCabelloDto extends PartialType(CreateTipoCabelloDto) {}
