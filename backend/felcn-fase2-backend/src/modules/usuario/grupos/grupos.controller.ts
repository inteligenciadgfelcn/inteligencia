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
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Grupos')
@Controller('grupos')
export class GruposController {
  constructor(private readonly service: GruposService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un grupo' })
  @ApiResponse({ status: 201, description: 'Grupo creado correctamente' })
  create(@Body() dto: CreateGrupoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar grupos con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }

  @Get('all/distrito')
  @ApiOperation({ summary: 'Listado simple de grupos por distrito' })
  @ApiQuery({ name: 'idDistrito', required: false })
  findAllSimple(@Query('idDistrito') idDistrito?: number) {
    return this.service.findAllDistrito(idDistrito ? Number(idDistrito) : undefined);
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los grupos (sin paginación)' })
  findAllGeneral() {
    return this.service.findAllGeneral();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un grupo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un grupo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGrupoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un grupo (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
