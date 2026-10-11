import {
  BadRequestException, Body, Controller, Get, Param, Post, Query, Res, UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import {
  ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BaseController } from '@/common/base/base-controller'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { FiltrosVariablesCruzadasLgiDto } from './dto/filtros-variables-cruzadas-lgi.dto'
import { BusquedaLgiService } from './busqueda_lgi.service'
import { VariablesCruzadasLgiExportService } from './variables-cruzadas-lgi-export.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Búsqueda general')
@Controller('lgi/busqueda-general')
export class BusquedaLgiController extends BaseController {
  constructor(
    private readonly busquedaLgiService: BusquedaLgiService,
    private readonly variablesCruzadasExportService: VariablesCruzadasLgiExportService
  ) { super() }

  @Post('buscar')
  @ApiOperation({ summary: 'Buscar casos LGI mediante variables cruzadas' })
  @ApiBody({ type: FiltrosVariablesCruzadasLgiDto, required: false,
    description: 'Todos los filtros son opcionales. Enviar {} para consultar casos LGI activos.' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'limite', required: false, example: 10 })
  @ApiQuery({ name: 'filtro', required: false, example: 'EMPRESA' })
  async buscar(
    @Body() filtros: FiltrosVariablesCruzadasLgiDto,
    @Query() pagination: PaginacionQueryDto
  ) {
    const result = await this.busquedaLgiService.buscarGeneralPaginado(filtros ?? {}, pagination)
    return this.successListRows(result)
  }

  @Get('catalogos')
  @ApiOperation({ summary: 'Obtener catálogos para los filtros LGI' })
  async obtenerCatalogos() {
    return { finalizado: true, datos: await this.busquedaLgiService.obtenerCatalogos() }
  }

  @Get('caso/:casosId/detalle')
  @ApiOperation({ summary: 'Obtener personas y actuaciones del caso con bienes y empresas' })
  @ApiParam({ name: 'casosId', type: String, example: '100' })
  async obtenerDetalle(@Param('casosId') casosId: string) {
    return { finalizado: true, datos: await this.busquedaLgiService.obtenerDetalle(casosId) }
  }

  @Post('export/:formato')
  @ApiOperation({ summary: 'Exportar búsqueda LGI en PDF, CSV, Excel o JSON' })
  @ApiParam({ name: 'formato', enum: ['pdf', 'csv', 'excel', 'json'], example: 'excel' })
  @ApiBody({ type: FiltrosVariablesCruzadasLgiDto, required: false })
  async exportar(
    @Param('formato') formato: string,
    @Body() filtros: FiltrosVariablesCruzadasLgiDto,
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
    const nombre = `busqueda-lgi-${this.obtenerFechaArchivo()}.${extension}`
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
