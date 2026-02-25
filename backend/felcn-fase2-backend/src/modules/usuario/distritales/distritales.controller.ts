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

import { DistritalesService } from './distritales.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CreateDistritalDto } from './dto/create-distritale.dto';
import { UpdateDistritalDto } from './dto/update-distritale.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Distritales')
@Controller('distritales')
export class DistritalesController {
  constructor(private readonly service: DistritalesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un distrital' })
  @ApiResponse({ status: 201, description: 'Distrital creado correctamente' })
  create(@Body() dto: CreateDistritalDto, @Req() req: any) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar distritales con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los distritales (sin paginación)' })
  findAllGeneral() {
    return this.service.findAllGeneral();
  }

  @Get('all/unidad')
  @ApiOperation({ summary: 'Listado simple de distritales (para combos)' })
  @ApiQuery({ name: 'idUnidad', required: false })
  findAllSimple(@Query('idUnidad') idUnidad?: number) {
    return this.service.findAllUnidad(idUnidad ? Number(idUnidad) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un distrital por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un distrital' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDistritalDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un distrital (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
