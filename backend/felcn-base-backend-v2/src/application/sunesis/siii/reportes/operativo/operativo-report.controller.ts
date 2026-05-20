import { Controller, Get, Param, Query, Res } from '@nestjs/common'
import type { Response } from 'express'
import { ReportBaseService } from '../services/reporte-base.service'
import { OperativoService } from '../../operativo/service/operativo.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { OperativeReportTemplate } from './templates/form-operativo.template'
import { CasoGralReportTemplate } from './templates/rep-caso-general.template'
import { CruzadasReportTemplate } from './templates/rep-cruzadas.template'
import { SetRequestTimeout } from '@/common/interceptors'
import { CruzadasService } from '../cruzados/cruzados.service'
import { ConsultaAvanzadaQueryDto } from '../cruzados/interfaces/consulta-avanzada-filtro.interface'

@ApiTags('Reportes Operativos (SIII)')
@Controller('reportes')
export class OperativeReportController extends BaseController {
  constructor(
    private readonly reportService: ReportBaseService,
    private readonly operativoService: OperativoService,
    private readonly cruzadasService: CruzadasService,
  ) {
    super()
  }

  @ApiOperation({
    summary: 'Genera el Formulario Operativo en formato PDF',
    description: 'Lee del felcn_siii.public.operativo y sus tablas relacionadas.',
  })
  @SetRequestTimeout(120)
  @Get('/operativo/:numeroOperativo/pdf')
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

  @ApiOperation({
    summary: 'Genera el Formulario Operativo en formato PDF',
    description: 'Lee del felcn_siii.public.operativo y sus tablas relacionadas.',
  })
  @SetRequestTimeout(120)
  @Get('/general/:numeroOperativo/pdf')
  async generateReporteGEenralPDF(@Param('numeroOperativo') numeroOperativo: string, @Res() res: Response) {
    try {
      const template = new CasoGralReportTemplate()
      const data = await CasoGralReportTemplate.fetchData(this.operativoService, numeroOperativo)

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

  @ApiOperation({
    summary: 'Genera reporte PDF de consulta cruzada de operativos',
    description:
      'Acepta los mismos filtros que GET /reportes/cruzadas/avanzado. ' +
      'Devuelve un PDF A3 landscape con las columnas de resultado y cada fila ' +
      'coloreada según el tipo de relevancia del operativo.',
  })
  @SetRequestTimeout(120)
  @Get('/cruzadas-avanzado/pdf')
  async generateCruzadasPdf(@Query() filtro: ConsultaAvanzadaQueryDto, @Res() res: Response) {
    try {
      const data = await this.cruzadasService.buscarAvanzado(filtro)
      const template = new CruzadasReportTemplate()
      const pdfBuffer = await this.reportService.generatePdf(template, data)

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=reporte-cruzadas.pdf',
        'Content-Length': pdfBuffer.length,
      })

      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('Error generating cruzadas PDF:', error)
      res.status(500).json({ message: 'Error al generar el PDF', error: error.message })
    }
  }
}
