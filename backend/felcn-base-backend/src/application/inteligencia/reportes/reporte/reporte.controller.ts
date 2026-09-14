import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'

import { Response } from 'express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ExportService } from '../export/export.service'
import {
  PDF_A3_HORIZONTAL,
  PDF_OFICIO_VERTICAL,
} from '../export/pdf/pdf-options'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ReporteService } from './reporte.service'
import { FiltrosVariablesCruzadasDto } from './dto/filtros-variables-cruzadas.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base/base-controller'
import { DetenidoReporteService } from './services/detenido-reporte.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reporte')
@Controller('reporte')
export class ReporteController extends BaseController {
  constructor(
    private readonly reporteService: ReporteService,
    private readonly exportService: ExportService,
    private readonly detenidoReporteService: DetenidoReporteService
  ) {
    super()
  }

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

  @Post('variables-cruzadas/buscar')
  @ApiOperation({
    summary: 'Consultar personas mediante variables cruzadas',
  })
  @ApiBody({
    type: FiltrosVariablesCruzadasDto,
    required: false,
    description:
      'Todos los filtros son opcionales. Enviar {} para consultar todos los registros.',
  })
  @ApiQuery({
    name: 'pagina',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limite',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'filtro',
    example: 'MAURICIO',
    required: false,
    description: 'Búsqueda general opcional',
  })
  async buscarVariablesCruzadas(
    @Body()
    filtros: FiltrosVariablesCruzadasDto,

    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.reporteService.buscarVariablesCruzadas(
      filtros ?? {},
      pagination
    )

    return this.successListRows(result)
  }

  @Get('detenido/:idDetenido/detalle')
  @ApiOperation({
    summary: 'Obtener información completa del detenido para reportes',
  })
  @ApiParam({
    name: 'idDetenido',
    type: Number,
    example: 95,
    description: 'Identificador del detenido en SII',
  })
  async obtenerDetalleDetenido(
    @Param('idDetenido', ParseIntPipe)
    idDetenido: number
  ) {
    return this.detenidoReporteService.obtenerDetalle(idDetenido)
  }
}
