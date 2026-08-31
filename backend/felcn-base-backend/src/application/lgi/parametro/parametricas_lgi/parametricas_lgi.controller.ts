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

  @Get('allPais')
  @ApiOperation({
    summary: 'Listar los países',
  })
  findAllPais() {
    return this.parametricasLgiService.findAllPais()
  }
  
  @Get('allDepartamento')
  @ApiOperation({
    summary: 'Listar los departamentos',
  })
  findAllDepartamento() {
    return this.parametricasLgiService.findAllDepartamento()
  }

  @Get('allSituacionJuridica')
  @ApiOperation({
    summary: 'Listar las situaciones jurídicas',
  })
  findAllSituacionJuridica() {
    return this.parametricasLgiService.findAllSituacionJuridica()
  }

  @Get('allEstadoCivil')
  @ApiOperation({
    summary: 'Listar los estados civiles',
  })
  findAllEstadoCivil() {
    return this.parametricasLgiService.findAllEstadoCivil()
  }

  @Get('allProfesion')
  @ApiOperation({
    summary: 'Listar las profesiones',
  })
  findAllProfesion() {
    return this.parametricasLgiService.findAllProfesion()
  }

  @Get('allTipoDocumento')
  @ApiOperation({
    summary: 'Listar los tipos de documento',
  })
  findAllTipoDocumento() {
    return this.parametricasLgiService.findAllTipoDocumento()
  }
}

