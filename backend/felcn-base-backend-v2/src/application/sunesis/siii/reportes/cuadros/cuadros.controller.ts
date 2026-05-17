import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { CuadrosService } from './cuadros.service'

/**
 * Controlador CuadrosController
 * Expone los 5 endpoints del reporte de cuadros de operativos SIII.
 * Origen: ReporteServicio.aspx.cs — página de reporte por CodServicio.
 *
 * Cada endpoint retorna un RespuestaCuadro con:
 *   - filas        Grid principal (MuestraResultados / GridView1)
 *   - resumen      Totales estadísticos consolidados (todos los NumXxx)
 *   - fabricas     Fábricas agrupadas por tipo (listaFabricas / DGFP)
 *   - coordenadas  Operativos con coordenadas GPS (operativos / gvresultados)
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reportes Cuadros (SIII)')
@Controller('reportes/cuadros')
export class CuadrosController extends BaseController {
  constructor(private readonly cuadrosService: CuadrosService) {
    super()
  }

  /**
   * Reporte por código de servicio.
   * Equivale al filtro original de ReporteServicio.aspx.cs:
   * Request.QueryString["id"] → WHERE CodServicio = '...'
   */
  @ApiOperation({
    summary: 'Reporte de cuadro por código de servicio',
    description:
      'Retorna el reporte completo (filas, resumen estadístico, fábricas y coordenadas) ' +
      'para el código de servicio indicado. ' +
      'Equivale al parámetro id de ReporteServicio.aspx.cs: WHERE a.codigo_servicio ILIKE %codServicio%.',
  })
  @ApiQuery({ name: 'codServicio', required: true, example: 'SRV-2024-001', description: 'Código de servicio (parcial)' })
  @Get('por-servicio')
  async porServicio(@Query('codServicio') codServicio: string) {
    const result = await this.cuadrosService.buscarPorServicio(codServicio)
    return this.success(result)
  }

  /**
   * Reporte por rango de fechas.
   * Análogo a btnfecha_Click de SEG-CAS-04.aspx.cs.
   */
  @ApiOperation({
    summary: 'Reporte de cuadro por rango de fechas',
    description:
      'Retorna el reporte completo de operativos cuya fecha_operativo está entre ' +
      'fechaInicio y fechaFin (inclusive). ' +
      'Análogo a btnfecha_Click de cruzadas.',
  })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin',    required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-fecha')
  async porFecha(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin')    fechaFin:    string,
  ) {
    const result = await this.cuadrosService.buscarPorFecha(fechaInicio, fechaFin)
    return this.success(result)
  }

  /**
   * Reporte de operativos que contienen drogas del tipo indicado.
   * Análogo a tntipodroga_Click de SEG-CAS-04.aspx.cs.
   */
  @ApiOperation({
    summary: 'Reporte de cuadro por tipo de droga',
    description:
      'Retorna el reporte de operativos que tienen al menos una droga del tipo indicado ' +
      'en el rango de fechas. ' +
      'Análogo a tntipodroga_Click de cruzadas.',
  })
  @ApiQuery({ name: 'idTipoDroga', required: true, example: 1, description: 'ID del tipo de droga (parametricas.tipo_droga)' })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin',    required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-tipo-droga')
  async porTipoDroga(
    @Query('idTipoDroga') idTipoDroga: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin')    fechaFin:    string,
  ) {
    const result = await this.cuadrosService.buscarPorTipoDroga(+idTipoDroga, fechaInicio, fechaFin)
    return this.success(result)
  }

  /**
   * Reporte de operativos por tipo de operación.
   * Análogo a btntipooper_Click de SEG-CAS-04.aspx.cs.
   */
  @ApiOperation({
    summary: 'Reporte de cuadro por tipo de operativo',
    description:
      'Retorna el reporte de operativos del tipo de operación indicado en el rango de fechas. ' +
      'Análogo a btntipooper_Click de cruzadas.',
  })
  @ApiQuery({ name: 'idTipoOperacion', required: true, example: 3, description: 'ID del tipo de operación (parametricas.tipo_operacion)' })
  @ApiQuery({ name: 'fechaInicio',     required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin',        required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-tipo-operativo')
  async porTipoOperativo(
    @Query('idTipoOperacion') idTipoOperacion: string,
    @Query('fechaInicio')     fechaInicio:     string,
    @Query('fechaFin')        fechaFin:        string,
  ) {
    const result = await this.cuadrosService.buscarPorTipoOperativo(+idTipoOperacion, fechaInicio, fechaFin)
    return this.success(result)
  }

  /**
   * Reporte de operativos por tipo de relevancia.
   * Análogo a btnrelev_Click de SEG-CAS-04.aspx.cs.
   */
  @ApiOperation({
    summary: 'Reporte de cuadro por tipo de relevancia',
    description:
      'Retorna el reporte de operativos con el tipo de relevancia indicado en el rango de fechas. ' +
      'Análogo a btnrelev_Click de cruzadas.',
  })
  @ApiQuery({ name: 'idTipoRelevancia', required: true, example: 1, description: 'ID del tipo de relevancia (parametricas.tipo_relevancia)' })
  @ApiQuery({ name: 'fechaInicio',      required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin',         required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-relevancia')
  async porRelevancia(
    @Query('idTipoRelevancia') idTipoRelevancia: string,
    @Query('fechaInicio')      fechaInicio:      string,
    @Query('fechaFin')         fechaFin:         string,
  ) {
    const result = await this.cuadrosService.buscarPorRelevancia(+idTipoRelevancia, fechaInicio, fechaFin)
    return this.success(result)
  }
}
