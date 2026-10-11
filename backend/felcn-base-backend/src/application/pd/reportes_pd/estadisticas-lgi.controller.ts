import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/common/base/base-controller'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { EstadisticasLgiService } from './service/estadisticas_lgi.service'

/**
 * Controlador de estadísticas LGI.
 *
 * Reportes de Estado del Caso, Operativos y Bienes Secuestrados.
 * Todos los endpoints comparten los filtros:
 *   - Rango de fechas (fechaInicio, fechaFin)
 *   - Gestión/año alternativo (gestion) que sobreescribe el rango
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('LGI - Reportes Estadísticos')
@Controller('reportes-lgi/estadisticas')
export class EstadisticasLgiController extends BaseController {
  constructor(
    private readonly estadisticasService: EstadisticasLgiService,
  ) {
    super()
  }

  @Get('estado-caso')
  @ApiOperation({
    summary: 'Reporte de estado del caso',
    description:
      'Casos iniciados, con informe conclusivo, con sentencia, rechazados, ' +
      'APD, etapas (Preliminar/Preparatoria/Juicio) y tiempo transcurrido, ' +
      'con desglose mensual, por unidad, distrito y estado del ciclo.',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026, description: 'Sobreescribe fechaInicio/fechaFin' })
  async estadoCaso(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenEstadoCaso(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }

  @Get('operativos')
  @ApiOperation({
    summary: 'Reporte de operativos LGI',
    description:
      'Operativos/actuaciones del módulo LGI clasificados por tipo de informe ' +
      '(Allanamientos = Ejecución de Allanamiento, Trabajo de Campo, etc.) con ' +
      'serie mensual y desglose por etapa, estado y unidad.',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026 })
  async operativos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenOperativos(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }

  @Get('bienes')
  @ApiOperation({
    summary: 'Reporte de bienes secuestrados',
    description:
      'Bienes secuestrados agregados por categoría (Muebles/Inmuebles/Dineros/Otros) ' +
      'con detalle por catálogo, cantidades, costos y serie mensual.',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026 })
  async bienes(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenBienes(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }

  @Get('situacion-legal')
  @ApiOperation({
    summary: 'Reporte de situación legal de bienes',
    description:
      'Bienes por situación legal (Secuestrado, Incautado, Confiscado/Decomisado, ' +
      'Entrega a DIRCABI y Devolución) con cantidades, costos y serie mensual.',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026 })
  async situacionLegal(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenSituacionLegal(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }

  @Get('personas-investigadas')
  @ApiOperation({
    summary: 'Reporte de personas investigadas LGI',
    description:
      'Personas investigadas por su situación jurídica vigente (investigado, imputado, ' +
      'acusado, rechazado, sobreseído, absuelto, condenado) con serie mensual.',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026 })
  async personasInvestigadas(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenPersonasInvestigadas(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }

  @Get('personas-juridicas')
  @ApiOperation({
    summary: 'Reporte de personas jurídicas',
    description:
      'Empresas por tipo de sociedad (deducido de la razón social), situación jurídica, ' +
      'vínculo, empresas investigadas vs intervenidas, beneficiarios finales y serie mensual.',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026 })
  async personasJuridicas(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenPersonasJuridicas(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }

  @Get('otros-datos')
  @ApiOperation({
    summary: 'Reporte de otros datos LGI',
    description:
      'Tipologías identificadas, verbos rectores y etapas/ciclo de LGI registrados en los ' +
      'operativos (texto libre normalizado por frecuencia).',
  })
  @ApiQuery({ name: 'fechaInicio', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'fechaFin', required: false, example: '2026-12-31' })
  @ApiQuery({ name: 'gestion', required: false, example: 2026 })
  async otrosDatos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('gestion') gestion?: string,
  ) {
    const result = await this.estadisticasService.resumenOtrosDatos(
      fechaInicio,
      fechaFin,
      gestion ? Number(gestion) : undefined,
    )
    return this.success(result)
  }
}