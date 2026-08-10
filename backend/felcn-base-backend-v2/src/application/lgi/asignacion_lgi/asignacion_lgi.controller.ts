import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common'
import { AsignacionLgiService } from './asignacion_lgi.service'
import { CreateAsignacionLgiDto } from './dto/create-asignacion_lgi.dto'
import { UpdateAsignacionLgiDto } from './dto/update-asignacion_lgi.dto'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base/base-controller'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { CrearNumeroCasoDto } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/dto/create_numeroCaso.dto'
import { AsignacionesService } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/asignaciones.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Asignación')
@Controller('asignacion-lgi')
export class AsignacionLgiController extends BaseController {
  constructor(
    private readonly asignacionLgiService: AsignacionLgiService,
    private readonly service: AsignacionesService
  ) {
    super()
  }

  @Post()
  create(@Body() createAsignacionLgiDto: CreateAsignacionLgiDto) {
    return this.asignacionLgiService.create(createAsignacionLgiDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar asignaciones con paginación' })
  async findAll(@Query() pagination: PaginacionQueryDto) {
    const result = await this.asignacionLgiService.findAllPaginado(pagination)
    return this.successListRows(result)
  }

  @Post('generar-numero')
    @ApiOperation({ summary: 'Generar número de caso' })
    generar(@Body() dto: CrearNumeroCasoDto) {
      return this.service.generarNumeroCaso(dto.codigoDepartamento, dto.letra)
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionLgiService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAsignacionLgiDto: UpdateAsignacionLgiDto
  ) {
    return this.asignacionLgiService.update(+id, updateAsignacionLgiDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignacionLgiService.remove(+id)
  }
}
