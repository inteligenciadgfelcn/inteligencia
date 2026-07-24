import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'
import { SetRequestTimeout } from '@/common/interceptors'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ReportBaseService } from '../../../siii/reportes/services/reporte-base.service'
import { ReporteFlujoTransporteService } from '../services/reporte-flujo-transporte.service'
import { RepFlujoTransporteTemplate } from './templates/rep-flujo-transporte.template'
import type { FiltroFlujoTransporte } from '../../flujo-transporte/repository/flujo-transporte.repository'

const RECIENTES_LIMITE_DEFAULT = 10
const RECIENTES_LIMITE_MAX = 50

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
    fechaHasta?: string,
    idColor?: number
  ): FiltroFlujoTransporte {
    return {
      documento: documento?.trim() || undefined,
      placa: placa?.trim() || undefined,
      fechaDesde: fechaDesde?.trim() || undefined,
      fechaHasta: fechaHasta?.trim() || undefined,
      idColor: idColor ? Number(idColor) : undefined,
    }
  }

  @ApiOperation({
    summary:
      'Lista paginada de los registros de Flujo de Transporte, filtrable por ' +
      'documento del conductor, placa/código de transporte, rango de fechas ' +
      '(fecha_hora) y/o color',
  })
  @ApiQuery({ name: 'documento', required: false })
  @ApiQuery({ name: 'placa', required: false })
  @ApiQuery({ name: 'fechaDesde', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'fechaHasta', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'idColor', required: false })
  @Get()
  async listar(
    @Query() paginacion: PaginacionQueryDto,
    @Query('documento') documento?: string,
    @Query('placa') placa?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('idColor') idColor?: number
  ) {
    const resultado = await this.reporteService.listar(
      this.construirFiltro(documento, placa, fechaDesde, fechaHasta, idColor),
      paginacion
    )
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({
    summary:
      `Últimos registros de Flujo de Transporte ingresados (por defecto ${RECIENTES_LIMITE_DEFAULT}), ` +
      'ordenados por fecha_hora descendente. Pensado para un tab con auto-refresh.',
  })
  @ApiQuery({ name: 'limite', required: false, type: Number })
  @Get('recientes')
  async listarRecientes(@Query('limite') limite?: number) {
    const tope = Math.min(
      Number(limite) || RECIENTES_LIMITE_DEFAULT,
      RECIENTES_LIMITE_MAX
    )
    const filas = await this.reporteService.listarRecientes(tope)
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
    @Req() req: Request,
    @Res() res: Response,
    @Query('documento') documento?: string,
    @Query('placa') placa?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    try {
      const filtro = this.construirFiltro(
        documento,
        placa,
        fechaDesde,
        fechaHasta
      )
      const filas = await this.reporteService.listarTodos(filtro)

      const { usuario, accessToken } = req.user as PassportUser
      const usuarioGenerador =
        await this.reportBaseService.obtenerUsuarioGenerador(
          accessToken,
          usuario
        )

      const template = new RepFlujoTransporteTemplate(usuarioGenerador)
      const pdfBuffer = await this.reportBaseService.generatePdf(template, {
        filas,
        filtro,
      })

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename=reporte-flujo-transporte.pdf',
        'Content-Length': pdfBuffer.length,
      })
      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('[FlujoTransporteReport] Error generando PDF:', error)
      res
        .status(500)
        .json({ message: 'Error al generar el PDF', error: error.message })
    }
  }
}
