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
import { CreateCatalogoClaseDto } from './dto/create-catalogo-clase.dto'
import { UpdateCatalogoDto } from './dto/update-catalogo-clase.dto'
import { CatalogoClaseLgiService } from './catalogo-clase.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Catalogo Clase LGI')
@Controller('parametro/catalogo-clase')
export class CatalogoClaseLgiController {
  constructor(
    private readonly service: CatalogoClaseLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateCatalogoClaseDto) {
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
    @Body() dto: UpdateCatalogoDto,
  ) {
    return this.service.update(id, dto)
  }

}