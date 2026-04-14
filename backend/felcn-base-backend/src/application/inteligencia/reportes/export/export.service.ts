// export.service.ts
import { Injectable } from '@nestjs/common'
import { PdfService } from './pdf/pdf.service'
import { ExcelService } from './excel/excel.service'

@Injectable()
export class ExportService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generatePDF(templateName: string, data: any): Promise<Buffer> {
    return this.pdfService.generate(templateName, data)
  }

  async generateExcel(sheetName: string, data: any[]): Promise<Buffer> {
    return this.excelService.generate(sheetName, data)
  }
}
