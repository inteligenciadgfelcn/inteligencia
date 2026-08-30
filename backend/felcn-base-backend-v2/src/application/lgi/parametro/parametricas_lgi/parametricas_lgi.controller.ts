import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { BaseController } from '@/common/base/base-controller'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { ParametricasLgiService } from './parametricas_lgi.service'
import { EtapaLgiService } from '../etapa/etapa.service'
import { EstadoLgiService } from '../estado/estado.service'
import { BienesService } from '../bienes/bienes.service'
import { CatalogoClaseLgiService } from '../catalogo-clase/catalogo-clase.service'
import { CatalogoTipoLgiService } from '../catalogo-tipo/catalogo-tipo.service'
import { CatalogoCaracteristicasLgiService } from '../catalogo-caracteristica/catalogo-caracteristicas.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Paramétricas LGI')
@Controller('parametricas-lgi')
export class ParametricasLgiController extends BaseController {
  constructor(
    private readonly parametricasLgiService: ParametricasLgiService,
    private readonly etapaService: EtapaLgiService,
    private readonly estadoService: EstadoLgiService,
    private readonly bienesLgiService: BienesService,
    private readonly claseBienService: CatalogoClaseLgiService,
    private readonly tipoService: CatalogoTipoLgiService,
    private readonly caracteristicaService:CatalogoCaracteristicasLgiService,
  ) {
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
  @ApiOperation({
    summary: 'Listar los grupos de acuerdo con la distrital seleccionada',
  })
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

  @Get('allEtapa')
  @ApiOperation({
    summary: 'Listar las etapas',
  })
  findAllEtapa() {
    return this.etapaService.findAll()
  }

  @Get('estado/:idEtapa')
  @ApiOperation({
    summary: 'Listar detalle etapa',
  })
  find(@Param('idEtapa', ParseIntPipe) idEtapa: number) {
    return this.estadoService.findAllEtapa(idEtapa)
  }

  @Get('allTipoInforme')
  @ApiOperation({
    summary: 'Listar tipos de informe',
  })
  findAllTipoInforme() {
    return this.parametricasLgiService.findAllTipoInforme()
  }

  @Get('allBienes')
  @ApiOperation({
    summary: 'Listar bienes',
  })
  findAllBienes() {
    return this.bienesLgiService.findAll()
  }

  @Get('allClaseBien/:idBien')
  @ApiOperation({
    summary: 'Listar clase del bien',
  })
  findAllClaseBien(@Param('idBien', ParseIntPipe) idBien: number) {
    return this.claseBienService.findAllClaseBien(idBien)
  }

  @Get('allTipoClase/:idClase')
  @ApiOperation({
    summary: 'Listar tipos de una clase',
  })
  findAllTipoClase(@Param('idClase', ParseIntPipe) idClase: number) {
    return this.tipoService.findAllTipoClase(idClase)
  }

   @Get('allCaracteristicasClase/:idClase')
  @ApiOperation({
    summary: 'Listar caracteristicas de una clase del bien',
  })
  findAllCaracteristicaClase(@Param('idClase', ParseIntPipe) idClase: number) {
    return this.caracteristicaService.findAllCaracteristicaClase(idClase)
  }
}
