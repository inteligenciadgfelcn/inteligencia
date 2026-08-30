import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BlancoService } from '../service/blanco.service'
import {
  CreateBlancoDto,
  CreateAntecedenteDto,
  CreateRedSocialDto,
  CreateLugarSigDto,
  CreateArchivoDto,
  CreateFlujoTelefonicoDto,
  CreateFlujoFiscaliaDto,
  CreateActivoPatrimonialDto,
  CreateOviseDto,
} from '../dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Blancos S2I (Personas Investigadas)')
@Controller('s2i')
export class BlancoController extends BaseController {
  constructor(private readonly service: BlancoService) {
    super()
  }

  // ==================== BLANCOS ====================

  @ApiOperation({
    summary: 'Crear blanco (persona investigada) para un caso',
    description:
      'Replica RegBlancos.InsertBlancos de FRM_ING_ENT1. Aplica toUpperCase en nombres y apellidos.',
  })
  @ApiParam({
    name: 'idCaso',
    description: 'ID del caso al que pertenece el blanco',
  })
  @Post('casos/:idCaso/blancos')
  async crear(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateBlancoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const blanco = await this.service.crear(idCaso, dto, numeroPase)
    return this.successCreate(blanco)
  }

  @ApiOperation({ summary: 'Listar blancos de un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Get('casos/:idCaso/blancos')
  async listarPorCaso(@Param('idCaso') idCaso: string) {
    return this.successList(await this.service.listarPorCaso(idCaso))
  }

  @ApiOperation({ summary: 'Eliminar blanco por ID' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco (bigint)' })
  @Delete('blancos/:idBlanco')
  async eliminar(@Param('idBlanco') idBlanco: string) {
    await this.service.eliminar(idBlanco)
    return this.successDelete()
  }

  @ApiOperation({
    summary: 'Actualizar foto del blanco',
    description:
      'Enviar como multipart/form-data. Campo: foto (imagen jpg/jpeg).',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @ApiConsumes('multipart/form-data')
  @Patch('blancos/:idBlanco/foto')
  @UseInterceptors(FileInterceptor('foto'))
  async actualizarFoto(
    @Param('idBlanco') idBlanco: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const foto = file?.buffer || Buffer.alloc(0)
    await this.service.actualizarFoto(idBlanco, foto)
    return this.successUpdate({ idBlanco })
  }

  @ApiOperation({ summary: 'Obtener foto del blanco (binario)' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/foto')
  async obtenerFoto(@Param('idBlanco') idBlanco: string, @Res() res: Response) {
    const foto = await this.service.obtenerFoto(idBlanco)
    res.set('Content-Type', 'image/jpeg')
    res.send(foto)
  }

  // ==================== ANTECEDENTES ====================

  @ApiOperation({
    summary: 'Agregar antecedente al blanco',
    description: 'Replica RegBlancos.Insertantecedente de FRM_ING_ENT1.',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Post('blancos/:idBlanco/antecedentes')
  async crearAntecedente(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateAntecedenteDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const antecedente = await this.service.crearAntecedente(
      idBlanco,
      dto,
      numeroPase
    )
    return this.successCreate(antecedente)
  }

  @ApiOperation({ summary: 'Listar antecedentes de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/antecedentes')
  async listarAntecedentes(@Param('idBlanco') idBlanco: string) {
    return this.successList(await this.service.listarAntecedentes(idBlanco))
  }

  @ApiOperation({ summary: 'Eliminar antecedente por ID' })
  @ApiParam({
    name: 'idAntecedente',
    description: 'ID del antecedente (bigint)',
  })
  @Delete('antecedentes/:idAntecedente')
  async eliminarAntecedente(@Param('idAntecedente') idAntecedente: string) {
    await this.service.eliminarAntecedente(idAntecedente)
    return this.successDelete()
  }

  // ==================== REDES SOCIALES ====================

  @ApiOperation({
    summary: 'Agregar red social al blanco',
    description: 'Replica RegBlancos.InsertRedSocial de FRM_ING_ENT1.',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Post('blancos/:idBlanco/redes-sociales')
  async crearRedSocial(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateRedSocialDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const red = await this.service.crearRedSocial(idBlanco, dto, numeroPase)
    return this.successCreate(red)
  }

  @ApiOperation({ summary: 'Listar redes sociales de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/redes-sociales')
  async listarRedesSociales(@Param('idBlanco') idBlanco: string) {
    return this.successList(await this.service.listarRedesSociales(idBlanco))
  }

  @ApiOperation({ summary: 'Eliminar red social por ID' })
  @ApiParam({
    name: 'idRedSocial',
    description: 'ID de la red social (bigint)',
  })
  @Delete('redes-sociales/:idRedSocial')
  async eliminarRedSocial(@Param('idRedSocial') idRedSocial: string) {
    await this.service.eliminarRedSocial(idRedSocial)
    return this.successDelete()
  }

  // ==================== SIG ====================

  @ApiOperation({
    summary: 'Agregar lugar SIG al blanco',
    description: 'Replica RegBlancos.InsertSig de FRM_ING_ENT1.',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Post('blancos/:idBlanco/lugares-sig')
  async crearLugar(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateLugarSigDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const lugar = await this.service.crearLugar(idBlanco, dto, numeroPase)
    return this.successCreate(lugar)
  }

  @ApiOperation({ summary: 'Listar lugares SIG de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/lugares-sig')
  async listarLugares(@Param('idBlanco') idBlanco: string) {
    return this.successList(await this.service.listarLugares(idBlanco))
  }

  @ApiOperation({ summary: 'Eliminar lugar SIG de blanco por ID' })
  @ApiParam({ name: 'idLugar', description: 'ID del lugar (bigint)' })
  @Delete('lugares-sig-blanco/:idLugar')
  async eliminarLugar(@Param('idLugar') idLugar: string) {
    await this.service.eliminarLugar(idLugar)
    return this.successDelete()
  }

  // ==================== ARCHIVOS ====================

  @ApiOperation({
    summary: 'Subir archivo adjunto al blanco',
    description: 'Enviar como multipart/form-data. Campo de archivo: archivo.',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @ApiConsumes('multipart/form-data')
  @Post('blancos/:idBlanco/archivos')
  @UseInterceptors(FileInterceptor('archivo'))
  async subirArchivo(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateArchivoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const data = file?.buffer || Buffer.alloc(0)
    const nombreArchivo = file?.originalname || dto.nombre
    const resultado = await this.service.subirArchivo(
      idBlanco,
      dto,
      nombreArchivo,
      data,
      numeroPase
    )
    return this.successCreate(resultado)
  }

  @ApiOperation({ summary: 'Listar archivos adjuntos de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/archivos')
  async listarArchivos(@Param('idBlanco') idBlanco: string) {
    return this.successList(await this.service.listarArchivos(idBlanco))
  }

  @ApiOperation({ summary: 'Descargar archivo adjunto de blanco' })
  @ApiParam({ name: 'idArchivo', description: 'ID del archivo (bigint)' })
  @Get('archivos-blanco/:idArchivo/descargar')
  async descargarArchivo(
    @Param('idArchivo') idArchivo: string,
    @Res() res: Response
  ) {
    const { data, nombreArchivo } =
      await this.service.descargarArchivo(idArchivo)
    res.set('Content-Disposition', `attachment; filename="${nombreArchivo}"`)
    res.set('Content-Type', 'application/octet-stream')
    res.send(data)
  }

  @ApiOperation({ summary: 'Eliminar archivo adjunto de blanco por ID' })
  @ApiParam({ name: 'idArchivo', description: 'ID del archivo (bigint)' })
  @Delete('archivos-blanco/:idArchivo')
  async eliminarArchivo(@Param('idArchivo') idArchivo: string) {
    await this.service.eliminarArchivo(idArchivo)
    return this.successDelete()
  }

  // ==================== FLUJO TELEFÓNICO ====================

  @ApiOperation({ summary: 'Registrar flujo telefónico de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Post('blancos/:idBlanco/flujos-telefonicos')
  async crearFlujoTelefonico(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateFlujoTelefonicoDto,
    @Req() req: Request
  ) {
    const { id: idUsuario = '' } = req.user as PassportUser
    const flujo = await this.service.crearFlujoTelefonico(
      idBlanco,
      dto,
      idUsuario
    )
    return this.successCreate(flujo)
  }

  @ApiOperation({ summary: 'Listar flujos telefónicos de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/flujos-telefonicos')
  async listarFlujosTelefonicos(@Param('idBlanco') idBlanco: string) {
    return this.successList(
      await this.service.listarFlujosTelefonicos(idBlanco)
    )
  }

  @ApiOperation({ summary: 'Eliminar flujo telefónico por ID' })
  @ApiParam({
    name: 'idFlujo',
    description: 'ID del flujo telefónico (bigint)',
  })
  @Delete('flujos-telefonicos/:idFlujo')
  async eliminarFlujoTelefonico(@Param('idFlujo') idFlujo: string) {
    await this.service.eliminarFlujoTelefonico(idFlujo)
    return this.successDelete()
  }

  // ==================== FLUJO FISCALÍA ====================

  @ApiOperation({
    summary: 'Registrar detalle de llamada (fiscalía) de un flujo telefónico',
  })
  @ApiParam({ name: 'idFlujo', description: 'ID del flujo telefónico' })
  @Post('flujos-telefonicos/:idFlujo/fiscalia')
  async crearFlujoFiscalia(
    @Param('idFlujo') idFlujo: string,
    @Body() dto: CreateFlujoFiscaliaDto,
    @Req() req: Request
  ) {
    const { id: idUsuario = '' } = req.user as PassportUser
    const flujoFiscalia = await this.service.crearFlujoFiscalia(
      idFlujo,
      dto,
      idUsuario
    )
    return this.successCreate(flujoFiscalia)
  }

  @ApiOperation({
    summary: 'Listar detalle de fiscalía de un flujo telefónico',
  })
  @ApiParam({ name: 'idFlujo', description: 'ID del flujo telefónico' })
  @Get('flujos-telefonicos/:idFlujo/fiscalia')
  async listarFlujoFiscalia(@Param('idFlujo') idFlujo: string) {
    return this.successList(await this.service.listarFlujoFiscalia(idFlujo))
  }

  @ApiOperation({ summary: 'Eliminar detalle de fiscalía por ID' })
  @ApiParam({
    name: 'idFlujoFiscalia',
    description: 'ID del detalle de fiscalía (bigint)',
  })
  @Delete('flujo-fiscalia/:idFlujoFiscalia')
  async eliminarFlujoFiscalia(
    @Param('idFlujoFiscalia') idFlujoFiscalia: string
  ) {
    await this.service.eliminarFlujoFiscalia(idFlujoFiscalia)
    return this.successDelete()
  }

  // ==================== ACTIVO PATRIMONIAL ====================

  @ApiOperation({
    summary: 'Registrar activo patrimonial del blanco',
    description: 'Enviar como multipart/form-data. Campo de archivo: archivo.',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @ApiConsumes('multipart/form-data')
  @Post('blancos/:idBlanco/activos-patrimoniales')
  @UseInterceptors(FileInterceptor('archivo'))
  async subirActivoPatrimonial(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateActivoPatrimonialDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const { id: idUsuario = '' } = req.user as PassportUser
    const archivo = file?.buffer || Buffer.alloc(0)
    const resultado = await this.service.subirActivoPatrimonial(
      idBlanco,
      dto,
      archivo,
      idUsuario
    )
    return this.successCreate(resultado)
  }

  @ApiOperation({ summary: 'Listar activos patrimoniales de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/activos-patrimoniales')
  async listarActivosPatrimoniales(@Param('idBlanco') idBlanco: string) {
    return this.successList(
      await this.service.listarActivosPatrimoniales(idBlanco)
    )
  }

  @ApiOperation({ summary: 'Descargar archivo de un activo patrimonial' })
  @ApiParam({
    name: 'idActivo',
    description: 'ID del activo patrimonial (bigint)',
  })
  @Get('activos-patrimoniales/:idActivo/descargar')
  async descargarActivoPatrimonial(
    @Param('idActivo') idActivo: string,
    @Res() res: Response
  ) {
    const archivo = await this.service.descargarActivoPatrimonial(idActivo)
    res.set('Content-Type', 'application/octet-stream')
    res.send(archivo)
  }

  @ApiOperation({ summary: 'Eliminar activo patrimonial por ID' })
  @ApiParam({
    name: 'idActivo',
    description: 'ID del activo patrimonial (bigint)',
  })
  @Delete('activos-patrimoniales/:idActivo')
  async eliminarActivoPatrimonial(@Param('idActivo') idActivo: string) {
    await this.service.eliminarActivoPatrimonial(idActivo)
    return this.successDelete()
  }

  // ==================== OVISE ====================

  @ApiOperation({
    summary: 'Registrar reporte OVISE del blanco',
    description:
      'Enviar como multipart/form-data. Campo de archivo opcional: archivo.',
  })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @ApiConsumes('multipart/form-data')
  @Post('blancos/:idBlanco/ovise')
  @UseInterceptors(FileInterceptor('archivo'))
  async crearOvise(
    @Param('idBlanco') idBlanco: string,
    @Body() dto: CreateOviseDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const { id: idUsuario = '' } = req.user as PassportUser
    const ovise = await this.service.crearOvise(
      idBlanco,
      dto,
      idUsuario,
      file?.buffer
    )
    return this.successCreate(ovise)
  }

  @ApiOperation({ summary: 'Listar reportes OVISE de un blanco' })
  @ApiParam({ name: 'idBlanco', description: 'ID del blanco' })
  @Get('blancos/:idBlanco/ovise')
  async listarOvise(@Param('idBlanco') idBlanco: string) {
    return this.successList(await this.service.listarOvise(idBlanco))
  }

  @ApiOperation({ summary: 'Descargar archivo de un reporte OVISE' })
  @ApiParam({ name: 'idOvise', description: 'ID del reporte OVISE (bigint)' })
  @Get('ovise/:idOvise/descargar')
  async descargarOvise(
    @Param('idOvise') idOvise: string,
    @Res() res: Response
  ) {
    const archivo = await this.service.descargarOvise(idOvise)
    res.set('Content-Type', 'application/octet-stream')
    res.send(archivo)
  }

  @ApiOperation({ summary: 'Eliminar reporte OVISE por ID' })
  @ApiParam({ name: 'idOvise', description: 'ID del reporte OVISE (bigint)' })
  @Delete('ovise/:idOvise')
  async eliminarOvise(@Param('idOvise') idOvise: string) {
    await this.service.eliminarOvise(idOvise)
    return this.successDelete()
  }
}
