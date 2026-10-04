import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import type { Request } from 'express'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base/base-controller'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AsignarInvestigadorDto } from './dto/asignar-investigador.dto'
import { InvestigadorLgiService } from './investigadores.service'
import { SepararInvestigadorDto } from './dto/separar-investigador.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Ganancias ilícitas')
@Controller('investigadores')
export class InvestigadorLgiController extends BaseController {
  constructor(private readonly investigadorService: InvestigadorLgiService) {
    super()
  }

  @Get('unidad')
  @ApiOperation({
    summary:
      'Obtener los investigadores activos de la unidad del usuario autenticado',
  })
  findAllGeneralInvestigadores(@Req() request: Request): Promise<any[]> {
    const usuario = request.user as { id?: number | string } | undefined
    const idUsuario = Number(usuario?.id)

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      throw new UnauthorizedException(
        'No se encontró un identificador válido del usuario autenticado'
      )
    }

    return this.investigadorService.findAllGeneralInvestigadores(idUsuario)
  }

  @Post('asignar-investigador/:casoId')
  @ApiOperation({
    summary: 'Asignar o reasignar un investigador a un caso',
  })
  asignarInvestigador(
    @Param('casoId', ParseIntPipe)
    casoId: number,
    @Body()
    dto: AsignarInvestigadorDto
  ) {
    return this.investigadorService.asignarInvestigador(casoId, dto)
  }

  @Patch(':investigadorId/separar')
  @ApiOperation({
    summary: 'Separar un investigador de un caso',
  })
  separarInvestigador(
    @Param('investigadorId', ParseIntPipe)
    investigadorId: number,
    @Body()
    dto: SepararInvestigadorDto
  ) {
    return this.investigadorService.separarInvestigador(investigadorId, dto)
  }

  @Get('caso/:casoId')
  @ApiOperation({
    summary: 'Obtener los investigadores y el historial de un caso',
  })
  @ApiParam({
    name: 'casoId',
    description: 'Identificador del caso',
    type: Number,
    example: 60,
  })
  findInvestigadoresByCaso(
    @Param('casoId', ParseIntPipe)
    casoId: number
  ) {
    return this.investigadorService.findInvestigadoresByCaso(casoId)
  }

  @Get('general')
  @ApiOperation({
    summary: 'Listar todos los investigadores con paginación',
  })
  async findAllGeneralInvestigador(
    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result =
      await this.investigadorService.findAllGeneralInvestigador(pagination)

    return this.successListRows(result)
  }
}
