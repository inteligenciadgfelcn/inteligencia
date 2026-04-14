import { Module } from '@nestjs/common'
import { TarjetaProntuarioController } from './tarjeta-prontuario.controller'
import { TarjetaProntuarioService } from './tarjeta-prontuario.service'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Module({
  controllers: [TarjetaProntuarioController],
  providers: [TarjetaProntuarioService, PdfService, ExcelService],
})
export class TarjetaProntuarioModule {}
