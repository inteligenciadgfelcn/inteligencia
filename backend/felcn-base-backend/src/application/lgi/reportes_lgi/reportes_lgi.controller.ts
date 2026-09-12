import { ExportService } from '@/application/inteligencia/reportes/export/export.service'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ReportesLgiService } from './reportes_lgi.service'
import { PDF_OFICIO_VERTICAL } from '@/application/inteligencia/reportes/export/pdf/pdf-options'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte')
@Controller('reportes-lgi')
export class ReportesLgiController {
  constructor(
    private readonly reporteService: ReportesLgiService,
    private readonly exportService: ExportService
  ) {}

  @Get('export/pdf/giaef/:id')
  async exportPDFGiaef(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    const data = await this.reporteService.GenerarPDFGiaef(id)

    const buffer = await this.exportService.generatePDF(
      'inicio-investigacion',
      data,
       PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=inicio-investigacion-${id}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }
}