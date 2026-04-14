import { Module } from '@nestjs/common'
import { VariablesCruzadasController } from './variables-cruzadas.controller'
import { VariablesCruzadasService } from './variables-cruzadas.service'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Module({
  controllers: [VariablesCruzadasController],
  providers: [VariablesCruzadasService, PdfService, ExcelService],
})
export class VariablesCruzadasModule {}
