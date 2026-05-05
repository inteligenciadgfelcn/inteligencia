import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseBoolPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { CasosParalelosService } from '../service/casos-paralelos.service'
import { CreateInvestigacionParalelaDto } from '../dto/create-investigacion-paralela.dto'
import { PaginacionQueryDto } from '@/common/dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Casos Paralelos (SIII)')
@Controller('casos-paralelos')
export class CasosParalelosController extends BaseController {
  constructor(private readonly service: CasosParalelosService) {
    super()
  }

  @ApiOperation({
    summary: 'Buscar investigaciones paralelas por unidad y resultado',
  })
  @ApiQuery({ name: 'unidad', description: 'Abreviatura de la unidad' })
  @ApiQuery({ name: 'resultado', description: 'Resultado (true/false)' })
  @Get('buscar-por-unidad-resultado')
  async buscarPorUnidadYResultado(
    @Query('unidad') unidad: string,
    @Query('resultado', ParseBoolPipe) resultado: boolean,
    @Query() paginacion: PaginacionQueryDto
  ) {
    const [datos, total] = await this.service.buscarPorUnidadYResultado(
      unidad,
      resultado,
      paginacion
    )
    return this.successPagedRows([datos, total], paginacion)
  }

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

  @ApiOperation({ summary: 'Obtener investigación paralela por ID' })
  @ApiParam({ name: 'id', description: 'ID de la investigación paralela' })
  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    const dato = await this.service.buscarPorId(id)
    return this.successList(dato)
  }
}
