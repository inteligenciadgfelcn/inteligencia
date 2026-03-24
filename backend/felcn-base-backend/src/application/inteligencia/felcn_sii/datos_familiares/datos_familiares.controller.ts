import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { DatosFamiliaresService } from './datos_familiares.service'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger'
import { CreateDatosFamiliaresDto } from './dto/create-datos_familiare.dto'
import { UpdateDatosFamiliaresDto } from './dto/update-datos_familiare.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SII - Datos Familiares')
@Controller('datos-familiares')
export class DatosFamiliaresController extends BaseController {
  constructor(private readonly datosFamiliaresService: DatosFamiliaresService) {
    super()
  }

  @Post()
  @ApiOperation({ summary: 'Crear un familiar' })
  @ApiResponse({ status: 201, description: 'Familiar creado correctamente' })
  create(@Body() dto: CreateDatosFamiliaresDto) {
    return this.datosFamiliaresService.create(dto)
  }

  @Get('detenido')
  @ApiOperation({ summary: 'Listado de familiares por detenido' })
  @ApiQuery({ name: 'idDetenido', required: true })
  findByDetenido(@Query('idDetenido') idDetenido: number) {
    return this.datosFamiliaresService.findByDetenido(idDetenido)
  }

  @Get()
  @ApiOperation({ summary: 'Listar familiares con paginación' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.datosFamiliaresService.findAll(pagination)
    return this.successListRows(result)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un familiar por ID' })
  findOne(@Param('id') id: number) {
    return this.datosFamiliaresService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un familiar' })
  update(@Param('id') id: number, @Body() dto: UpdateDatosFamiliaresDto) {
    return this.datosFamiliaresService.update(id, dto)
  }
}
