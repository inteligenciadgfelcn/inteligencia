import { Module } from '@nestjs/common'
import { ConsultaBiometricaController } from './consulta-biometrica.controller'
import { ConsultaBiometricaService } from './consulta-biometrica.service'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Module({
  controllers: [ConsultaBiometricaController],
  providers: [ConsultaBiometricaService, PdfService, ExcelService],
})
export class ConsultaBiometricaModule {}
