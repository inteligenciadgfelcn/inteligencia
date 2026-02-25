import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { EstructuraService } from '../service/estructura.service'

// TODO: Reactivar guards para producción

@ApiTags('Estructura Organizacional (S2I)')
@Controller('estructura')
export class EstructuraController extends BaseController {
  constructor(private readonly estructuraService: EstructuraService) {
    super()
  }

  @ApiOperation({ summary: 'Listar grados' })
  @Get('grados')
  async listarGrados() {
    const datos = await this.estructuraService.listarGrados()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Listar unidades' })
  @Get('unidades')
  async listarUnidades() {
    const datos = await this.estructuraService.listarUnidades()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Listar distritales' })
  @Get('distritales')
  async listarDistritales() {
    const datos = await this.estructuraService.listarDistritales()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Listar distritales por unidad' })
  @Get('distritales/unidad/:idUnidad')
  async listarDistritalesPorUnidad(@Param('idUnidad') idUnidad: string) {
    const datos = await this.estructuraService.listarDistritalesPorUnidad(
      parseInt(idUnidad),
    )
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Listar grupos' })
  @Get('grupos')
  async listarGrupos() {
    const datos = await this.estructuraService.listarGrupos()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Listar grupos por distrital' })
  @Get('grupos/distrital/:idDistrital')
  async listarGruposPorDistrital(@Param('idDistrital') idDistrital: string) {
    const datos = await this.estructuraService.listarGruposPorDistrital(
      parseInt(idDistrital),
    )
    return this.successList(datos)
  }
}
