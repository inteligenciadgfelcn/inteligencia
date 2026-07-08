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
import { MpSujetoService } from '../service/mp-sujeto.service'
import {
  ActualizarAbogadoDto,
  ActualizarSujetoDto,
  CrearAbogadosDto,
  CrearDomicilioDto,
  CrearSituacionesJuridicasDto,
  CrearSujetosDto,
} from '../dto/sujeto.dto'
import { RUTA_FISCALIA } from '../shared/constants'

/**
 * Controlador MpSujetoController
 * Sujetos del caso y sus recursos hijos: abogados, situaciones jurídicas
 * y domicilios (3.7–3.12).
 */
@ApiTags('MP → POL: Sujetos')
@UseFilters(FiscaliaExceptionFilter)
@UseInterceptors(EventoRecepcionInterceptor)
@Controller(RUTA_FISCALIA)
export class MpSujetoController {
  constructor(private readonly mpSujetoService: MpSujetoService) {}

  @ApiOperation({ summary: 'Registrar sujetos del caso (3.7)' })
  @ApiParam({ name: 'pol_caso_id', example: 1 })
  @ApiResponse({
    status: 201,
    description: 'Mapeo mp_caso_persona_id → pol_caso_persona_id',
  })
  @Post('casos/:pol_caso_id/sujetos')
  async crearSujetos(
    @Param('pol_caso_id') polCasoId: string,
    @Body() dto: CrearSujetosDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { sujetos, algunoCreado } = await this.mpSujetoService.crearSujetos(
      polCasoId,
      dto
    )
    res.status(algunoCreado ? HttpStatus.CREATED : HttpStatus.OK)
    return { sujetos }
  }

  @ApiOperation({ summary: 'Actualizar un sujeto del caso (3.8)' })
  @ApiParam({ name: 'pol_caso_persona_id', example: 1 })
  @ApiResponse({ status: 204, description: 'Sujeto actualizado' })
  @Patch('sujetos/:pol_caso_persona_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async actualizarSujeto(
    @Param('pol_caso_persona_id') polCasoPersonaId: string,
    @Body() dto: ActualizarSujetoDto
  ): Promise<void> {
    await this.mpSujetoService.actualizarSujeto(polCasoPersonaId, dto)
  }

  @ApiOperation({ summary: 'Registrar abogados del sujeto (3.9)' })
  @ApiParam({ name: 'pol_caso_persona_id', example: 1 })
  @ApiResponse({
    status: 201,
    description:
      'Mapeo mp_caso_persona_abogado_id → pol_caso_persona_abogado_id',
  })
  @Post('sujetos/:pol_caso_persona_id/abogados')
  async crearAbogados(
    @Param('pol_caso_persona_id') polCasoPersonaId: string,
    @Body() dto: CrearAbogadosDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { abogados, algunoCreado } = await this.mpSujetoService.crearAbogados(
      polCasoPersonaId,
      dto
    )
    res.status(algunoCreado ? HttpStatus.CREATED : HttpStatus.OK)
    return { abogados }
  }

  @ApiOperation({ summary: 'Actualizar un abogado del sujeto (3.10)' })
  @ApiParam({ name: 'pol_caso_persona_abogado_id', example: 1 })
  @ApiResponse({ status: 204, description: 'Abogado actualizado' })
  @Patch('abogados/:pol_caso_persona_abogado_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async actualizarAbogado(
    @Param('pol_caso_persona_abogado_id') polCasoPersonaAbogadoId: string,
    @Body() dto: ActualizarAbogadoDto
  ): Promise<void> {
    await this.mpSujetoService.actualizarAbogado(polCasoPersonaAbogadoId, dto)
  }

  @ApiOperation({
    summary: 'Registrar situaciones jurídicas del sujeto (3.11)',
  })
  @ApiParam({ name: 'pol_caso_persona_id', example: 1 })
  @ApiResponse({
    status: 201,
    description:
      'Mapeo mp_caso_persona_situacion_juridica_id → pol_caso_persona_situacion_juridica_id',
  })
  @Post('sujetos/:pol_caso_persona_id/situaciones-juridicas')
  async crearSituacionesJuridicas(
    @Param('pol_caso_persona_id') polCasoPersonaId: string,
    @Body() dto: CrearSituacionesJuridicasDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const resultado = await this.mpSujetoService.crearSituacionesJuridicas(
      polCasoPersonaId,
      dto
    )
    res.status(resultado.algunoCreado ? HttpStatus.CREATED : HttpStatus.OK)
    return { situaciones_juridicas: resultado.situaciones_juridicas }
  }

  @ApiOperation({ summary: 'Registrar domicilio del sujeto (3.12)' })
  @ApiParam({ name: 'pol_caso_persona_id', example: 1 })
  @ApiResponse({
    status: 201,
    description: '{ pol_persona_residencia_id }',
  })
  @Post('sujetos/:pol_caso_persona_id/domicilios')
  async crearDomicilio(
    @Param('pol_caso_persona_id') polCasoPersonaId: string,
    @Body() dto: CrearDomicilioDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { pol_persona_residencia_id, creado } =
      await this.mpSujetoService.crearDomicilio(polCasoPersonaId, dto)

    if (creado) {
      res
        .status(HttpStatus.CREATED)
        .location(`${req.originalUrl}/${pol_persona_residencia_id}`)
    } else {
      res.status(HttpStatus.OK)
    }
    return { pol_persona_residencia_id }
  }
}
