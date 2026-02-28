import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { AsignacionService } from '../service/asignacion.service'
import {
  CrearAsignacionDto,
  ActualizarAsignacionDto,
  FiltrosAsignacionDto,
} from '../dto'

// TODO: Reactivar guards para producción
// import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
// import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, CasbinGuard)

/**
 * Controlador de Asignaciones de Casos
 * Base de datos: felcn_asignacion_caso
 * Tabla: asignacion
 * Implementa funcionalidad de FRM-OP-ING.aspx.cs
 */
@ApiTags('Asignaciones (ASIG-CASOS)')
@Controller('asignaciones')
export class AsignacionController extends BaseController {
  constructor(private readonly asignacionService: AsignacionService) {
    super()
  }

  @ApiOperation({ summary: 'Listar asignaciones con filtros' })
  @Get()
  async listar(@Query() filtros: FiltrosAsignacionDto) {
    const resultado = await this.asignacionService.listar(filtros)
    return this.successListRows(resultado)
  }

  @ApiOperation({ summary: 'Obtener asignación por ID' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const asignacion = await this.asignacionService.buscarPorId(id)
    return this.successList(asignacion)
  }

  @ApiOperation({
    summary: 'Obtener asignaciones por usuario (muestraoperativos)',
  })
  @Get('usuario/:usuarioLogin')
  async buscarPorUsuario(@Param('usuarioLogin') usuarioLogin: string) {
    const asignaciones =
      await this.asignacionService.buscarPorUsuarioLogin(usuarioLogin)
    return this.successList(asignaciones)
  }

  @ApiOperation({
    summary: 'Obtener casos no aprobados por usuario (muestranoaprob)',
    description: 'Retorna asignaciones donde numero_caso está vacío',
  })
  @Get('usuario/:usuarioLogin/no-aprobados')
  async buscarNoAprobadosPorUsuario(
    @Param('usuarioLogin') usuarioLogin: string
  ) {
    const asignaciones =
      await this.asignacionService.buscarNoAprobadosPorUsuario(usuarioLogin)
    return this.successList(asignaciones)
  }

  @ApiOperation({ summary: 'Buscar asignación por número de caso' })
  @Get('numero-caso/:numeroCaso')
  async buscarPorNumeroCaso(@Param('numeroCaso') numeroCaso: string) {
    const asignacion =
      await this.asignacionService.buscarPorNumeroCaso(numeroCaso)
    return this.successList(asignacion)
  }

  @ApiOperation({ summary: 'Buscar asignación por número de operativo' })
  @Get('numero-operativo/:numeroOperativo')
  async buscarPorNumeroOperativo(
    @Param('numeroOperativo') numeroOperativo: string
  ) {
    const asignacion =
      await this.asignacionService.buscarPorNumeroOperativo(numeroOperativo)
    return this.successList(asignacion)
  }

  @ApiOperation({ summary: 'Crear nueva asignación' })
  @Post()
  async crear(@Body() dto: CrearAsignacionDto) {
    const usuarioLogin = 'SISTEMA' // TODO: Obtener del JWT cuando se reactive auth
    const asignacion = await this.asignacionService.crear(dto, usuarioLogin)
    return this.successCreate(asignacion)
  }

  @ApiOperation({ summary: 'Actualizar asignación' })
  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAsignacionDto
  ) {
    const asignacion = await this.asignacionService.actualizar(id, dto)
    return this.successUpdate(asignacion)
  }

  @ApiOperation({ summary: 'Eliminar asignación' })
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    await this.asignacionService.eliminar(id)
    return this.successDelete({ id })
  }
}
