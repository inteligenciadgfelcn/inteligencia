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
import { GradoService } from './grado.service'
import { CreateGradoDto } from './dto/create-grado.dto'
import { UpdateGradoDto } from './dto/update-grado.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Grado } from './entities/grado.entity'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('S2I - Grados')
@Controller('grado')
export class GradoController extends BaseController {
  constructor(private readonly gradoService: GradoService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grado' })
  @ApiResponse({ status: 201, description: 'Grado creado correctamente' })
  create(@Body() createGradoDto: CreateGradoDto) {
    return this.gradoService.create(createGradoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar grados con paginación' })
  @ApiResponse({ status: 200, description: 'Listado paginado de grados' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.gradoService.findAll(pagination)
    return this.successListRows(result)
  }

  @Get('lista')
  @ApiOperation({ summary: 'Listar todos los grados activos (sin paginación)' })
  @ApiResponse({ status: 200, description: 'Lista simple de grados activos' })
  findAllActivos(): Promise<Grado[]> {
    return this.gradoService.findAllGeneral();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un grado por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Grado encontrado' })
  @ApiResponse({ status: 404, description: 'Grado no encontrado' })
  findOne(@Param('id') id: number): Promise<Grado> {
    return this.gradoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un grado' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Grado actualizado correctamente' })
  update(
    @Param('id') id: number,
    @Body() updateGradoDto: UpdateGradoDto,
  ): Promise<Grado> {
    return this.gradoService.update(id, updateGradoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (lógicamente) un grado' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Grado eliminado correctamente' })
  remove(@Param('id' ) id: number): Promise<Grado> {
    return this.gradoService.remove(id);
  }
}
