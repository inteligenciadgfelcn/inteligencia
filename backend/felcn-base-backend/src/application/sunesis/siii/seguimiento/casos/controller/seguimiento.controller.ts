import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  Res,
  Req,
  UseGuards,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { SeguimientoService } from '../service/seguimiento.service'
import {
  CreateFiscalDto,
  CreateJurisdiccionDto,
  CreateControlJurisdiccionalDto,
  CreateServidorPolicialDto,
  UpdateMetadatosCasoDto,
  CreateInvestigadorDto,
} from '../dto/seguimiento.dto'

/**
 * Controlador SeguimientoController
 * Expone los endpoints para el seguimiento jurídico de casos (SIII).
 * Origen: FRM-JUR-01.aspx.cs
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Seguimiento de Casos (SIII)')
@Controller('seguimiento')
export class SeguimientoController extends BaseController {
  constructor(private readonly service: SeguimientoService) {
    super()
  }

  @ApiOperation({ summary: 'Obtener detalle de seguimiento de un caso' })
  @Get('detalle/:idCaso')
  async obtenerDetalle(@Param('idCaso') idCaso: string) {
    const datos = await this.service.obtenerDetalleSeguimiento(idCaso)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Actualizar metadatos del caso (CUD, PerDom, Etapa e Informe)' })
  @Patch('metadatos/:idCaso/:idOperativo')
  async actualizarMetadatos(
    @Param('idCaso') idCaso: string,
    @Param('idOperativo') idOperativo: string,
    @Body() dto: UpdateMetadatosCasoDto
  ) {
    await this.service.actualizarMetadatosCaso(idCaso, idOperativo, dto)
    return this.successUpdate(null)
  }

  @ApiOperation({ summary: 'Agregar fiscal al caso' })
  @Post('fiscal/:idCaso')
  async agregarFiscal(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateFiscalDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    // Convertimos fecha string a Date para cumplir con la entidad
    const nuevo = await this.service.agregarFiscal(
      idCaso,
      { ...dto, fecha: new Date(dto.fecha) },
      numeroPase
    )
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Agregar jurisdicción al caso' })
  @Post('jurisdiccion/:idCaso')
  async agregarJurisdiccion(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateJurisdiccionDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.agregarJurisdiccion(
      idCaso,
      { ...dto, fecha: new Date(dto.fecha) },
      numeroPase
    )
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Agregar control jurisdiccional al caso' })
  @Post('control-jurisdiccional/:idCaso')
  async agregarControlJurisdiccional(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateControlJurisdiccionalDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.agregarControlJurisdiccional(
      idCaso,
      { ...dto, fecha: new Date(dto.fecha) },
      numeroPase
    )
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Agregar investigador al caso' })
  @Post('investigador/:idCaso')
  async agregarInvestigador(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateInvestigadorDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.agregarInvestigador(
      idCaso,
      { ...dto, fecha: new Date(dto.fecha) },
      numeroPase
    )
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Listar servidores policiales de un operativo' })
  @Get('servidor-policial/:idOperativo')
  async listarServidores(@Param('idOperativo') idOperativo: string) {
    const datos = await this.service.listarServidoresPoliciales(idOperativo)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Agregar servidor policial al operativo' })
  @Post('servidor-policial/:idOperativo')
  async agregarServidor(
    @Param('idOperativo') idOperativo: string,
    @Body() dto: CreateServidorPolicialDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.agregarServidorPolicial(idOperativo, dto, numeroPase)
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Subir archivo al caso' })
  @Post('archivo/:idCaso')
  @UseInterceptors(FileInterceptor('file'))
  async subirArchivo(
    @Param('idCaso') idCaso: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('idContenidoCaso') idContenidoCaso: string,
    @Body('tipo') tipo: string,
    @Body('nombre') nombre: string
  ) {
    const nuevo = await this.service.subirArchivo(idCaso, {
      idContenidoCaso,
      tipo,
      nombre,
      nombreArchivo: file.originalname,
      data: file.buffer,
    })
    return this.successCreate(nuevo)
  }

  @ApiOperation({ summary: 'Descargar archivo' })
  @Get('archivo/descargar/:idArchivo')
  async descargarArchivo(@Param('idArchivo') idArchivo: string, @Res() res: Response) {
    const archivo = await this.service.descargarArchivo(idArchivo)
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename=${archivo.nombreArchivo}`)
    res.send(archivo.data)
  }

  @ApiOperation({ summary: 'Eliminar archivo' })
  @Delete('archivo/:idArchivo')
  async eliminarArchivo(@Param('idArchivo') idArchivo: string) {
    await this.service.eliminarArchivo(idArchivo)
    return this.successDelete(null)
  }
}
