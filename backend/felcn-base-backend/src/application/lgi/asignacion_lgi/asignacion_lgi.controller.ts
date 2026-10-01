import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { BaseController } from '@/common/base/base-controller'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { CrearNumeroCasoDto } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/dto/create_numeroCaso.dto'
import { AsignacionesService } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/asignaciones.service'

import { AsignacionLgiService } from './asignacion_lgi.service'
import { CreateAsignacionLgiDto } from './dto/create-asignacion_lgi.dto'
import { UpdateAsignacionLgiDto } from './dto/update-asignacion_lgi.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { RegistrarEtapaProcesalDto } from './dto/etapa-asignacion_lgi.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Ganancias ilícitas')
@Controller('asignacion-lgi')
export class AsignacionLgiController extends BaseController {
  constructor(
    private readonly asignacionLgiService: AsignacionLgiService,
    private readonly asignacionesService: AsignacionesService
  ) {
    super()
  }

  @Post('crear-datosGenerales')
  @ApiOperation({
    summary: 'Crear asignación, sección datos generales',
  })
  create(@Body() dto: CreateAsignacionLgiDto) {
    return this.asignacionLgiService.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar asignaciones con paginación',
  })
  async findAll(
    @Query()
    pagination: PaginacionQueryDto
  ) {
    const result = await this.asignacionLgiService.findAllPaginado(pagination)
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
    const result = await this.asignacionLgiService.findAllPaginadoInvestigado(
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
    return this.asignacionLgiService.findOne(id)
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
    return this.asignacionLgiService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Inactivar una asignación',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.asignacionLgiService.remove(id)
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
    @Body() dto: RegistrarEtapaProcesalDto,
    @UploadedFile() documento: Express.Multer.File | undefined,
    @Req() req: { user: { numeroPase: string } }
  ) {
    return this.asignacionLgiService.registrar(
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
    return this.asignacionLgiService.listarPorCaso(casosId)
  }
}
