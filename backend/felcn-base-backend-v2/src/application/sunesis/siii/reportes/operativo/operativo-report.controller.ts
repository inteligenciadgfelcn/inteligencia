import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import { ReportBaseService } from '../services/reporte-base.service'
import { OperativoService } from '../../operativo/service/operativo.service'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { OperativeReportTemplate } from './templates/form-operativo.template'
import { CasoGralReportTemplate } from './templates/rep-caso-general.template'
import { CruzadasReportTemplate } from './templates/rep-cruzadas.template'
import { SetRequestTimeout } from '@/common/interceptors'
import { CruzadasService } from '../cruzados/cruzados.service'
import { ConsultaAvanzadaQueryDto } from '../cruzados/interfaces/consulta-avanzada-filtro.interface'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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

  // ── Helper compartido: mismos datos que los PDF pero sin imágenes ──────────

  private async getPreviewData(numeroOperativo: string) {
    const operativo = await this.operativoService.buscarPorNumeroOperativo(
      decodeURIComponent(numeroOperativo),
    )
    const idOperativo = operativo.id
    const fullLimit = { limite: 100 } as any

    const [
      { caso },
      [drogas],
      [sustanciasSolidas],
      [sustanciasLiquidas],
      [fabricas],
      [bienesRaw],
      [personas],
      [galerias],
    ] = await Promise.all([
      this.operativoService.getOrInit(operativo.idCaso),
      this.operativoService.listarDrogas(idOperativo, fullLimit),
      this.operativoService.listarSustanciasSolidas(idOperativo, fullLimit),
      this.operativoService.listarSustanciasLiquidas(idOperativo, fullLimit),
      this.operativoService.listarFabricas(idOperativo, fullLimit),
      this.operativoService.listarBienes(idOperativo, fullLimit),
      this.operativoService.listarPersonasAuxiliares(idOperativo, fullLimit),
      this.operativoService.listarGaleria(idOperativo, fullLimit),
    ])

    const bienes = await Promise.all(
      bienesRaw.map(async (b: any) => {
        const [caracteristicasRaw] = await this.operativoService.listarCaracteristicasBien(
          idOperativo,
          b.id,
          fullLimit,
        )
        return {
          ...b,
          caracteristicas: (caracteristicasRaw as any[]).map((c) => ({
            label: c.descripcionCaracteristica,
            value: c.descripcion,
          })),
        }
      }),
    )

    const ordenCondicionPersona = (estado?: string): number => {
      switch ((estado ?? '').trim().toUpperCase()) {
        case 'PRINCIPAL IMPLICADO':
          return 1
        case 'APREHENDIDO':
          return 2
        case 'ARRESTADO':
          return 3
        default:
          return 4
      }
    }
    ;(personas as any[]).sort((a, b) => ordenCondicionPersona(a.estado) - ordenCondicionPersona(b.estado))

    return {
      caso,
      operativo,
      drogas,
      sustanciasSolidas,
      sustanciasLiquidas,
      fabricas,
      bienes,
      personas,
      galerias,
      mapaCoords:
        operativo.coordX && operativo.coordY
          ? { lat: operativo.coordX, lon: operativo.coordY }
          : null,
    }
  }

  // ── Vista previa JSON — Formulario Operativo ──────────────────────────────

  @ApiOperation({
    summary: 'Datos del Formulario Operativo en JSON (vista previa)',
    description: 'Misma estructura que el PDF pero sin imágenes.',
  })
  @ApiQuery({ name: 'numero', description: 'Número de operativo (URL-encoded)', example: 'OP%2F2024%2F001' })
  @Get('/operativo/preview')
  async previewOperativo(@Query('numero') numeroOperativo: string) {
    const data = await this.getPreviewData(numeroOperativo)
    return this.successCreate(data)
  }

  // ── Vista previa JSON — Reporte General ───────────────────────────────────

  @ApiOperation({
    summary: 'Datos del Reporte General en JSON (vista previa)',
    description: 'Misma estructura que el PDF pero sin imágenes.',
  })
  @ApiQuery({ name: 'numero', description: 'Número de operativo (URL-encoded)', example: 'OP%2F2024%2F001' })
  @Get('/general/preview')
  async previewGeneral(@Query('numero') numeroOperativo: string) {
    const data = await this.getPreviewData(numeroOperativo)
    return this.successCreate(data)
  }

  @ApiOperation({
    summary: 'Genera el Formulario Operativo en formato PDF',
    description: 'Lee del felcn_siii.public.operativo y sus tablas relacionadas.',
  })
  @ApiQuery({ name: 'numero', description: 'Número de operativo (puede contener "/", se envía URL-encoded)', example: 'OP%2F2024%2F001' })
  @SetRequestTimeout(120)
  @Get('/operativo/pdf')
  async generateOperativePdf(
    @Query('numero') numeroOperativo: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { usuario } = req.user as PassportUser
      const usuarioGenerador = await this.reportService.obtenerUsuarioGenerador(usuario)
      const template = new OperativeReportTemplate(usuarioGenerador)
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
    summary: 'Genera el Reporte General en formato PDF',
    description: 'Lee del felcn_siii.public.operativo y sus tablas relacionadas.',
  })
  @ApiQuery({ name: 'numero', description: 'Número de operativo (puede contener "/", se envía URL-encoded)', example: 'OP%2F2024%2F001' })
  @SetRequestTimeout(120)
  @Get('/general/pdf')
  async generateReporteGEenralPDF(
    @Query('numero') numeroOperativo: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { usuario } = req.user as PassportUser
      const usuarioGenerador = await this.reportService.obtenerUsuarioGenerador(usuario)
      const template = new CasoGralReportTemplate(usuarioGenerador)
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
  async generateCruzadasPdf(
    @Query() filtro: ConsultaAvanzadaQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { usuario } = req.user as PassportUser
      const usuarioGenerador = await this.reportService.obtenerUsuarioGenerador(usuario)
      const { filas } = await this.cruzadasService.buscarAvanzado(filtro)
      const template = new CruzadasReportTemplate(usuarioGenerador)
      const pdfBuffer = await this.reportService.generatePdf(template, filas)

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
