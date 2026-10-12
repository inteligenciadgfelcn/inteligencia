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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProduces, ApiTags } from '@nestjs/swagger'
import { PDF_OFICIO_VERTICAL } from '@/application/inteligencia/reportes/export/pdf/pdf-options'
import { ActuacionLgiService } from './service/actuacion.service'
import { InicioInvestigacionService } from './service/inicio_investigacion.service'
import { BienesLgiService } from './service/bienes_lgi.service'
import { PersonasJuridicasReporteService } from './service/personas-juridicas.service'
import { ConclusionReporteService } from './service/conclusion.service'
import { ReportePdService } from './service/reporte-pd.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('pd - Reporte')
@Controller('reportes-pd')
export class ReportesLgiController {
  constructor(
    private readonly reporteService: ActuacionLgiService,
    private readonly exportService: ExportService,
    private readonly reporteBienes: BienesLgiService,
    private readonly personasJuridicasReporte: PersonasJuridicasReporteService,
    private readonly conclusionReporte: ConclusionReporteService,
     private readonly reportePdService: ReportePdService,
  ) {}

  @Get('export/pdf/actuacion/:id')
  async exportPDFActuacionPd(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    const data = await this.reporteService.GenerarPDFActuacion(id)

    const buffer = await this.exportService.generatePDF(
      'pd-actuacion',
      data,
      PDF_OFICIO_VERTICAL
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pd-actuacion-${id}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get('export/pdf/bienes/:idBien')
  async exportPDFBienesSecuestrados(
    @Param('idBien', ParseIntPipe) idBien: number,
    @Res() res: Response
  ) {
    const data = await this.reporteBienes.GenerarPDFBienes(idBien)
    const buffer = await this.exportService.generatePDF(
      'pd-bienes',
      data,
      PDF_OFICIO_VERTICAL
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pd-bienes-${idBien}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get('export/pdf/personas-juridicas/:idEmpresa')
  async exportPDFPersonaJuridica(
    @Param('idEmpresa', ParseIntPipe) idEmpresa: number,
    @Res() res: Response
  ) {
    const data =
      await this.personasJuridicasReporte.GenerarPDFEmpresa(idEmpresa)
    const buffer = await this.exportService.generatePDF(
      'pd-personas-juridicas',
      data,
      PDF_OFICIO_VERTICAL
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pd-personas-juridicas-${idEmpresa}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get('export/pdf/conclusion/:casosId')
  async exportPDFConclusion(
    @Param('casosId', ParseIntPipe)
    casosId: number,

    @Res()
    res: Response
  ) {
    const data = await this.conclusionReporte.GenerarPDFConclusion(casosId)

    const buffer = await this.exportService.generatePDF(
      'pd-conclusion-caso',
      data,
      PDF_OFICIO_VERTICAL
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="pd-conclusion-caso-${casosId}.pdf"`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

   @Get('export/pdf/caso-integral/:casosId')
  @ApiOperation({ summary: 'Exportar reporte integral de Pérdida de Dominio' })
  @ApiProduces('application/pdf')
  @ApiParam({ name: 'casosId', type: String, example: '196' })
  async exportPDFCasoIntegral(
    @Param('casosId') casosId: string,
    @Res() res: Response,
  ) {
    const data = await this.reportePdService.generarReporte(casosId)
    const buffer = await this.exportService.generatePDF(
      'pd-caso-integral',
      data,
      {
        ...PDF_OFICIO_VERTICAL,
        margin: {
          top: '18mm',
          right: '16mm',
          bottom: '18mm',
          left: '16mm',
        },
      },
    )
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=pd-caso-integral-${casosId}.pdf`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }


}
