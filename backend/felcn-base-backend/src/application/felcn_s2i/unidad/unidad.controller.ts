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
import { UnidadService } from './unidad.service'
import { CreateUnidadDto } from './dto/create-unidad.dto'
import { UpdateUnidadDto } from './dto/update-unidad.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('S2I - Unidades')
@Controller('unidad')
export class UnidadController extends BaseController {
  constructor(private readonly unidadService: UnidadService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear una unidad' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateUnidadDto) {
    return this.unidadService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'listar distrital con paginación' })
  async findAllPaginado(@Query() Pagination: PaginacionQueryDto) {
    const result = await this.unidadService.findAllPaginado(Pagination)
    return this.successListRows(result)
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos las unidades (sin paginación)' })
  findAllGeneral() {
    return this.unidadService.findAllGeneral()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una unidad por ID' })
  findOne(@Param('id') id: number) {
    return this.unidadService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una unidad por ID' })
  update(@Param('id') id: number, @Body() dto: UpdateUnidadDto) {
    return this.unidadService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una unidad (borrado lógico)' })
  remove(@Param('id') id: number) {
    return this.unidadService.remove(id)
  }
}
