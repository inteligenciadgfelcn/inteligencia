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
import { BienService } from '../service/bien.service'
import { CreateBienInvestigadoDto, CreateBienCaracteristicaDto } from '../dto'
import { CreateLugarSigDto } from '../../blanco/dto/create-lugar-sig.dto'
import { CreateArchivoDto } from '../../blanco/dto/create-archivo.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Bienes S2I (Bienes Investigados)')
@Controller('s2i')
export class BienController extends BaseController {
  constructor(private readonly service: BienService) {
    super()
  }

  // ==================== BIENES INVESTIGADOS ====================

  @ApiOperation({
    summary: 'Crear bien investigado para un caso',
    description: 'Replica RegBienes.InsertBienes de FRM_ING_ENT3.',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Post('casos/:idCaso/bienes')
  async crear(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateBienInvestigadoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const bien = await this.service.crear(idCaso, dto, numeroPase)
    return this.successCreate(bien)
  }

  @ApiOperation({ summary: 'Listar bienes investigados de un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Get('casos/:idCaso/bienes')
  async listarPorCaso(@Param('idCaso') idCaso: string) {
    return this.successList(await this.service.listarPorCaso(idCaso))
  }

  @ApiOperation({ summary: 'Obtener bien investigado por ID' })
  @ApiParam({
    name: 'idItemBien',
    description: 'ID del bien investigado (bigint)',
  })
  @Get('bienes/:idItemBien')
  async buscarPorId(@Param('idItemBien') idItemBien: string) {
    const bien = await this.service.buscarPorId(idItemBien)
    return this.successList(bien)
  }

  @ApiOperation({ summary: 'Eliminar bien investigado por ID' })
  @ApiParam({
    name: 'idItemBien',
    description: 'ID del bien investigado (bigint)',
  })
  @Delete('bienes/:idItemBien')
  async eliminar(@Param('idItemBien') idItemBien: string) {
    await this.service.eliminar(idItemBien)
    return this.successDelete()
  }

  // ==================== CARACTERÍSTICAS ====================

  @ApiOperation({
    summary: 'Agregar característica al bien investigado',
    description: 'Replica RegBienes.InsertCaracteristicas de FRM_ING_ENT3.',
  })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @Post('bienes/:idItemBien/caracteristicas')
  async crearCaracteristica(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateBienCaracteristicaDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const caracteristica = await this.service.crearCaracteristica(
      idItemBien,
      dto,
      numeroPase
    )
    return this.successCreate(caracteristica)
  }

  @ApiOperation({ summary: 'Listar características de un bien investigado' })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @Get('bienes/:idItemBien/caracteristicas')
  async listarCaracteristicas(@Param('idItemBien') idItemBien: string) {
    return this.successList(
      await this.service.listarCaracteristicas(idItemBien)
    )
  }

  @ApiOperation({
    summary:
      'Listar características disponibles para un bien (según su tipo de catálogo)',
    description:
      'Filtra por la clase del tipo de bien registrado. Usado para poblar el dropdown de características.',
  })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @Get('bienes/:idItemBien/caracteristicas-disponibles')
  async listarCaracteristicasDisponibles(
    @Param('idItemBien') idItemBien: string
  ) {
    return this.successList(
      await this.service.listarCaracteristicasDisponibles(idItemBien)
    )
  }

  @ApiOperation({ summary: 'Eliminar característica de bien por ID' })
  @ApiParam({
    name: 'idCaracteristica',
    description: 'ID de la característica (int)',
  })
  @Delete('caracteristicas-bien/:idCaracteristica')
  async eliminarCaracteristica(
    @Param('idCaracteristica') idCaracteristica: string
  ) {
    await this.service.eliminarCaracteristica(parseInt(idCaracteristica))
    return this.successDelete()
  }

  // ==================== SIG ====================

  @ApiOperation({
    summary: 'Agregar lugar SIG a un bien investigado',
    description: 'Replica RegBienes.InsertSig de FRM_ING_ENT3.',
  })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @Post('bienes/:idItemBien/lugares-sig')
  async crearLugar(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateLugarSigDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const lugar = await this.service.crearLugar(idItemBien, dto, numeroPase)
    return this.successCreate(lugar)
  }

  @ApiOperation({ summary: 'Listar lugares SIG de un bien investigado' })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @Get('bienes/:idItemBien/lugares-sig')
  async listarLugares(@Param('idItemBien') idItemBien: string) {
    return this.successList(await this.service.listarLugares(idItemBien))
  }

  @ApiOperation({ summary: 'Eliminar lugar SIG de bien por ID' })
  @ApiParam({ name: 'idLugar', description: 'ID del lugar (bigint)' })
  @Delete('lugares-sig-bien/:idLugar')
  async eliminarLugar(@Param('idLugar') idLugar: string) {
    await this.service.eliminarLugar(idLugar)
    return this.successDelete()
  }

  // ==================== ARCHIVOS ====================

  @ApiOperation({
    summary: 'Subir archivo adjunto a un bien investigado',
    description: 'Enviar como multipart/form-data. Campo de archivo: archivo.',
  })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @ApiConsumes('multipart/form-data')
  @Post('bienes/:idItemBien/archivos')
  @UseInterceptors(FileInterceptor('archivo'))
  async subirArchivo(
    @Param('idItemBien') idItemBien: string,
    @Body() dto: CreateArchivoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const data = file?.buffer || Buffer.alloc(0)
    const nombreArchivo = file?.originalname || dto.nombre
    const resultado = await this.service.subirArchivo(
      idItemBien,
      dto,
      nombreArchivo,
      data,
      numeroPase
    )
    return this.successCreate(resultado)
  }

  @ApiOperation({ summary: 'Listar archivos adjuntos de un bien investigado' })
  @ApiParam({ name: 'idItemBien', description: 'ID del bien investigado' })
  @Get('bienes/:idItemBien/archivos')
  async listarArchivos(@Param('idItemBien') idItemBien: string) {
    return this.successList(await this.service.listarArchivos(idItemBien))
  }

  @ApiOperation({ summary: 'Descargar archivo adjunto de bien investigado' })
  @ApiParam({ name: 'idArchivo', description: 'ID del archivo (bigint)' })
  @Get('archivos-bien/:idArchivo/descargar')
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

  @ApiOperation({
    summary: 'Eliminar archivo adjunto de bien investigado por ID',
  })
  @ApiParam({ name: 'idArchivo', description: 'ID del archivo (bigint)' })
  @Delete('archivos-bien/:idArchivo')
  async eliminarArchivo(@Param('idArchivo') idArchivo: string) {
    await this.service.eliminarArchivo(idArchivo)
    return this.successDelete()
  }
}
