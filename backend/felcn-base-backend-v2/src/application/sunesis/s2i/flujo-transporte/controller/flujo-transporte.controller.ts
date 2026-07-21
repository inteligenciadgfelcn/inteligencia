import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { FlujoTransporteService } from '../service/flujo-transporte.service'
import { ReglaColorService } from '../../parametrica/service/regla-color.service'
import { CreateFlujoTransporteDto } from '../dto/create-flujo-transporte.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Flujo de Transporte S2I')
@Controller('s2i')
export class FlujoTransporteController extends BaseController {
  constructor(
    private readonly service: FlujoTransporteService,
    private readonly reglaColorService: ReglaColorService
  ) {
    super()
  }

  @ApiOperation({
    summary:
      'Registra el flujo de transporte (viaje) vinculando conductor, transporte, lugar y color',
  })
  @Post('flujo-transporte')
  async crear(@Body() dto: CreateFlujoTransporteDto, @Req() req: Request) {
    const { numeroPase = '' } = req.user as PassportUser
    return this.successCreate(await this.service.crear(dto, numeroPase))
  }

  @ApiOperation({
    summary:
      'Sugiere los id_color evaluando parametricas.regla_color contra el documento del ' +
      'conductor y/o la placa del transporte. Acumula los colores de todas las reglas activas ' +
      'que apliquen (sin cortar en la primera). Retorna colores: [] si ninguna regla aplica.',
  })
  @ApiQuery({ name: 'documento', required: false })
  @ApiQuery({ name: 'placa', required: false })
  @Get('flujo-transporte/color-sugerido')
  async colorSugerido(
    @Query('documento') documento?: string,
    @Query('placa') placa?: string
  ) {
    return this.success(
      await this.reglaColorService.resolverColorSugerido(documento, placa)
    )
  }
}
