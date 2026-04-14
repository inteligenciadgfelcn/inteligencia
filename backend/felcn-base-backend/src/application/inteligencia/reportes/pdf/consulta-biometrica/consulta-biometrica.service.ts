import { Injectable } from '@nestjs/common'
import { PdfService } from '../../export/pdf/pdf.service'
import { ExcelService } from '../../export/excel/excel.service'

@Injectable()
export class ConsultaBiometricaService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly excelService: ExcelService
  ) {}

  async generarPDF() {
    const data = this.getDatosStaticos()
    const buffer = await this.pdfService.generate('consulta-biometrica', data)
    return buffer
  }

  async generarExcel() {
    const data = this.getDatosStaticos()
    const rowsForExcel = [
      ['ORIGEN DE LA CONSULTA'],
      ['Operador:', data.origen.operador],
      ['Unidad:', data.unidad],
      ['Método de Captura:', data.origen.metodoCaptura],
      [],
      ['RESULTADOS DEL COTEJO'],
      ['Estado de Coincidencia:', data.resultados.estadoCoincidencia],
      ['Porcentaje de Precisión:', data.resultados.porcentajePrecision],
      [],
      ['IDENTIDAD CONFIRMADA'],
      ['Nombre Completo:', data.identidad.nombreCompleto],
      ['C.I.:', data.identidad.ci],
      ['Fecha de Nacimiento:', data.identidad.fechaNacimiento],
      ['Tipo de Sangre:', data.identidad.tipoSangre],
      [],
      ['PUNTOS CARACTERÍSTICOS DETECTADOS'],
      ['Bifurcaciones:', data.puntosCaracteristicos.bifurcaciones.toString()],
      ['Terminaciones:', data.puntosCaracteristicos.terminaciones.toString()],
      ['Núcleos:', data.puntosCaracteristicos.nucleos.toString()],
      [],
      ['OBSERVACIONES TÉCNICAS'],
      [data.observacionesTecnicas],
    ]
    const buffer = await this.excelService.generate(
      'consulta-biometrica',
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
      origen: {
        operador: 'SGT. 1RO. CHOQUE HUANCA, MARCO',
        metodoCaptura: 'SCANNER LIVESCAN 3000 / CARGA DE ARCHIVO NIST',
      },
      unidad: 'DIVISIÓN DE INTELIGENCIA (SCZ)',
      resultados: {
        estadoCoincidencia: 'HIT - POSITIVO',
        porcentajePrecision: '98.4%',
      },
      identidad: {
        nombreCompleto: 'GUTIÉRREZ ZAMBRANA, ROLANDO',
        ci: '5540212 SC.',
        fechaNacimiento: '12/08/1988',
        tipoSangre: 'O+',
      },
      puntosCaracteristicos: {
        totalMinucias: 14,
        bifurcaciones: 6,
        terminaciones: 5,
        nucleos: 3,
      },
      observacionesTecnicas:
        'La consulta biométrica arroja una coincidencia plena. El sujeto presenta desgaste dactilar en el dedo índice derecho por trabajo manual, sin embargo, el pulgar izquierdo permite la identificación inequívoca.',
      footer: {
        idTransaccion: '0092834-B',
        sello: 'DEPARTAMENTO BIOMÉTRICO',
        firma: 'CNEL. DESP.',
      },
    }
  }
}
