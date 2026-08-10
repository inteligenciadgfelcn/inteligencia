import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { BaseController } from '@/common/base/base-controller'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { ParametricasLgiService } from './parametricas_lgi.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Paramétricas LGI')
@Controller('parametricas-lgi')
export class ParametricasLgiController extends BaseController {
  constructor(private readonly parametricasLgiService: ParametricasLgiService) {
    super()
  }

  @Get('allDistrito')
  @ApiOperation({
    summary: 'Listar las distritales operativas del usuario autenticado',
  })
  findAllDistrito(@Request() request: any) {
    const idUsuario = Number(request.user.id)
    return this.parametricasLgiService.findAllDistrito(idUsuario)
  }

  @Get('distrito/:id')
  findOne(@Param('id') id: string) {
    return this.parametricasLgiService.findOne(+id)
  }

  @Get('grupo/:idDistrito')
  @ApiOperation({ summary: 'Listar los grupos de acuerdo con la distrital seleccionada' })
  findAllGrupo(
    @Param('idDistrito')
    idDistrito: number
  ) {
    return this.parametricasLgiService.findAllGrupo(idDistrito)
  }

  
  @Get('allDepartamento')
  @ApiOperation({
    summary: 'Listar los departamentos del usuario autenticado',
  })
  findAllDepartamento() {
    return this.parametricasLgiService.findAllDepartamento()
  }
}
