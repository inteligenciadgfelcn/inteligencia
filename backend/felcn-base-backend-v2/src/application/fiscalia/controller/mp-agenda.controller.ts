import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FiscaliaExceptionFilter } from '../filter/fiscalia-exception.filter'
import { EventoRecepcionInterceptor } from '../interceptor/evento-recepcion.interceptor'
import { MpAgendaService } from '../service/mp-agenda.service'
import { ActualizarAgendaDto, CrearAgendaDto } from '../dto/agenda.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpAgendaController
 * Agenda de audiencias enviada por el MP (3.19 / 3.16b + 3.20 unificados).
 */
@ApiTags('MP → POL: Agenda de audiencias')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpAgendaController {
  constructor(private readonly mpAgendaService: MpAgendaService) {}

  @ApiOperation({ summary: 'Registrar evento de agenda del caso (3.19)' })
  @ApiParam({ name: 'pol_caso_id', example: 1 })
  @ApiResponse({ status: 201, description: '{ pol_agenda_id }' })
  @Post('casos/:pol_caso_id/agendas')
  async crearAgenda(
    @Param('pol_caso_id') polCasoId: string,
    @Body() dto: CrearAgendaDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { pol_agenda_id, creado } = await this.mpAgendaService.crearAgenda(
      polCasoId,
      dto
    )

    if (creado) {
      res
        .status(HttpStatus.CREATED)
        .location(`${req.originalUrl}/${pol_agenda_id}`)
    } else {
      res.status(HttpStatus.OK)
    }
    return { pol_agenda_id }
  }

  @ApiOperation({
    summary: 'Actualizar evento de agenda (3.16b / 3.20 unificados)',
  })
  @ApiParam({ name: 'pol_agenda_id', example: 1 })
  @ApiResponse({ status: 204, description: 'Agenda actualizada' })
  @Patch('agendas/:pol_agenda_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async actualizarAgenda(
    @Param('pol_agenda_id') polAgendaId: string,
    @Body() dto: ActualizarAgendaDto
  ): Promise<void> {
    await this.mpAgendaService.actualizarAgenda(polAgendaId, dto)
  }
}
