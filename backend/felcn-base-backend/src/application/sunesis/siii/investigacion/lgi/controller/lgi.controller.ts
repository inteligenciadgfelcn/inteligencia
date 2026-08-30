import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { Request } from 'express'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { PaginacionQueryDto } from '@/common/dto'
import { LgiService } from '../service/lgi.service'
import { BuscarAsignacionLgiQueryDto } from '../dto/buscar-asignacion-lgi-query.dto'


/**
 * Controlador LGI — endpoints sobre felcn_lgi
 * Origen: sistema legacy GIAEF — pg.sql (docs/migrations/pg.sql)
 * Tablas: asignacion, operativo, investigador, departamentosc, distritales, localidad, provincias
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Sistema Legacy GIAEF (felcn_lgi)')
@Controller('lgi')
export class LgiController extends BaseController {
  constructor(private readonly service: LgiService) {
    super()
  }

  @ApiOperation({
    summary: 'Listar mis casos asignados (Investigador)',
    description: 'Origen: LGI-MEN2.aspx.cs y LGI-MEN3.aspx.cs. Filtra por el usuario del JWT en la tabla investigador.',
  })
  @Get('mis-casos')
  async buscarMisCasos(
    @Req() req: Request,
    @Query() filtros: BuscarAsignacionLgiQueryDto,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const [datos, total] = await this.service.buscarMisCasos(numeroPase, filtros, paginacion)
    return this.successPagedRows([datos, total], paginacion)
  }

  // ==================== OPERATIVO ====================

  @ApiOperation({
    summary: 'Listar operativos de un caso LGI',
    description: 'Origen: LGI-MEN3.aspx.cs — MuestraOperativos(). JOIN con departamentosc, provincias, localidad, unidades y distritales.',
  })
  @ApiParam({ name: 'casosId', description: 'ID del caso (asignacion.casos_id)' })
  @Get('asignacion/:casosId/operativos')
  async listarOperativosPorCaso(@Param('casosId') casosId: string) {
    const datos = await this.service.listarOperativosPorCaso(casosId)
    return this.successList(datos)
  }
}
