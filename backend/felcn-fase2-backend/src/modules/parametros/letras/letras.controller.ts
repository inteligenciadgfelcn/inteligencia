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

import { LetrasService } from './letras.service';
import { CreateLetraDto } from './dto/create-letra.dto';
import { UpdateLetraDto } from './dto/update-letra.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Usuario - Letras')
@Controller('letras')
export class LetrasController {
  constructor(private readonly service: LetrasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear letra' })
  @ApiResponse({ status: 201, description: 'Letra creada correctamente' })
  create(@Body() dto: CreateLetraDto,@Req() req: any) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar letras con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAllPaginado(pagination);
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todas las letras activas' })
  findAllGeneral() {
    return this.service.findAllGeneral();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener letra por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar letra' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLetraDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar letra (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}