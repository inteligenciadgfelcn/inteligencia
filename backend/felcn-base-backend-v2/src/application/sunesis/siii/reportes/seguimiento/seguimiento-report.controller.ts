import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { ReportBaseService } from '../services/reporte-base.service'
import { SeguimientoService } from '../../seguimiento/casos/service/seguimiento.service'
import { PersonasService } from '../../seguimiento/personas/service/personas.service'
import { BienesService } from '../../seguimiento/bienes/service/bienes.service'
import { SeguimientoReportTemplate } from './templates/rep-seguimiento-caso.template'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { SetRequestTimeout } from '@/common/interceptors'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reportes de Seguimiento (SIII)')
@Controller('reportes/seguimiento')
export class SeguimientoReportController extends BaseController {
  constructor(
    private readonly reportService: ReportBaseService,
    private readonly seguimientoService: SeguimientoService,
    private readonly personasService: PersonasService,
    private readonly bienesService: BienesService,
  ) {
    super()
  }

  @ApiOperation({
    summary: 'Genera el Reporte de Seguimiento de Caso en formato PDF',
    description:
      'Fiscales, investigadores, jurisdicción, control jurisdiccional, servidores policiales, ' +
      'situación legal de personas implicadas y situación legal de bienes secuestrados.',
  })
  @ApiQuery({ name: 'idCaso', description: 'ID del caso (asignacion.id_caso)', example: '123' })
  @SetRequestTimeout(120)
  @Get('/pdf')
  async generateSeguimientoPdf(
    @Query('idCaso') idCaso: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { usuario, accessToken } = req.user as PassportUser
      const usuarioGenerador = await this.reportService.obtenerUsuarioGenerador(accessToken, usuario)
      const template = new SeguimientoReportTemplate(usuarioGenerador)
      const data = await SeguimientoReportTemplate.fetchData(
        this.seguimientoService,
        this.personasService,
        this.bienesService,
        idCaso,
      )

      const pdfBuffer = await this.reportService.generatePdf(template, data)

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=seguimiento-caso-${idCaso}.pdf`,
        'Content-Length': pdfBuffer.length,
      })

      res.end(Buffer.from(pdfBuffer))
    } catch (error) {
      console.error('Error generating seguimiento PDF:', error)
      res.status(500).json({ message: 'Error al generar el PDF', error: error.message })
    }
  }
}
