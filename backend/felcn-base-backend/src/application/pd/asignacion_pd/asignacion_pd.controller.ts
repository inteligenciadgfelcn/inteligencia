import { CrearNumeroCasoDto } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/dto/create_numeroCaso.dto'
import { UpdateAsignacionLgiDto } from '@/application/lgi/asignacion_lgi/dto/update-asignacion_lgi.dto'
import { PaginacionQueryDto } from '@/common/dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import {
  UseGuards,
  UseInterceptors,
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger'
import { AsignacionPdService } from './asignacion_pd.service'
import { BaseController } from '@/common/base/base-controller'
import { AsignacionesService } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/asignaciones.service'
import { CreateAsignacionPdDto } from './dto/create-asignacion_pd.dto'
import { RegistrarEtapaProcesalPdDto } from './dto/etapa-asignacion_pd.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('PD - Asignación')
@Controller('asignacion-pd')
export class AsignacionPdController extends BaseController {
  constructor(
    private readonly asignacionPdService: AsignacionPdService,
    private readonly asignacionesService: AsignacionesService
  ) {
    super()
  }

  @Post('crear-datosGenerales')
  @ApiOperation({
    summary: 'Crear asignación, sección datos generales',
  })
  create(@Body() dto: CreateAsignacionPdDto) {
    return this.asignacionPdService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar asignaciones con paginación',
  })
  async findAll(
    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.asignacionPdService.findAllPaginado(pagination)
    return this.successListRows(result)
  }

  @Get('caso/investigador')
  @ApiOperation({
    summary: 'Listar asignaciones con paginación por investigador asignado',
  })
  async findAllInvestigador(
    @Query()
    pagination: PaginacionQueryDto,
    @Req() req: Request & { user: { numeroPase: string } }
  ) {
    const result = await this.asignacionPdService.findAllPaginadoInvestigado(
      pagination,
      req.user.numeroPase
    )

    return this.successListRows(result)
  }

  @Post('generar-numero')
  @ApiOperation({
    summary: 'Generar número de caso',
  })
  generar(@Body() dto: CrearNumeroCasoDto) {
    return this.asignacionesService.generarNumeroCaso(
      dto.codigoDepartamento,
      dto.letra
    )
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una asignación por ID',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.asignacionPdService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar los datos generales de una asignación',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateAsignacionLgiDto
  ) {
    return this.asignacionPdService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Inactivar una asignación',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.asignacionPdService.remove(id)
  }

  @Post(':casosId')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Registrar etapa procesal del caso',
  })
  @UseInterceptors(
    FileInterceptor('documento', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    })
  )
  registrar(
    @Param('casosId', ParseIntPipe) casosId: number,
    @Body() dto: RegistrarEtapaProcesalPdDto,
    @UploadedFile() documento: Express.Multer.File | undefined,
    @Req() req: { user: { numeroPase: string } }
  ) {
    return this.asignacionPdService.registrar(
      casosId,
      dto,
      req.user.numeroPase,
      documento
    )
  }

  @Get('caso/:casosId')
  @ApiOperation({
    summary: 'Listar historial de etapas del caso',
  })
  listarPorCaso(
    @Param('casosId', ParseIntPipe)
    casosId: number
  ) {
    return this.asignacionPdService.listarPorCaso(casosId)
  }
}
