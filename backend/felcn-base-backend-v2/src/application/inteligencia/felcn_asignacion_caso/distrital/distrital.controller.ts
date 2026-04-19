import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common'
import { DistritalService } from './distrital.service'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from '@/common/base'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SIII - Distrital')
@Controller('distrital')
export class DistritalController extends BaseController {
  constructor(private readonly distritalService: DistritalService) {
    super()
  }

  @Get('allGeneral')
  @ApiOperation({ summary: 'Listar todos los distritales (sin paginación)' })
  findAllGeneral() {
    return this.distritalService.findAllGeneral()
  }

  @Get('all/unidad')
  @ApiOperation({ summary: 'Listado simple de distritales (para combos)' })
  @ApiQuery({ name: 'idUnidad', required: false })
  findAllSimple(@Query('idUnidad') idUnidad?: number) {
    return this.distritalService.findAllUnidad(
      idUnidad ? Number(idUnidad) : undefined
    )
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.distritalService.findOne(+id)
  }

}
