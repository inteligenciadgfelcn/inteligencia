import { Injectable } from '@nestjs/common'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Injectable()
export class RegistroAntecedentesService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generarPDF() {
    const data = this.getDatosStaticos()
    const buffer = await this.pdfService.generate('registro-antecedentes', data)
    return buffer
  }

  async generarExcel() {
    const data = this.getDatosStaticos()
    const rowsForExcel = [
      [
        'ID REGISTRO',
        'NOMBRES Y APELLIDOS',
        'C.I. / DOC.',
        'DELITO ESPECÍFICO',
        'FECHA REG.',
      ],
      ...data.registros.map((r) => [r.id, r.nombre, r.ci, r.delito, r.fecha]),
      [],
      ['RESUMEN ESTADÍSTICO'],
      ['Total registros encontrados:', data.resumen.totalRegistros.toString()],
      ['Mayor incidencia:', data.resumen.mayorIncidencia],
      ['Género Masculino:', data.resumen.generoMasculino],
      ['Género Femenino:', data.resumen.generoFemenino],
    ]
    const buffer = await this.excelService.generate(
      'registro-antecedentes',
      rowsForExcel
    )
    return buffer
  }

  private getDatosStaticos() {
    const fechaActual = new Date().toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return {
      fechaGeneracion: fechaActual,
      parametros: {
        rangoFechas: '01/01/2026 AL 14/04/2026',
        jurisdiccion: 'DEPARTAMENTO DE SANTA CRUZ (TODO)',
        tipoDelito: 'TRÁFICO DE SUSTANCIAS CONTROLADAS (LEY 1008)',
        estado: 'SENTENCIADO / EN PROCESO',
      },
      registros: [
        {
          id: 'FELCN-4501',
          nombre: 'MAMANI CONDORI, JUAN L.',
          ci: '4590321 LP.',
          delito: 'TRANSPORTE',
          fecha: '12/01/2026',
        },
        {
          id: 'FELCN-4588',
          nombre: 'SUAREZ VARGAS, CARLOS',
          ci: '1029384 SC.',
          delito: 'POSESIÓN',
          fecha: '05/02/2026',
        },
        {
          id: 'FELCN-4612',
          nombre: 'DA SILVA, ROBERTO',
          ci: 'E-493021-BR',
          delito: 'TRÁFICO',
          fecha: '22/02/2026',
        },
        {
          id: 'FELCN-4705',
          nombre: 'QUISPE APAZA, MARÍA',
          ci: '7730219 CB.',
          delito: 'FABRICACIÓN',
          fecha: '15/03/2026',
        },
        {
          id: 'FELCN-4810',
          nombre: 'ROJAS PEÑA, FERNANDO',
          ci: '5530122 SC.',
          delito: 'TRANSPORTE',
          fecha: '02/04/2026',
        },
      ],
      resumen: {
        totalRegistros: 5,
        mayorIncidencia: 'Transporte (40%)',
        generoMasculino: '80%',
        generoFemenino: '20%',
      },
    }
  }
}
