import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { pdfFonts } from 'src/common/helpers/fonts';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';

@Injectable()
export class ParametersPdfService {
  async generateParameterReport(data: Continente[]): Promise<Buffer> {
    const printer = new PdfPrinter(pdfFonts);

    const docDefinition = {
      content: [
        { text: 'Reporte de Parámetros', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', '*', 'auto'],
            body: [
              [
                { text: 'ID', bold: true },
                { text: 'Nombre Parámetro', bold: true },
                { text: 'Activo', bold: true },
                { text: 'Usuario Registro', bold: true },
                { text: 'Fecha Registro', bold: true },
              ],
              ...data.map((item) => [
                item.codigo,
                item.nombre,
               // item.activo ? 'Sí' : 'No',
               // item.usuario_registro,
               // new Date(item.fecha_registro).toLocaleString(),
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 10, 0] as [number, number, number, number],
        },
      },
      defaultStyle: {
        font: 'Arial',
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Uint8Array[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }
}
