import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ExportService } from '../export/export.service'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ReporteService } from './reporte.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte')
@Controller('reporte')
export class ReporteController {
  constructor(
    private readonly reporteService: ReporteService,
    private readonly exportService: ExportService
  ) {}

  @Get('export/pdf/:id_detenido')
  async exportPDF(@Param('id_detenido') id: number, @Res() res: Response) {
    const data = await this.reporteService.GenerarPDF(+id)

    const buffer = await this.exportService.generatePDF('tarjeta-prontuaria', data)

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=tarjeta-prontuaria-${id}.pdf`,
    })

    res.send(buffer)
  }

}
