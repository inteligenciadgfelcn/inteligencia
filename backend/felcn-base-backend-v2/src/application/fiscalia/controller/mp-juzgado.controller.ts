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
import { MpJuzgadoService } from '../service/mp-juzgado.service'
import {
  ActualizarJuzgadoCasoDto,
  ActualizarJuzgadoSujetosDto,
} from '../dto/juzgado.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpJuzgadoController
 * Asignación de juzgado a caso y a sujetos (3.17 / 3.18). POST porque cada
 * llamada agrega un nuevo registro al historial (el vigente es el más
 * reciente); el id de caso/sujetos viaja en el body, no en la URL.
 */
@ApiTags('MP → POL: Juzgados')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpJuzgadoController {
  constructor(private readonly mpJuzgadoService: MpJuzgadoService) {}

  @ApiOperation({ summary: 'Actualizar juzgado del caso (3.17)' })
  @ApiResponse({ status: 201, description: 'Juzgado del caso actualizado' })
  @Post('casos/juzgado')
  @HttpCode(HttpStatus.CREATED)
  async actualizarJuzgadoCaso(
    @Body() dto: ActualizarJuzgadoCasoDto
  ): Promise<void> {
    await this.mpJuzgadoService.actualizarJuzgadoCaso(dto)
  }

  @ApiOperation({ summary: 'Actualizar juzgado de sujetos (3.18)' })
  @ApiResponse({ status: 201, description: 'Juzgado de sujetos actualizado' })
  @Post('sujetos/juzgado')
  @HttpCode(HttpStatus.CREATED)
  async actualizarJuzgadoSujetos(
    @Body() dto: ActualizarJuzgadoSujetosDto
  ): Promise<void> {
    await this.mpJuzgadoService.actualizarJuzgadoSujetos(dto)
  }
}
