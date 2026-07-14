import { Controller, Get, Param, Query, UseFilters, UseInterceptors } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { ConsultaOperativoService } from '../service/consulta-operativo.service'
import { PaginacionQueryDto } from '@/common/dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador ConsultaOperativoController
 * API de consulta para la Fiscalía: operativos anidados completos
 * (drogas, sustancias, fábricas, personas auxiliares, bienes, galería)
 * con catálogos resueltos a descripción. Solo lectura.
 */
@ApiTags('POL → MP: Consulta de operativos')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class ConsultaOperativoController {
  constructor(private readonly service: ConsultaOperativoService) {}

  @ApiOperation({ summary: 'Listado paginado de operativos (solo cabecera)' })
  @Get('operativos')
  async listar(@Query() paginacion: PaginacionQueryDto) {
    return this.service.listar(paginacion)
  }

  @ApiOperation({ summary: 'Detalle anidado completo de un operativo por cud' })
  @ApiParam({ name: 'cud', example: '123456789' })
  @Get('operativos/:cud')
  async buscarPorCud(@Param('cud') cud: string) {
    return this.service.buscarPorCud(cud)
  }
}
