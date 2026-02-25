import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Continente } from 'src/modules/parametros/continentes/entities/continente.entity';

@Injectable()
export class ParametersExcelService {
  async generateParameterReport(data: Continente[]): Promise<Buffer> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Parámetros');

    worksheet.addRow([
      'ID',
      'Nombre',
      'Activo',
      'Usuario Registro',
      'Fecha Registro',
    ]);

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    data.forEach((item) => {
      worksheet.addRow([
        item,
        item.nombre,
        //item.activo ? 'Sí' : 'No',
       // item.usuario_registro,
       // new Date(item.fecha_registro).toLocaleString(),
      ]);
    });

    // worksheet.columns.forEach((column) => {
    //   let maxLength = 10;
    //   column.eachCell({ includeEmpty: true }, (cell) => {
    //     const value = cell.value as string;
    //     const length = value ? value.toString().length : 10;
    //     if (length > maxLength) maxLength = length;
    //   });
    //   column.width = maxLength + 2;
    // });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
