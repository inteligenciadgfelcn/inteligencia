import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AsignacionesIngresoService } from '../service/asignaciones-ingreso.service'
import { BuscarIngresoDto } from '../dto/buscar-ingreso.dto'

/**
 * Controlador AsignacionesIngresoController
 * Expone los endpoints de listado de asignaciones por estado de ingreso de operativo.
 * Origen: FRM-INF-ING.aspx.cs
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Seguimiento - Ingreso de Asignaciones (SIII)')
@Controller('asignaciones-ingreso')
export class AsignacionesIngresoController extends BaseController {
  constructor(private readonly service: AsignacionesIngresoService) {
    super()
  }

  @ApiOperation({
    summary: 'Listar asignaciones SIN operativo ingresado (Gridcasosing)',
    description: 'Equivale a muestraoperativos() de FRM-INF-ING.aspx.cs. Filtra por distrital y retorna casos cuyo operativo no tiene descripción registrada.',
  })
  @Get('sin-registrar')
  async sinRegistrar(@Query() dto: BuscarIngresoDto) {
    const result = await this.service.listarSinRegistrar(dto)
    return this.successListRows(result)
  }

  @ApiOperation({
    summary: 'Buscar asignaciones ingresadas por número de caso (Gridcasosact)',
    description: 'Equivale a muestraoperativosnumero() de FRM-INF-ING.aspx.cs. Requiere nroCaso.',
  })
  @Get('por-numero')
  async porNumero(@Query() dto: BuscarIngresoDto) {
    const result = await this.service.listarRegistradosPorNumero(dto)
    return this.successListRows(result)
  }

  @ApiOperation({
    summary: 'Buscar asignaciones ingresadas por nombre de caso (Gridcasosact)',
    description: 'Equivale a muestraoperativosnnombres() de FRM-INF-ING.aspx.cs. Requiere nombreCaso.',
  })
  @Get('por-nombre')
  async porNombre(@Query() dto: BuscarIngresoDto) {
    const result = await this.service.listarRegistradosPorNombre(dto)
    return this.successListRows(result)
  }

  @ApiOperation({
    summary: 'Buscar asignaciones ingresadas por rango de fecha (Gridcasosact)',
    description: 'Equivale a muestraoperativosfechas() de FRM-INF-ING.aspx.cs. Requiere desde y hasta (ISO 8601).',
  })
  @Get('por-fecha')
  async porFecha(@Query() dto: BuscarIngresoDto) {
    const result = await this.service.listarRegistradosPorFecha(dto)
    return this.successListRows(result)
  }
}
