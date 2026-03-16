import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { GradoService } from '../service/grado.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { BaseController } from '@/common/base'
import { Request } from 'express'
import { CrearGradoDto, ActualizarGradoDto } from '../dto/grado.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Grados')
@ApiBearerAuth()
@Controller('grados')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class GradoController extends BaseController {
  constructor(private gradoServicio: GradoService) {
    super()
  }

  @ApiOperation({ summary: 'Listado paginado de todos los grados' })
  @Get()
  async listar() {
    const result = await this.gradoServicio.listarTodos()
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'Crear nuevo grado' })
  @ApiBody({ type: CrearGradoDto })
  @Post()
  async crear(@Req() req: Request, @Body() dto: CrearGradoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.gradoServicio.crear(dto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'Actualizar grado' })
  @ApiBody({ type: ActualizarGradoDto })
  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() dto: ActualizarGradoDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.gradoServicio.actualizar(id, dto, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Activar grado' })
  @Patch(':id/activacion')
  async activar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.gradoServicio.activar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Inactivar grado' })
  @Patch(':id/inactivacion')
  async inactivar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.gradoServicio.inactivar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
