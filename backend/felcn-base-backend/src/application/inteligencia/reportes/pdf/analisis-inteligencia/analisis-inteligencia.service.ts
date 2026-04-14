import { Injectable } from '@nestjs/common'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Injectable()
export class AnalisisInteligenciaService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generarPDF() {
    const data = this.getDatosStaticos()
    const buffer = await this.pdfService.generate('analisis-inteligencia', data)
    return buffer
  }

  async generarExcel() {
    const data = this.getDatosStaticos()
    const rowsForExcel = [
      ['PARÁMETROS DEL ANÁLISIS (DATA MINING)'],
      ['Dimensión Temporal:', data.parametros.dimensionTemporal],
      ['Cruce Geográfico:', data.parametros.cruceGeografico],
      ['Variable de Valor:', data.parametros.variableValor],
      [],
      ['DIAGRAMA DE VÍNCULOS (SÍNTESIS DE REDES)'],
      ['Nodo Central:', data.vinculos.nodoCentral],
      ['Enlace Logístico:', data.vinculos.enlaceLogistico],
      ['Enlace Financiero:', data.vinculos.enlaceFinanciero],
      ['Nexo Operativo:', data.vinculos.nexoOperativo],
      [],
      ['MAPA DE CALOR GEOGRÁFICO'],
      ['Punto Crítico A:', data.mapaCalor.puntoA],
      ['Punto Crítico B:', data.mapaCalor.puntoB],
      ['Punto Crítico C:', data.mapaCalor.puntoC],
      [],
      ['ANÁLISIS DE CORRELACIÓN'],
      [data.correlacion],
      [],
      ['ADVERTENCIA:', data.advertencia],
    ]
    const buffer = await this.excelService.generate(
      'analisis-inteligencia',
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
        dimensionTemporal: 'Q1 - GESTIÓN 2026 (ENERO - MARZO)',
        cruceGeografico:
          'ZONA TRÓPICO DE COCHABAMBA vs. FRONTERA ESTE (Pto. Quijarro)',
        variableValor: 'CLORHIDRATO DE COCAÍNA (ALTA PUREZA)',
      },
      vinculos: {
        nodoCentral: 'EL PATRÓN (Identidad Protegida ID:X44)',
        enlaceLogistico: 'Transporte terrestre (Ruta F-4)',
        enlaceFinanciero: 'Empresa de fachada Constructora X',
        nexoOperativo: 'Laboratorio de Cristalización en [UBICACIÓN CENSURADA]',
      },
      mapaCalor: {
        puntoA:
          'Villa Tunari - Concentración de Precursores (60% del total nacional)',
        puntoB: 'Montero - Centro de acopio y distribución regional',
        puntoC: 'Puerto Suárez - Punto de salida internacional detectado',
      },
      correlacion:
        'Se observa un incremento del 22% en incautaciones durante los fines de semana del mes de marzo, correlacionado con el aumento de flujo de carga pesada internacional.',
      footer: {
        sello: 'DIVISIÓN DE ESTADÍSTICA',
        firma: 'ANALISTA SR. - DNIC - FELCN',
      },
      advertencia:
        'La difusión no autorizada de este documento compromete operaciones en curso.',
    }
  }
}
