import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
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
} from '@nestjs/swagger'
import { CreateServicioDto } from './dto/create-servicio.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { BaseController } from '@/common/base'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('ASIG. CASO - Servicio')
@Controller('servicio')
export class ServicioController extends BaseController {
  constructor(private readonly servicioService: ServicioService) {
    super()
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

  @Get()
  @ApiOperation({ summary: 'Listar distritales con paginación' })
  async findAllPaginado(pagination: PaginacionQueryDto) {
    const result = await this.servicioService.findAllPaginado(pagination)
    return this.successListRows(result)
  }
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
