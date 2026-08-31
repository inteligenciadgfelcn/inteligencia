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
import { CreateCatalogoJuridicaDto } from './dto/create-catalogo-juridica.dto'
import { UpdateCatalogoJuridicaDto } from './dto/update-catalogo-juridica.dto'
import { CatalogoJuridicaLgiService } from './catalogo-juridica.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Catalogo Juridica LGI')
@Controller('parametro/catalogo-juridica')
export class CatalogoJuridicaLgiController {
  constructor(
    private readonly service: CatalogoJuridicaLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateCatalogoJuridicaDto) {
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
    @Body() dto: UpdateCatalogoJuridicaDto,
  ) {
    return this.service.update(id, dto)
  }

}