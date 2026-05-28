import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { S2iLookupService } from '../service/s2i-lookup.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Lookups S2I (Paramétricas)')
@Controller('s2i/lookups')
export class S2iLookupController extends BaseController {
  constructor(private readonly service: S2iLookupService) {
    super()
  }

  @ApiOperation({ summary: 'Listar continentes' })
  @Get('continentes')
  async listarContinentes() {
    return this.successList(await this.service.listarContinentes())
  }

  @ApiOperation({
    summary: 'Listar países (opcionalmente filtrados por continente)',
  })
  @ApiQuery({
    name: 'idContinente',
    required: false,
    description: 'ID del continente para filtrar',
  })
  @Get('paises')
  async listarPaises(@Query('idContinente') idContinente?: string) {
    const id = idContinente ? parseInt(idContinente) : undefined
    return this.successList(await this.service.listarPaises(id))
  }

  @ApiOperation({ summary: 'Listar estados de caso' })
  @Get('estados-caso')
  async listarEstadosCaso() {
    return this.successList(await this.service.listarEstadosCaso())
  }

  @ApiOperation({ summary: 'Listar etapas de investigación' })
  @Get('etapas-investigacion')
  async listarEtapasInvestigacion() {
    return this.successList(await this.service.listarEtapasInvestigacion())
  }

  @ApiOperation({
    summary: 'Listar tipos de delito (para antecedentes de blancos)',
  })
  @Get('tipos-delito')
  async listarTiposDelito() {
    return this.successList(await this.service.listarTiposDelito())
  }

  @ApiOperation({ summary: 'Listar tipos de organización' })
  @Get('tipos-organizacion')
  async listarTiposOrganizacion() {
    return this.successList(await this.service.listarTiposOrganizacion())
  }

  @ApiOperation({
    summary: 'Listar tipos de contenido de caso (documentos adjuntos)',
  })
  @Get('contenido-caso')
  async listarContenidoCaso() {
    return this.successList(await this.service.listarContenidoCaso())
  }

  @ApiOperation({ summary: 'Listar categorías de bienes' })
  @Get('bienes')
  async listarBienes() {
    return this.successList(await this.service.listarBienes())
  }

  @ApiOperation({ summary: 'Listar clases de bien por categoría de bien' })
  @ApiParam({ name: 'idBien', description: 'ID de la categoría de bien' })
  @Get('clases/:idBien')
  async listarClasesPorBien(@Param('idBien') idBien: string) {
    return this.successList(
      await this.service.listarClasesPorBien(parseInt(idBien))
    )
  }

  @ApiOperation({ summary: 'Listar tipos de bien por clase' })
  @ApiParam({ name: 'idCatalogoClase', description: 'ID de la clase de bien' })
  @Get('tipos/:idCatalogoClase')
  async listarTiposPorClase(@Param('idCatalogoClase') idCatalogoClase: string) {
    return this.successList(
      await this.service.listarTiposPorClase(parseInt(idCatalogoClase))
    )
  }

  @ApiOperation({ summary: 'Listar características de bien por tipo' })
  @ApiParam({ name: 'idCatalogoTipo', description: 'ID del tipo de bien' })
  @Get('caracteristicas/:idCatalogoTipo')
  async listarCaracteristicasPorTipo(
    @Param('idCatalogoTipo') idCatalogoTipo: string
  ) {
    return this.successList(
      await this.service.listarCaracteristicasPorTipo(parseInt(idCatalogoTipo))
    )
  }

  @ApiOperation({ summary: 'Listar tipos de investigación de bien' })
  @Get('tipos-investigacion-bien')
  async listarTiposInvestigacionBien() {
    return this.successList(await this.service.listarTiposInvestigacionBien())
  }
}
