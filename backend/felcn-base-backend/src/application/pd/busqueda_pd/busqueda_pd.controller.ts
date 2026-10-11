import {
  BadRequestException, Body, Controller, Get, Param, Post, Query, Res, UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import {
  ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BaseController } from '@/common/base/base-controller'
import { PaginacionQueryDto } from '@/common/dto'
import { BusquedaPdService } from './busqueda_pd.service'
import { VariablesCruzadasPdExportService } from './variables-cruzadas-pd-export.service'
import { FiltrosVariablesCruzadasPdDto } from './dto/filtros-variables-cruzadas.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('PD - Búsqueda general')
@Controller('pd/busqueda-general')
export class BusquedaPdController extends BaseController {
  constructor(
    private readonly busquedaPdService: BusquedaPdService,
    private readonly variablesCruzadasExportService: VariablesCruzadasPdExportService
  ) { super() }

  @Post('buscar')
  @ApiOperation({ summary: 'Buscar casos PD mediante variables cruzadas' })
  @ApiBody({ type: FiltrosVariablesCruzadasPdDto, required: false,
    description: 'Todos los filtros son opcionales. Enviar {} para consultar casos PD activos.' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'limite', required: false, example: 10 })
  @ApiQuery({ name: 'filtro', required: false, example: 'EMPRESA' })
  async buscar(
    @Body() filtros: FiltrosVariablesCruzadasPdDto,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.busquedaPdService.buscarGeneralPaginado(filtros ?? {}, pagination)
    return this.successListRows(result)
  }

  @Get('catalogos')
  @ApiOperation({ summary: 'Obtener catálogos para los filtros Pd' })
  async obtenerCatalogos() {
    return { finalizado: true, datos: await this.busquedaPdService.obtenerCatalogos() }
  }

  @Get('caso/:casosId/detalle')
  @ApiOperation({ summary: 'Obtener personas y actuaciones del caso con bienes y empresas' })
  @ApiParam({ name: 'casosId', type: String, example: '100' })
  async obtenerDetalle(@Param('casosId') casosId: string) {
    return { finalizado: true, datos: await this.busquedaPdService.obtenerDetalle(casosId) }
  }

  @Post('export/:formato')
  @ApiOperation({ summary: 'Exportar búsqueda PD en PDF, CSV, Excel o JSON' })
  @ApiParam({ name: 'formato', enum: ['pdf', 'csv', 'excel', 'json'], example: 'excel' })
  @ApiBody({ type: FiltrosVariablesCruzadasPdDto, required: false })
  async exportar(
    @Param('formato') formato: string,
    @Body() filtros: FiltrosVariablesCruzadasPdDto,
    @Res() res: Response
  ) {
    const tipo = formato.trim().toLowerCase()
    let buffer: Buffer
    let contentType: string
    let extension: string
    switch (tipo) {
      case 'json':
        buffer = await this.variablesCruzadasExportService.generarJson(filtros ?? {})
        contentType = 'application/json; charset=utf-8'
        extension = 'json'
        break
      case 'csv':
        buffer = await this.variablesCruzadasExportService.generarCsv(filtros ?? {})
        contentType = 'text/csv; charset=utf-8'
        extension = 'csv'
        break
      case 'excel':
        buffer = await this.variablesCruzadasExportService.generarExcel(filtros ?? {})
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        extension = 'xlsx'
        break
      case 'pdf':
        buffer = await this.variablesCruzadasExportService.generarPdf(filtros ?? {})
        contentType = 'application/pdf'
        extension = 'pdf'
        break
      default:
        throw new BadRequestException('Formato inválido. Use pdf, csv, excel o json.')
    }
    const nombre = `busqueda-Pd-${this.obtenerFechaArchivo()}.${extension}`
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${nombre}"`,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'no-store',
    })
    return res.send(buffer)
  }

  private obtenerFechaArchivo(): string {
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date())
    const obtener = (tipo: Intl.DateTimeFormatPartTypes) =>
      partes.find((parte) => parte.type === tipo)?.value ?? ''
    return `${obtener('year')}${obtener('month')}${obtener('day')}-${obtener('hour')}${obtener('minute')}${obtener('second')}`
  }
}
