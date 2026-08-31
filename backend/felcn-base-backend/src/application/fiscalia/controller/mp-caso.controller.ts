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
import { MpCasoService } from '../service/mp-caso.service'
import { ActualizarCasoDto, CrearCasoDto } from '../dto/caso.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpCasoController
 * Endpoints que consume el Ministerio Público para enviar casos (3.1 / 3.2).
 * Abiertos: la seguridad la aplica el hub de interoperabilidad.
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
@ApiTags('MP → POL: Casos')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpCasoController {
  constructor(private readonly mpCasoService: MpCasoService) {}

  @ApiOperation({ summary: 'Registrar un caso enviado por el MP (3.1)' })
  @ApiResponse({ status: 201, description: 'Caso creado: { pol_caso_id }' })
  @ApiResponse({
    status: 200,
    description: 'Reintento idempotente: mp_caso_id ya registrado',
  })
  @Post('casos')
  async crearCaso(
    @Body() dto: CrearCasoDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ pol_caso_id: number }> {
    const { pol_caso_id, creado } = await this.mpCasoService.crearCaso(dto)

    if (creado) {
      res
        .status(HttpStatus.CREATED)
        .location(`${req.originalUrl}/${pol_caso_id}`)
    } else {
      res.status(HttpStatus.OK)
    }

    return { pol_caso_id }
  }

  @ApiOperation({ summary: 'Actualizar un caso enviado por el MP (3.2)' })
  @ApiParam({ name: 'pol_caso_id', example: 1 })
  @ApiResponse({ status: 204, description: 'Caso actualizado' })
  @Patch('casos/:pol_caso_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async actualizarCaso(
    @Param('pol_caso_id') polCasoId: string,
    @Body() dto: ActualizarCasoDto
  ): Promise<void> {
    await this.mpCasoService.actualizarCaso(polCasoId, dto)
  }
}
