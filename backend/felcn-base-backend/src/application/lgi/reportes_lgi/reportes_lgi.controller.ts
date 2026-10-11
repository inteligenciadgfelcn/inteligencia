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
import { BienesLgiService } from './service/bienes_lgi.service'
import { PersonasJuridicasReporteService } from './service/personas-juridicas.service'
import { ConclusionReporteService } from './service/conclusion.service'
import { CasoIntegralService } from './service/caso-integral.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Reporte')
@Controller('reportes-lgi')
export class ReportesLgiController {
  constructor(
    private readonly reporteService: ActuacionLgiService,
    private readonly exportService: ExportService,
    private readonly reporteBienes: BienesLgiService,
    private readonly personasJuridicasReporte: PersonasJuridicasReporteService,
    private readonly conclusionReporte: ConclusionReporteService,
    private readonly reporte: CasoIntegralService,
  ) { }

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

  @Get('export/pdf/bienes/:idBien')
  async exportPDFBienesSecuestrados(
    @Param('idBien', ParseIntPipe) idBien: number,
    @Res() res: Response,
  ) {
    const data = await this.reporteBienes.GenerarPDFBienes(idBien)
    const buffer = await this.exportService.generatePDF(
      'lgi-bienes', data, PDF_OFICIO_VERTICAL,
    )
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=lgi-bienes-${idBien}.pdf`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Get('export/pdf/personas-juridicas/:idEmpresa')
  async exportPDFPersonaJuridica(
    @Param('idEmpresa', ParseIntPipe) idEmpresa: number,
    @Res() res: Response,
  ) {
    const data = await this.personasJuridicasReporte.GenerarPDFEmpresa(idEmpresa)
    const buffer = await this.exportService.generatePDF(
      'lgi-personas-juridicas', data, PDF_OFICIO_VERTICAL,
    )
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=lgi-personas-juridicas-${idEmpresa}.pdf`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

  @Get('export/pdf/conclusion/:opId')
  async exportPDFConclusion(
    @Param('opId', ParseIntPipe) opId: number,
    @Res() res: Response,
  ) {
    const data =
      await this.conclusionReporte.GenerarPDFConclusion(opId)

    const buffer = await this.exportService.generatePDF(
      'lgi-conclusion',
      data,
      PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        `attachment; filename=lgi-conclusion-${opId}.pdf`,
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get('export/pdf/caso-integral/:casosId')
  async exportPDFCasoIntegral(
    @Param('casosId', ParseIntPipe) casosId: number,
    @Res() res: Response,
  ) {
    const data = await this.reporte.GenerarPDFCasoIntegral(casosId)
    const buffer = await this.exportService.generatePDF('lgi-caso-integral', data, PDF_OFICIO_VERTICAL)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=lgi-caso-integral-${casosId}.pdf`,
      'Content-Length': buffer.length,
    })
    res.end(buffer)
  }

}