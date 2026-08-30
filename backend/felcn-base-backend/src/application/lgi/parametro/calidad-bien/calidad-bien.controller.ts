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
import { CreateCalidadBienDto } from './dto/create-calidad-bien.dto'
import { UpdateCalidadBienDto } from './dto/update-calidad-bien.dto'
import { CalidadBienLgiService } from './calidad-bien.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Calidad bien LGI')
@Controller('parametro/calidad-bien')
export class CalidadBienLgiController {
  constructor(
    private readonly service: CalidadBienLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateCalidadBienDto) {
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
    @Body() dto: UpdateCalidadBienDto,
  ) {
    return this.service.update(id, dto)
  }

}