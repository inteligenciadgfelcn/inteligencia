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
import { GrupoService } from '../service/grupo.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { BaseController } from '@/common/base'
import { Request } from 'express'
import { CrearGrupoDto, ActualizarGrupoDto } from '../dto/grupo.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Grupos')
@ApiBearerAuth()
@Controller('grupos')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class GrupoController extends BaseController {
  constructor(private grupoServicio: GrupoService) {
    super()
  }

  @ApiOperation({ summary: 'Listado paginado de todos los grupos' })
  @Get()
  async listar() {
    const result = await this.grupoServicio.listarTodos()
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'Crear nuevo grupo operacional' })
  @ApiBody({ type: CrearGrupoDto })
  @Post()
  async crear(@Req() req: Request, @Body() dto: CrearGrupoDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.grupoServicio.crear(dto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'Actualizar grupo' })
  @ApiBody({ type: ActualizarGrupoDto })
  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() dto: ActualizarGrupoDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.grupoServicio.actualizar(id, dto, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Activar grupo' })
  @Patch(':id/activacion')
  async activar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.grupoServicio.activar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Inactivar grupo' })
  @Patch(':id/inactivacion')
  async inactivar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.grupoServicio.inactivar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
