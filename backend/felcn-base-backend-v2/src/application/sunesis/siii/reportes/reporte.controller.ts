import { Controller, Get, Param, Res } from '@nestjs/common'
import type { Response } from 'express'
import { ReportBaseService } from './services/reporte-base.service'
import { OperativoService } from '../operativo/service/operativo.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { OperativeReportTemplate } from './templates/form-operativo.template'
import { SetRequestTimeout } from '@/common/interceptors'

@ApiTags('Reportes Operativos (SIII)')
@Controller('reportes')
export class ReportController extends BaseController {
  constructor(
    private readonly reportService: ReportBaseService,
    private readonly operativoService: OperativoService
  ) {
    super()
  }

  @ApiOperation({
    summary: 'Genera el Formulario Operativo en formato PDF',
    description: 'Lee del felcn_siii.public.operativo y sus tablas relacionadas.',
  })
  @SetRequestTimeout(120)
  @Get('operativos/:numeroOperativo/pdf')
  async generateOperativePdf(@Param('numeroOperativo') numeroOperativo: string, @Res() res: Response) {
    try {
      const template = new OperativeReportTemplate()
      const data = await OperativeReportTemplate.fetchData(this.operativoService, numeroOperativo)

      const pdfBuffer = await this.reportService.generatePdf(template, data)

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=formulario-operativo-${numeroOperativo}.pdf`,
        'Content-Length': pdfBuffer.length,
      })

      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('Error generating PDF:', error)
      res.status(500).json({ message: 'Error al generar el PDF', error: error.message })
    }
  }
}
