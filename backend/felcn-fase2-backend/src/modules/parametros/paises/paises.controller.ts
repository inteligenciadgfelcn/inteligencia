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

import { PaisesService } from './paises.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CreatePaisDto } from './dto/create-paise.dto';
import { UpdatePaisDto } from './dto/update-paise.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Paramétricas - Países')
@Controller('paises')
export class PaisesController {
  constructor(private readonly service: PaisesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un país' })
  @ApiResponse({ status: 201, description: 'País creado correctamente' })
  create(@Body() dto: CreatePaisDto, @Req() req: any) {
    return this.service.create(dto);
  }

  @Get('all/continente')
  @ApiOperation({ summary: 'Listado de paises por continente' })
  @ApiQuery({ name: 'idContinente', required: false })
  findAllSimple(@Query('idContinente') idContinente?: number) {
    return this.service.findAllContinente(
      idContinente ? Number(idContinente) : undefined,
    );
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los países (sin paginación)' })
  findAllGeneral() {
    return this.service.findAllGeneral();
  }

  @Get()
  @ApiOperation({ summary: 'Listar países con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un país por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un país' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaisDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un país (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
