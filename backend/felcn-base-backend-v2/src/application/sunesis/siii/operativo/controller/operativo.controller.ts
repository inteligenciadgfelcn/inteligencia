import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
} from '@nestjs/common'
import { Response } from 'express'
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'
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

  // ==================== CASOS DE USUARIO ====================

  @ApiOperation({
    summary: 'Listar todos los casos de un usuario',
    description: 'Lee de felcn_siii.public.asignacion con JOINs a unidad/distrital/grupo.',
  })
  @Get('casos/usuario/:usuario')
  async listarCasosPorUsuario(@Param('usuario') usuario: string) {
    const datos = await this.operativoService.listarCasosPorUsuario(usuario)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Listar casos no aprobados de un usuario',
    description: 'Lee de felcn_siii.public.asignacion donde NroCaso está vacío.',
  })
  @Get('casos/no-aprobados/usuario/:usuario')
  async listarCasosNoAprobados(@Param('usuario') usuario: string) {
    const datos = await this.operativoService.listarCasosNoAprobados(usuario)
    return this.successList(datos)
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

  // ==================== OPERATIVO PRINCIPAL (keyed by idCaso) ====================

  @ApiOperation({
    summary: 'Obtener caso + operativo unificado',
    description:
      'Retorna datos del caso desde asignacion y, si existe, el operativo con estadísticas. ' +
      'esNuevo:true si no hay operativo aún, esNuevo:false si ya existe.',
  })
  @Get('caso/:idCaso')
  async getOrInit(@Param('idCaso') idCaso: string) {
    const datos = await this.operativoService.getOrInit(idCaso)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Crear operativo para un caso',
    description:
      'El numeroOperativo se toma de asignacion automáticamente. ' +
      'Retorna 409 si ya existe un operativo para ese caso.',
  })
  @Post('caso/:idCaso')
  async crear(@Param('idCaso') idCaso: string, @Body() data: OperativoDto) {
    const usuario = 'SISTEMA'
    const operativo = await this.operativoService.crear(idCaso, data, usuario)
    return this.successCreate(operativo)
  }

  @ApiOperation({
    summary: 'Actualizar operativo de un caso',
    description:
      'Resuelve idCaso → idOperativo internamente. Retorna 404 si no existe operativo.',
  })
  @Patch('caso/:idCaso')
  async actualizar(@Param('idCaso') idCaso: string, @Body() data: OperativoDto) {
    const usuario = 'SISTEMA'
    const operativo = await this.operativoService.actualizar(idCaso, data, usuario)
    return this.successUpdate(operativo)
  }

  // ==================== ADMIN: operativo por ID interno ====================

  @ApiOperation({ summary: 'Listar todos los operativos (admin)' })
  @Get()
  async listar(@Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listar(paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Obtener operativo por ID interno (admin/debug)' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const operativo = await this.operativoService.buscarPorId(id)
    return this.successList(operativo)
  }

  // ==================== DROGAS ====================

  @ApiOperation({ summary: 'Listar drogas del caso ([] si operativo no existe)' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { total, filas }. Campos planos: idTipoDroga, descripcionEstadoDroga, descripcionTipoDroga, urlFotoPruebaCampo, urlFotoPesaje' })
  @Get('caso/:idCaso/drogas')
  async listarDrogas(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarDrogas(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Obtener pesaje/resumen de drogas del caso' })
  @Get('caso/:idCaso/drogas/pesaje')
  async obtenerPesaje(@Param('idCaso') idCaso: string) {
    const pesaje = await this.operativoService.obtenerPesajeDrogas(idCaso)
    return this.successList(pesaje)
  }

  @ApiOperation({
    summary: 'Agregar droga al caso (requiere operativo existente)',
    description:
      'Enviar como multipart/form-data. Campos de texto como campos del form. ' +
      'Archivos opcionales: pruebaCampo (foto prueba de campo) y pesaje (foto cuantificación/pesaje).',
  })
  @ApiConsumes('multipart/form-data')
  @Post('caso/:idCaso/drogas')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pruebaCampo', maxCount: 1 },
      { name: 'pesaje', maxCount: 1 },
    ])
  )
  async agregarDroga(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateDrogaDto,
    @UploadedFiles()
    files: {
      pruebaCampo?: Express.Multer.File[]
      pesaje?: Express.Multer.File[]
    }
  ) {
    const pruebaCampo = files?.pruebaCampo?.[0]?.buffer || Buffer.alloc(0)
    const pesaje = files?.pesaje?.[0]?.buffer || Buffer.alloc(0)
    const droga = await this.operativoService.agregarDroga(
      idCaso,
      data,
      pruebaCampo,
      pesaje,
      'SISTEMA'
    )
    return this.successCreate(droga)
  }

  @ApiOperation({ summary: 'Obtener foto prueba de campo de una droga' })
  @Get('caso/:idCaso/drogas/:idDroga/fotos/prueba-campo')
  async obtenerFotoPruebaCampo(
    @Param('idCaso') idCaso: string,
    @Param('idDroga') idDroga: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDroga(
      idCaso,
      idDroga,
      'prueba-campo'
    )
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto cuantificación/pesaje de una droga' })
  @Get('caso/:idCaso/drogas/:idDroga/fotos/pesaje')
  async obtenerFotoPesaje(
    @Param('idCaso') idCaso: string,
    @Param('idDroga') idDroga: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDroga(
      idCaso,
      idDroga,
      'pesaje'
    )
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Eliminar droga del caso' })
  @Delete('caso/:idCaso/drogas/:idDroga')
  async eliminarDroga(
    @Param('idCaso') idCaso: string,
    @Param('idDroga') idDroga: string
  ) {
    await this.operativoService.eliminarDroga(idCaso, idDroga)
    return this.successDelete(null)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  @ApiOperation({ summary: 'Listar sustancias sólidas del caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { total, filas }. Campos planos: descripcionSustancia' })
  @Get('caso/:idCaso/sustancias-solidas')
  async listarSustanciasSolidas(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarSustanciasSolidas(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar sustancia sólida al caso' })
  @Post('caso/:idCaso/sustancias-solidas')
  async agregarSustanciaSolida(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateSustanciaSolidaDto
  ) {
    const sustancia = await this.operativoService.agregarSustanciaSolida(
      idCaso,
      data,
      'SISTEMA'
    )
    return this.successCreate(sustancia)
  }

  @ApiOperation({ summary: 'Eliminar sustancia sólida del caso' })
  @Delete('caso/:idCaso/sustancias-solidas/:id')
  async eliminarSustanciaSolida(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarSustanciaSolida(idCaso, id)
    return this.successDelete(null)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  @ApiOperation({ summary: 'Listar sustancias líquidas del caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { total, filas }. Campos planos: descripcionSustancia' })
  @Get('caso/:idCaso/sustancias-liquidas')
  async listarSustanciasLiquidas(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarSustanciasLiquidas(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar sustancia líquida al caso' })
  @Post('caso/:idCaso/sustancias-liquidas')
  async agregarSustanciaLiquida(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateSustanciaLiquidaDto
  ) {
    const sustancia = await this.operativoService.agregarSustanciaLiquida(
      idCaso,
      data,
      'SISTEMA'
    )
    return this.successCreate(sustancia)
  }

  @ApiOperation({ summary: 'Eliminar sustancia líquida del caso' })
  @Delete('caso/:idCaso/sustancias-liquidas/:id')
  async eliminarSustanciaLiquida(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarSustanciaLiquida(idCaso, id)
    return this.successDelete(null)
  }

  // ==================== FÁBRICAS ====================

  @ApiOperation({ summary: 'Listar fábricas del caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { total, filas }. Campos planos: idTipoFabrica, descripcionFabricaModelo, descripcionTipoFabrica' })
  @Get('caso/:idCaso/fabricas')
  async listarFabricas(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarFabricas(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar fábrica al caso' })
  @Post('caso/:idCaso/fabricas')
  async agregarFabrica(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateFabricaDto
  ) {
    const fabrica = await this.operativoService.agregarFabrica(idCaso, data, 'SISTEMA')
    return this.successCreate(fabrica)
  }

  @ApiOperation({ summary: 'Eliminar fábrica del caso' })
  @Delete('caso/:idCaso/fabricas/:id')
  async eliminarFabrica(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarFabrica(idCaso, id)
    return this.successDelete(null)
  }

  // ==================== BIENES SECUESTRADOS ====================

  @ApiOperation({ summary: 'Listar bienes secuestrados del caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { total, filas }. Campos planos: idCatalogoClase, idBien, descripcionCatalogoTipo, descripcionCatalogoClase, descripcionBien, urlFotoBien' })
  @Get('caso/:idCaso/bienes')
  async listarBienes(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarBienes(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar bien secuestrado al caso' })
  @Post('caso/:idCaso/bienes')
  async agregarBien(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateBienSecuestradoDto
  ) {
    const bien = await this.operativoService.agregarBien(idCaso, data, 'SISTEMA')
    return this.successCreate(bien)
  }

  @ApiOperation({ summary: 'Eliminar bien secuestrado del caso' })
  @Delete('caso/:idCaso/bienes/:idBien')
  async eliminarBien(
    @Param('idCaso') idCaso: string,
    @Param('idBien') idBien: string
  ) {
    await this.operativoService.eliminarBien(idCaso, idBien)
    return this.successDelete(null)
  }

  // ==================== CARACTERÍSTICAS DE BIENES ====================

  @ApiOperation({ summary: 'Listar características de un bien' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @ApiParam({ name: 'idBien', description: 'ID del bien secuestrado' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (default: 1)' })
  @ApiQuery({ name: 'limite', required: false, description: 'Registros por página (10-50, default: 10)' })
  @ApiResponse({ status: 200, description: 'Lista paginada: { total, filas }. Campos planos: descripcionCaracteristica' })
  @Get('caso/:idCaso/bienes/:idBien/caracteristicas')
  async listarCaracteristicasBien(
    @Param('idCaso') idCaso: string,
    @Param('idBien') idBien: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const resultado = await this.operativoService.listarCaracteristicasBien(
      idCaso,
      idBien,
      paginacion
    )
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar característica a un bien' })
  @Post('caso/:idCaso/bienes/:idBien/caracteristicas')
  async agregarCaracteristicaBien(
    @Param('idCaso') idCaso: string,
    @Param('idBien') idBien: string,
    @Body() data: CreateBienCaracteristicaDto
  ) {
    const caracteristica = await this.operativoService.agregarCaracteristicaBien(
      idCaso,
      idBien,
      data,
      'SISTEMA'
    )
    return this.successCreate(caracteristica)
  }

  @ApiOperation({ summary: 'Eliminar característica de un bien' })
  @Delete('caso/:idCaso/bienes/:idBien/caracteristicas/:id')
  async eliminarCaracteristicaBien(
    @Param('idCaso') idCaso: string,
    @Param('idBien') idBien: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarCaracteristicaBien(idCaso, idBien, id)
    return this.successDelete(null)
  }

  @ApiOperation({ summary: 'Obtener foto de bien secuestrado' })
  @Get('caso/:idCaso/bienes/:idBien/foto')
  async obtenerFotoBien(
    @Param('idCaso') idCaso: string,
    @Param('idBien') idBien: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoBien(idCaso, idBien)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  // ==================== DETENIDOS ====================

  @ApiOperation({ summary: 'Listar detenidos del caso' })
  @Get('caso/:idCaso/detenidos')
  async listarDetenidos(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarDetenidos(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar detenido al caso' })
  @Post('caso/:idCaso/detenidos')
  async agregarDetenido(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateDetenidoDto
  ) {
    const detenido = await this.operativoService.agregarDetenido(
      idCaso,
      data,
      'SISTEMA'
    )
    return this.successCreate(detenido)
  }

  @ApiOperation({ summary: 'Eliminar detenido del caso' })
  @Delete('caso/:idCaso/detenidos/:id')
  async eliminarDetenido(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarDetenido(idCaso, id)
    return this.successDelete(null)
  }

  @ApiOperation({ summary: 'Obtener foto de detenido (frente)' })
  @Get('caso/:idCaso/detenidos/:id/fotos/frente')
  async obtenerFotoDetenidoFrente(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDetenido(idCaso, id, 'frente')
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de detenido (perfil derecho)' })
  @Get('caso/:idCaso/detenidos/:id/fotos/perfil-derecho')
  async obtenerFotoDetenidoPerfilDerecho(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDetenido(
      idCaso,
      id,
      'perfil-derecho'
    )
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de detenido (perfil izquierdo)' })
  @Get('caso/:idCaso/detenidos/:id/fotos/perfil-izquierdo')
  async obtenerFotoDetenidoPerfilIzquierdo(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoDetenido(
      idCaso,
      id,
      'perfil-izquierdo'
    )
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Subir foto de detenido (frente)' })
  @ApiConsumes('multipart/form-data')
  @Post('caso/:idCaso/detenidos/:id/fotos/frente')
  @UseInterceptors(FileInterceptor('foto'))
  async subirFotoDetenidoFrente(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    // TODO: implementar guardado de foto de detenido en la entidad
    return this.successCreate({ mensaje: 'Foto recibida (pendiente de implementar)' })
  }

  @ApiOperation({ summary: 'Subir foto de detenido (perfil derecho)' })
  @ApiConsumes('multipart/form-data')
  @Post('caso/:idCaso/detenidos/:id/fotos/perfil-derecho')
  @UseInterceptors(FileInterceptor('foto'))
  async subirFotoDetenidoPerfilDerecho(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.successCreate({ mensaje: 'Foto recibida (pendiente de implementar)' })
  }

  @ApiOperation({ summary: 'Subir foto de detenido (perfil izquierdo)' })
  @ApiConsumes('multipart/form-data')
  @Post('caso/:idCaso/detenidos/:id/fotos/perfil-izquierdo')
  @UseInterceptors(FileInterceptor('foto'))
  async subirFotoDetenidoPerfilIzquierdo(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.successCreate({ mensaje: 'Foto recibida (pendiente de implementar)' })
  }

  // ==================== GALERÍA ====================

  @ApiOperation({ summary: 'Listar galería del caso' })
  @Get('caso/:idCaso/galeria')
  async listarGaleria(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarGaleria(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar foto a la galería del caso' })
  @ApiConsumes('multipart/form-data')
  @Post('caso/:idCaso/galeria')
  @UseInterceptors(FileInterceptor('foto'))
  async agregarFotoGaleria(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateGaleriaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const foto = file?.buffer || Buffer.alloc(0)
    const galeria = await this.operativoService.agregarFotoGaleria(
      idCaso,
      data,
      foto,
      'SISTEMA'
    )
    return this.successCreate(galeria)
  }

  @ApiOperation({ summary: 'Eliminar foto de la galería del caso' })
  @Delete('caso/:idCaso/galeria/:id')
  async eliminarFotoGaleria(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarFotoGaleria(idCaso, id)
    return this.successDelete(null)
  }

  @ApiOperation({ summary: 'Obtener foto de galería (thumbnail)' })
  @Get('caso/:idCaso/galeria/:id/thumbnail')
  async obtenerGaleriaThumbnail(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    // TODO: Implementar procesamiento de imagen con sharp para thumbnail 50x50px
    const foto = await this.operativoService.obtenerFotoGaleria(idCaso, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de galería (medium)' })
  @Get('caso/:idCaso/galeria/:id/medium')
  async obtenerGaleriaMedium(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    // TODO: Implementar procesamiento de imagen con sharp 400x400px
    const foto = await this.operativoService.obtenerFotoGaleria(idCaso, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  @ApiOperation({ summary: 'Obtener foto de galería (full)' })
  @Get('caso/:idCaso/galeria/:id/full')
  async obtenerGaleriaFull(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoGaleria(idCaso, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }

  // ==================== LOGOTIPOS ====================

  @ApiOperation({ summary: 'Listar logotipos del caso' })
  @Get('caso/:idCaso/logotipos')
  async listarLogotipos(@Param('idCaso') idCaso: string, @Query() paginacion: PaginacionQueryDto) {
    const resultado = await this.operativoService.listarLogotipos(idCaso, paginacion)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Agregar logotipo al caso' })
  @ApiConsumes('multipart/form-data')
  @Post('caso/:idCaso/logotipos')
  @UseInterceptors(FileInterceptor('fotografia'))
  async agregarLogotipo(
    @Param('idCaso') idCaso: string,
    @Body() data: CreateLogotipoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fotografia = file?.buffer || Buffer.alloc(0)
    const logotipo = await this.operativoService.agregarLogotipo(
      idCaso,
      data,
      fotografia,
      'SISTEMA'
    )
    return this.successCreate(logotipo)
  }

  @ApiOperation({ summary: 'Eliminar logotipo del caso' })
  @Delete('caso/:idCaso/logotipos/:id')
  async eliminarLogotipo(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string
  ) {
    await this.operativoService.eliminarLogotipo(idCaso, id)
    return this.successDelete(null)
  }

  @ApiOperation({ summary: 'Obtener foto de logotipo' })
  @Get('caso/:idCaso/logotipos/:id/foto')
  async obtenerFotoLogotipo(
    @Param('idCaso') idCaso: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const foto = await this.operativoService.obtenerFotoLogotipo(idCaso, id)
    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(foto)
  }
}
