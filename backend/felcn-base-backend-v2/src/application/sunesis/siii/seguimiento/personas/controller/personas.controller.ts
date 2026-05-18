import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { PersonasService } from '../service/personas.service'
import { CreateSituacionDto, CreateEtapaProcesoDto } from '../dto/personas.dto'

/**
 * Controlador PersonasController
 * Expone los endpoints para la situación jurídica de personas implicadas (SIII).
 * Origen: FRM-JUR-02.aspx.cs
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Personas - Situación Jurídica (SIII)')
@Controller('personas')
export class PersonasController extends BaseController {
  constructor(private readonly service: PersonasService) {
    super()
  }

  // ==================== PERSONAS DEL OPERATIVO ====================

  @ApiOperation({ summary: 'Listar personas implicadas en un operativo' })
  @Get('operativo/:idOperativo')
  async listarPersonasPorOperativo(@Param('idOperativo') idOperativo: string) {
    const datos = await this.service.listarPersonasPorOperativo(idOperativo)
    return this.successList(datos)
  }

  // // ==================== SITUACION LEGAL ====================

  // @ApiOperation({ summary: 'Listar situaciones legales registradas de una persona' })
  // @Get(':idDetenido/situacion')
  // async listarSituaciones(@Param('idDetenido') idDetenido: string) {
  //   const datos = await this.service.listarSituacionesPorPersona(idDetenido)
  //   return this.successList(datos)
  // }

  // @ApiOperation({ summary: 'Registrar situación legal de una persona' })
  // @Post(':idDetenido/situacion')
  // async registrarSituacion(
  //   @Param('idDetenido') idDetenido: string,
  //   @Body() dto: CreateSituacionDto,
  //   @Req() req: Request
  // ) {
  //   const { numeroPase = '' } = req.user as PassportUser
  //   const nuevo = await this.service.registrarSituacion(idDetenido, dto, numeroPase)
  //   return this.successCreate(nuevo)
  // }

  // // ==================== ETAPA DEL PROCESO ====================

  @ApiOperation({ summary: 'Listar etapas del proceso registradas de una persona' })
  @Get(':idDetenido/etapa-proceso')
  async listarEtapasProceso(@Param('idDetenido') idDetenido: string) {
    const datos = await this.service.listarEtapasProcesoPorPersona(idDetenido)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Registrar etapa del proceso de una persona' })
  @Post(':idDetenido/etapa-proceso')
  async registrarEtapaProceso(
    @Param('idDetenido') idDetenido: string,
    @Body() dto: CreateEtapaProcesoDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nuevo = await this.service.registrarEtapaProceso(idDetenido, dto, numeroPase)
    return this.successCreate(nuevo)
  }

}

