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
import { ContinenteService } from './continente.service'
import { CreateContinenteDto } from './dto/create-continente.dto'
import { UpdateContinenteDto } from './dto/update-continente.dto'
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
@ApiTags('SII - Continentes')
@Controller('continente')
export class ContinenteController extends BaseController {
  constructor(private readonly continenteService: ContinenteService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un continente' })
  @ApiResponse({ status: 201, description: 'Continente creado correctamente' })
  create(@Body() dto: CreateContinenteDto) {
    return this.continenteService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'listar distrital con paginación' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.continenteService.findAllPaginado(pagination)
    return this.successListRows(result)
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos las continentes (sin paginación)' })
  findAllGeneral() {
    return this.continenteService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un continente por ID' })
  findOne(@Param('id') id: number) {
    return this.continenteService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un continente' })
  update(@Param('id') id: number, @Body() dto: UpdateContinenteDto) {
    return this.continenteService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un continente' })
  remove(@Param('id') id: number) {
    return this.continenteService.remove(id)
  }
}
