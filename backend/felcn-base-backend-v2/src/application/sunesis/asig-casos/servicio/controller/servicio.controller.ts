import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { ServicioService } from '../service/servicio.service'
import { CrearServicioDto, FiltrosServicioDto } from '../dto'

// TODO: Reactivar guards para producción
// import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
// import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, CasbinGuard)

@ApiTags('Servicios (ASIG-CASOS)')
@Controller('servicios')
export class ServicioController extends BaseController {
  constructor(private readonly servicioService: ServicioService) {
    super()
  }

  @ApiOperation({ summary: 'Listar servicios con filtros' })
  @Get()
  async listar(@Query() filtros: FiltrosServicioDto) {
    const resultado = await this.servicioService.listar(filtros)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Obtener servicio por código' })
  @Get(':codigoServicio')
  async buscarPorCodigo(@Param('codigoServicio') codigoServicio: string) {
    const servicio = await this.servicioService.buscarPorCodigo(codigoServicio)
    return this.successList(servicio)
  }

  @ApiOperation({ summary: 'Obtener servicio activo por usuario' })
  @Get('activo/:usuarioLogin')
  async buscarActivoPorUsuario(@Param('usuarioLogin') usuarioLogin: string) {
    const servicio =
      await this.servicioService.buscarActivoPorUsuario(usuarioLogin)
    return this.successList(servicio)
  }

  @ApiOperation({ summary: 'Verificar si usuario tiene servicio activo' })
  @Get('verificar/:usuarioLogin')
  async verificarServicioActivo(@Param('usuarioLogin') usuarioLogin: string) {
    const tieneServicio =
      await this.servicioService.verificarServicioActivo(usuarioLogin)
    return this.successList({ tieneServicio })
  }

  @ApiOperation({ summary: 'Crear nuevo servicio' })
  @Post()
  async crear(@Body() dto: CrearServicioDto) {
    const servicio = await this.servicioService.crear(dto)
    return this.successCreate(servicio)
  }

  @ApiOperation({ summary: 'Eliminar servicio' })
  @Delete(':codigoServicio')
  async eliminar(@Param('codigoServicio') codigoServicio: string) {
    await this.servicioService.eliminar(codigoServicio)
    return this.successDelete(null)
  }
}
