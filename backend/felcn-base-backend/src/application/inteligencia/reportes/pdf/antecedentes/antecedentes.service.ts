import { Injectable } from '@nestjs/common'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Injectable()
export class AntecedentesService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generarPDF() {
    const data = this.getDatosStaticos()
    const buffer = await this.pdfService.generate('antecedentes', data)
    return buffer
  }

  async generarExcel() {
    const data = this.getDatosStaticos()
    const rowsForExcel = [
      ['Fecha', 'Delito', 'Estado', 'Caso'],
      ...data.antecedentes.map((a) => [a.fecha, a.delito, a.estado, a.caso]),
      [],
      ['Total de Registros:', data.totalRegistros],
    ]
    const buffer = await this.excelService.generate(
      'antecedentes',
      rowsForExcel
    )
    return buffer
  }

  private getDatosStaticos() {
    const fecha = new Date().toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return {
      fecha,
      sujeto: {
        nombre: 'JUAN PEREZ MAMANI',
        ci: '1234567 LP',
        nacionalidad: 'Boliviana',
      },
      antecedentes: [
        {
          fecha: '20/01/2024',
          delito: 'Transporte de sustancias controladas',
          estado: 'Remitido a la Fiscalía',
          caso: 'LPZ-123/24',
        },
        {
          fecha: '15/03/2023',
          delito: 'Comercialización de drogas',
          estado: 'Sentencia',
          caso: 'LPZ-456/23',
        },
        {
          fecha: '10/08/2022',
          delito: 'Tenencia con fines de tráfico',
          estado: 'Archivo',
          caso: 'LPZ-789/22',
        },
      ],
      totalRegistros: 3,
    }
  }
}
