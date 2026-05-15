import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  ParseBoolPipe,
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
import { PaginacionQueryDto } from '@/common/dto'
import { InvestigacionService } from '../service/investigacion.service'
import { BuscarAsignacionQueryDto } from '../dto/buscar-asignacion-query.dto'
import { CreateInvestigacionParalelaDto } from '../dto/create-investigacion-paralela.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Investigación Paralela (SIII)')
@Controller('investigacion')
export class InvestigacionController extends BaseController {
  constructor(private readonly service: InvestigacionService) {
    super()
  }

  // ==================== ASIGNACION (PAR-REG-CASO) ====================

  @ApiOperation({
    summary: 'Busca casos (ASIGNACION) con filtros opcionales',
    description: `Origen: Button1/3/5/6/8/9_Click — PAR-REG-CASO.aspx.cs.
    - Sin parámetros: todos los casos válidos de la unidad (Mostrar Todos).
    - nroCaso: coincidencia exacta por Nro. Caso FELCN.
    - investigador: JOIN con tabla investigador, SIN filtro de unidad.
    - nombreCaso: búsqueda parcial LIKE en nombre del caso.
    - nroCasoPerdidaDominio: coincidencia exacta.
    - nroOperativo: coincidencia exacta.`,
  })
  @Get('asignacion')
  async buscarAsignacion(@Query() filtros: BuscarAsignacionQueryDto) {
    const datos = await this.service.buscarAsignacion(filtros)
    return this.successList(datos)
  }

  @ApiOperation({
    summary: 'Lista los operativos de un caso seleccionado',
    description: 'Origen: MuestraOperativos() — PAR-REG-CASO.aspx.cs. Join: departamento, provincia, localidad, unidad, distrital.',
  })
  @ApiParam({ name: 'idCaso', description: 'ID del caso (ASIGNACION.id_caso)' })
  @Get('asignacion/:idCaso/operativos')
  async listarOperativosPorCaso(@Param('idCaso') idCaso: string) {
    const datos = await this.service.listarOperativosPorCaso(idCaso)
    return this.successList(datos)
  }

  // ==================== INVESTIGACION PARALELA ====================

  @ApiOperation({ summary: 'Crear una nueva investigación paralela' })
  @Post()
  async crearInvestigacionParalela(
    @Body() dto: CreateInvestigacionParalelaDto,
    @Req() req: Request
  ) {
    const { numeroPase = '' } = req.user as PassportUser
    const nueva = await this.service.crearInvestigacionParalela(dto, numeroPase)
    return this.successCreate(nueva)
  }

  @ApiOperation({ summary: 'Listar investigaciones paralelas con paginación' })
  @Get()
  async listar(@Query() paginacion: PaginacionQueryDto) {
    const [datos, total] = await this.service.listar(paginacion)
    return this.successPagedRows([datos, total], paginacion)
  }

  @ApiOperation({
    summary: 'Buscar investigaciones paralelas por unidad y resultado (filtros en body)',
  })
  @Post('buscar-por-unidad-resultado')
  async buscarPorUnidadYResultado(
    @Body('unidad') unidad: string,
    @Body('resultado', ParseBoolPipe) resultado: boolean,
    @Body('respInvParalela') respInvParalela: boolean | undefined,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const [datos, total] = await this.service.buscarPorUnidadYResultado(
      unidad,
      resultado,
      paginacion,
      respInvParalela
    )
    return this.successPagedRows([datos, total], paginacion)
  }

  @ApiOperation({
    summary: 'Casos Paralelos en Análisis (sin respuesta)',
    description: 'Origen: PAR-ING-CASO.aspx.cs. Filtra: resultado=false, unidad del parámetro. Ordena por fechaEnvio ASC.',
  })
  @ApiQuery({ name: 'abreviaturaUnidad', required: true })
  @Get('en-analisis')
  async listarEnAnalisis(
    @Query('abreviaturaUnidad') abreviaturaUnidad: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const [datos, total] = await this.service.listarEnAnalisis(abreviaturaUnidad, paginacion)
    return this.successPagedRows([datos, total], paginacion)
  }

  @ApiOperation({
    summary: 'Casos Paralelos Judicializados',
    description: 'Origen: PAR-JUD-CASO.aspx.cs. Filtra: resultado=true AND respuestaInvestigacionParalela=true. Ordena por fechaEnvio ASC.',
  })
  @ApiQuery({ name: 'abreviaturaUnidad', required: true })
  @Get('judicializados')
  async listarJudicializados(
    @Query('abreviaturaUnidad') abreviaturaUnidad: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const [datos, total] = await this.service.listarJudicializados(abreviaturaUnidad, paginacion)
    return this.successPagedRows([datos, total], paginacion)
  }

  @ApiOperation({
    summary: 'Casos Paralelos Desestimados',
    description: 'Origen: PAR-RECH-CASO.aspx.cs. Filtra: resultado=true AND respuestaInvestigacionParalela=false. Ordena por fechaEnvio ASC.',
  })
  @ApiQuery({ name: 'abreviaturaUnidad', required: true })
  @Get('desestimados')
  async listarDesestimados(
    @Query('abreviaturaUnidad') abreviaturaUnidad: string,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const [datos, total] = await this.service.listarDesestimados(abreviaturaUnidad, paginacion)
    return this.successPagedRows([datos, total], paginacion)
  }

  @ApiOperation({ summary: 'Obtener investigación paralela por ID' })
  @ApiParam({ name: 'id', description: 'ID de la investigación paralela' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const dato = await this.service.buscarPorId(id)
    return this.successList(dato)
  }
}
