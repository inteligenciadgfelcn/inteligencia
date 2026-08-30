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
import { CreateCatalogoTipoDto } from './dto/create-catalogo-tipo.dto'
import { UpdateCatalogoTipoDto } from './dto/update-catalogo-tipo.dto'
import { CatalogoTipoLgiService } from './catalogo-tipo.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Catalogo Tipo LGI')
@Controller('parametro/catalogo-tipo')
export class CatalogoTipoLgiController {
  constructor(
    private readonly service: CatalogoTipoLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateCatalogoTipoDto) {
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
    @Body() dto: UpdateCatalogoTipoDto,
  ) {
    return this.service.update(id, dto)
  }

}