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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

import { AsignacionesService } from './asignaciones.service';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CreateAsignacionDto } from './dto/create-asignacione.dto';
import { UpdateAsignacionDto } from './dto/update-asignacione.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Operaciones - Asignaciones')
@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly service: AsignacionesService) {}

  @Get('generar-codigo')
  @ApiOperation({
    summary:
      'Generar número de operativo por departamento y grupo (solo para vista)',
  })
  @ApiQuery({ name: 'idDepartamento', type: Number, required: true })
  @ApiQuery({ name: 'idGrupo', type: Number, required: true })
  generarCodigo(
    @Query('idDepartamento', ParseIntPipe) idDepartamento: number,
    @Query('idGrupo', ParseIntPipe) idGrupo: number,
  ) {
    return this.service.generarCodigoRegistro(idDepartamento, idGrupo);
  }

  @Get('buscar-operativo')
  @ApiOperation({ summary: 'Buscar asignación por número de operativo' })
  @ApiQuery({ name: 'codigo', type: String, required: true })
  findByCodigo(@Query('codigo') codigo: string) {
    return this.service.findByCodigoResumen(codigo);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva asignación' })
  create(@Body() dto: CreateAsignacionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asignación' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAsignacionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar asignaciones con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }
}
