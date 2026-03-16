import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuditoriaService } from '../service/auditoria.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Auditoría')
@ApiBearerAuth()
@Controller('auditoria')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class AuditoriaController extends BaseController {
  constructor(private auditoriaServicio: AuditoriaService) {
    super()
  }

  @ApiOperation({ summary: 'Bitácora de inicios de sesión (paginada)' })
  @Get('login')
  async listarLogin(@Query() paginacion: PaginacionQueryDto) {
    const result = await this.auditoriaServicio.listarBitacoraLogin(paginacion)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'Bitácora de inicios de sesión por usuario' })
  @ApiQuery({ name: 'limite', required: false, type: Number })
  @Get('login/usuario/:idUsuario')
  async listarLoginPorUsuario(
    @Param('idUsuario') idUsuario: string,
    @Query('limite') limite?: number
  ) {
    const result = await this.auditoriaServicio.listarBitacoraLoginPorUsuario(
      idUsuario,
      limite ? Number(limite) : 20
    )
    return this.successList(result)
  }

  @ApiOperation({ summary: 'Auditoría de cambios en tablas (paginada, filtrable por tabla)' })
  @ApiQuery({ name: 'tabla', required: false })
  @Get('cambios')
  async listarCambios(
    @Query() paginacion: PaginacionQueryDto,
    @Query('tabla') tabla?: string
  ) {
    const result = await this.auditoriaServicio.listarAuditoriaCambios(tabla, paginacion)
    return this.successListRows(result)
  }
}
