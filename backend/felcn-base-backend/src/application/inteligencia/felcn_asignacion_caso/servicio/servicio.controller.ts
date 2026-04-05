import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { ServicioService } from './servicio.service'
import { UpdateServicioDto } from './dto/update-servicio.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { CreateServicioDto } from './dto/create-servicio.dto'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('ASIG. CASO - Servicio')
@Controller('servicio')
export class ServicioController extends BaseController {
  constructor(private readonly servicioService: ServicioService) {
    super()
  }

  @Get('generar-codigo-servicio')
  @ApiOperation({
    summary: 'Generar codigo de servicio operativo (solo para vista)',
  })
  @ApiQuery({
    name: 'fechaIngreso',
    type: String,
    example: '2026-03-05 13:30:00',
  })
  @ApiQuery({
    name: 'fechaSalida',
    type: String,
    example: '2026-03-05 18:00:00',
  })
  generarCodigo(
    @Query('fechaIngreso') fechaIngreso: string,
    @Query('fechaSalida') fechaSalida: string
  ) {
    const ingreso = new Date(fechaIngreso.replace(' ', 'T'))
    const salida = new Date(fechaSalida.replace(' ', 'T'))

    return this.servicioService.generarCodigoServicio(ingreso, salida)
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio' })
  @ApiResponse({ status: 201, description: 'Servicios creado correctamente' })
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.servicioService.create(createServicioDto)
  }

  @Get('verificar/:usuario')
  @ApiOperation({ summary: 'Verificar si un usuario tiene servicio activo' })
  @ApiParam({
    name: 'usuario',
    description: 'Usuario principal o de emergencia',
  })
  @ApiResponse({ status: 200, description: 'Estado del servicio obtenido' })
  verificarServicio(@Param('usuario') usuario: string) {
    return this.servicioService.verificarServicio(usuario)
  }

  // @Get()
  // @ApiOperation({ summary: 'Listar servicios con paginación' })
  // async findAllPaginado(@Query() pagination: PaginacionQueryDto) {
  //   const result = await this.servicioService.findAllPaginado(pagination)
  //   return this.successListRows(result)
  // }

  @Get('info/:codigoServicio')
  @ApiOperation({ summary: 'Obtener información de un servicio' })
  @ApiParam({ name: 'codigoServicio', description: 'Código del servicio' })
  infoServicio(@Param('codigoServicio') codigoServicio: string) {
    return this.servicioService.findOne(codigoServicio)
  }

  @Patch(':codigoServicio')
  update(
    @Param('codigoServicio') codigoServicio: string,
    @Body() updateServicioDto: UpdateServicioDto
  ) {
    return this.servicioService.update(codigoServicio, updateServicioDto)
  }
}
