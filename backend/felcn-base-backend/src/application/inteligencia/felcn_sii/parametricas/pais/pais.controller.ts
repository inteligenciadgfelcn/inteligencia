import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { PaisService } from './pais.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CreatePaisDto } from './dto/create-pais.dto'
import { UpdatePaisDto } from './dto/update-pais.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Países')
@Controller('pais')
export class PaisController extends BaseController {
  constructor(private readonly paisService: PaisService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un país' })
  @ApiResponse({ status: 201, description: 'País creado correctamente' })
  create(@Body() dto: CreatePaisDto) {
    return this.paisService.create(dto)
  }

  @Get('all/continente')
  @ApiOperation({ summary: 'Listado de paises por continente' })
  @ApiQuery({ name: 'idContinente', required: false })
  findAllSimple(@Query('idContinente') idContinente: number) {
    return this.paisService.findAllContinente(
      idContinente);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los países (sin paginación)' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
   const result = await this.paisService.findAll(pagination);
    return this.successListRows(result);
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los países (sin paginación)' })
  findAllGeneral() {
    return this.paisService.findAllGeneral();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un país por ID' })
  findOne(@Param('id') id: number) {
    return this.paisService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un país' })
  update(@Param('id') id: number, @Body() dto: UpdatePaisDto) {
    return this.paisService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un país (borrado lógico)' })
  remove(@Param('id') id: number) {
    return this.paisService.remove(id);
  }
}
