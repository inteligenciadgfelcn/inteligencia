import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { SetRequestTimeout } from '@/common/interceptors'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ReportBaseService } from '../../../siii/reportes/services/reporte-base.service'
import { ReporteFlujoTransporteService } from '../services/reporte-flujo-transporte.service'
import { RepFlujoTransporteTemplate } from './templates/rep-flujo-transporte.template'
import type { FiltroFlujoTransporte } from '../../flujo-transporte/repository/flujo-transporte.repository'

/**
 * Controlador de reportes de Flujo de Transporte (módulo S2I).
 * Lista los viajes registrados filtrables por documento del conductor,
 * placa/código de transporte y rango de fechas, con exportación a PDF.
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reportes S2I — Flujo de Transporte')
@Controller('s2i/reportes/flujo-transporte')
export class FlujoTransporteReportController extends BaseController {
  constructor(
    private readonly reportBaseService: ReportBaseService,
    private readonly reporteService: ReporteFlujoTransporteService
  ) {
    super()
  }

  private construirFiltro(
    documento?: string,
    placa?: string,
    fechaDesde?: string,
    fechaHasta?: string
  ): FiltroFlujoTransporte {
    return {
      documento: documento?.trim() || undefined,
      placa: placa?.trim() || undefined,
      fechaDesde: fechaDesde?.trim() || undefined,
      fechaHasta: fechaHasta?.trim() || undefined,
    }
  }

  @ApiOperation({
    summary:
      'Lista los registros de Flujo de Transporte, filtrables por documento del ' +
      'conductor, placa/código de transporte y rango de fechas (fecha_hora)',
  })
  @ApiQuery({ name: 'documento', required: false })
  @ApiQuery({ name: 'placa', required: false })
  @ApiQuery({ name: 'fechaDesde', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'fechaHasta', required: false, description: 'YYYY-MM-DD' })
  @Get()
  async listar(
    @Query('documento') documento?: string,
    @Query('placa') placa?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    const filas = await this.reporteService.listar(
      this.construirFiltro(documento, placa, fechaDesde, fechaHasta)
    )
    return this.successList(filas)
  }

  @ApiOperation({
    summary:
      'Genera el reporte de Flujo de Transporte en PDF con los mismos filtros, ' +
      'pintando el color correspondiente de cada registro',
  })
  @ApiQuery({ name: 'documento', required: false })
  @ApiQuery({ name: 'placa', required: false })
  @ApiQuery({ name: 'fechaDesde', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'fechaHasta', required: false, description: 'YYYY-MM-DD' })
  @SetRequestTimeout(60)
  @Get('pdf')
  async generarPdf(
    @Res() res: Response,
    @Query('documento') documento?: string,
    @Query('placa') placa?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    try {
      const filtro = this.construirFiltro(documento, placa, fechaDesde, fechaHasta)
      const filas = await this.reporteService.listar(filtro)

      const template = new RepFlujoTransporteTemplate()
      const pdfBuffer = await this.reportBaseService.generatePdf(template, {
        filas,
        filtro,
      })

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=reporte-flujo-transporte.pdf',
        'Content-Length': pdfBuffer.length,
      })
      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('[FlujoTransporteReport] Error generando PDF:', error)
      res.status(500).json({ message: 'Error al generar el PDF', error: error.message })
    }
  }
}
