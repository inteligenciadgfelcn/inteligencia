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
import { DistritaService } from '../service/distrital.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { BaseController } from '@/common/base'
import { Request } from 'express'
import { CrearDistritaDto, ActualizarDistritaDto } from '../dto/distrital.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Distritales')
@ApiBearerAuth()
@Controller('distritales')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class DistritaController extends BaseController {
  constructor(private distritaServicio: DistritaService) {
    super()
  }

  @ApiOperation({ summary: 'Listado paginado de todas las distritales' })
  @Get()
  async listar() {
    const result = await this.distritaServicio.listarTodos()
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'Crear nueva distrital' })
  @ApiBody({ type: CrearDistritaDto })
  @Post()
  async crear(@Req() req: Request, @Body() dto: CrearDistritaDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.distritaServicio.crear(dto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'Actualizar distrital' })
  @ApiBody({ type: ActualizarDistritaDto })
  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() dto: ActualizarDistritaDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.distritaServicio.actualizar(id, dto, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Activar distrital' })
  @Patch(':id/activacion')
  async activar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.distritaServicio.activar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Inactivar distrital' })
  @Patch(':id/inactivacion')
  async inactivar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.distritaServicio.inactivar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
