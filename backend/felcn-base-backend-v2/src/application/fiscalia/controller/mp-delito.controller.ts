import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { MpDelitoService } from '../service/mp-delito.service'
import { ActualizarDelitoDto, CrearDelitosDto } from '../dto/delito.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpDelitoController
 * Delitos del caso enviados por el MP (3.3–3.6): cubre delito inicial y
 * principal con el mismo recurso.
 */
@ApiTags('MP → POL: Delitos')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpDelitoController {
  constructor(private readonly mpDelitoService: MpDelitoService) {}

  @ApiOperation({ summary: 'Registrar delitos del caso (3.3 / 3.5)' })
  @ApiParam({ name: 'pol_caso_id', example: 1 })
  @ApiResponse({
    status: 201,
    description: 'Mapeo mp_caso_delito_id → pol_caso_delito_id',
  })
  @Post('casos/:pol_caso_id/delitos')
  async crearDelitos(
    @Param('pol_caso_id') polCasoId: string,
    @Body() dto: CrearDelitosDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { delitos, algunoCreado } = await this.mpDelitoService.crearDelitos(
      polCasoId,
      dto
    )
    res.status(algunoCreado ? HttpStatus.CREATED : HttpStatus.OK)
    return { delitos }
  }

  @ApiOperation({ summary: 'Actualizar un delito del caso (3.4 / 3.6)' })
  @ApiParam({ name: 'pol_caso_delito_id', example: 1 })
  @ApiResponse({ status: 204, description: 'Delito actualizado' })
  @Patch('delitos/:pol_caso_delito_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async actualizarDelito(
    @Param('pol_caso_delito_id') polCasoDelitoId: string,
    @Body() dto: ActualizarDelitoDto
  ): Promise<void> {
    await this.mpDelitoService.actualizarDelito(polCasoDelitoId, dto)
  }
}
