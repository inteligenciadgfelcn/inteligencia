import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'
import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'
import { CreateUnidadDto } from './dto/create-unidad.dto'
import { UpdateUnidadDto } from './dto/update-unidad.dto'
import { UnidadLgiService } from './unidad.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Unidad LGI')
@Controller('parametro/unidades')
export class UnidadLgiController {
  constructor(
    private readonly unidadService: UnidadLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateUnidadDto) {
    return this.unidadService.create(dto)
  }

  @Get()
  findAll() {
    return this.unidadService.findAll()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.unidadService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnidadDto,
  ) {
    return this.unidadService.update(id, dto)
  }

}