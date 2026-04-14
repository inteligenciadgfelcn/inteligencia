import { Injectable } from '@nestjs/common'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Injectable()
export class VariablesCruzadasService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generarPDF() {
    const data = this.getDatosStaticos()
    const buffer = await this.pdfService.generate('variables-cruzadas', data)
    return buffer
  }

  async generarExcel() {
    const data = this.getDatosStaticos()
    const rowsForExcel = [
      [
        'Variable / Categoría',
        'Categoría A',
        'Categoría B',
        'Categoría C',
        'Total',
      ],
      ...data.rows.map((r) => [r.label, r.valA, r.valB, r.valC, r.total]),
    ]
    const buffer = await this.excelService.generate(
      'variables-cruzadas',
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
      rows: [
        {
          label: 'Operativos Realizados',
          valA: 15,
          valB: 22,
          valC: 18,
          total: 55,
        },
        {
          label: 'Drogad Incautada (kg)',
          valA: 125.5,
          valB: 98.3,
          valC: 210.7,
          total: 434.5,
        },
        { label: 'Vehículos Incautados', valA: 3, valB: 5, valC: 2, total: 10 },
        { label: 'Armas de Fuego', valA: 8, valB: 12, valC: 6, total: 26 },
        { label: 'Detenciones', valA: 20, valB: 25, valC: 15, total: 60 },
        {
          label: 'Casos Registrados',
          valA: 45,
          valB: 38,
          valC: 52,
          total: 135,
        },
      ],
    }
  }
}
