import { Controller, Get, UseGuards } from '@nestjs/common'
import { UnidadService } from './unidad.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Unidades')
@Controller('unidad')
export class UnidadController extends BaseController {
  constructor(private readonly unidadService: UnidadService) {
    super()
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos las unidades (sin paginación)' })
  findAllGeneral() {
    return this.unidadService.findAllGeneral()
  }
}
