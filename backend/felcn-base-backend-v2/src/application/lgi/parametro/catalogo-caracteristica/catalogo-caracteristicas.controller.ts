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
import { CreateCatalogoCaracteristicasDto } from './dto/create-catalogo-caracteristica.dto'
import { UpdateCatalogoCaracteristicaDto } from './dto/update-catalogo-caracteristicas.dto'
import { CatalogoCaracteristicasLgiService } from './catalogo-caracteristicas.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Catalogo Caracteristicas LGI')
@Controller('parametro/catalogo-caracteristicas')
export class CatalogoCaracteristicasLgiController {
  constructor(
    private readonly service: CatalogoCaracteristicasLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateCatalogoCaracteristicasDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCatalogoCaracteristicaDto,
  ) {
    return this.service.update(id, dto)
  }

}