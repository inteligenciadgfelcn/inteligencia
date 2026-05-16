import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { BienesService } from '../service/bienes.service'
import {
  CreateBienSecuestradoDto,
  CreateBienIncautadoDto,
  CreateBienConfiscadoDto,
  CreatePerdidaDominioDto,
  CreateSituacionBienDto,
} from '../dto/bienes.dto'

/**
 * Controlador BienesController
 * Expone los endpoints para el seguimiento jurídico de bienes secuestrados (SIII).
 * Cubre: listado de bienes por operativo, secuestro, incautación, confiscación,
 * pérdida de dominio, situación/entrega y gestión de archivos documentales.
 * Origen: FRM-JUR-03.aspx.cs
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Bienes - Seguimiento Jurídico (SIII)')
@Controller('bienes')
export class BienesController extends BaseController {
  constructor(private readonly service: BienesService) {
    super()
  }

  // ==================== BIENES DEL OPERATIVO ====================

  @ApiOperation({ summary: 'Listar ítems de bien de un operativo con sus características' })
  @Get('operativo/:idOperativo')
  async listarBienesPorOperativo(@Param('idOperativo') idOperativo: string) {
    const datos = await this.service.listarBienesPorOperativo(idOperativo)
    return this.successList(datos)
  }

  // ==================== BIEN SECUESTRADO ====================

  @ApiOperation({ summary: 'Listar registros de secuestro de un ítem de bien' })
  @Get(':idItemBien/secuestrado')
  async listarBienSecuestrado(@Param('idItemBien') idItemBien: string) {
    const datos = await this.service.listarBienSecuestrado(idItemBien)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Registrar acto de secuestro de un ítem de bien' })
  @Post(':idItemBien/secuestrado')
  async registrarBienSecuestrado(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateBienSecuestradoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.registrarBienSecuestrado(idItemBien, dto, numeroPase)
    return this.successCreate(nuevo)
  }

  // ==================== BIEN INCAUTADO ====================

  @ApiOperation({ summary: 'Listar registros de incautación de un ítem de bien' })
  @Get(':idItemBien/incautado')
  async listarBienIncautado(@Param('idItemBien') idItemBien: string) {
    const datos = await this.service.listarBienIncautado(idItemBien)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Registrar incautación de un ítem de bien' })
  @Post(':idItemBien/incautado')
  async registrarBienIncautado(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateBienIncautadoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.registrarBienIncautado(idItemBien, dto, numeroPase)
    return this.successCreate(nuevo)
  }

  // ==================== BIEN CONFISCADO ====================

  @ApiOperation({ summary: 'Listar registros de confiscación de un ítem de bien' })
  @Get(':idItemBien/confiscado')
  async listarBienConfiscado(@Param('idItemBien') idItemBien: string) {
    const datos = await this.service.listarBienConfiscado(idItemBien)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Registrar confiscación de un ítem de bien mediante sentencia judicial' })
  @Post(':idItemBien/confiscado')
  async registrarBienConfiscado(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateBienConfiscadoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.registrarBienConfiscado(idItemBien, dto, numeroPase)
    return this.successCreate(nuevo)
  }

  // ==================== PERDIDA DE DOMINIO ====================

  @ApiOperation({ summary: 'Listar registros de pérdida de dominio de un ítem de bien' })
  @Get(':idItemBien/perdida-dominio')
  async listarPerdidaDominio(@Param('idItemBien') idItemBien: string) {
    const datos = await this.service.listarPerdidaDominio(idItemBien)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Registrar proceso de pérdida de dominio de un ítem de bien' })
  @Post(':idItemBien/perdida-dominio')
  async registrarPerdidaDominio(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreatePerdidaDominioDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.registrarPerdidaDominio(idItemBien, dto, numeroPase)
    return this.successCreate(nuevo)
  }

  // ==================== SITUACION DEL BIEN ====================

  @ApiOperation({ summary: 'Listar historial de situación y entregas de un ítem de bien' })
  @Get(':idItemBien/situacion')
  async listarSituacionBien(@Param('idItemBien') idItemBien: string) {
    const datos = await this.service.listarSituacionBien(idItemBien)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Registrar situación y entrega de un ítem de bien' })
  @Post(':idItemBien/situacion')
  async registrarSituacionBien(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateSituacionBienDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.registrarSituacionBien(idItemBien, dto, numeroPase)
    return this.successCreate(nuevo)
  }

  // ==================== ARCHIVOS DOCUMENTALES ====================

  @ApiOperation({ summary: 'Listar metadatos de archivos adjuntos de un caso (sección bienes)' })
  @Get('caso/:idCaso/archivos')
  async listarArchivosBien(@Param('idCaso') idCaso: string) {
    const datos = await this.service.listarArchivosBien(idCaso)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Subir archivo adjunto a un caso (sección bienes)' })
  @Post('caso/:idCaso/archivos')
  @UseInterceptors(FileInterceptor('file'))
  async subirArchivoBien(
    @Param('idCaso') idCaso: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('idContenidoBien') idContenidoBien: string,
    @Body('tipo') tipo: string,
    @Body('nombre') nombre: string
  ) {
    const nuevo = await this.service.subirArchivoBien(
      idCaso,
      idContenidoBien,
      tipo,
      nombre,
      file.originalname,
      file.buffer
    )
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Descargar archivo adjunto de la sección de bienes' })
  @Get('archivo/:idArchivo/descargar')
  async descargarArchivoBien(@Param('idArchivo') idArchivo: string, @Res() res: Response) {
    const archivo = await this.service.descargarArchivoBien(idArchivo)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename=${archivo.nombreArchivo}`)
    res.send(archivo.data)
  }

  @ApiOperation({ summary: 'Eliminar archivo adjunto de la sección de bienes' })
  @Delete('archivo/:idArchivo')
  async eliminarArchivoBien(@Param('idArchivo') idArchivo: string) {
    await this.service.eliminarArchivoBien(idArchivo)
    return this.successDelete(null)
  }
}
