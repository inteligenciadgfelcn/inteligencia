import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CreateGradoDto } from './dto/create-grado.dto';
import { UpdateGradoDto } from './dto/update-grado.dto';
import { Grado } from './entities/grado.entity';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { GradosService } from './grados.service';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Grados de estudio')
@Controller('grados')
export class GradosController {
  constructor(private readonly gradosService: GradosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grado' })
  @ApiResponse({ status: 201, description: 'Grado creado correctamente' })
  create(@Body() createGradoDto: CreateGradoDto): Promise<Grado> {
    return this.gradosService.create(createGradoDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiOperation({ summary: 'Listar grados con paginación' })
  @ApiResponse({ status: 200, description: 'Listado paginado de grados' })
  findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginationResult<Grado>> {
    return this.gradosService.findAll(pagination);
  }

  @Get('lista')
  @ApiOperation({ summary: 'Listar todos los grados activos (sin paginación)' })
  @ApiResponse({ status: 200, description: 'Lista simple de grados activos' })
  findAllActivos(): Promise<Grado[]> {
    return this.gradosService.findAllGeneral();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un grado por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Grado encontrado' })
  @ApiResponse({ status: 404, description: 'Grado no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Grado> {
    return this.gradosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un grado' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Grado actualizado correctamente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGradoDto: UpdateGradoDto,
  ): Promise<Grado> {
    return this.gradosService.update(id, updateGradoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (lógicamente) un grado' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Grado eliminado correctamente' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.gradosService.remove(id);
  }
}
