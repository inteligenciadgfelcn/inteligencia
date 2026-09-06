import { BaseController } from '@/common/base'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import {
  UseGuards,
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateSituacionJuridicaEmpresaDto } from './dto/create-situacion_jurica_empresa.dto'
import { SituacionJuridicaEmpresaService } from './situacion_jurica_empresa.service'

@ApiBearerAuth()
@UseInterceptors(AuditoriaUsuarioInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Situación jurídica de empresas')
@Controller('situacion-juridica-empresa')
export class SituacionJuridicaEmpresaController extends BaseController {
  constructor(private readonly service: SituacionJuridicaEmpresaService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar situación jurídica de una empresa',
  })
  @UseInterceptors(AuditoriaUsuarioInterceptor)
  create(
    @Body()
    dto: CreateSituacionJuridicaEmpresaDto
  ) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar situaciones jurídicas de empresas',
  })
  findAll() {
    return this.service.findAll()
  }

  @Get('tipos')
  @ApiOperation({
    summary: 'Listar tipos de situación jurídica',
  })
  findTipos() {
    return this.service.findTipos()
  }

  @Get('empresa/:idEmpresa')
  @ApiOperation({
    summary: 'Listar situaciones jurídicas de una empresa',
  })
  findByEmpresa(
    @Param('idEmpresa', ParseIntPipe)
    idEmpresa: number
  ) {
    return this.service.findByEmpresa(idEmpresa)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener situación jurídica por ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar situación jurídica de una empresa',
  })
  @UseInterceptors(AuditoriaUsuarioInterceptor)
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: CreateSituacionJuridicaEmpresaDto
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar situación jurídica de una empresa',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.remove(id)
  }
}
