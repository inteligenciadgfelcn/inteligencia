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
import { CreateContinenteDto } from './dto/create-continente.dto';
import { ContinentesService } from './continentes.service';
import { UpdateContinenteDto } from './dto/update-continente.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('Paramétricas - Continentes')
@Controller('continentes')
export class ContinentesController {
  constructor(private readonly service: ContinentesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un continente' })
  @ApiResponse({ status: 201, description: 'Continente creado correctamente' })
  create(@Body() dto: CreateContinenteDto, @Req() req: any) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un continente por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un continente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContinenteDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un continente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
