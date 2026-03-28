import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'
import { GradoService } from '../service/grado.service'
import { UnidadService } from '../service/unidad.service'
import { DistritaService } from '../service/distrital.service'
import { GrupoService } from '../service/grupo.service'

@ApiTags('Lookups')
@ApiBearerAuth()
@Controller('lookups')
@UseGuards(JwtAuthGuard)
export class LookupsController extends BaseController {
  constructor(
    private gradoServicio: GradoService,
    private unidadServicio: UnidadService,
    private distritaServicio: DistritaService,
    private grupoServicio: GrupoService
  ) {
    super()
  }

  @ApiOperation({ summary: 'Grados activos ordenados por jerarquía' })
  @Get('grados')
  async grados() {
    const result = await this.gradoServicio.listar()
    return this.successList(result)
  }

  @ApiOperation({ summary: 'Unidades activas' })
  @Get('unidades')
  async unidades() {
    const result = await this.unidadServicio.listar()
    return this.successList(result)
  }

  @ApiOperation({ summary: 'Distritales activas de una unidad' })
  @Get('distritales/unidad/:idUnidad')
  async distritalesPorUnidad(@Param('idUnidad', ParseIntPipe) idUnidad: number) {
    const result = await this.distritaServicio.listar(idUnidad)
    return this.successList(result)
  }

  @ApiOperation({ summary: 'Grupos activos de una distrital' })
  @Get('grupos/distrital/:idDistrital')
  async gruposPorDistrital(@Param('idDistrital', ParseIntPipe) idDistrital: number) {
    const result = await this.grupoServicio.listar(idDistrital)
    return this.successList(result)
  }
}
