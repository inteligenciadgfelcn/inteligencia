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
import { CreateGradoDto } from './dto/create-grado.dto'
import { UpdateGradoDto } from './dto/update-grado.dto'
import { GradoLgiService } from './grado.service'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('Parámetro - Grado LGI')
@Controller('parametro/grado')
export class GradoLgiController {
  constructor(
    private readonly service: GradoLgiService,
  ) {}

  @Post()
  create(@Body() dto: CreateGradoDto) {
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
    @Body() dto: UpdateGradoDto,
  ) {
    return this.service.update(id, dto)
  }

}