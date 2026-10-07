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

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('pd - Reporte')
@Controller('reportes-pd')
export class ReportesLgiController {
  constructor(
    private readonly reporteService: ActuacionLgiService,
    private readonly exportService: ExportService,
    private readonly reporteIncio: InicioInvestigacionService,
    private readonly reporteBienes: BienesLgiService,
    private readonly personasJuridicasReporte: PersonasJuridicasReporteService,
    private readonly conclusionReporte: ConclusionReporteService,
  ) { }

  @Get('export/pdf/actuacion/:id')
  async exportPDFActuacionPd(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const data = await this.reporteService.GenerarPDFActuacion(id)

    const buffer = await this.exportService.generatePDF(
      'pd-actuacion',
      data,
      PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        `attachment; filename=pd-actuacion-${id}.pdf`,
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
      'pd-bienes',
      data,
      PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        `attachment; filename=pd-bienes-${idBien}.pdf`,
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
      'pd-personas-juridicas',
      data,
      PDF_OFICIO_VERTICAL,
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        `attachment; filename=pd-personas-juridicas-${idEmpresa}.pdf`,
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
}