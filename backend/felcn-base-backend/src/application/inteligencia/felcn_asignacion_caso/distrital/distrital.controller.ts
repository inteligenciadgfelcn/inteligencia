import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { DistritalService } from './distrital.service'
import { CreateDistritalDto } from './dto/create-distrital.dto'
import { UpdateDistritalDto } from './dto/update-distrital.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@/core/authentication/guards/jwt-auth.guard'
import { BaseController } from '@/common/base'

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
