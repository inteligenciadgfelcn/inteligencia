import { Module } from '@nestjs/common'
import { AnalisisInteligenciaController } from './analisis-inteligencia.controller'
import { AnalisisInteligenciaService } from './analisis-inteligencia.service'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Module({
  controllers: [AnalisisInteligenciaController],
  providers: [AnalisisInteligenciaService, PdfService, ExcelService],
})
export class AnalisisInteligenciaModule {}
