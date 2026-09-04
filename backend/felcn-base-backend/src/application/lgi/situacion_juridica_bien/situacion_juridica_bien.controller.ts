import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { SituacionJuridicaBienService } from './situacion_juridica_bien.service'
import { CreateSituacionJuridicaBienDto } from './dto/create-situacion_juridica_bien.dto'
import { UpdateSituacionJuridicaBienDto } from './dto/update-situacion_juridica_bien.dto'
import { BaseController } from '@/common/base'
import { PaginacionQueryDto } from '@/common/dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Bienes secuestrados')
@Controller('situacion-juridica-bien')
export class SituacionJuridicaBienController extends BaseController {
  constructor(private readonly service: SituacionJuridicaBienService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar situación jurídica',
  })
  create(
    @Body()
    dto: CreateSituacionJuridicaBienDto
  ) {
    return this.service.create(dto)
  }

  @Get('bien/:itembiensecId')
  @ApiOperation({
    summary: 'Listar situaciones jurídicas de un bien',
  })
  findByBien(
    @Param('itembiensecId', ParseIntPipe)
    itembiensecId: number
  ) {
    return this.service.findByBien(itembiensecId)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateSituacionJuridicaBienDto
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Inactivar situación jurídica',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    return this.service.remove(id)
  }
}
