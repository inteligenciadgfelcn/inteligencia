
import { Module } from "@nestjs/common";
import { ExcelService } from "./excel/excel.service";
import { ExportService } from "./export.service";
import { PdfService } from "./pdf/pdf.service";

@Module({
  providers: [ExportService, PdfService, ExcelService],
  exports: [ExportService, PdfService, ExcelService],
})
export class ExportModule {}
