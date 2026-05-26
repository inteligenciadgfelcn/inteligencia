import { Controller, Get, Param, Query, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { SetRequestTimeout } from '@/common/interceptors'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ReportBaseService } from '../../../siii/reportes/services/reporte-base.service'
import { ReporteCasosService, FiltroCasosDto } from '../services/reporte-casos.service'
import { RepCasoDetalleTemplate } from './templates/rep-caso-detalle.template'
import { RepCasoGisTemplate } from './templates/rep-caso-gis.template'

/**
 * Controlador de reportes del módulo S2I (Casos de Investigación).
 * Migración de los formularios ASP.NET:
 *   FRM-RP-01 → GET /s2i/reportes/casos (lista JSON)
 *   FRM-RP-02 → GET /s2i/reportes/casos (mismo endpoint, diferencia en el cliente)
 *   RPT-MN-01 → GET /s2i/reportes/casos/:id/pdf
 *   RPT-MN-02 → GET /s2i/reportes/casos/:id/gis/pdf
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reportes S2I — Casos de Investigación')
@Controller('s2i/reportes/casos')
export class CasosReportController extends BaseController {
  constructor(
    private readonly reportBaseService: ReportBaseService,
    private readonly reporteCasosService: ReporteCasosService,
  ) {
    super()
  }

  // ── FRM-RP-01 / FRM-RP-02 ────────────────────────────────────────────────

  @ApiOperation({
    summary: 'Lista los casos de investigación del usuario autenticado',
    description:
      'Equivale a FRM-RP-01 y FRM-RP-02. Devuelve JSON paginable con ' +
      'filtros opcionales por nombre, estado y antecedente.',
  })
  @ApiQuery({ name: 'nombre', required: false, description: 'Filtro por nombre del caso' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtro por estado del caso' })
  @ApiQuery({ name: 'antecedente', required: false, description: 'Filtro por antecedente' })
  @Get()
  async listarCasos(
    @Req() req: Request,
    @Query('nombre') nombre?: string,
    @Query('estado') estado?: string,
    @Query('antecedente') antecedente?: string,
  ) {
    // El usuario proviene del token JWT procesado por el guard de autenticación
    const { numeroPase = '' } = req.user as PassportUser
    const filtro: FiltroCasosDto = { nombre, estado, antecedente }
    const casos = await this.reporteCasosService.listarCasos(numeroPase, filtro)
    return this.successList(casos)
  }

  // ── RPT-MN-01 ─────────────────────────────────────────────────────────────

  @ApiOperation({
    summary: 'Genera el Reporte Detallado de Caso en PDF (RPT-MN-01)',
    description:
      'Incluye: datos generales, investigados (con antecedentes, redes ' +
      'sociales y lugares de frecuencia), organizaciones (con GIS) y ' +
      'bienes/activos (con características).',
  })
  @ApiParam({ name: 'id', description: 'ID del caso (idCaso)' })
  @SetRequestTimeout(120)
  @Get(':id/pdf')
  async generarDetallePdf(
    @Param('id') idCaso: string,
    @Res() res: Response,
  ) {
    try {
      const template = new RepCasoDetalleTemplate()
      const data = await RepCasoDetalleTemplate.fetchData(
        this.reporteCasosService,
        idCaso,
      )

      const pdfBuffer = await this.reportBaseService.generatePdf(template, data)

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=reporte-caso-${idCaso}.pdf`,
        'Content-Length': pdfBuffer.length,
      })
      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('[CasosReport] Error generando PDF detalle:', error)
      res.status(500).json({ message: 'Error al generar el PDF', error: error.message })
    }
  }

  // ── RPT-MN-02 ─────────────────────────────────────────────────────────────

  @ApiOperation({
    summary: 'Genera el Reporte GIS de Caso en PDF (RPT-MN-02)',
    description:
      'Incluye los datos generales del caso y un mapa Leaflet con los ' +
      'marcadores de personas investigadas, organizaciones y bienes, ' +
      'diferenciados por color.',
  })
  @ApiParam({ name: 'id', description: 'ID del caso (idCaso)' })
  @SetRequestTimeout(120)
  @Get(':id/gis/pdf')
  async generarGisPdf(
    @Param('id') idCaso: string,
    @Res() res: Response,
  ) {
    try {
      const template = new RepCasoGisTemplate()
      const data = await RepCasoGisTemplate.fetchData(
        this.reporteCasosService,
        idCaso,
      )

      const pdfBuffer = await this.reportBaseService.generatePdf(template, data)

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=reporte-gis-caso-${idCaso}.pdf`,
        'Content-Length': pdfBuffer.length,
      })
      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('[CasosReport] Error generando PDF GIS:', error)
      res.status(500).json({ message: 'Error al generar el PDF GIS', error: error.message })
    }
  }
}
