import { Injectable } from '@nestjs/common'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Injectable()
export class TarjetaProntuarioService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generarPDF() {
    const data = this.getDatosStaticos()
    const buffer = await this.pdfService.generate('tarjeta-prontuario', data)
    return buffer
  }

  async generarExcel() {
    const data = this.getDatosStaticos()
    const rowsForExcel = [
      ['DATOS DE IDENTIDAD BIOMÉTRICA'],
      ['Nombres:', data.identidad.nombres],
      ['Apellidos:', data.identidad.apellidos],
      ['C.I.:', data.identidad.ci],
      ['Sexo:', data.identidad.sexo],
      ['Nacionalidad:', data.identidad.nacionalidad],
      ['Edad:', data.identidad.edad],
      ['Estado Civil:', data.identidad.estadoCivil],
      ['Profesión:', data.identidad.profesion],
      [],
      ['HISTORIAL DE ANTECEDENTES'],
      ['FECHA', 'CASO', 'DELITO', 'ESTADO JURÍDICO'],
      ...data.antecedentes.map((a) => [a.fecha, a.caso, a.delito, a.estado]),
      [],
      ['OBSERVACIONES Y SEÑALES PARTICULARES'],
      ...data.observaciones.map((o) => [o]),
    ]
    const buffer = await this.excelService.generate(
      'tarjeta-prontuario',
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
      identidad: {
        nombres: 'GUSTAVO ADOLFO',
        apellidos: 'ORTEGA VILLALOBOS',
        ci: '6722341 LP.',
        sexo: 'M',
        nacionalidad: 'BOLIVIANA',
        edad: '34 AÑOS',
        estadoCivil: 'SOLTERO',
        profesion: 'TRANSPORTISTA',
      },
      dactiloscopico: {
        manoDerecha: 'V - 3 - 2 - 4 - 1',
        manoIzquierda: 'E - 2 - 1 - 1 - 3',
        formula: 'Fórmula dactiloscópica',
      },
      antecedentes: [
        {
          fecha: '15/05/2022',
          caso: 'FELCN-772',
          delito: 'TRÁFICO (ART. 48)',
          estado: 'SENTENCIADO (6 AÑOS)',
        },
        {
          fecha: '02/11/2025',
          caso: 'FELCN-102',
          delito: 'ASOCIACIÓN DELICTUOSA',
          estado: 'EN PROCESO',
        },
      ],
      observaciones: [
        '- CICATRIZ EN EL ANTEBRAZO DERECHO.',
        '- TATUAJE EN FORMA DE ANCLA EN EL CUELLO.',
        '- ESTATURA: 1.75 M. | PESO: 78 KG.',
      ],
      footer: {
        direccion: 'DIRECCIÓN NACIONAL FELCN',
        codigoQR: 'P-1008',
        verificarURL: 'https://verificar.policia.bo',
      },
    }
  }
}
