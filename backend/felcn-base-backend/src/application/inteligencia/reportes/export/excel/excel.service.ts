import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async generate(type: string, data: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type.toUpperCase());

    if (data.length === 0) {
      worksheet.addRow(['Sin datos']);
    } else {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      data.forEach(item => {
        worksheet.addRow(headers.map(h => item[h]));
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
