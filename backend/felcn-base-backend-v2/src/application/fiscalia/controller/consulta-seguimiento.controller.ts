import { Controller, Get, Param, Query, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { ConsultaSeguimientoService } from '../service/consulta-seguimiento.service'
import { PaginacionQueryDto } from '@/common/dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador ConsultaSeguimientoController
 * API de consulta para la Fiscalía: seguimiento jurídico de casos anidado
 * completo (fiscales, jurisdicciones, control jurisdiccional, archivos,
 * bienes con sus hitos legales, personas con su situación/etapa procesal).
 * Solo lectura.
 */
@ApiTags('POL → MP: Consulta de seguimientos')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class ConsultaSeguimientoController {
  constructor(private readonly service: ConsultaSeguimientoService) {}

  @ApiOperation({ summary: 'Listado paginado de seguimientos (solo cabecera)' })
  @Get('seguimientos')
  async listar(@Query() paginacion: PaginacionQueryDto) {
    return this.service.listar(paginacion)
  }

  @ApiOperation({ summary: 'Detalle anidado completo de un seguimiento por cud' })
  @ApiParam({ name: 'cud', example: '123456789' })
  @Get('seguimientos/:cud')
  async buscarPorCud(@Param('cud') cud: string) {
    return this.service.buscarPorCud(cud)
  }
}
