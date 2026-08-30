import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common'
import { UnidadService } from './unidad.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Unidades')
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
