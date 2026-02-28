import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { OperativoService } from '../service/operativo.service'

// DTOs
import {
  CreateOperativoDto,
  CreateDrogaDto,
  CreateDetenidoDto,
  CreateBienSecuestradoDto,
  CreateFabricaDto,
  CreateSustanciaSolidaDto,
  CreateSustanciaLiquidaDto,
  CreateLogotipoDto,
} from '../dto'

// TODO: Reactivar guards para producción
// import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
// import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, CasbinGuard)

@ApiTags('Operativos (SIII)')
@Controller('operativos')
export class OperativoController extends BaseController {
  constructor(private readonly operativoService: OperativoService) {
    super()
  }

  // ==================== OPERATIVO PRINCIPAL ====================

  @ApiOperation({ summary: 'Listar operativos' })
  @Get()
  async listar() {
    const datos = await this.operativoService.listar()
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener operativo por ID' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const operativo = await this.operativoService.buscarPorId(id)
    return this.successList(operativo)
  }

  @ApiOperation({ summary: 'Obtener operativo completo con sub-entidades' })
  @Get(':id/completo')
  async obtenerCompleto(@Param('id') id: string) {
    const datos = await this.operativoService.obtenerOperativoCompleto(id)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener operativos por caso' })
  @Get('caso/:idCaso')
  async buscarPorCaso(@Param('idCaso') idCaso: string) {
    const operativos = await this.operativoService.buscarPorCaso(idCaso)
    return this.successList(operativos)
  }

  @ApiOperation({ summary: 'Buscar operativo por número' })
  @Get('numero/:numeroOperativo')
  async buscarPorNumeroOperativo(
    @Param('numeroOperativo') numeroOperativo: string
  ) {
    const operativo =
      await this.operativoService.buscarPorNumeroOperativo(numeroOperativo)
    return this.successList(operativo)
  }

  @ApiOperation({ summary: 'Crear operativo' })
  @Post()
  async crear(@Body() data: CreateOperativoDto) {
    const usuario = 'SISTEMA'
    const operativo = await this.operativoService.crear(data, usuario)
    return this.successCreate(operativo)
  }

  @ApiOperation({ summary: 'Actualizar operativo' })
  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() data: any) {
    const usuarioModificacion = 'SISTEMA'
    const operativo = await this.operativoService.actualizar(
      id,
      data,
      usuarioModificacion
    )
    return this.successUpdate(operativo)
  }

  @ApiOperation({ summary: 'Inactivar operativo' })
  @Patch(':id/inactivar')
  async inactivar(@Param('id') id: string) {
    const usuarioModificacion = 'SISTEMA'
    const operativo = await this.operativoService.inactivar(
      id,
      usuarioModificacion
    )
    return this.successUpdate(operativo)
  }

  // ==================== DROGAS ====================

  @ApiOperation({ summary: 'Listar drogas del operativo' })
  @Get(':id/drogas')
  async listarDrogas(@Param('id') id: string) {
    const drogas = await this.operativoService.listarDrogas(id)
    return this.successList(drogas)
  }

  @ApiOperation({ summary: 'Obtener pesaje/resumen de drogas' })
  @Get(':id/drogas/pesaje')
  async obtenerPesaje(@Param('id') id: string) {
    const pesaje = await this.operativoService.obtenerPesajeDrogas(id)
    return this.successList(pesaje)
  }

  @ApiOperation({ summary: 'Agregar droga al operativo' })
  @Post(':id/drogas')
  async agregarDroga(@Param('id') id: string, @Body() data: CreateDrogaDto) {
    const usuario = 'SISTEMA'
    const droga = await this.operativoService.agregarDroga(id, data, usuario)
    return this.successCreate(droga)
  }

  @ApiOperation({ summary: 'Eliminar droga del operativo' })
  @Delete(':id/drogas/:idDroga')
  async eliminarDroga(
    @Param('id') id: string,
    @Param('idDroga') idDroga: string
  ) {
    await this.operativoService.eliminarDroga(id, idDroga)
    return this.successDelete(null)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  @ApiOperation({ summary: 'Listar sustancias sólidas del operativo' })
  @Get(':id/sustancias-solidas')
  async listarSustanciasSolidas(@Param('id') id: string) {
    const sustancias = await this.operativoService.listarSustanciasSolidas(id)
    return this.successList(sustancias)
  }

  @ApiOperation({ summary: 'Agregar sustancia sólida al operativo' })
  @Post(':id/sustancias-solidas')
  async agregarSustanciaSolida(
    @Param('id') id: string,
    @Body() data: CreateSustanciaSolidaDto
  ) {
    const usuario = 'SISTEMA'
    const sustancia = await this.operativoService.agregarSustanciaSolida(
      id,
      data,
      usuario
    )
    return this.successCreate(sustancia)
  }

  @ApiOperation({ summary: 'Eliminar sustancia sólida del operativo' })
  @Delete(':id/sustancias-solidas/:idSustancia')
  async eliminarSustanciaSolida(
    @Param('id') id: string,
    @Param('idSustancia') idSustancia: string
  ) {
    await this.operativoService.eliminarSustanciaSolida(id, idSustancia)
    return this.successDelete(null)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  @ApiOperation({ summary: 'Listar sustancias líquidas del operativo' })
  @Get(':id/sustancias-liquidas')
  async listarSustanciasLiquidas(@Param('id') id: string) {
    const sustancias = await this.operativoService.listarSustanciasLiquidas(id)
    return this.successList(sustancias)
  }

  @ApiOperation({ summary: 'Agregar sustancia líquida al operativo' })
  @Post(':id/sustancias-liquidas')
  async agregarSustanciaLiquida(
    @Param('id') id: string,
    @Body() data: CreateSustanciaLiquidaDto
  ) {
    const usuario = 'SISTEMA'
    const sustancia = await this.operativoService.agregarSustanciaLiquida(
      id,
      data,
      usuario
    )
    return this.successCreate(sustancia)
  }

  @ApiOperation({ summary: 'Eliminar sustancia líquida del operativo' })
  @Delete(':id/sustancias-liquidas/:idSustancia')
  async eliminarSustanciaLiquida(
    @Param('id') id: string,
    @Param('idSustancia') idSustancia: string
  ) {
    await this.operativoService.eliminarSustanciaLiquida(id, idSustancia)
    return this.successDelete(null)
  }

  // ==================== FÁBRICAS ====================

  @ApiOperation({ summary: 'Listar fábricas del operativo' })
  @Get(':id/fabricas')
  async listarFabricas(@Param('id') id: string) {
    const fabricas = await this.operativoService.listarFabricas(id)
    return this.successList(fabricas)
  }

  @ApiOperation({ summary: 'Agregar fábrica al operativo' })
  @Post(':id/fabricas')
  async agregarFabrica(
    @Param('id') id: string,
    @Body() data: CreateFabricaDto
  ) {
    const usuario = 'SISTEMA'
    const fabrica = await this.operativoService.agregarFabrica(
      id,
      data,
      usuario
    )
    return this.successCreate(fabrica)
  }

  @ApiOperation({ summary: 'Eliminar fábrica del operativo' })
  @Delete(':id/fabricas/:idFabrica')
  async eliminarFabrica(
    @Param('id') id: string,
    @Param('idFabrica') idFabrica: string
  ) {
    await this.operativoService.eliminarFabrica(id, idFabrica)
    return this.successDelete(null)
  }

  // ==================== BIENES SECUESTRADOS ====================

  @ApiOperation({ summary: 'Listar bienes secuestrados del operativo' })
  @Get(':id/bienes')
  async listarBienes(@Param('id') id: string) {
    const bienes = await this.operativoService.listarBienes(id)
    return this.successList(bienes)
  }

  @ApiOperation({ summary: 'Agregar bien secuestrado al operativo' })
  @Post(':id/bienes')
  async agregarBien(
    @Param('id') id: string,
    @Body() data: CreateBienSecuestradoDto
  ) {
    const usuario = 'SISTEMA'
    const bien = await this.operativoService.agregarBien(id, data, usuario)
    return this.successCreate(bien)
  }

  @ApiOperation({ summary: 'Eliminar bien secuestrado del operativo' })
  @Delete(':id/bienes/:idBien')
  async eliminarBien(@Param('id') id: string, @Param('idBien') idBien: string) {
    await this.operativoService.eliminarBien(id, idBien)
    return this.successDelete(null)
  }

  // ==================== DETENIDOS ====================

  @ApiOperation({ summary: 'Listar detenidos del operativo' })
  @Get(':id/detenidos')
  async listarDetenidos(@Param('id') id: string) {
    const detenidos = await this.operativoService.listarDetenidos(id)
    return this.successList(detenidos)
  }

  @ApiOperation({ summary: 'Agregar detenido al operativo' })
  @Post(':id/detenidos')
  async agregarDetenido(
    @Param('id') id: string,
    @Body() data: CreateDetenidoDto
  ) {
    const usuario = 'SISTEMA'
    const detenido = await this.operativoService.agregarDetenido(
      id,
      data,
      usuario
    )
    return this.successCreate(detenido)
  }

  @ApiOperation({ summary: 'Eliminar detenido del operativo' })
  @Delete(':id/detenidos/:idDetenido')
  async eliminarDetenido(
    @Param('id') id: string,
    @Param('idDetenido') idDetenido: string
  ) {
    await this.operativoService.eliminarDetenido(id, idDetenido)
    return this.successDelete(null)
  }

  // ==================== GALERÍA ====================

  @ApiOperation({ summary: 'Listar galería del operativo' })
  @Get(':id/galeria')
  async listarGaleria(@Param('id') id: string) {
    const galeria = await this.operativoService.listarGaleria(id)
    return this.successList(galeria)
  }

  @ApiOperation({ summary: 'Eliminar foto de la galería' })
  @Delete(':id/galeria/:idGaleria')
  async eliminarFotoGaleria(
    @Param('id') id: string,
    @Param('idGaleria') idGaleria: string
  ) {
    await this.operativoService.eliminarFotoGaleria(id, idGaleria)
    return this.successDelete(null)
  }

  // ==================== LOGOTIPOS ====================

  @ApiOperation({ summary: 'Listar logotipos del operativo' })
  @Get(':id/logotipos')
  async listarLogotipos(@Param('id') id: string) {
    const logotipos = await this.operativoService.listarLogotipos(id)
    return this.successList(logotipos)
  }

  @ApiOperation({ summary: 'Agregar logotipo al operativo' })
  @ApiConsumes('multipart/form-data')
  @Post(':id/logotipos')
  @UseInterceptors(FileInterceptor('fotografia'))
  async agregarLogotipo(
    @Param('id') id: string,
    @Body() data: CreateLogotipoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const usuario = 'SISTEMA'
    const fotografia = file?.buffer || Buffer.alloc(0)
    const logotipo = await this.operativoService.agregarLogotipo(
      id,
      data,
      fotografia,
      usuario
    )
    return this.successCreate(logotipo)
  }

  @ApiOperation({ summary: 'Eliminar logotipo del operativo' })
  @Delete(':id/logotipos/:idLogotipo')
  async eliminarLogotipo(
    @Param('id') id: string,
    @Param('idLogotipo') idLogotipo: string
  ) {
    await this.operativoService.eliminarLogotipo(id, idLogotipo)
    return this.successDelete(null)
  }

  // ==================== CATÁLOGOS ====================

  @ApiOperation({ summary: 'Listar estados de droga por tipo' })
  @Get('catalogos/estados-droga/:idTipoDroga')
  async listarEstadosDroga(@Param('idTipoDroga') idTipoDroga: string) {
    const estados = await this.operativoService.listarEstadosDroga(
      parseInt(idTipoDroga)
    )
    return this.successList(estados)
  }

  @ApiOperation({ summary: 'Listar modelos de fábrica por tipo' })
  @Get('catalogos/fabrica-modelos/:idTipoFabrica')
  async listarFabricaModelos(@Param('idTipoFabrica') idTipoFabrica: string) {
    const modelos = await this.operativoService.listarFabricaModelos(
      parseInt(idTipoFabrica)
    )
    return this.successList(modelos)
  }

  @ApiOperation({ summary: 'Listar items de operativo por categoría' })
  @Get('catalogos/items-operativo/:idCategoriaOperativo')
  async listarItemsOperativo(
    @Param('idCategoriaOperativo') idCategoriaOperativo: string
  ) {
    const items = await this.operativoService.listarItemsOperativo(
      parseInt(idCategoriaOperativo)
    )
    return this.successList(items)
  }

  @ApiOperation({ summary: 'Listar clases de catálogo por bien' })
  @Get('catalogos/clases/:idBien')
  async listarCatalogoClases(@Param('idBien') idBien: string) {
    const clases = await this.operativoService.listarCatalogoClases(
      parseInt(idBien)
    )
    return this.successList(clases)
  }

  @ApiOperation({ summary: 'Listar tipos de catálogo por clase' })
  @Get('catalogos/tipos/:idCatalogoClase')
  async listarCatalogoTipos(@Param('idCatalogoClase') idCatalogoClase: string) {
    const tipos = await this.operativoService.listarCatalogoTipos(
      parseInt(idCatalogoClase)
    )
    return this.successList(tipos)
  }

  @ApiOperation({ summary: 'Listar características de catálogo por clase' })
  @Get('catalogos/caracteristicas/:idCatalogoClase')
  async listarCatalogoCaracteristicas(
    @Param('idCatalogoClase') idCatalogoClase: string
  ) {
    const caracteristicas =
      await this.operativoService.listarCatalogoCaracteristicas(
        parseInt(idCatalogoClase)
      )
    return this.successList(caracteristicas)
  }
}
