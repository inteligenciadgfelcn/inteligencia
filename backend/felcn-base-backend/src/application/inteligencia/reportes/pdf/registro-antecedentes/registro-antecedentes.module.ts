import { Module } from '@nestjs/common'
import { RegistroAntecedentesController } from './registro-antecedentes.controller'
import { RegistroAntecedentesService } from './registro-antecedentes.service'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Module({
  controllers: [RegistroAntecedentesController],
  providers: [RegistroAntecedentesService, PdfService, ExcelService],
})
export class RegistroAntecedentesModule {}
