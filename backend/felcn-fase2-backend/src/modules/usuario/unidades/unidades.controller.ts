import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UnidadesService } from './unidades.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CreateUnidadDto } from './dto/create-unidade.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Unidades')
@Controller('unidades')
export class UnidadesController {
  constructor(private readonly service: UnidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una unidad' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateUnidadDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar unidades con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos las unidades (sin paginación)' })
  findAllGeneral() {
    return this.service.findAllGeneral();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una unidad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una unidad por ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateUnidadDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una unidad (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
