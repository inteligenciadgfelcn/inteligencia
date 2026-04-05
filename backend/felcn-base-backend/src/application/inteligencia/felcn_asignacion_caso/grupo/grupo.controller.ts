import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common'
import { GrupoService } from './grupo.service'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Grupos')
@Controller('grupos')
export class GrupoController extends BaseController {
  constructor(private readonly grupoService: GrupoService) {
    super()
  }

  @Get('all/distrito')
  @ApiOperation({ summary: 'Listado simple de grupos por distrito' })
  @ApiQuery({ name: 'idDistrito', required: false })
  findAllSimple(@Query('idDistrito') idDistrito?: number) {
    return this.grupoService.findAllDistrito(
      idDistrito ? Number(idDistrito) : undefined
    )
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los grupos (sin paginación)' })
  findAllGeneral() {
    return this.grupoService.findAllGeneral()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un grupo por ID' })
  findOne(@Param('id') id: number) {
    return this.grupoService.findOne(id)
  }
}
  