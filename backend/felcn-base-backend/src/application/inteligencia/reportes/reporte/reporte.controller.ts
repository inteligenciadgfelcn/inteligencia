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

import { ExportService } from '../export/export.service'

import {
  PDF_A3_HORIZONTAL,
  PDF_OFICIO_VERTICAL,
} from '../export/pdf/pdf-options'

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
  async exportPDF(
    @Param('id_detenido', ParseIntPipe)
    id: number,

    @Res()
    res: Response
  ) {
    const data = await this.reporteService.GenerarPDF(id)

    const buffer = await this.exportService.generatePDF(
      'tarjeta-prontuaria',
      data,
      PDF_OFICIO_VERTICAL
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=tarjeta-prontuaria-${id}.pdf`,
      'Content-Length': buffer.length,
    })

    res.send(buffer)
  }

  @Get('export/pdf/servicio/:id_servicio')
  async exportPDFServicio(
    @Param('id_servicio')
    idServicio: string,

    @Res()
    res: Response
  ) {
    const data = await this.reporteService.GenerarPDFServicio(idServicio)

    const buffer = await this.exportService.generatePDF(
      'reporte-servicio',
      data,
      PDF_A3_HORIZONTAL
    )

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte-servicio-${idServicio}.pdf`,
      'Content-Length': buffer.length,
    })

    res.send(buffer)
  }
}