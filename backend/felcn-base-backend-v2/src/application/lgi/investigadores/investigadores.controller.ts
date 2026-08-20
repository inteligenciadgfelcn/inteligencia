import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base/base-controller'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AsignarInvestigadoresDto } from './dto/asignar-investigador.dto'
import { InvestigadorLgiService } from './investigadores.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Investigadores')
@Controller('investigadores')
export class InvestigadorLgiController extends BaseController {
  constructor(
    private readonly investigadorService: InvestigadorLgiService
  ) {
    super()
  }

  @Post('asignar-investigadores/:casoId')
  @ApiOperation({
    summary: 'Asignar investigadores a un caso',
  })
  asignarInvestigadores(
    @Param('casoId', ParseIntPipe)
    casoId: number,
    @Body()
    dto: AsignarInvestigadoresDto
  ) {
    return this.investigadorService.asignarInvestigadores(
      casoId,
      dto
    )
  }

  @Get('caso/:casoId')
  @ApiOperation({
    summary: 'Obtener el historial de investigadores asignados a un caso',
  })
  findByCaso(
    @Param('casoId', ParseIntPipe)
    casoId: number
  ) {
    return this.investigadorService.findByCaso(casoId)
  }

  @Get('caso/:casoId/actuales')
  @ApiOperation({
    summary: 'Obtener los investigadores actualmente asignados a un caso',
  })
  findActualesByCaso(
    @Param('casoId', ParseIntPipe)
    casoId: number
  ) {
    return this.investigadorService.findActualesByCaso(
      casoId
    )
  }
}