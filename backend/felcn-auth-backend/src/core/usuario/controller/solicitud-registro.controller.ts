import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { BaseController } from '@/common/base'
import { ParamUuidDto } from '@/common/dto/params-uuid.dto'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { CasbinGuard } from '@/core/authorization/guards/casbin.guard'
import { SolicitudRegistroService } from '../service/solicitud-registro.service'
import { SolicitarAccesoRegistroDto } from '../dto/solicitar-acceso-registro.dto'
import { CompletarSolicitudRegistroDto } from '../dto/completar-solicitud-registro.dto'
import { AprobarSolicitudRegistroDto } from '../dto/aprobar-solicitud-registro.dto'
import { RechazarSolicitudRegistroDto } from '../dto/rechazar-solicitud-registro.dto'
import { FiltrosSolicitudRegistroDto } from '../dto/filtros-solicitud-registro.dto'
import { Messages } from '@/common/constants/response-messages'

@Controller('usuarios/solicitudes-registro')
@ApiTags('Solicitudes de registro')
export class SolicitudRegistroController extends BaseController {
  constructor(private readonly solicitudRegistroService: SolicitudRegistroService) {
    super()
  }

  // Paso 1 — público. No escribe nada, solo envía el link si el correo es válido.
  @ApiOperation({ summary: 'API para solicitar el link de preregistro por correo' })
  @ApiBody({ type: SolicitarAccesoRegistroDto, required: true })
  @Post('acceso')
  async solicitarAcceso(@Body() dto: SolicitarAccesoRegistroDto) {
    await this.solicitudRegistroService.solicitarAcceso(dto)
    return this.success(null, Messages.SOLICITUD_REGISTRO_ACCESO_ENVIADA)
  }

  // Público — permite al frontend validar el link antes de mostrar el formulario.
  @ApiOperation({ summary: 'API para validar el token del link de preregistro' })
  @Get('acceso/:token')
  async validarToken(@Param('token') token: string) {
    const result = this.solicitudRegistroService.validarToken(token)
    return this.success(result)
  }

  // Público — lookup de grados para el formulario de preregistro (sin sesión).
  @ApiOperation({ summary: 'API para listar los grados disponibles para preregistro' })
  @Get('grados')
  async grados() {
    const result = await this.solicitudRegistroService.listarGradosPublico()
    return this.successList(result)
  }

  // Paso 2 — público. Solo persiste si no hay una cuenta real duplicada.
  @ApiOperation({ summary: 'API para completar el formulario de preregistro' })
  @ApiBody({ type: CompletarSolicitudRegistroDto, required: true })
  @Post('completar')
  async completarFormulario(@Body() dto: CompletarSolicitudRegistroDto) {
    await this.solicitudRegistroService.completarFormulario(dto)
    return this.success(null, Messages.SOLICITUD_REGISTRO_COMPLETADA)
  }

  @ApiOperation({ summary: 'API para listar las solicitudes de registro' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get()
  async listar(@Query() filtros: FiltrosSolicitudRegistroDto) {
    const result = await this.solicitudRegistroService.listar(filtros)
    return this.success(result, Messages.SUCCESS_LIST)
  }

  @ApiOperation({ summary: 'API para obtener el detalle de una solicitud de registro' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get(':id')
  async buscarPorId(@Param() params: ParamUuidDto) {
    const result = await this.solicitudRegistroService.buscarPorId(params.id)
    return this.success(result)
  }

  @ApiOperation({ summary: 'API para aprobar una solicitud de registro' })
  @ApiBearerAuth()
  @ApiBody({ type: AprobarSolicitudRegistroDto, required: true })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':id/aprobar')
  async aprobar(
    @Req() req: Request,
    @Param() params: ParamUuidDto,
    @Body() dto: AprobarSolicitudRegistroDto
  ) {
    const idAdmin = this.getUser(req)
    const result = await this.solicitudRegistroService.aprobar(params.id, dto, idAdmin)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para rechazar una solicitud de registro' })
  @ApiBearerAuth()
  @ApiBody({ type: RechazarSolicitudRegistroDto, required: false })
  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Patch(':id/rechazar')
  async rechazar(
    @Req() req: Request,
    @Param() params: ParamUuidDto,
    @Body() dto: RechazarSolicitudRegistroDto
  ) {
    const idAdmin = this.getUser(req)
    const result = await this.solicitudRegistroService.rechazar(params.id, dto, idAdmin)
    return this.successUpdate(result)
  }
}
