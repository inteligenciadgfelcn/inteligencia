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
import { CreateTipoPersonaDto } from './dto/create-tipo-persona.dto'
import { UpdateTipoPersonaDto } from './dto/update-tipo-persona.dto'
import { TipoPersonaLgiService } from './tipo-persona.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Tipo persona LGI')
@Controller('parametro/tipo-persona')
export class TipoPersonaLgiController {
  constructor(
    private readonly service: TipoPersonaLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateTipoPersonaDto) {
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
    @Body() dto: UpdateTipoPersonaDto,
  ) {
    return this.service.update(id, dto)
  }

}