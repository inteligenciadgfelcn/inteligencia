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
import { CreateContenidoCasoDto } from './dto/create-contenido-caso.dto'
import { UpdateContenidoCasoDto } from './dto/update-contenido-caso.dto'
import { ContenidoCasoLgiService } from './contenido-caso.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Tipo persona LGI')
@Controller('parametro/tipo-persona')
export class ContenidoCasoLgiController {
  constructor(
    private readonly service: ContenidoCasoLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateContenidoCasoDto) {
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
    @Body() dto: UpdateContenidoCasoDto,
  ) {
    return this.service.update(id, dto)
  }

}