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
import { PDF_OFICIO_VERTICAL } from '@/application/inteligencia/reportes/export/pdf/pdf-options'
import { ActuacionLgiService } from './service/actuacion.service'
import { InicioInvestigacionService } from './service/inicio_investigacion.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Reporte')
@Controller('reportes-lgi')
export class ReportesLgiController {
  constructor(
    private readonly reporteService: ActuacionLgiService,
    private readonly exportService: ExportService,
    private readonly reporteIncio: InicioInvestigacionService,
  ) {}

  @Get('export/pdf/actuacion/:id')
  async exportPDFGiaef(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    const data = await this.reporteService.GenerarPDFActuacion(id)

    const buffer = await this.exportService.generatePDF(
      'lgi-actuacion',
      data,
       PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=lgi-actuacion-${id}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get('export/pdf/actuacion/:id')
  async exportPDFInicioInvestigacion(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    const data = await this.reporteIncio.GenerarPDFInicio(id)

    const buffer = await this.exportService.generatePDF(
      'lgi-inicio-investigacion',
      data,
       PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=lgi-inicio-investigacion-${id}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }
}