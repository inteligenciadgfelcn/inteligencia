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
import { OrganizacionService } from '../service/organizacion.service'
import { CreateOrganizacionDto } from '../dto/create-organizacion.dto'
import { CreateLugarGisDto } from '../../blanco/dto/create-lugar-gis.dto'
import { CreateArchivoDto } from '../../blanco/dto/create-archivo.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Organizaciones S2I (Empresas Investigadas)')
@Controller('s2i')
export class OrganizacionController extends BaseController {
  constructor(private readonly service: OrganizacionService) {
    super()
  }

  // ==================== ORGANIZACIONES ====================

  @ApiOperation({
    summary: 'Crear organización investigada para un caso',
    description:
      'Replica RegOrganizacion.InsertOrganizacion de FRM_ING_ENT2. Aplica toUpperCase en nombre, NIT, matrícula y representante.',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Post('casos/:idCaso/organizaciones')
  async crear(
    @Param('idCaso') idCaso: string,
    @Body() dto: CreateOrganizacionDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const empresa = await this.service.crear(idCaso, dto, numeroPase)
    return this.successCreate(empresa)
  }

  @ApiOperation({ summary: 'Listar organizaciones de un caso' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso' })
  @Get('casos/:idCaso/organizaciones')
  async listarPorCaso(@Param('idCaso') idCaso: string) {
    return this.successList(await this.service.listarPorCaso(idCaso))
  }

  @ApiOperation({ summary: 'Eliminar organización por ID' })
  @ApiParam({
    name: 'idEmpresa',
    description: 'ID de la organización (bigint)',
  })
  @Delete('organizaciones/:idEmpresa')
  async eliminar(@Param('idEmpresa') idEmpresa: string) {
    await this.service.eliminar(idEmpresa)
    return this.successDelete()
  }

  // ==================== GIS ====================

  @ApiOperation({
    summary: 'Agregar lugar GIS a una organización',
    description: 'Replica RegOrganizacion.InsertGis de FRM_ING_ENT2.',
  })
  @ApiParam({ name: 'idEmpresa', description: 'ID de la organización' })
  @Post('organizaciones/:idEmpresa/lugares-gis')
  async crearLugar(
    @Param('idEmpresa') idEmpresa: string,
    @Body() dto: CreateLugarGisDto
  ) {
    const lugar = await this.service.crearLugar(idEmpresa, dto)
    return this.successCreate(lugar)
  }

  @ApiOperation({ summary: 'Listar lugares GIS de una organización' })
  @ApiParam({ name: 'idEmpresa', description: 'ID de la organización' })
  @Get('organizaciones/:idEmpresa/lugares-gis')
  async listarLugares(@Param('idEmpresa') idEmpresa: string) {
    return this.successList(await this.service.listarLugares(idEmpresa))
  }

  @ApiOperation({ summary: 'Eliminar lugar GIS de organización por ID' })
  @ApiParam({ name: 'idLugar', description: 'ID del lugar (bigint)' })
  @Delete('lugares-gis-empresa/:idLugar')
  async eliminarLugar(@Param('idLugar') idLugar: string) {
    await this.service.eliminarLugar(idLugar)
    return this.successDelete()
  }

  // ==================== ARCHIVOS ====================

  @ApiOperation({
    summary: 'Subir archivo adjunto a una organización',
    description: 'Enviar como multipart/form-data. Campo de archivo: archivo.',
  })
  @ApiParam({ name: 'idEmpresa', description: 'ID de la organización' })
  @ApiConsumes('multipart/form-data')
  @Post('organizaciones/:idEmpresa/archivos')
  @UseInterceptors(FileInterceptor('archivo'))
  async subirArchivo(
    @Param('idEmpresa') idEmpresa: string,
    @Body() dto: CreateArchivoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = file?.buffer || Buffer.alloc(0)
    const nombreArchivo = file?.originalname || dto.nombre
    const resultado = await this.service.subirArchivo(
      idEmpresa,
      dto,
      nombreArchivo,
      data
    )
    return this.successCreate(resultado)
  }

  @ApiOperation({ summary: 'Listar archivos adjuntos de una organización' })
  @ApiParam({ name: 'idEmpresa', description: 'ID de la organización' })
  @Get('organizaciones/:idEmpresa/archivos')
  async listarArchivos(@Param('idEmpresa') idEmpresa: string) {
    return this.successList(await this.service.listarArchivos(idEmpresa))
  }

  @ApiOperation({ summary: 'Descargar archivo adjunto de organización' })
  @ApiParam({ name: 'idArchivo', description: 'ID del archivo (bigint)' })
  @Get('archivos-organizacion/:idArchivo/descargar')
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

  @ApiOperation({ summary: 'Eliminar archivo adjunto de organización por ID' })
  @ApiParam({ name: 'idArchivo', description: 'ID del archivo (bigint)' })
  @Delete('archivos-organizacion/:idArchivo')
  async eliminarArchivo(@Param('idArchivo') idArchivo: string) {
    await this.service.eliminarArchivo(idArchivo)
    return this.successDelete()
  }
}
