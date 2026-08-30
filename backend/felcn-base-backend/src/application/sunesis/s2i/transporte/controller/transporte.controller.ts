import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { TransporteService } from '../service/transporte.service'
import { CreateTransporteDto } from '../dto/create-transporte.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Transporte S2I (Flujo de Transporte)')
@Controller('s2i')
export class TransporteController extends BaseController {
  constructor(private readonly service: TransporteService) {
    super()
  }

  @ApiOperation({
    summary:
      'Busca el vehículo en felcn_vls y resuelve (busca o crea) el transporte en felcn_s2i. ' +
      '404 si el vehículo no existe en felcn_vls.',
  })
  @ApiParam({ name: 'placa', description: 'Placa o código Charly Papa' })
  @Get('transporte/:placa')
  async buscarOResolver(@Param('placa') placa: string) {
    return this.successList(await this.service.buscarOResolver(placa))
  }

  @ApiOperation({
    summary:
      'Registra manualmente un transporte en felcn_s2i (sin tocar felcn_vls)',
  })
  @Post('transporte')
  async crearDesdeFormulario(@Body() dto: CreateTransporteDto) {
    return this.successCreate(await this.service.crearDesdeFormulario(dto))
  }
}
