import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
  Patch,
  Param,
} from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger'

import { AsignacionesService } from './asignaciones.service'
import { CreateAsignacionDto } from './dto/create-asignacione.dto'
import { UpdateAsignacionDto } from './dto/update-asignacione.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Operaciones - Asignaciones')
@Controller('asignaciones')
export class AsignacionesController extends BaseController {
  constructor(private readonly service: AsignacionesService) {
    super()
  }

  @Get('generar-codigo')
  @ApiOperation({
    summary:
      'Generar número de operativo por departamento y grupo (solo para vista)',
  })
  generarCodigo(
    @Query('idDepartamento', ParseIntPipe) idDepartamento: number,
    @Query('idGrupo', ParseIntPipe) idGrupo: number
  ) {
    return this.service.generarCodigoRegistro(idDepartamento, idGrupo)
  }

  @Get('buscar-operativo')
  @ApiOperation({ summary: 'Buscar asignación por número de operativo' })
  @ApiQuery({ name: 'codigo', type: String, required: true })
  findByCodigo(@Query('codigo') codigo: string) {
    return this.service.findByCodigoResumen(codigo)
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva asignación' })
  create(@Body() dto: CreateAsignacionDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asignación' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAsignacionDto
  ) {
    return this.service.update(id, dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar asignaciones con paginación' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.service.findAllPaginado(pagination)
    return this.successListRows(result)
  }
}
