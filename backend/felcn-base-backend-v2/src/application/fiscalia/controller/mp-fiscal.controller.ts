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
import { MpFiscalService } from '../service/mp-fiscal.service'
import { ActualizarFiscalDto, CrearFiscalesDto } from '../dto/fiscal.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpFiscalController
 * Fiscales del caso enviados por el MP (3.13 / 3.14 — "investigadores"
 * en el documento del convenio).
 */
@ApiTags('MP → POL: Fiscales')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpFiscalController {
  constructor(private readonly mpFiscalService: MpFiscalService) {}

  @ApiOperation({ summary: 'Registrar fiscales del caso (3.13)' })
  @ApiParam({ name: 'pol_caso_id', example: 1 })
  @ApiResponse({
    status: 201,
    description: 'Mapeo mp_caso_funcionario_id → pol_caso_funcionario_id',
  })
  @Post('casos/:pol_caso_id/fiscales')
  async crearFiscales(
    @Param('pol_caso_id') polCasoId: string,
    @Body() dto: CrearFiscalesDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { fiscales, algunoCreado } = await this.mpFiscalService.crearFiscales(
      polCasoId,
      dto
    )
    res.status(algunoCreado ? HttpStatus.CREATED : HttpStatus.OK)
    return { fiscales }
  }

  @ApiOperation({ summary: 'Actualizar un fiscal del caso (3.14)' })
  @ApiParam({ name: 'pol_caso_funcionario_id', example: 1 })
  @ApiResponse({ status: 204, description: 'Fiscal actualizado' })
  @Patch('fiscales/:pol_caso_funcionario_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async actualizarFiscal(
    @Param('pol_caso_funcionario_id') polCasoFuncionarioId: string,
    @Body() dto: ActualizarFiscalDto
  ): Promise<void> {
    await this.mpFiscalService.actualizarFiscal(polCasoFuncionarioId, dto)
  }
}
