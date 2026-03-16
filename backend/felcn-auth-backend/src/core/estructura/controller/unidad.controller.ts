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
import { UnidadService } from '../service/unidad.service'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { BaseController } from '@/common/base'
import { Request } from 'express'
import { CrearUnidadDto, ActualizarUnidadDto } from '../dto/unidad.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Unidades')
@ApiBearerAuth()
@Controller('unidades')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UnidadController extends BaseController {
  constructor(private unidadServicio: UnidadService) {
    super()
  }

  @ApiOperation({ summary: 'Listado paginado de todas las unidades' })
  @Get()
  async listar() {
    const result = await this.unidadServicio.listarTodos()
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'Crear nueva unidad organizacional' })
  @ApiBody({ type: CrearUnidadDto })
  @Post()
  async crear(@Req() req: Request, @Body() dto: CrearUnidadDto) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadServicio.crear(dto, usuarioAuditoria)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'Actualizar unidad' })
  @ApiBody({ type: ActualizarUnidadDto })
  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() dto: ActualizarUnidadDto
  ) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadServicio.actualizar(id, dto, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Activar unidad' })
  @Patch(':id/activacion')
  async activar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadServicio.activar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'Inactivar unidad' })
  @Patch(':id/inactivacion')
  async inactivar(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const usuarioAuditoria = this.getUser(req)
    const result = await this.unidadServicio.inactivar(id, usuarioAuditoria)
    return this.successUpdate(result)
  }
}
