import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { MpReservaService } from '../service/mp-reserva.service'
import { CrearReservaDto } from '../dto/reserva.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpReservaController
 * Reserva de caso / sujeto / actividad enviada por el MP (3.16).
 */
@ApiTags('MP → POL: Reservas')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpReservaController {
  constructor(private readonly mpReservaService: MpReservaService) {}

  @ApiOperation({
    summary: 'Registrar reserva de caso, sujeto o actividad (3.16)',
  })
  @ApiResponse({ status: 201, description: '{ pol_reserva_id }' })
  @Post('reservas')
  @HttpCode(HttpStatus.CREATED)
  async crearReserva(@Body() dto: CrearReservaDto) {
    return await this.mpReservaService.crearReserva(dto)
  }
}
