import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AsignacionSiiiService } from '../service/asignacion-siii.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Asignación (SIII)')
@Controller('asignacion-siii')
export class AsignacionSiiiController extends BaseController {
  constructor(private readonly asignacionSiiiService: AsignacionSiiiService) {
    super()
  }


  @ApiOperation({
    summary: 'Obtener asignación por ID de caso',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Get(':idCaso')
  async buscarPorId(@Param('idCaso') idCaso: string) {
    const dato = await this.asignacionSiiiService.buscarPorId(idCaso)
    return this.successList(dato)
  }
}
