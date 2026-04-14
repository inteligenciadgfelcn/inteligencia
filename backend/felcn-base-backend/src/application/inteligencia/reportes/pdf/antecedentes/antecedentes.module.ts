import { Module } from '@nestjs/common'
import { AntecedentesController } from './antecedentes.controller'
import { AntecedentesService } from './antecedentes.service'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Module({
  controllers: [AntecedentesController],
  providers: [AntecedentesService, PdfService, ExcelService],
})
export class AntecedentesModule {}
