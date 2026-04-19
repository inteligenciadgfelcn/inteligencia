import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { ConsultarItvDto } from '../dto/consultar-itv.dto'
import { InteroperabilidadService } from '../service/interoperabilidad.service'
import { ConsultarSegipDto } from '../dto/consultar-segip.dto'
import { SinConsultaContribuyenteDto } from '../dto/sin-consulta-contribuyente.dto'

// @ApiBearerAuth()
@ApiTags('Interoperabilidad')
@Controller('interoperabilidad')
// @UseGuards(JwtAuthGuard)
export class InteroperabilidadController extends BaseController {
  constructor(
    private readonly interoperabilidadService: InteroperabilidadService
  ) {
    super()
  }

  @Post('itv/consulta-inspeccion')
  @ApiOperation({ summary: 'Consultar datos de inspeccion en servicio externo' })
  @ApiBody({ type: ConsultarItvDto })
  async consultarInspeccion(@Body() payload: ConsultarItvDto) {
    const result = await this.interoperabilidadService.consultarInspeccion(
      payload
    )
    return this.success(result)
  }

  @Post('segip/consulta')
  @ApiOperation({ summary: 'Consultar datos en SEGIP' })
  @ApiBody({ type: ConsultarSegipDto })
  async consultarSegip(@Body() payload: ConsultarSegipDto) {
    const result = await this.interoperabilidadService.consultarSegip(payload)
    return this.success(result)
  }

  @Get('inra/titulo')
  @ApiOperation({ summary: 'Consultar titulo ejecutorial en INRA' })
  @ApiQuery({ name: 'numTitulo', type: String, required: true })
  async consultarInraTitulo(@Query('numTitulo') numTitulo: string) {
    const result =
      await this.interoperabilidadService.consultarInraTitulo(numTitulo)
    return this.success(result)
  }

  @Get('inra/identificacion')
  @ApiOperation({ summary: 'Consultar identificacion en INRA' })
  @ApiQuery({ name: 'numeroIdentificacion', type: String, required: true })
  async consultarInraIdentificacion(
    @Query('numeroIdentificacion') numeroIdentificacion: string
  ) {
    const result =
      await this.interoperabilidadService.consultarInraIdentificacion(
        numeroIdentificacion
      )
    return this.success(result)
  }

  @Post('sin/consulta-datos-contribuyente')
  @ApiOperation({ summary: 'Consultar datos de contribuyente en SIN' })
  @ApiBody({ type: SinConsultaContribuyenteDto })
  async consultarDatosContribuyente(
    @Body() payload: SinConsultaContribuyenteDto
  ) {
    const result =
      await this.interoperabilidadService.consultarSinDatosContribuyente(payload)
    return this.success(result)
  }

  @Get('sin/verificar-comunicacion')
  @ApiOperation({ summary: 'Verificar comunicacion con servicio SIN' })
  async verificarComunicacionSin() {
    const result = await this.interoperabilidadService.verificarComunicacionSin()
    return this.success(result)
  }
}
