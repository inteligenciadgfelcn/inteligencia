import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { CruzadasService } from './cruzados.service'
import { ConsultaAvanzadaQueryDto } from './interfaces/consulta-avanzada-filtro.interface'

/**
 * Controlador CruzadasController
 * Expone los 8 endpoints de búsqueda cruzada de operativos SIII.
 * Origen: SEG-CAS-04.aspx.cs — formulario de consultas cruzadas.
 *
 * Todos los endpoints devuelven un arreglo de resultados que coincide con la interfaz ResultadoCruzada.
 * Las fechas se reciben en formato YYYY-MM-DD y se convierten a rango horario completo en el repositorio.
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Reportes Cruzadas (SIII)')
@Controller('reportes/cruzadas')
export class CruzadasController extends BaseController {
  constructor(private readonly cruzadasService: CruzadasService) {
    super()
  }

  /**
   * Búsqueda avanzada con 42 filtros todos opcionales.
   * Consulta unificada que reemplaza los 8 botones del formulario SEG-CAS-04.aspx.cs.
   */
  @ApiOperation({
    summary: 'Búsqueda avanzada de operativos (todos los filtros opcionales)',
    description:
      'Acepta hasta 42 query params opcionales. Cuando un parámetro no se envía ' +
      'el filtro correspondiente se ignora. Devuelve operativos con todas sus ' +
      'subentidades (drogas, personas, bienes, sustancias, laboratorios).',
  })
  @Get('avanzado')
  async avanzado(@Query() filtro: ConsultaAvanzadaQueryDto) {
    const result = await this.cruzadasService.buscarAvanzado(filtro)
    return this.successList(result)
  }

  /**
   * Busca operativos por rango de fechas.
   * Origen: btnfecha_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por rango de fechas',
    description:
      'Retorna todos los operativos cuya fecha_operativo está entre fechaInicio y fechaFin (inclusive). ' +
      'Equivale a btnfecha_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-fecha')
  async porFecha(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const result = await this.cruzadasService.buscarPorFecha(fechaInicio, fechaFin)
    return this.successList(result)
  }

  /**
   * Busca operativos por número de caso.
   * Origen: btncaso_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por número de caso',
    description:
      'Búsqueda parcial (ILIKE) sobre numero_caso de la tabla asignacion. ' +
      'Equivale a btncaso_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'numeroCaso', required: true, example: 'FELCN-2024-001', description: 'Número de caso (parcial)' })
  @Get('por-caso')
  async porCaso(@Query('numeroCaso') numeroCaso: string) {
    const result = await this.cruzadasService.buscarPorCaso(numeroCaso)
    return this.successList(result)
  }

  /**
   * Busca operativos por tipo de droga en un rango de fechas.
   * Origen: tntipodroga_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por tipo de droga',
    description:
      'Filtra por tipo de droga (a través de estado_droga.id_tipo_droga) en un rango de fechas. ' +
      'Equivale a tntipodroga_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'idTipoDroga', required: true, example: 1, description: 'ID del tipo de droga (parametricas.tipo_droga)' })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-tipo-droga')
  async porTipoDroga(
    @Query('idTipoDroga') idTipoDroga: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const result = await this.cruzadasService.buscarPorTipoDroga(+idTipoDroga, fechaInicio, fechaFin)
    return this.successList(result)
  }

  /**
   * Busca operativos por estado de droga en un rango de fechas.
   * Origen: btnestadroga_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por estado de droga',
    description:
      'Filtra por id_estado_droga en public.droga en un rango de fechas. ' +
      'Equivale a btnestadroga_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'idEstadoDroga', required: true, example: 2, description: 'ID del estado de droga (public.estado_droga)' })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-estado-droga')
  async porEstadoDroga(
    @Query('idEstadoDroga') idEstadoDroga: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const result = await this.cruzadasService.buscarPorEstadoDroga(+idEstadoDroga, fechaInicio, fechaFin)
    return this.successList(result)
  }

  /**
   * Busca operativos por tipo de operación en un rango de fechas.
   * Origen: btntipooper_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por tipo de operativo',
    description:
      'Filtra por id_tipo_operacion en public.operativo en un rango de fechas. ' +
      'Equivale a btntipooper_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'idTipoOperacion', required: true, example: 3, description: 'ID del tipo de operación (parametricas.tipo_operacion)' })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-tipo-operativo')
  async porTipoOperativo(
    @Query('idTipoOperacion') idTipoOperacion: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const result = await this.cruzadasService.buscarPorTipoOperativo(+idTipoOperacion, fechaInicio, fechaFin)
    return this.successList(result)
  }

  /**
   * Busca operativos por tipo de relevancia en un rango de fechas.
   * Origen: btnrelev_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por tipo de relevancia',
    description:
      'Filtra por id_tipo_relevancia en public.operativo en un rango de fechas. ' +
      'Equivale a btnrelev_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'idTipoRelevancia', required: true, example: 1, description: 'ID del tipo de relevancia (parametricas.tipo_relevancia)' })
  @ApiQuery({ name: 'fechaInicio', required: true, example: '2024-01-01', description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: true, example: '2024-12-31', description: 'Fecha fin (YYYY-MM-DD)' })
  @Get('por-relevancia')
  async porRelevancia(
    @Query('idTipoRelevancia') idTipoRelevancia: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const result = await this.cruzadasService.buscarPorRelevancia(+idTipoRelevancia, fechaInicio, fechaFin)
    return this.successList(result)
  }

  /**
   * Busca operativos por nombre de persona aprehendida (detenida).
   * Todos los parámetros son opcionales pero al menos uno debe tener valor.
   * Origen: btnaprehen_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por persona aprehendida (detenida)',
    description:
      'Búsqueda parcial (ILIKE) sobre public.persona_auxiliar. Al menos un campo debe tener valor. ' +
      'DETENIDOSAUX en el sistema legacy corresponde a public.persona_auxiliar en el nuevo esquema. ' +
      'Equivale a btnaprehen_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'nombres', required: false, example: 'Juan', description: 'Nombres (parcial)' })
  @ApiQuery({ name: 'apellidoPaterno', required: false, example: 'Perez', description: 'Apellido paterno (parcial)' })
  @ApiQuery({ name: 'apellidoMaterno', required: false, example: 'Lopez', description: 'Apellido materno (parcial)' })
  @ApiQuery({ name: 'apellidoEsposo', required: false, example: '', description: 'Apellido de esposo/a (parcial)' })
  @Get('por-aprehendido')
  async porAprehendido(
    @Query('nombres') nombres = '',
    @Query('apellidoPaterno') apellidoPaterno = '',
    @Query('apellidoMaterno') apellidoMaterno = '',
    @Query('apellidoEsposo') apellidoEsposo = '',
  ) {
    const result = await this.cruzadasService.buscarPorAprehendido(
      nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo,
    )
    return this.successList(result)
  }

  /**
   * Busca operativos por nombre de persona arrestada.
   * Todos los parámetros son opcionales pero al menos uno debe tener valor.
   * Origen: btnarrestado_Click — SEG-CAS-04.aspx.cs
   */
  @ApiOperation({
    summary: 'Buscar operativos por persona arrestada',
    description:
      'Búsqueda parcial (ILIKE) sobre public.arrestado_auxiliar. Al menos un campo debe tener valor. ' +
      'Equivale a btnarrestado_Click de SEG-CAS-04.aspx.cs.',
  })
  @ApiQuery({ name: 'nombres', required: false, example: 'Maria', description: 'Nombres (parcial)' })
  @ApiQuery({ name: 'apellidoPaterno', required: false, example: 'Gomez', description: 'Apellido paterno (parcial)' })
  @ApiQuery({ name: 'apellidoMaterno', required: false, example: 'Rios', description: 'Apellido materno (parcial)' })
  @ApiQuery({ name: 'apellidoEsposo', required: false, example: '', description: 'Apellido de esposo/a (parcial)' })
  @Get('por-arrestado')
  async porArrestado(
    @Query('nombres') nombres = '',
    @Query('apellidoPaterno') apellidoPaterno = '',
    @Query('apellidoMaterno') apellidoMaterno = '',
    @Query('apellidoEsposo') apellidoEsposo = '',
  ) {
    const result = await this.cruzadasService.buscarPorArrestado(
      nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo,
    )
    return this.successList(result)
  }
}
