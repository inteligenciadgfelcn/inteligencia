// export.service.ts
import { Injectable } from '@nestjs/common'
import { PdfService } from './pdf/pdf.service'
import { ExcelService } from './excel/excel.service'
import { PDFOptions } from 'puppeteer'

@Injectable()
export class ExportService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generatePDF(
    templateName: string,
    data: any,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    return this.pdfService.generate(templateName, data, options)
  }

  async generateExcel(sheetName: string, data: any[]): Promise<Buffer> {
    return this.excelService.generate(sheetName, data)
  }

  generateCSV(data: any[]): Buffer {
    if (!data.length) {
      return Buffer.from('\uFEFFSin datos\r\n', 'utf8')
    }
    const encabezados = Object.keys(data[0])
    const contenido: string[] = []
    contenido.push(
      encabezados
        .map((encabezado) => this.escaparValorCSV(encabezado))
        .join(';')
    )

    for (const fila of data) {
      contenido.push(
        encabezados
          .map((encabezado) => this.escaparValorCSV(fila[encabezado]))
          .join(';')
      )
    }

    return Buffer.from('\uFEFF' + contenido.join('\r\n'), 'utf8')
  }

  generateJSON(data: unknown): Buffer {
    const contenido = JSON.stringify(data, null, 2)

    return Buffer.from(contenido, 'utf8')
  }

  private escaparValorCSV(valor: unknown): string {
    if (valor === null || valor === undefined) {
      return '""'
    }

    let texto: string

    if (typeof valor === 'object') {
      texto = JSON.stringify(valor)
    } else {
      texto = String(valor)
    }

    const textoEscapado = texto.replace(/"/g, '""')

    return `"${textoEscapado}"`
  }
}
