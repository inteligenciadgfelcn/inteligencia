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

import { DepartamentosService } from './departamentos.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Paramétricas - Departamentos')
@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly service: DepartamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un departamento' })
  @ApiResponse({ status: 201, description: 'Departamento creado correctamente' })
  create(@Body() dto: CreateDepartamentoDto, @Req() req: any) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar departamentos con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los departamentos (sin paginación)' })
  findAllGeneral() {
    return this.service.findAllGeneral();
  }

  @Get('all/pais')
  @ApiOperation({ summary: 'Listado simple de departamentos (para combos)' })
  @ApiQuery({ name: 'idPais', required: false })
  findAllSimple(
    @Query('idPais') idPais?: number,
  ) {
    return this.service.findAllPais(
      idPais ? Number(idPais) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un departamento por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un departamento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartamentoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un departamento (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}