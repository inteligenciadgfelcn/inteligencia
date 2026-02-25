import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { LookupService } from '../service/lookup.service'

// TODO: Reactivar guards para producción
// import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
// import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, CasbinGuard)

@ApiTags('Lookups SIII (Paramétricas)')
@Controller('siii-lookups')
export class LookupController extends BaseController {
  constructor(private readonly lookupService: LookupService) {
    super()
  }

  // Geografía
  @ApiOperation({ summary: 'Listar continentes' })
  @Get('continentes')
  async listarContinentes() {
    return this.successList(await this.lookupService.listarContinentes())
  }

  @ApiOperation({ summary: 'Listar países' })
  @Get('paises')
  async listarPaises() {
    return this.successList(await this.lookupService.listarPaises())
  }

  @ApiOperation({ summary: 'Listar países por continente' })
  @Get('paises/continente/:id')
  async listarPaisesPorContinente(@Param('id') id: string) {
    return this.successList(await this.lookupService.listarPaisesPorContinente(parseInt(id)))
  }

  @ApiOperation({ summary: 'Listar países destino' })
  @Get('paises-destino')
  async listarPaisesDestino() {
    return this.successList(await this.lookupService.listarPaisesDestino())
  }

  @ApiOperation({ summary: 'Listar departamentos' })
  @Get('departamentos')
  async listarDepartamentos() {
    return this.successList(await this.lookupService.listarDepartamentos())
  }

  @ApiOperation({ summary: 'Listar departamentos por país' })
  @Get('departamentos/pais/:id')
  async listarDepartamentosPorPais(@Param('id') id: string) {
    return this.successList(await this.lookupService.listarDepartamentosPorPais(parseInt(id)))
  }

  @ApiOperation({ summary: 'Listar provincias' })
  @Get('provincias')
  async listarProvincias() {
    return this.successList(await this.lookupService.listarProvincias())
  }

  @ApiOperation({ summary: 'Listar provincias por departamento' })
  @Get('provincias/departamento/:id')
  async listarProvinciasPorDepartamento(@Param('id') id: string) {
    return this.successList(await this.lookupService.listarProvinciasPorDepartamento(parseInt(id)))
  }

  @ApiOperation({ summary: 'Listar localidades' })
  @Get('localidades')
  async listarLocalidades() {
    return this.successList(await this.lookupService.listarLocalidades())
  }

  @ApiOperation({ summary: 'Listar localidades por provincia' })
  @Get('localidades/provincia/:id')
  async listarLocalidadesPorProvincia(@Param('id') id: string) {
    return this.successList(await this.lookupService.listarLocalidadesPorProvincia(parseInt(id)))
  }

  // Tipos
  @ApiOperation({ summary: 'Listar tipos de droga' })
  @Get('tipos-droga')
  async listarTiposDroga() {
    return this.successList(await this.lookupService.listarTiposDroga())
  }

  @ApiOperation({ summary: 'Listar tipos de operación' })
  @Get('tipos-operacion')
  async listarTiposOperacion() {
    return this.successList(await this.lookupService.listarTiposOperacion())
  }

  @ApiOperation({ summary: 'Listar tipos penal' })
  @Get('tipos-penal')
  async listarTiposPenal() {
    return this.successList(await this.lookupService.listarTiposPenal())
  }

  @ApiOperation({ summary: 'Listar tipos de relevancia' })
  @Get('tipos-relevancia')
  async listarTiposRelevancia() {
    return this.successList(await this.lookupService.listarTiposRelevancia())
  }

  @ApiOperation({ summary: 'Listar tipos de persona' })
  @Get('tipos-persona')
  async listarTiposPersona() {
    return this.successList(await this.lookupService.listarTiposPersona())
  }

  @ApiOperation({ summary: 'Listar estados civiles' })
  @Get('estados-civiles')
  async listarEstadosCiviles() {
    return this.successList(await this.lookupService.listarEstadosCiviles())
  }

  @ApiOperation({ summary: 'Listar categorías de operativo' })
  @Get('categorias-operativo')
  async listarCategoriasOperativo() {
    return this.successList(await this.lookupService.listarCategoriasOperativo())
  }

  // ==================== NUEVOS TIPOS ====================

  @ApiOperation({ summary: 'Listar tipos de denuncia' })
  @Get('tipos-denuncia')
  async listarTiposDenuncia() {
    return this.successList(await this.lookupService.listarTiposDenuncia())
  }

  @ApiOperation({ summary: 'Listar tipos de fábrica' })
  @Get('tipos-fabrica')
  async listarTiposFabrica() {
    return this.successList(await this.lookupService.listarTiposFabrica())
  }

  @ApiOperation({ summary: 'Listar tipos de documento' })
  @Get('tipos-documento')
  async listarTiposDocumento() {
    return this.successList(await this.lookupService.listarTiposDocumento())
  }

  @ApiOperation({ summary: 'Listar tipos de implicado' })
  @Get('tipos-implicado')
  async listarTiposImplicado() {
    return this.successList(await this.lookupService.listarTiposImplicado())
  }

  // ==================== OPERATIVO PARAMS ====================

  @ApiOperation({ summary: 'Listar planes de operaciones' })
  @Get('planes-operaciones')
  async listarPlanesOperaciones() {
    return this.successList(await this.lookupService.listarPlanesOperaciones())
  }

  @ApiOperation({ summary: 'Listar formas de transporte' })
  @Get('formas-transporte')
  async listarFormasTransporte() {
    return this.successList(await this.lookupService.listarFormasTransporte())
  }

  @ApiOperation({ summary: 'Listar etapas' })
  @Get('etapas')
  async listarEtapas() {
    return this.successList(await this.lookupService.listarEtapas())
  }

  @ApiOperation({ summary: 'Listar etapas de investigación' })
  @Get('etapas-investigacion')
  async listarEtapasInvestigacion() {
    return this.successList(await this.lookupService.listarEtapasInvestigacion())
  }

  @ApiOperation({ summary: 'Listar recursos' })
  @Get('recursos')
  async listarRecursos() {
    return this.successList(await this.lookupService.listarRecursos())
  }

  // ==================== SUSTANCIAS ====================

  @ApiOperation({ summary: 'Listar descripciones de sustancias sólidas' })
  @Get('sustancias-solidas-desc')
  async listarSustanciasSolidasDesc() {
    return this.successList(await this.lookupService.listarSustanciasSolidasDesc())
  }

  @ApiOperation({ summary: 'Listar descripciones de sustancias líquidas' })
  @Get('sustancias-liquidas-desc')
  async listarSustanciasLiquidasDesc() {
    return this.successList(await this.lookupService.listarSustanciasLiquidasDesc())
  }

  @ApiOperation({ summary: 'Listar procedencias de coca' })
  @Get('coca-procedencias')
  async listarCocaProcedencias() {
    return this.successList(await this.lookupService.listarCocaProcedencias())
  }

  @ApiOperation({ summary: 'Listar estados de coca' })
  @Get('coca-estados')
  async listarCocaEstados() {
    return this.successList(await this.lookupService.listarCocaEstados())
  }

  @ApiOperation({ summary: 'Listar descripciones de coca' })
  @Get('coca-descripciones')
  async listarCocaDescripciones() {
    return this.successList(await this.lookupService.listarCocaDescripciones())
  }

  // ==================== BIENES ====================

  @ApiOperation({ summary: 'Listar tipos de bienes' })
  @Get('bienes')
  async listarBienes() {
    return this.successList(await this.lookupService.listarBienes())
  }

  @ApiOperation({ summary: 'Listar calidades de bien' })
  @Get('calidades-bien')
  async listarCalidadesBien() {
    return this.successList(await this.lookupService.listarCalidadesBien())
  }

  // ==================== PERSONA - CARACTERÍSTICAS ====================

  @ApiOperation({ summary: 'Listar colores de piel' })
  @Get('colores-piel')
  async listarColoresPiel() {
    return this.successList(await this.lookupService.listarColoresPiel())
  }

  @ApiOperation({ summary: 'Listar colores de ojos' })
  @Get('colores-ojos')
  async listarColoresOjos() {
    return this.successList(await this.lookupService.listarColoresOjos())
  }

  @ApiOperation({ summary: 'Listar colores de cabello' })
  @Get('colores-cabello')
  async listarColoresCabello() {
    return this.successList(await this.lookupService.listarColoresCabello())
  }

  @ApiOperation({ summary: 'Listar tipos de cabello' })
  @Get('tipos-cabello')
  async listarTiposCabello() {
    return this.successList(await this.lookupService.listarTiposCabello())
  }
}
