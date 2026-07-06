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
import { CreateContenidoBienDto } from './dto/create-contenido-bien.dto'
import { UpdateContenidoBienDto } from './dto/update-contenido-bien.dto'
import { ContenidoBienLgiService } from './contenido-bien.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Contenido bien LGI')
@Controller('parametro/contenido-bien')
export class ContenidoBienLgiController {
  constructor(
    private readonly service: ContenidoBienLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateContenidoBienDto) {
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
    @Body() dto: UpdateContenidoBienDto,
  ) {
    return this.service.update(id, dto)
  }

}