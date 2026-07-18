import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ConductorService } from '../service/conductor.service'
import { CreateConductorDto } from '../dto/create-conductor.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Conductor S2I (Flujo de Transporte)')
@Controller('s2i')
export class ConductorController extends BaseController {
  constructor(private readonly service: ConductorService) {
    super()
  }

  @ApiOperation({
    summary:
      'Busca la persona en felcn_personas y resuelve (busca o crea) el conductor en felcn_s2i. ' +
      '404 si la persona no existe en felcn_personas.',
  })
  @ApiParam({ name: 'documento', description: 'Documento de identidad' })
  @Get('conductores/:documento')
  async buscarOResolver(@Param('documento') documento: string) {
    return this.successList(await this.service.buscarOResolver(documento))
  }

  @ApiOperation({
    summary:
      'Registra manualmente una persona en felcn_personas y resuelve el conductor en felcn_s2i',
  })
  @Post('conductores')
  async crearDesdeFormulario(@Body() dto: CreateConductorDto) {
    return this.successCreate(await this.service.crearDesdeFormulario(dto))
  }
}
