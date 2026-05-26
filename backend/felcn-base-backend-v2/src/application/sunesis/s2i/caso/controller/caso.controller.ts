import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { CasoService } from '../service/caso.service'
import { CreateCasoDto } from '../dto/create-caso.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos S2I (Investigaciones)')
@Controller('s2i/casos')
export class CasoController extends BaseController {
  constructor(private readonly service: CasoService) {
    super()
  }

  @ApiOperation({
    summary: 'Calcular el siguiente número de caso correlativo',
    description:
      'Equivale al botón "AsigCaso_Click" de FRM-ING-C0. Formato: ALA-{idPais}-{N}/{GG}.',
  })
  @ApiQuery({ name: 'idPais', required: true, description: 'ID del país' })
  @ApiQuery({
    name: 'gestion',
    required: true,
    description: 'Año de gestión (ej. 2026)',
  })
  @Get('numero-siguiente')
  async calcularSiguienteNumero(
    @Query('idPais') idPais: string,
    @Query('gestion') gestion: string
  ) {
    const numero = await this.service.calcularSiguienteNumero(
      parseInt(idPais),
      parseInt(gestion)
    )
    return this.successList({ numeroCaso: numero })
  }

  @ApiOperation({
    summary: 'Crear un nuevo caso de investigación',
    description:
      'Replica FRM-ING-C0. Si no se provee nroCasoCer, se calcula el correlativo automáticamente.',
  })
  @Post()
  async crear(@Body() dto: CreateCasoDto, @Req() req: Request) {
    const { numeroPase = '' } = req.user as PassportUser
    const caso = await this.service.crear(dto, numeroPase)
    return this.successCreate(caso)
  }

  @ApiOperation({
    summary: 'Listar casos del usuario autenticado',
    description:
      'Filtra por caso.usuario = JWT.numeroPase. Opcionalmente filtra por etapa de investigación.',
  })
  @ApiQuery({
    name: 'idEtapa',
    required: false,
    description: 'ID de la etapa de investigación',
  })
  @Get()
  async listar(@Req() req: Request, @Query('idEtapa') idEtapa?: string) {
    const { numeroPase = '' } = req.user as PassportUser
    const etapa = idEtapa ? parseInt(idEtapa) : undefined
    const datos = await this.service.listarPorUsuario(numeroPase, etapa)
    return this.successList(datos)
  }

  @ApiOperation({ summary: 'Obtener un caso por ID' })
  @ApiParam({ name: 'idCaso', description: 'ID del caso (bigint)' })
  @Get(':idCaso')
  async buscarPorId(@Param('idCaso') idCaso: string) {
    const caso = await this.service.buscarPorId(idCaso)
    return this.successList(caso)
  }
}
