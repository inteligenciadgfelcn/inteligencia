import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { MpActividadService } from '../service/mp-actividad.service'
import { CrearActividadesDto } from '../dto/actividad.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpActividadController
 * Actividades / actos investigativos del caso enviados por el MP (3.15).
 */
@ApiTags('MP → POL: Actividades')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpActividadController {
  constructor(private readonly mpActividadService: MpActividadService) {}

  @ApiOperation({ summary: 'Registrar actividades del caso (3.15)' })
  @ApiParam({ name: 'pol_caso_id', example: 1 })
  @ApiResponse({
    status: 201,
    description: 'Mapeo mp_caso_actividad_id → pol_caso_actividad_id',
  })
  @Post('casos/:pol_caso_id/actividades')
  async crearActividades(
    @Param('pol_caso_id') polCasoId: string,
    @Body() dto: CrearActividadesDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { actividades, algunoCreado } =
      await this.mpActividadService.crearActividades(polCasoId, dto)
    res.status(algunoCreado ? HttpStatus.CREATED : HttpStatus.OK)
    return { actividades }
  }
}
