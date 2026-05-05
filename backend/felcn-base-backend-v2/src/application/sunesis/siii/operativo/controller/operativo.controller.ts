import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { OperativoService } from '../service/operativo.service'

// DTOs
import {
  OperativoDto,
  CreateDrogaDto,
  CreateDetenidoDto,
  CreateBienSecuestradoDto,
  CreateBienCaracteristicaDto,
  CreateFabricaDto,
  CreateSustanciaSolidaDto,
  CreateSustanciaLiquidaDto,
  CreateGaleriaDto,
  CreateLogotipoDto,
} from '../dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Operativos (SIII)')
@Controller('operativos')
export class OperativoController extends BaseController {
  constructor(private readonly operativoService: OperativoService) {
    super()
  }

  // ==================== CASOS DE USUARIO ====================

  @ApiOperation({
    summary: 'Listar casos aprobados del usuario autenticado',
    description: 'Filtra asignacion.usuario = JWT.numeroPase y TRIM(numero_caso) <> \'\'.',
  })
  @Get('casos/aprobados')
  async listarCasosAprobados(@Req() req: Request) {
    const { numeroPase = '' } = req.user as PassportUser
    const datos = await this.operativoService.listarCasosAprobados(numeroPase)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Listar casos no aprobados del usuario autenticado',
    description: 'Filtra asignacion.usuario = JWT.numeroPase y TRIM(numero_caso) = \'\'.',
  })
  @Get('casos/no-aprobados')
  async listarCasosNoAprobados(@Req() req: Request) {
    const { numeroPase = '' } = req.user as PassportUser
    const datos = await this.operativoService.listarCasosNoAprobados(numeroPase)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Listar todos los casos del usuario autenticado',
    description: 'Filtra asignacion.usuario = JWT.numeroPase.',
  })
  @Get('casos')
  async listarTodosCasos(@Req() req: Request) {
    const { numeroPase = '' } = req.user as PassportUser
    const datos = await this.operativoService.listarTodosCasos(numeroPase)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Listar casos con CUD (post-interoperabilidad) del usuario autenticado',
    description: 'Filtra asignacion.usuario = JWT.numeroPase y TRIM(ianus) <> \'\'.',
  })
  @Get('casos/con-cud')
  async listarCasosConCud(@Req() req: Request) {
    const { numeroPase = '' } = req.user as PassportUser
    const datos = await this.operativoService.listarCasosConCud(numeroPase)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Listar casos por abreviatura de unidad',
    description: 'Obtiene todos los casos filtrados por la abreviatura de la unidad.',
  })
  @ApiParam({ name: 'abreviaturaUnidad', description: 'Abreviatura de la unidad (ej. DG-FELCN)' })
  @Get('casos/unidad/:abreviaturaUnidad')
  async listarCasosPorUnidad(@Param('abreviaturaUnidad') abreviaturaUnidad: string) {
    const datos = await this.operativoService.listarCasosPorUnidad(abreviaturaUnidad)
    return this.successList(datos)
  }

  // ==================== CATÁLOGOS ====================

  @ApiOperation({ summary: 'Listar estados de droga por tipo' })
  @Get('catalogos/estados-droga/:idTipoDroga')
  async listarEstadosDroga(@Param('idTipoDroga') idTipoDroga: string) {
    const estados = await this.operativoService.listarEstadosDroga(parseInt(idTipoDroga))
    return this.successList(estados)
  }

  @ApiOperation({ summary: 'Listar modelos de fábrica por tipo' })
  @Get('catalogos/fabrica-modelos/:idTipoFabrica')
  async listarFabricaModelos(@Param('idTipoFabrica') idTipoFabrica: string) {
    const modelos = await this.operativoService.listarFabricaModelos(parseInt(idTipoFabrica))
    return this.successList(modelos)
  }

  @ApiOperation({ summary: 'Listar items de operativo por categoría' })
  @Get('catalogos/items-operativo/:idCategoriaOperativo')
  async listarItemsOperativo(@Param('idCategoriaOperativo') idCategoriaOperativo: string) {
    const items = await this.operativoService.listarItemsOperativo(parseInt(idCategoriaOperativo))
    return this.successList(items)
  }

  @ApiOperation({ summary: 'Listar clases de catálogo por bien' })
  @Get('catalogos/clases/:idBien')
  async listarCatalogoClases(@Param('idBien') idBien: string) {
    const clases = await this.operativoService.listarCatalogoClases(parseInt(idBien))
    return this.successList(clases)
  }

  @ApiOperation({ summary: 'Listar tipos de catálogo por clase' })
  @Get('catalogos/tipos/:idCatalogoClase')
  async listarCatalogoTipos(@Param('idCatalogoClase') idCatalogoClase: string) {
    const tipos = await this.operativoService.listarCatalogoTipos(parseInt(idCatalogoClase))
    return this.successList(tipos)
  }

  @ApiOperation({ summary: 'Listar características de catálogo por clase' })
  @Get('catalogos/caracteristicas/:idCatalogoClase')
  async listarCatalogoCaracteristicas(@Param('idCatalogoClase') idCatalogoClase: string) {
    const caracteristicas = await this.operativoService.listarCatalogoCaracteristicas(parseInt(idCatalogoClase))
    return this.successList(caracteristicas)
  }

  // ==================== CASO (1:N) ====================

  @ApiOperation({
    summary: 'Obtener caso + lista de operativos',
    description:
      'Retorna datos del caso desde asignacion y la lista de todos sus operativos. ' +
      'Si no hay operativos, retorna lista vacía. Usar idOperativo de cada operativo para las secciones.',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso (asignacion)' })
  @ApiResponse({ status: 200, description: '{ caso: {...}, operativos: [...] }' })
  @Get('caso/:idCaso')
  async getOrInit(@Param('idCaso') idCaso: string) {
    const datos = await this.operativoService.getOrInit(idCaso)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Obtener datos formateados del operativo por idCaso (para investigación paralela)',
    description: 'Devuelve campos Op1...Op6 concatenados según el requerimiento del sistema legado.',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso (asignacion)' })
  @Get('buscar-por-caso-detalle/:idCaso')
  async buscarPorCasoDetalle(@Param('idCaso') idCaso: string) {
    const datos = await this.operativoService.buscarOperativoPorCaso(idCaso)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Crear operativo para un caso',
    description:
      'Un caso puede tener múltiples operativos. ' +
      'Retorna el operativo con su id (idOperativo) para usar en todas las secciones.',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso (asignacion)' })
  @Post('caso/:idCaso')
  async crear(@Param('idCaso') idCaso: string, @Body() data: OperativoDto) {
    const operativo = await this.operativoService.crear(idCaso, data, 'SISTEMA')
    return this.successCreate(operativo)
  }

  // ==================== ADMIN ====================

  @ApiOperation({ summary: 'Listar todos los operativos (admin)' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @Get()
  async listar(@Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listar(paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  // ==================== SECCIONES GENÉRICAS (2, 6, 7, 10) ====================
  // El frontend llama GET para cargar y POST para guardar cada sección.
  // Las secciones de items (3-5) usan sus propios endpoints (sustancias, lab).
  // Sección 2 = Drogas (los datos se manejan vía /drogas), aquí devuelve resumen.
  // Secciones 6, 7, 10 están embebidas en el operativo principal.

  @ApiOperation({ summary: 'Obtener datos de sección 2 (drogas) del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/seccion2')
  async getSeccion2(@Param('idOperativo') idOperativo: string) {
    const pesaje = await this.operativoService.obtenerPesajeDrogas(idOperativo)
    return this.successList({ idOperativo, pesaje })
  }

  @ApiOperation({ summary: 'Guardar datos de sección 2 (drogas) del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/seccion2')
  async postSeccion2(@Param('idOperativo') idOperativo: string, @Body() body: Record<string, unknown>) {
    return this.successUpdate({ idOperativo, ...body })
  }

  @ApiOperation({ summary: 'Obtener datos de sección 6 (personas) del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/seccion6')
  async getSeccion6(@Param('idOperativo') idOperativo: string) {
    const operativo = await this.operativoService.buscarPorId(idOperativo)
    return this.successList(operativo)
  }

  @ApiOperation({ summary: 'Guardar datos de sección 6 (personas) del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/seccion6')
  async postSeccion6(@Param('idOperativo') idOperativo: string, @Body() body: Record<string, unknown>) {
    return this.successUpdate({ idOperativo, ...body })
  }

  @ApiOperation({ summary: 'Obtener datos de sección 7 (bienes) del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/seccion7')
  async getSeccion7(@Param('idOperativo') idOperativo: string) {
    const operativo = await this.operativoService.buscarPorId(idOperativo)
    return this.successList(operativo)
  }

  @ApiOperation({ summary: 'Guardar datos de sección 7 (bienes) del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/seccion7')
  async postSeccion7(@Param('idOperativo') idOperativo: string, @Body() body: Record<string, unknown>) {
    return this.successUpdate({ idOperativo, ...body })
  }

  @ApiOperation({ summary: 'Obtener datos de sección 10 del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/seccion10')
  async getSeccion10(@Param('idOperativo') idOperativo: string) {
    const operativo = await this.operativoService.buscarPorId(idOperativo)
    return this.successList(operativo)
  }

  @ApiOperation({ summary: 'Guardar datos de sección 10 del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/seccion10')
  async postSeccion10(@Param('idOperativo') idOperativo: string, @Body() body: Record<string, unknown>) {
    return this.successUpdate({ idOperativo, ...body })
  }

  // ==================== OPERATIVO POR ID ====================

  @ApiOperation({ summary: 'Obtener operativo por ID' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo')
  async buscarPorId(@Param('idOperativo') idOperativo: string) {
    const operativo = await this.operativoService.buscarPorId(idOperativo)
    return this.successList(operativo)
  }

  @ApiOperation({ summary: 'Actualizar operativo por ID' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Patch(':idOperativo')
  async actualizar(@Param('idOperativo') idOperativo: string, @Body() data: OperativoDto) {
    const operativo = await this.operativoService.actualizar(idOperativo, data, 'SISTEMA')
    return this.successUpdate(operativo)
  }

  // ==================== DROGAS ====================

  @ApiOperation({ summary: 'Obtener pesaje/resumen de drogas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/drogas/pesaje')
  async obtenerPesaje(@Param('idOperativo') idOperativo: string) {
    const pesaje = await this.operativoService.obtenerPesajeDrogas(idOperativo)
    return this.successList(pesaje)
  }

  @ApiOperation({ summary: 'Listar drogas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada. Campos planos: idTipoDroga, descripcionEstadoDroga, descripcionTipoDroga, descripcionFormaTransporte, descripcionPaisProcedencia, descripcionPaisDestino, urlFotoPruebaCampo, urlFotoPesaje' })
  @Get(':idOperativo/drogas')
  async listarDrogas(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarDrogas(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({
    summary: 'Agregar droga al operativo',
    description:
      'Enviar como multipart/form-data. ' +
      'Archivos opcionales: pruebaCampo (foto prueba de campo) y pesaje (foto cuantificación/pesaje).',
  })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiConsumes('multipart/form-data')
  @Post(':idOperativo/drogas')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pruebaCampo', maxCount: 1 },
      { name: 'pesaje', maxCount: 1 },
    ])
  )
  async agregarDroga(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateDrogaDto,
    @UploadedFiles()
    files: {
      pruebaCampo?: Express.Multer.File[]
      pesaje?: Express.Multer.File[]
    }
  ) {
    const pruebaCampo = files?.pruebaCampo?.[0]?.buffer || Buffer.alloc(0)
    const pesaje = files?.pesaje?.[0]?.buffer || Buffer.alloc(0)
    const droga = await this.operativoService.agregarDroga(idOperativo, data, pruebaCampo, pesaje, 'SISTEMA')
    return this.successCreate(droga)
  }

  @ApiOperation({ summary: 'Obtener foto prueba de campo de una droga' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @Get(':idOperativo/drogas/:idDroga/fotos/prueba-campo')
  async obtenerFotoPruebaCampo(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDroga(idOperativo, idDroga, 'prueba-campo')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto cuantificación/pesaje de una droga' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @Get(':idOperativo/drogas/:idDroga/fotos/pesaje')
  async obtenerFotoPesaje(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDroga(idOperativo, idDroga, 'pesaje')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Eliminar droga del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @Delete(':idOperativo/drogas/:idDroga')
  async eliminarDroga(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string
  ) {
    await this.operativoService.eliminarDroga(idOperativo, idDroga)
    return this.successDelete(null)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  @ApiOperation({ summary: 'Listar sustancias sólidas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada. Campos planos: descripcionSustancia' })
  @Get(':idOperativo/sustancias-solidas')
  async listarSustanciasSolidas(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarSustanciasSolidas(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Agregar sustancia sólida al operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/sustancias-solidas')
  async agregarSustanciaSolida(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateSustanciaSolidaDto
  ) {
    const sustancia = await this.operativoService.agregarSustanciaSolida(idOperativo, data, 'SISTEMA')
    return this.successCreate(sustancia)
  }

  @ApiOperation({ summary: 'Eliminar sustancia sólida del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Delete(':idOperativo/sustancias-solidas/:id')
  async eliminarSustanciaSolida(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarSustanciaSolida(idOperativo, id)
    return this.successDelete(null)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  @ApiOperation({ summary: 'Listar sustancias líquidas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada. Campos planos: descripcionSustancia' })
  @Get(':idOperativo/sustancias-liquidas')
  async listarSustanciasLiquidas(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarSustanciasLiquidas(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Agregar sustancia líquida al operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/sustancias-liquidas')
  async agregarSustanciaLiquida(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateSustanciaLiquidaDto
  ) {
    const sustancia = await this.operativoService.agregarSustanciaLiquida(idOperativo, data, 'SISTEMA')
    return this.successCreate(sustancia)
  }

  @ApiOperation({ summary: 'Eliminar sustancia líquida del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Delete(':idOperativo/sustancias-liquidas/:id')
  async eliminarSustanciaLiquida(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarSustanciaLiquida(idOperativo, id)
    return this.successDelete(null)
  }

  // ==================== FÁBRICAS ====================

  @ApiOperation({ summary: 'Listar fábricas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada. Campos planos: idTipoFabrica, descripcionFabricaModelo, descripcionTipoFabrica' })
  @Get(':idOperativo/fabricas')
  async listarFabricas(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarFabricas(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Agregar fábrica al operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Post(':idOperativo/fabricas')
  async agregarFabrica(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateFabricaDto
  ) {
    const fabrica = await this.operativoService.agregarFabrica(idOperativo, data, 'SISTEMA')
    return this.successCreate(fabrica)
  }

  @ApiOperation({ summary: 'Eliminar fábrica del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Delete(':idOperativo/fabricas/:id')
  async eliminarFabrica(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarFabrica(idOperativo, id)
    return this.successDelete(null)
  }

  // ==================== BIENES SECUESTRADOS ====================

  @ApiOperation({ summary: 'Listar bienes secuestrados del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada. Campos planos: idCatalogoClase, idBien, descripcionCatalogoTipo, descripcionCatalogoClase, descripcionBien, urlFotoBien' })
  @Get(':idOperativo/bienes')
  async listarBienes(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarBienes(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({
    summary: 'Agregar bien secuestrado al operativo',
    description: 'Enviar como multipart/form-data. Campo opcional: foto (jpg/jpeg del bien).',
  })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiConsumes('multipart/form-data')
  @Post(':idOperativo/bienes')
  @UseInterceptors(FileInterceptor('foto'))
  async agregarBien(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateBienSecuestradoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const foto = file?.buffer || undefined
    const bien = await this.operativoService.agregarBien(idOperativo, data, 'SISTEMA', foto)
    return this.successCreate(bien)
  }

  @ApiOperation({ summary: 'Obtener foto de bien secuestrado' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idBien', description: 'ID del bien secuestrado' })
  @Get(':idOperativo/bienes/:idBien/foto')
  async obtenerFotoBien(
    @Param('idOperativo') idOperativo: string,
    @Param('idBien') idBien: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoBien(idOperativo, idBien)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Listar características de un bien' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idBien', description: 'ID del bien secuestrado' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada. Campos planos: descripcionCaracteristica' })
  @Get(':idOperativo/bienes/:idBien/caracteristicas')
  async listarCaracteristicasBien(
    @Param('idOperativo') idOperativo: string,
    @Param('idBien') idBien: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const resultado = await this.operativoService.listarCaracteristicasBien(idOperativo, idBien, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Agregar característica a un bien' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idBien', description: 'ID del bien secuestrado' })
  @Post(':idOperativo/bienes/:idBien/caracteristicas')
  async agregarCaracteristicaBien(
    @Param('idOperativo') idOperativo: string,
    @Param('idBien') idBien: string,
    @Body() data: CreateBienCaracteristicaDto
  ) {
    const caracteristica = await this.operativoService.agregarCaracteristicaBien(idOperativo, idBien, data, 'SISTEMA')
    return this.successCreate(caracteristica)
  }

  @ApiOperation({ summary: 'Eliminar característica de un bien' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idBien', description: 'ID del bien secuestrado' })
  @Delete(':idOperativo/bienes/:idBien/caracteristicas/:id')
  async eliminarCaracteristicaBien(
    @Param('idOperativo') idOperativo: string,
    @Param('idBien') idBien: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarCaracteristicaBien(idOperativo, idBien, id)
    return this.successDelete(null)
  }

  @ApiOperation({ summary: 'Eliminar bien secuestrado del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idBien', description: 'ID del bien secuestrado' })
  @Delete(':idOperativo/bienes/:idBien')
  async eliminarBien(
    @Param('idOperativo') idOperativo: string,
    @Param('idBien') idBien: string
  ) {
    await this.operativoService.eliminarBien(idOperativo, idBien)
    return this.successDelete(null)
  }

  // ==================== APREHENDIDOS ====================

  @ApiOperation({ summary: 'Listar personas del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @Get(':idOperativo/personas')
  async listarDetenidos(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarDetenidos(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({
    summary: 'Agregar aprehendido al operativo',
    description: 'Enviar como multipart/form-data. Campos opcionales de archivo: fotoFrente, fotoDocumento, fotoPerfilIzquierdo (jpg/jpeg).',
  })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiConsumes('multipart/form-data')
  @Post(':idOperativo/personas')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fotoFrente', maxCount: 1 },
      { name: 'fotoDocumento', maxCount: 1 },
      { name: 'fotoPerfilIzquierdo', maxCount: 1 },
    ])
  )
  async agregarDetenido(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateDetenidoDto,
    @UploadedFiles()
    files: {
      fotoFrente?: Express.Multer.File[]
      fotoDocumento?: Express.Multer.File[]
      fotoPerfilIzquierdo?: Express.Multer.File[]
    }
  ) {
    const fotoFrente = files?.fotoFrente?.[0]?.buffer
    const fotoDocumento = files?.fotoDocumento?.[0]?.buffer
    const fotoPerfilIzquierdo = files?.fotoPerfilIzquierdo?.[0]?.buffer
    const aprehendido = await this.operativoService.agregarDetenido(
      idOperativo, data, 'SISTEMA', fotoFrente, fotoDocumento, fotoPerfilIzquierdo
    )
    return this.successCreate(aprehendido)
  }

  @ApiOperation({ summary: 'Obtener foto de aprehendido (frente)' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'id', description: 'ID del aprehendido' })
  @Get(':idOperativo/personas/:id/fotos/frente')
  async obtenerFotoDetenidoFrente(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDetenido(idOperativo, id, 'frente')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de documento del aprehendido' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'id', description: 'ID del aprehendido' })
  @Get(':idOperativo/personas/:id/fotos/foto-documento')
  async obtenerFotoDetenidoDocumento(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDetenido(idOperativo, id, 'foto-documento')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de aprehendido (perfil izquierdo)' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'id', description: 'ID del aprehendido' })
  @Get(':idOperativo/personas/:id/fotos/perfil-izquierdo')
  async obtenerFotoDetenidoPerfilIzquierdo(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDetenido(idOperativo, id, 'perfil-izquierdo')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Eliminar aprehendido del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Delete(':idOperativo/personas/:id')
  async eliminarDetenido(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarDetenido(idOperativo, id)
    return this.successDelete(null)
  }

  // ==================== GALERÍA ====================

  @ApiOperation({ summary: 'Listar galería del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @Get(':idOperativo/galeria')
  async listarGaleria(@Param('idOperativo') idOperativo: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarGaleria(idOperativo, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Agregar foto a la galería del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiConsumes('multipart/form-data')
  @Post(':idOperativo/galeria')
  @UseInterceptors(FileInterceptor('foto'))
  async agregarFotoGaleria(
    @Param('idOperativo') idOperativo: string,
    @Body() data: CreateGaleriaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const foto = file?.buffer || Buffer.alloc(0)
    const galeria = await this.operativoService.agregarFotoGaleria(idOperativo, data, foto, 'SISTEMA')
    return this.successCreate(galeria)
  }

  @ApiOperation({ summary: 'Obtener foto de galería (thumbnail)' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/galeria/:id/thumbnail')
  async obtenerGaleriaThumbnail(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoGaleria(idOperativo, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de galería (medium)' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/galeria/:id/medium')
  async obtenerGaleriaMedium(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoGaleria(idOperativo, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de galería (full)' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Get(':idOperativo/galeria/:id/full')
  async obtenerGaleriaFull(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoGaleria(idOperativo, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Eliminar foto de la galería del operativo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @Delete(':idOperativo/galeria/:id')
  async eliminarFotoGaleria(
    @Param('idOperativo') idOperativo: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarFotoGaleria(idOperativo, id)
    return this.successDelete(null)
  }

  // ==================== LOGOTIPOS ====================

  @ApiOperation({ summary: 'Listar logotipos de una droga' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @Get(':idOperativo/drogas/:idDroga/logotipos')
  async listarLogotipos(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const resultado = await this.operativoService.listarLogotipos(idOperativo, idDroga, paginacion)
    return this.successPagedRows(resultado, paginacion)
  }

  @ApiOperation({ summary: 'Agregar logotipo a una droga' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @ApiConsumes('multipart/form-data')
  @Post(':idOperativo/drogas/:idDroga/logotipos')
  @UseInterceptors(FileInterceptor('fotografia'))
  async agregarLogotipo(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string,
    @Body() data: CreateLogotipoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fotografia = file?.buffer || Buffer.alloc(0)
    const logotipo = await this.operativoService.agregarLogotipo(idOperativo, idDroga, data, fotografia, 'SISTEMA')
    return this.successCreate(logotipo)
  }

  @ApiOperation({ summary: 'Obtener foto de logotipo' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @ApiParam({ name: 'id', description: 'ID del logotipo' })
  @Get(':idOperativo/drogas/:idDroga/logotipos/:id/foto')
  async obtenerFotoLogotipo(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoLogotipo(idDroga, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Eliminar logotipo de una droga' })
  @ApiParam({ name: 'idOperativo', description: 'ID del operativo' })
  @ApiParam({ name: 'idDroga', description: 'ID de la droga' })
  @Delete(':idOperativo/drogas/:idDroga/logotipos/:id')
  async eliminarLogotipo(
    @Param('idOperativo') idOperativo: string,
    @Param('idDroga') idDroga: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarLogotipo(id)
    return this.successDelete(null)
  }
}
